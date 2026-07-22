// Cloudflare Pages Function — Stripe Webhook
// Sets AC tags and provisions Supabase access grants when a purchase is completed.
// Env vars needed: STRIPE_WEBHOOK_SECRET, AC_API_URL, AC_API_KEY
// 1:1 installment schedules additionally need STRIPE_SECRET_KEY and the matching
// STRIPE_1ZU1_PRICE_2X / STRIPE_1ZU1_PRICE_3X price IDs.
// Optional for member access: PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY

const PRODUCT_TAG_MAP = {
  'beyondbonus': '73',    // beyondbonus-gekauft
  'its-bundle': '79',     // its-gekauft
};

const PRODUCT_LIST_MAP = {
  'beyondbonus': '24',    // BeyondBonus onboarding automation
  'its-bundle': '25',     // It's time to shine
};

const PRODUCT_ACCESS_CONFIG = {
  'beyondbonus': {
    productKey: 'beyondbonus',
    courseMonths: 12,
    livecallMonths: 6,
  },
  'its-bundle': {
    productKey: 'its-bundle',
    courseMonths: 6,
  },
};

export async function onRequestPost(context) {
  const { request, env } = context;

  const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const AC_URL = env.AC_API_URL || 'https://sallymatthes.api-us1.com';
  const AC_KEY = env.AC_API_KEY;

  if (!WEBHOOK_SECRET) {
    console.error('Missing env var: STRIPE_WEBHOOK_SECRET');
    return new Response('Server config error', { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = await verifyStripeSignature(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signature verification failed:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return jsonResponse({ received: true, skipped: event.type });
  }

  const session = event.data.object;
  const email = session.customer_details?.email || session.customer_email;
  const product = session.metadata?.product;
  const customerName = session.metadata?.customer_name || session.customer_details?.name || '';

  // Keep 1:1 payment handling isolated from the existing BeyondBonus/ITS paths.
  // Subscription schedules are critical: failures return 500 so Stripe retries the event.
  if (product === 'one-to-one') {
    return handleOneToOneCheckout({ env, session, email });
  }

  if (!email || !product) {
    console.log('No email or product in session', { email, product });
    return jsonResponse({ received: true, skipped: 'no email or product' });
  }

  const results = {
    received: true,
    email,
    product,
    activeCampaign: null,
    grants: null,
    passwordEmail: null,
  };

  const tagId = PRODUCT_TAG_MAP[product];
  if (tagId && AC_KEY) {
    results.activeCampaign = await tagActiveCampaignContact({ AC_URL, AC_KEY, email, tagId, product });
  } else if (tagId && !AC_KEY) {
    console.error('Missing env var: AC_API_KEY');
    results.activeCampaign = { ok: false, error: 'AC_API_KEY missing' };
  } else {
    results.activeCampaign = { ok: true, skipped: `unknown product: ${product}` };
  }

  const accessConfig = PRODUCT_ACCESS_CONFIG[product];
  if (accessConfig) {
    results.grants = await provisionSupabaseAccess({ env, email, fullName: customerName, accessConfig, sessionId: session.id });
    if (results.grants?.ok) {
      results.passwordEmail = await sendPasswordSetupEmail({ env, email, origin: new URL(request.url).origin });
    }
  } else {
    results.grants = { ok: true, skipped: `no grant config for product: ${product}` };
  }

  return jsonResponse(results);
}

async function handleOneToOneCheckout({ env, session, email }) {
  const plan = session.metadata?.payment_plan;
  const installmentCount = Number(session.metadata?.installment_count || 0);
  const requiresSchedule = session.metadata?.requires_subscription_schedule === 'true';

  if (plan === 'full') {
    if (session.mode !== 'payment' || installmentCount !== 1 || requiresSchedule) {
      console.error('Invalid 1:1 full-payment metadata', { sessionId: session.id, plan, installmentCount, requiresSchedule });
      return jsonResponse({ received: false, error: 'Invalid 1:1 payment metadata' }, 400);
    }

    const activeCampaign = await tagOneToOnePurchase({ env, email, plan });
    if (!activeCampaign.ok && !activeCampaign.skipped) {
      return jsonResponse({ received: false, error: '1:1 purchase onboarding failed' }, 500);
    }
    return jsonResponse({ received: true, product: 'one-to-one', plan, schedule: { ok: true, skipped: 'one-time payment' }, activeCampaign });
  }

  if (!['2x', '3x'].includes(plan) || ![2, 3].includes(installmentCount) || !requiresSchedule || session.mode !== 'subscription') {
    console.error('Invalid 1:1 installment metadata', { sessionId: session.id, plan, installmentCount, requiresSchedule, mode: session.mode });
    return jsonResponse({ received: false, error: 'Invalid 1:1 installment metadata' }, 400);
  }

  if (!session.subscription) {
    console.error('1:1 installment Checkout Session has no subscription', { sessionId: session.id });
    return jsonResponse({ received: false, error: 'Subscription missing' }, 500);
  }

  try {
    const schedule = await configureOneToOneInstallmentSchedule({ env, session, plan, installmentCount });
    const activeCampaign = await tagOneToOnePurchase({ env, email, plan });
    if (!activeCampaign.ok && !activeCampaign.skipped) {
      return jsonResponse({ received: false, error: '1:1 purchase onboarding failed' }, 500);
    }
    return jsonResponse({ received: true, product: 'one-to-one', plan, schedule, activeCampaign });
  } catch (error) {
    console.error('1:1 installment schedule failed:', error?.message || error);
    return jsonResponse({ received: false, error: 'Installment schedule failed' }, 500);
  }
}

async function configureOneToOneInstallmentSchedule({ env, session, plan, installmentCount }) {
  const stripeKey = env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error('STRIPE_SECRET_KEY missing');

  const expectedPriceId = env[plan === '2x' ? 'STRIPE_1ZU1_PRICE_2X' : 'STRIPE_1ZU1_PRICE_3X'];
  if (!expectedPriceId) throw new Error(`Expected Stripe price env missing for plan ${plan}`);

  const subscription = await stripeRequest({
    stripeKey,
    path: `/v1/subscriptions/${encodeURIComponent(session.subscription)}`,
  });
  const items = subscription?.items?.data || [];
  if (items.length !== 1) throw new Error(`Expected exactly one subscription item, got ${items.length}`);

  const item = items[0];
  if (item?.price?.id !== expectedPriceId) {
    throw new Error(`Subscription price mismatch for plan ${plan}`);
  }
  if (item?.price?.recurring?.interval !== 'month' || (item?.price?.recurring?.interval_count || 1) !== 1) {
    throw new Error('1:1 installment price must recur monthly');
  }

  let schedule;
  if (subscription.schedule) {
    schedule = await stripeRequest({
      stripeKey,
      path: `/v1/subscription_schedules/${encodeURIComponent(subscription.schedule)}`,
    });
    if (schedule?.metadata?.checkout_session !== session.id || schedule?.metadata?.product !== 'one-to-one') {
      throw new Error('Subscription already has an unrelated schedule; refusing to overwrite it');
    }
  } else {
    const createParams = new URLSearchParams({
      from_subscription: subscription.id,
      'metadata[product]': 'one-to-one',
      'metadata[checkout_session]': session.id,
      'metadata[payment_plan]': plan,
      'metadata[installment_count]': String(installmentCount),
    });
    schedule = await stripeRequest({
      stripeKey,
      path: '/v1/subscription_schedules',
      method: 'POST',
      body: createParams,
      idempotencyKey: `one-to-one-schedule-${session.id}`,
    });
  }

  const phaseStart = schedule?.current_phase?.start_date || schedule?.phases?.[0]?.start_date || subscription.current_period_start;
  if (!phaseStart) throw new Error('Subscription schedule has no current phase start');

  const updateParams = new URLSearchParams({
    end_behavior: 'cancel',
    'phases[0][start_date]': String(phaseStart),
    'phases[0][items][0][price]': expectedPriceId,
    'phases[0][items][0][quantity]': String(item.quantity || 1),
    'phases[0][iterations]': String(installmentCount),
    'phases[0][proration_behavior]': 'none',
    'metadata[product]': 'one-to-one',
    'metadata[checkout_session]': session.id,
    'metadata[payment_plan]': plan,
    'metadata[installment_count]': String(installmentCount),
  });

  if (subscription.collection_method) {
    updateParams.set('phases[0][collection_method]', subscription.collection_method);
  }
  for (const [index, taxRate] of (subscription.default_tax_rates || []).entries()) {
    if (taxRate?.id) updateParams.set(`phases[0][default_tax_rates][${index}]`, taxRate.id);
  }

  const updated = await stripeRequest({
    stripeKey,
    path: `/v1/subscription_schedules/${encodeURIComponent(schedule.id)}`,
    method: 'POST',
    body: updateParams,
    idempotencyKey: `one-to-one-schedule-update-${session.id}`,
  });

  if (updated?.end_behavior !== 'cancel' || Number(updated?.metadata?.installment_count) !== installmentCount) {
    throw new Error('Stripe did not confirm the expected limited schedule');
  }

  return { ok: true, scheduleId: updated.id, installmentCount, endBehavior: updated.end_behavior };
}

async function tagOneToOnePurchase({ env, email, plan }) {
  if (!email) return { ok: false, skipped: 'checkout session has no email' };
  const tagId = env.AC_1ZU1_PURCHASE_TAG_ID;
  const planTagEnv = {
    full: 'AC_1ZU1_PURCHASE_PLAN_FULL_TAG_ID',
    '2x': 'AC_1ZU1_PURCHASE_PLAN_2X_TAG_ID',
    '3x': 'AC_1ZU1_PURCHASE_PLAN_3X_TAG_ID',
  }[plan];
  const planTagId = planTagEnv ? env[planTagEnv] : undefined;
  const listId = env.AC_1ZU1_PURCHASE_LIST_ID;
  if (!env.AC_API_KEY || !tagId || !planTagId || !listId) {
    return { ok: true, skipped: '1:1 purchase ActiveCampaign env not configured' };
  }

  try {
    const AC_URL = (env.AC_API_URL || 'https://sallymatthes.api-us1.com').replace(/\/$/, '');
    const headers = { 'Api-Token': env.AC_API_KEY, 'Content-Type': 'application/json' };
    const contactRes = await fetch(`${AC_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ contact: { email } }),
    });
    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;
    if (!contactRes.ok || !contactId) throw new Error('1:1 purchase contact sync failed');

    // Apply all routing tags before the list subscription so any future
    // list-triggered onboarding automation sees the complete state.
    for (const currentTagId of [tagId, planTagId]) {
      const tagRes = await fetch(`${AC_URL}/api/3/contactTags`, {
        method: 'POST', headers,
        body: JSON.stringify({ contactTag: { contact: contactId, tag: String(currentTagId) } }),
      });
      if (!tagRes.ok) throw new Error('1:1 purchase tagging failed');
    }

    const listRes = await fetch(`${AC_URL}/api/3/contactLists`, {
      method: 'POST', headers,
      body: JSON.stringify({ contactList: { list: String(listId), contact: contactId, status: '1' } }),
    });
    if (!listRes.ok) throw new Error('1:1 purchase list subscription failed');
    return { ok: true, tagged: true, paymentPlan: plan };
  } catch (error) {
    console.error('1:1 purchase ActiveCampaign error:', error?.message || error);
    return { ok: false, error: '1:1 purchase ActiveCampaign update failed' };
  }
}

async function stripeRequest({ stripeKey, path, method = 'GET', body, idempotencyKey }) {
  const headers = { Authorization: `Bearer ${stripeKey}` };
  if (body) headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const response = await fetch(`https://api.stripe.com${path}`, {
    method,
    headers,
    body,
    signal: AbortSignal.timeout(12000),
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!response.ok) throw new Error(data?.error?.message || `Stripe HTTP ${response.status}`);
  return data;
}

async function sendPasswordSetupEmail({ env, email, origin }) {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { ok: false, error: 'Supabase admin config missing' };
  }

  const redirectTo = `${origin}/auth/callback?next=/reset-password&type=recovery`;

  try {
    await supabaseFetch({
      supabaseUrl,
      supabaseKey,
      path: '/auth/v1/recover',
      method: 'POST',
      body: { email, gotrue_meta_security: { captcha_token: null } },
      extraHeaders: { 'X-Redirect-To': redirectTo },
    });

    console.log(`✅ Password setup email sent to ${email}`);
    return { ok: true, sent: true, redirectTo };
  } catch (err) {
    console.error('Password setup email error:', err);
    return { ok: false, error: err.message || 'Password setup email failed' };
  }
}

async function tagActiveCampaignContact({ AC_URL, AC_KEY, email, tagId, product }) {
  try {
    const acHeaders = { 'Api-Token': AC_KEY, 'Content-Type': 'application/json' };
    const productListId = PRODUCT_LIST_MAP[product];

    const contactRes = await fetch(`${AC_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers: acHeaders,
      body: JSON.stringify({ contact: { email } })
    });
    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    if (!contactId) {
      console.error('Could not find/create AC contact for', email);
      return { ok: false, error: 'AC contact not found' };
    }

    await fetch(`${AC_URL}/api/3/contactTags`, {
      method: 'POST',
      headers: acHeaders,
      body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } })
    });

    await fetch(`${AC_URL}/api/3/contactLists`, {
      method: 'POST',
      headers: acHeaders,
      body: JSON.stringify({ contactList: { list: '29', contact: contactId, status: '1' } })
    });

    if (productListId) {
      await fetch(`${AC_URL}/api/3/contactLists`, {
        method: 'POST',
        headers: acHeaders,
        body: JSON.stringify({ contactList: { list: productListId, contact: contactId, status: '1' } })
      });
    }

    console.log(`✅ Tagged ${email} with tag ${tagId} (product: ${product}), contact ID: ${contactId}`);
    return { ok: true, tagged: true, contactId, tagId, listId: productListId || null };
  } catch (acErr) {
    console.error('AC error:', acErr);
    return { ok: false, error: 'AC tagging failed' };
  }
}

async function provisionSupabaseAccess({ env, email, fullName, accessConfig, sessionId }) {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase admin env vars for Stripe provisioning');
    return { ok: false, error: 'Supabase admin config missing' };
  }

  try {
    const profile = await findOrCreateSupabaseProfile({ supabaseUrl, supabaseKey, email, fullName });
    const courseEndsAt = addMonthsIso(accessConfig.courseMonths);

    const courseGrant = await upsertGrant({
      supabaseUrl,
      supabaseKey,
      userId: profile.id,
      productKey: accessConfig.productKey,
      area: 'course',
      endsAt: courseEndsAt,
      note: `Stripe Checkout ${sessionId}`,
    });

    let livecallGrant = null;
    if (accessConfig.livecallMonths) {
      livecallGrant = await upsertGrant({
        supabaseUrl,
        supabaseKey,
        userId: profile.id,
        productKey: accessConfig.productKey,
        area: 'livecalls',
        endsAt: addMonthsIso(accessConfig.livecallMonths),
        note: `Stripe Checkout ${sessionId}`,
      });
    }

    console.log(`✅ Provisioned ${accessConfig.productKey} grants for ${email}`);
    return { ok: true, userId: profile.id, createdUser: profile.createdUser, courseGrant, livecallGrant };
  } catch (err) {
    console.error('Supabase provisioning error:', err);
    return { ok: false, error: err.message || 'Supabase provisioning failed' };
  }
}

async function findOrCreateSupabaseProfile({ supabaseUrl, supabaseKey, email, fullName }) {
  const profile = await supabaseFetch({
    supabaseUrl,
    supabaseKey,
    path: `/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id,email,full_name&limit=1`,
  });

  if (Array.isArray(profile) && profile[0]?.id) {
    return { ...profile[0], createdUser: false };
  }

  const users = await supabaseFetch({
    supabaseUrl,
    supabaseKey,
    path: `/auth/v1/admin/users?page=1&per_page=1000`,
  });
  const existingUser = users?.users?.find((user) => user.email?.toLowerCase() === email.toLowerCase());

  if (existingUser?.id) {
    await supabaseFetch({
      supabaseUrl,
      supabaseKey,
      path: '/rest/v1/profiles',
      method: 'POST',
      prefer: 'resolution=merge-duplicates',
      body: [{ id: existingUser.id, email, full_name: fullName || null }],
    });
    return { id: existingUser.id, email, full_name: fullName || null, createdUser: false };
  }

  const created = await supabaseFetch({
    supabaseUrl,
    supabaseKey,
    path: '/auth/v1/admin/users',
    method: 'POST',
    body: {
      email,
      password: crypto.randomUUID() + crypto.randomUUID(),
      email_confirm: true,
      user_metadata: { full_name: fullName || email.split('@')[0] },
    },
  });

  if (!created?.id) {
    throw new Error('Supabase user could not be created');
  }

  await supabaseFetch({
    supabaseUrl,
    supabaseKey,
    path: '/rest/v1/profiles',
    method: 'POST',
    prefer: 'resolution=merge-duplicates',
    body: [{ id: created.id, email, full_name: fullName || null }],
  });

  return { id: created.id, email, full_name: fullName || null, createdUser: true };
}

async function upsertGrant({ supabaseUrl, supabaseKey, userId, productKey, area, endsAt, note }) {
  const existing = await supabaseFetch({
    supabaseUrl,
    supabaseKey,
    path: `/rest/v1/access_grants?user_id=eq.${userId}&product_key=eq.${productKey}&area=eq.${area}&status=eq.active&select=id&limit=1`,
  });

  const payload = {
    user_id: userId,
    product_key: productKey,
    area,
    status: 'active',
    starts_at: new Date().toISOString(),
    ends_at: endsAt,
    source: 'stripe',
    note,
  };

  if (Array.isArray(existing) && existing[0]?.id) {
    await supabaseFetch({
      supabaseUrl,
      supabaseKey,
      path: `/rest/v1/access_grants?id=eq.${existing[0].id}`,
      method: 'PATCH',
      prefer: 'return=representation',
      body: payload,
    });
    return existing[0].id;
  }

  const inserted = await supabaseFetch({
    supabaseUrl,
    supabaseKey,
    path: '/rest/v1/access_grants',
    method: 'POST',
    prefer: 'return=representation',
    body: [payload],
  });

  return inserted?.[0]?.id || null;
}

async function supabaseFetch({ supabaseUrl, supabaseKey, path, method = 'GET', body, prefer, extraHeaders }) {
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    ...(extraHeaders || {}),
  };
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error_description || data?.error || `Supabase HTTP ${response.status}`);
  }

  return data;
}

function addMonthsIso(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader) throw new Error('No signature header');

  const parts = sigHeader.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const signature = parts['v1'];

  if (!timestamp || !signature) throw new Error('Invalid signature format');

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    throw new Error('Timestamp too old');
  }

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (!constantTimeEqual(expectedSig, signature)) {
    throw new Error('Signature mismatch');
  }

  return JSON.parse(payload);
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function onRequestOptions() {
  return new Response(null, { status: 200 });
}
