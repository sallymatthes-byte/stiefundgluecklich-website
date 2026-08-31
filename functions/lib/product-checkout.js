const INVOICE_FOOTER = 'Sally Matthes, Coaching, Beratung & Training | SIRET: 935040469 00014 | TVA: FR 50935040469';

export async function createProductCheckout(context, config) {
  const { request, env } = context;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

  if (!isSameOrigin(request)) return json({ error: 'Ungültige Anfrage.' }, 403, headers);
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return json({ error: 'Ungültiges Datenformat.' }, 415, headers);
  }

  let payload;
  try { payload = await request.json(); } catch { return json({ error: 'Die Angaben konnten nicht gelesen werden.' }, 400, headers); }

  const name = cleanText(payload?.name, 120);
  const email = cleanText(payload?.email, 254).toLowerCase();
  const requestId = typeof payload?.requestId === 'string' && /^[0-9a-f-]{36}$/i.test(payload.requestId) ? payload.requestId : null;
  if (!name || !isEmail(email) || payload?.termsAccepted !== true || !requestId) {
    return json({ error: 'Bitte prüfe deine Angaben und bestätige den Hinweis zum Widerrufsrecht.' }, 400, headers);
  }

  const stripeKey = env.STRIPE_SECRET_KEY;
  if (!stripeKey) return json({ error: 'Der Checkout ist gerade nicht verfügbar.' }, 503, headers);

  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: 'payment',
    customer_email: email,
    success_url: `${origin}${config.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${config.cancelPath}`,
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(config.amount),
    'line_items[0][price_data][product_data][name]': config.name,
    'line_items[0][price_data][product_data][description]': config.description,
    'line_items[0][quantity]': '1',
    'payment_method_types[0]': 'card',
    'payment_method_types[1]': 'sepa_debit',
    'payment_method_types[2]': 'klarna',
    'payment_method_types[3]': 'link',
    allow_promotion_codes: 'true',
    'invoice_creation[enabled]': 'true',
    'invoice_creation[invoice_data][footer]': INVOICE_FOOTER,
    'metadata[product]': config.product,
    'metadata[customer_name]': name,
  });

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `${config.product}-checkout-${requestId}`,
      },
      body: params,
      signal: AbortSignal.timeout(12000),
    });
    const data = await response.json();
    if (!response.ok || !data?.url) return json({ error: 'Der Checkout konnte gerade nicht gestartet werden.' }, 502, headers);
    return json({ url: data.url }, 200, headers);
  } catch {
    return json({ error: 'Der Checkout konnte gerade nicht gestartet werden.' }, 502, headers);
  }
}

export async function productCheckoutOptions(context) {
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

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/\u0000/g, '').slice(0, maxLength) : '';
}

function isEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}
