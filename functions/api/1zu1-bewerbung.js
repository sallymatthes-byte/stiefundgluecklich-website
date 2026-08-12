// Cloudflare Pages Function — secure 1:1 application submission and routing.
// Routing is based only on closed answers. Free text is stored for Sally's call preparation.

import { submitOneToOneApplication } from '../lib/activecampaign-1zu1.js';

const ALLOWED = {
  knownFrom: ['instagram', 'podcast', 'break-the-cycle', 'newsletter', 'empfehlung', 'google-blog', 'ki-suche', 'sonstiges'],
  roleDuration: ['unter-6-monate', '6-monate-2-jahre', '2-5-jahre', 'mehr-als-5-jahre'],
  mainStrain: ['aussenseiterin', 'konflikte', 'ex-grenzen', 'bonus-kind', 'rolle', 'selbstverlust', 'erschoepft', 'sonstiges'],
  urgency: ['sehr-dringend', 'dringend', 'veraenderungswunsch', 'nur-information'],
  attempts: ['partnergespraech', 'content-selbstarbeit', 'break-the-cycle', 'beyondbonus-kurs', 'therapie', 'coaching-beratung', 'noch-nichts', 'sonstiges'],
  responsibility: ['andere-sollen-sich-aendern', 'unsicher-eigener-anteil', 'bereit-eigener-anteil'],
  timeCapacity: ['verbindlich', 'flexibel', 'keine-zeit'],
  investmentRange: ['bis-500', '500-1000', '1000-2000', '2000-3500', 'ueber-3500'],
  priceReality: ['moeglich', 'raten', 'partnergespraech', 'nicht-moeglich'],
  desiredStart: ['mitte-september-2026', 'oktober-2026', 'naechste-3-monate', 'spaeter'],
  supportFrame: ['coaching-stabil', 'akute-krise', 'andere-fachhilfe'],
};

export async function onRequestPost(context) {
  const { request, env } = context;
  const responseHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  if (!isSameOrigin(request)) {
    return json({ error: 'Ungültige Anfrage.' }, 403, responseHeaders);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json({ error: 'Ungültiges Datenformat.' }, 415, responseHeaders);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 30000) {
    return json({ error: 'Die Anfrage ist zu groß.' }, 413, responseHeaders);
  }

  let raw;
  try {
    raw = await request.json();
  } catch {
    return json({ error: 'Die Angaben konnten nicht gelesen werden.' }, 400, responseHeaders);
  }

  if (raw?.website) {
    // Honeypot: do not reveal bot detection details.
    return json({ error: 'Die Bewerbung konnte nicht gesendet werden.' }, 400, responseHeaders);
  }

  const validation = validateApplication(raw);
  if (!validation.ok) {
    return json({ error: 'Bitte prüfe deine Angaben.', fields: validation.fields }, 400, responseHeaders);
  }

  const application = validation.application;
  const route = determineOneToOneRoute(application);
  const stored = await submitOneToOneApplication({ env, application, route });

  // Fail closed: never show a success result when Sally's preparation data was discarded.
  if (!stored.ok) {
    return json({
      error: 'Deine Bewerbung konnte gerade nicht sicher gespeichert werden. Bitte versuche es später noch einmal.',
    }, stored.status || 502, responseHeaders);
  }

  return json({ success: true, route }, 200, responseHeaders);
}

