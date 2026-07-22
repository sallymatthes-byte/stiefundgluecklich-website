// Cloudflare Pages Function — 1:1 Stripe Checkout adapter.
// No Stripe objects are created during the build. At runtime this endpoint creates
// a Checkout Session using price IDs supplied exclusively through environment vars.
//
// Required env vars:
// STRIPE_SECRET_KEY
// STRIPE_1ZU1_PRICE_FULL (one-time price: 299700 EUR cents)
// STRIPE_1ZU1_PRICE_2X   (monthly recurring price: 154900 EUR cents)
// STRIPE_1ZU1_PRICE_3X   (monthly recurring price: 104900 EUR cents)
// STRIPE_1ZU1_TAX_RATE   (inclusive French TVA tax rate)

const PLANS = {
  full: { mode: 'payment', installments: 1, priceEnv: 'STRIPE_1ZU1_PRICE_FULL' },
  '2x': { mode: 'subscription', installments: 2, priceEnv: 'STRIPE_1ZU1_PRICE_2X' },
  '3x': { mode: 'subscription', installments: 3, priceEnv: 'STRIPE_1ZU1_PRICE_3X' },
};

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

  if (!isSameOrigin(request)) return json({ error: 'Ungültige Anfrage.' }, 403, headers);
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return json({ error: 'Ungültiges Datenformat.' }, 415, headers);
  }

  let payload;
  try { payload = await request.json(); } catch { return json({ error: 'Die Auswahl konnte nicht gelesen werden.' }, 400, headers); }

  const planKey = typeof payload?.plan === 'string' ? payload.plan : '';
  const plan = PLANS[planKey];
  if (!plan) return json({ error: 'Ungültige Zahlungsoption.' }, 400, headers);
  if (payload?.termsAccepted !== true || payload?.coachingConfirmed !== true) {
    return json({ error: 'Bitte bestätige die Angebots- und Coaching-Hinweise.' }, 400, headers);
  }
  const requestId = typeof payload?.requestId === 'string' && /^[0-9a-f-]{36}$/i.test(payload.requestId)
    ? payload.requestId
    : null;
  if (!requestId) return json({ error: 'Ungültige Checkout-Anfrage.' }, 400, headers);

  if (env.ONE_TO_ONE_SALES_ENABLED !== 'true') {
    return json({ error: 'Die Buchung ist noch nicht freigeschaltet.' }, 503, headers);
  }

  const stripeKey = env.STRIPE_SECRET_KEY;
  const priceId = env[plan.priceEnv];
  const taxRateId = env.STRIPE_1ZU1_TAX_RATE;
  if (!stripeKey || !priceId || !taxRateId) {
    console.error('Missing 1:1 Stripe env configuration');
    return json({ error: 'Der Checkout ist noch nicht freigeschaltet.' }, 503, headers);
  }

  const origin = new URL(request.url).origin;
  const form = buildCheckoutParams({ planKey, plan, priceId, taxRateId, origin, acceptedAt: new Date().toISOString() });

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `one-to-one-checkout-${requestId}`,
      },
      body: form,
      signal: AbortSignal.timeout(12000),
    });
    const data = await response.json();

    if (!response.ok || !data?.url) {
      console.error('1:1 Stripe Checkout creation failed:', data?.error?.message || response.status);
      return json({ error: 'Der Checkout konnte gerade nicht gestartet werden.' }, 502, headers);
    }

    return json({ url: data.url }, 200, headers);
  } catch (error) {
    console.error('1:1 Stripe Checkout request failed:', error?.message || error);
    return json({ error: 'Der Checkout konnte gerade nicht gestartet werden.' }, 502, headers);
  }
}

export function buildCheckoutParams({ planKey, plan, priceId, taxRateId, origin, acceptedAt }) {
  const metadata = {
    product: 'one-to-one',
    payment_plan: planKey,
    installment_count: String(plan.installments),
    requires_subscription_schedule: plan.mode === 'subscription' ? 'true' : 'false',
    offer_version: '2026-07-17',
    terms_accepted: 'true',
    coaching_boundary_confirmed: 'true',
    accepted_at: acceptedAt,
  };

  const form = new URLSearchParams({
    mode: plan.mode,
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'line_items[0][tax_rates][0]': taxRateId,
    'payment_method_types[0]': 'card',
    locale: 'de',
    billing_address_collection: 'required',
    success_url: `${origin}/1zu1-angebot/danke/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/1zu1-angebot/?checkout=abgebrochen`,
  });

  if (plan.mode === 'payment') {
    form.set('customer_creation', 'always');
    form.set('invoice_creation[enabled]', 'true');
  } else {
    form.set('subscription_data[default_tax_rates][0]', taxRateId);
  }

  for (const [key, value] of Object.entries(metadata)) {
    form.set(`metadata[${key}]`, value);
    if (plan.mode === 'subscription') form.set(`subscription_data[metadata][${key}]`, value);
    if (plan.mode === 'payment') form.set(`payment_intent_data[metadata][${key}]`, value);
  }

  return form;
}

function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('origin');
  const ownOrigin = new URL(context.request.url).origin;
  if (origin && origin !== ownOrigin) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': ownOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '600',
    },
  });
}
