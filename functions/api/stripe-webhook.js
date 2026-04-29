// Cloudflare Pages Function — Stripe Webhook
// Sets AC tags and provisions Supabase access grants when a purchase is completed.
// Env vars needed: STRIPE_WEBHOOK_SECRET, AC_API_URL, AC_API_KEY
// Optional for member access: PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY

const PRODUCT_TAG_MAP = {
  'beyondbonus': '73',    // beyondbonus-gekauft
  'its-bundle': '79',     // its-gekauft
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
  } else {
    results.grants = { ok: true, skipped: `no grant config for product: ${product}` };
  }

  return jsonResponse(results);
}

async function tagActiveCampaignContact({ AC_URL, AC_KEY, email, tagId, product }) {
  try {
    const acHeaders = { 'Api-Token': AC_KEY, 'Content-Type': 'application/json' };

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

    console.log(`✅ Tagged ${email} with tag ${tagId} (product: ${product}), contact ID: ${contactId}`);
    return { ok: true, tagged: true, contactId, tagId };
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

async function supabaseFetch({ supabaseUrl, supabaseKey, path, method = 'GET', body, prefer }) {
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
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