export function validateApplication(raw) {
  const fields = [];
  const application = {
    formVersion: '2026-07-16-v2',
    firstname: cleanText(raw?.firstname, 80),
    email: cleanText(raw?.email, 254).toLowerCase(),
    knownFrom: raw?.knownFrom,
    roleDuration: raw?.roleDuration,
    mainStrain: raw?.mainStrain,
    mainStrainOther: cleanText(raw?.mainStrainOther, 500),
    urgency: raw?.urgency,
    attempts: Array.isArray(raw?.attempts) ? [...new Set(raw.attempts)] : [],
    attemptsOther: cleanText(raw?.attemptsOther, 500),
    goal: cleanText(raw?.goal, 1000),
    responsibility: raw?.responsibility,
    timeCapacity: raw?.timeCapacity,
    investmentRange: raw?.investmentRange,
    priceReality: raw?.priceReality || '',
    desiredStart: raw?.desiredStart || '',
    supportFrame: raw?.supportFrame || '',
    notes: cleanText(raw?.notes, 2000),
    privacyConsent: raw?.privacyConsent === true,
    contactConsent: raw?.contactConsent === true,
    source: cleanSource(raw?.source),
  };

  if (application.firstname.length < 1) fields.push('firstname');
  if (!isEmail(application.email)) fields.push('email');
  validateEnum(fields, application, 'knownFrom');
  validateEnum(fields, application, 'roleDuration');
  validateEnum(fields, application, 'mainStrain');
  if (application.mainStrain === 'sonstiges' && !application.mainStrainOther) fields.push('mainStrainOther');
  validateEnum(fields, application, 'urgency');
  if (!application.attempts.length || application.attempts.some((value) => !ALLOWED.attempts.includes(value))) fields.push('attempts');
  if (application.attempts.includes('sonstiges') && !application.attemptsOther) fields.push('attemptsOther');
  if (application.goal.length < 150) fields.push('goal');
  validateEnum(fields, application, 'responsibility');
  validateEnum(fields, application, 'timeCapacity');
  validateEnum(fields, application, 'investmentRange');

  const highInvestment = ['2000-3500', 'ueber-3500'].includes(application.investmentRange);
  if (highInvestment) validateEnum(fields, application, 'priceReality');

  const priceEligible = highInvestment && ['moeglich', 'raten', 'partnergespraech'].includes(application.priceReality);
  if (priceEligible) validateEnum(fields, application, 'desiredStart');

  // Always collect the coaching/safety boundary. This keeps route E at the
  // highest priority even when price or readiness already excludes 1:1.
  validateEnum(fields, application, 'supportFrame');

  if (!application.privacyConsent) fields.push('privacyConsent');
  if (!application.contactConsent) fields.push('contactConsent');

  return fields.length ? { ok: false, fields } : { ok: true, application };
}

export function determineOneToOneRoute(application) {
  // Priority 1: safety / professional support.
  if (['akute-krise', 'andere-fachhilfe'].includes(application.supportFrame)) {
    return 'andere-unterstuetzung';
  }

  // Priority 2: current readiness, time or timing.
  if (
    application.urgency === 'nur-information' ||
    application.responsibility === 'andere-sollen-sich-aendern' ||
    application.timeCapacity === 'keine-zeit' ||
    application.desiredStart === 'spaeter'
  ) {
    return 'noch-nicht';
  }

  // Priority 3: financial fit.
  if (['bis-500', '500-1000', '1000-2000'].includes(application.investmentRange)) return 'beyondbonus';
  if (application.priceReality === 'nicht-moeglich') return 'beyondbonus';

  // Route A only when every closed-answer requirement is positively met.
  const isFit =
    ['sehr-dringend', 'dringend', 'veraenderungswunsch'].includes(application.urgency) &&
    ['unsicher-eigener-anteil', 'bereit-eigener-anteil'].includes(application.responsibility) &&
    ['verbindlich', 'flexibel'].includes(application.timeCapacity) &&
    ['2000-3500', 'ueber-3500'].includes(application.investmentRange) &&
    ['moeglich', 'raten', 'partnergespraech'].includes(application.priceReality) &&
    ['mitte-september-2026', 'oktober-2026', 'naechste-3-monate'].includes(application.desiredStart) &&
    application.supportFrame === 'coaching-stabil';

  return isFit ? 'kennenlernen' : 'noch-nicht';
}

function validateEnum(fields, application, field) {
  if (!ALLOWED[field].includes(application[field])) fields.push(field);
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/\u0000/g, '').slice(0, maxLength) : '';
}

function cleanSource(value) {
  const source = cleanText(value, 100);
  return /^[a-zA-Z0-9_.:-]+$/.test(source) ? source : 'direct';
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
