// Cloudflare Pages Function — Bonusmama-Check → ActiveCampaign
// Env vars: AC_API_URL, AC_API_KEY (Plaintext in Cloudflare Pages dashboard!)

const PATTERN_TAGS = {
  1: 'scorecard-muster-platz',
  2: 'scorecard-muster-kommunikation',
  3: 'scorecard-muster-leistung',
  4: 'scorecard-muster-anpassung',
  5: 'scorecard-muster-ausdruck',
  6: 'scorecard-muster-verantwortung',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { firstname, email, pattern, totalPct, areaScores, introAnswer } = await request.json();

    if (!email || !firstname) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: corsHeaders });
    }

    const AC_URL = env.AC_API_URL || 'https://sallymatthes.api-us1.com';
    const AC_KEY = env.AC_API_KEY;

    if (!AC_KEY) {
      console.error('AC_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server config error' }), { status: 500, headers: corsHeaders });
    }

    const headers = {
      'Api-Token': AC_KEY,
      'Content-Type': 'application/json',
    };

    // 1. Create or update contact
    const contactRes = await fetch(`${AC_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact: {
          email,
          firstName: firstname,
        }
      })
    });

    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    if (!contactId) {
      console.error('Failed to create contact:', contactData);
      return new Response(JSON.stringify({ error: 'Contact creation failed' }), { status: 500, headers: corsHeaders });
    }

    // 2. Subscribe to Scorecard list (ID 28)
    try {
      await fetch(`${AC_URL}/api/3/contactLists`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contactList: { list: '28', contact: contactId, status: '1' }
        })
      });
    } catch (listErr) {
      console.error('List subscription error:', listErr);
    }

    // 3. Add tags
    const tagsToAdd = ['scorecard-teilnehmerin'];
    
    // Pattern tag
    if (pattern && PATTERN_TAGS[pattern]) {
      tagsToAdd.push(PATTERN_TAGS[pattern]);
    }

    // Intro answer tag (how long bonusmama)
    if (introAnswer) {
      tagsToAdd.push('scorecard-dauer-' + introAnswer);
    }

    // Area-specific tags for weak areas (≤45%)
    if (areaScores) {
      for (const [area, pct] of Object.entries(areaScores)) {
        if (pct <= 45) {
          tagsToAdd.push('scorecard-schwach-' + area);
        }
      }
    }

    // Create tags and add to contact
    for (const tagName of tagsToAdd) {
      try {
        // First ensure tag exists
        const tagRes = await fetch(`${AC_URL}/api/3/tags`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ tag: { tag: tagName, tagType: 'contact' } })
        });
        const tagData = await tagRes.json();
        
        // Get tag ID (from creation or existing)
        let tagId = tagData?.tag?.id;
        if (!tagId && tagData?.errors) {
          // Tag already exists, search for it
          const searchRes = await fetch(`${AC_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`, { headers });
          const searchData = await searchRes.json();
          tagId = searchData?.tags?.[0]?.id;
        }

        if (tagId) {
          await fetch(`${AC_URL}/api/3/contactTags`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } })
          });
        }
      } catch (tagErr) {
        console.error('Tag error for', tagName, tagErr);
      }
    }

    // 4. Store scores as custom fields (IDs from AC)
    const FIELD_IDS = {
      scorecard_pattern: '33',
      scorecard_total: '34',
      scorecard_grenzen: '35',
      scorecard_kommunikation: '36',
      scorecard_rolle: '37',
      scorecard_ex: '38',
      scorecard_selbstfuersorge: '39',
      scorecard_wunderfrage: '40',
    };

    const fieldValues = [
      { field: FIELD_IDS.scorecard_pattern, value: String(pattern || '') },
      { field: FIELD_IDS.scorecard_total, value: String(totalPct || '') },
      { field: FIELD_IDS.scorecard_grenzen, value: String(areaScores?.grenzen || '') },
      { field: FIELD_IDS.scorecard_kommunikation, value: String(areaScores?.kommunikation || '') },
      { field: FIELD_IDS.scorecard_rolle, value: String(areaScores?.rolle || '') },
      { field: FIELD_IDS.scorecard_ex, value: String(areaScores?.ex || '') },
      { field: FIELD_IDS.scorecard_selbstfuersorge, value: String(areaScores?.selbstfuersorge || '') },
    ];

    // Write all field values
    await Promise.all(fieldValues.map(fv =>
      fetch(`${AC_URL}/api/3/fieldValues`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ fieldValue: { contact: contactId, field: fv.field, value: fv.value } })
      }).catch(() => {})
    ));

    return new Response(JSON.stringify({ success: true, contactId }), { headers: corsHeaders });

  } catch (err) {
    console.error('Bonusmama-check error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
