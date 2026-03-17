// Cloudflare Pages Function — Bonusmama-Check Wunderfrage → AC Custom Field
// Env vars: AC_API_URL, AC_API_KEY

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { email, wonderAnswer } = await request.json();

    if (!email || !wonderAnswer) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: corsHeaders });
    }

    const AC_URL = env.AC_API_URL || 'https://sallymatthes.api-us1.com';
    const AC_KEY = env.AC_API_KEY;

    if (!AC_KEY) {
      return new Response(JSON.stringify({ error: 'Server config error' }), { status: 500, headers: corsHeaders });
    }

    const headers = {
      'Api-Token': AC_KEY,
      'Content-Type': 'application/json',
    };

    // Find contact by email
    const searchRes = await fetch(`${AC_URL}/api/3/contacts?email=${encodeURIComponent(email)}`, { headers });
    const searchData = await searchRes.json();
    const contactId = searchData?.contacts?.[0]?.id;

    if (!contactId) {
      return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404, headers: corsHeaders });
    }

    // Try to store wonder answer in custom field
    try {
      const fieldSearchRes = await fetch(`${AC_URL}/api/3/fields?search=scorecard_wunderfrage`, { headers });
      const fieldSearchData = await fieldSearchRes.json();
      const fieldId = fieldSearchData?.fields?.[0]?.id;

      if (fieldId) {
        await fetch(`${AC_URL}/api/3/fieldValues`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ fieldValue: { contact: contactId, field: fieldId, value: wonderAnswer.substring(0, 500) } })
        });
      }
    } catch (err) {
      console.error('Wonder field error:', err);
    }

    // Also add a note with the wonder answer (always works, no custom field needed)
    try {
      await fetch(`${AC_URL}/api/3/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          note: {
            contact: contactId,
            note: `Wunderfrage (Bonusmama-Check): "${wonderAnswer}"`,
          }
        })
      });
    } catch (err) {
      console.error('Note error:', err);
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });

  } catch (err) {
    console.error('Wonder error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
