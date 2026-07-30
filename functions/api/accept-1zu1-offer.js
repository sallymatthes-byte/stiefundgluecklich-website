import { recordOneToOneOfferAcceptance } from '../lib/activecampaign-1zu1.js';

const ALLOWED_PLANS = new Set(['full', '2x', '3x']);
const TERMS_VERSION = '2026-07-30-v2';

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };

  if (env.PUBLIC_1ZU1_OFFER_ENABLED !== 'true') {
    return json({ error: 'Die Angebotsannahme ist noch nicht freigeschaltet.' }, 503, headers);
  }

  if (!isAllowedOrigin(request)) {
    return json({ error: 'Ungültige Anfrage.' }, 403, headers);
  }

  if (!String(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return json({ error: 'Ungültiges Datenformat.' }, 415, headers);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 12000) {
    return json({ error: 'Die Anfrage ist zu groß.' }, 413, headers);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Die Angaben konnten nicht gelesen werden.' }, 400, headers);
  }

  const acceptance = validateAcceptance(body);
  if (!acceptance.ok) {
    return json({ error: acceptance.error }, 400, headers);
  }

  const stored = await recordOneToOneOfferAcceptance({
    env,
    acceptance: {
      ...acceptance.value,
      termsVersion: TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
    },
  });

  if (!stored.ok) {
    return json({ error: 'Die Angebotsannahme konnte gerade nicht gespeichert werden.' }, stored.status || 502, headers);
  }

  return json({ ok: true }, 200, headers);
}

function validateAcceptance(body) {
  if (!body || typeof body !== 'object') return invalid();
  if (!ALLOWED_PLANS.has(body.plan)) return invalid('Bitte wähle ein gültiges Zahlungsmodell.');
  if (body.termsAccepted !== true || body.earlyStartAccepted !== true) {
    return invalid('Bitte bestätige beide erforderlichen Erklärungen.');
  }

  const requestId = clean(body.requestId, 80);
  const billing = body.billing || {};
  const value = {
    plan: body.plan,
    termsAccepted: true,
    earlyStartAccepted: true,
    requestId,
    billing: {
      firstname: clean(billing.firstname, 80),
      lastname: clean(billing.lastname, 80),
      email: clean(billing.email, 254).toLowerCase(),
      street: clean(billing.street, 160),
      postcode: clean(billing.postcode, 30),
      city: clean(billing.city, 100),
      country: clean(billing.country, 100),
    },
  };

  if (!requestId || !Object.values(value.billing).every(Boolean)) return invalid('Bitte fülle deine Rechnungsdaten vollständig aus.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.billing.email)) return invalid('Bitte prüfe deine E-Mail-Adresse.');
  return { ok: true, value };
}

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';
}

function isAllowedOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const hostname = new URL(origin).hostname;
    return hostname === 'stiefundgluecklich.de'
      || hostname === 'www.stiefundgluecklich.de'
      || hostname === 'stiefundgluecklich-website.pages.dev'
      || hostname.endsWith('.stiefundgluecklich-website.pages.dev');
  } catch {
    return false;
  }
}

function invalid(error = 'Bitte prüfe deine Angaben.') {
  return { ok: false, error };
}

function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), { status, headers });
}
