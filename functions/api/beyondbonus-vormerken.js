const BEYONDBONUS_LIST_ID = '24';

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

  if (!isSameOrigin(request)) return json({ error: 'Ungültige Anfrage.' }, 403, headers);
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return json({ error: 'Ungültiges Datenformat.' }, 415, headers);
  }

  let raw;
  try { raw = await request.json(); } catch { return json({ error: 'Die Angaben konnten nicht gelesen werden.' }, 400, headers); }
  if (raw?.website) return json({ error: 'Die Vormerkung konnte nicht gespeichert werden.' }, 400, headers);

  const firstname = clean(raw?.firstname, 80);
  const email = clean(raw?.email, 254).toLowerCase();
  const consent = raw?.consent === true;
  if (!firstname || !isEmail(email) || !consent) {
    return json({ error: 'Bitte prüfe deine Angaben.' }, 400, headers);
  }

  const apiUrl = String(env.AC_API_URL || '').replace(/\/$/, '');
  const apiKey = env.AC_API_KEY;
  const listId = env.AC_BEYONDBONUS_LIST_ID || BEYONDBONUS_LIST_ID;
  if (!apiUrl || !apiKey) return json({ error: 'Die Vormerkung ist gerade nicht verfügbar.' }, 503, headers);

  const acHeaders = { 'Api-Token': apiKey, 'Content-Type': 'application/json' };
  try {
    const contactData = await acRequest(`${apiUrl}/api/3/contact/sync`, {
      method: 'POST', headers: acHeaders,
      body: JSON.stringify({ contact: { email, firstName: firstname } }),
    });
    const contactId = contactData?.contact?.id;
    if (!contactId) throw new Error('No contact ID returned');

    await acRequest(`${apiUrl}/api/3/contactLists`, {
      method: 'POST', headers: acHeaders,
      body: JSON.stringify({ contactList: { list: String(listId), contact: String(contactId), status: '1' } }),
    });
    return json({ success: true }, 200, headers);
  } catch (error) {
    console.error('BeyondBonus reservation failed:', error?.message || error);
    return json({ error: 'Die Vormerkung konnte gerade nicht gespeichert werden. Bitte versuche es später erneut.' }, 502, headers);
  }
}

async function acRequest(url, init) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(10000) });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!response.ok) throw new Error(data?.message || `ActiveCampaign HTTP ${response.status}`);
  return data;
}

function clean(value, max) { return typeof value === 'string' ? value.trim().replace(/\u0000/g, '').slice(0, max) : ''; }
function isEmail(value) { return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}
function json(data, status, headers) { return new Response(JSON.stringify(data), { status, headers }); }
