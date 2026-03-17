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

    // 2. Add tags
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

    // 3. Store scores as custom fields (if fields exist)
    // Custom field IDs need to be created in AC first
    // For now, store pattern + total score in notes/field values
    const fieldMappings = {
      'scorecard_pattern': String(pattern || ''),
      'scorecard_total': String(totalPct || ''),
      'scorecard_grenzen': String(areaScores?.grenzen || ''),
      'scorecard_kommunikation': String(areaScores?.kommunikation || ''),
      'scorecard_rolle': String(areaScores?.rolle || ''),
      'scorecard_ex': String(areaScores?.ex || ''),
      'scorecard_selbstfuersorge': String(areaScores?.selbstfuersorge || ''),
    };

    // Try to update custom fields (will silently fail if fields don't exist yet)
    for (const [field, value] of Object.entries(fieldMappings)) {
      try {
        // Search for field by name
        const fieldSearchRes = await fetch(`${AC_URL}/api/3/fields?search=${encodeURIComponent(field)}`, { headers });
        const fieldSearchData = await fieldSearchRes.json();
        const fieldId = fieldSearchData?.fields?.[0]?.id;
        
        if (fieldId) {
          await fetch(`${AC_URL}/api/3/fieldValues`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ fieldValue: { contact: contactId, field: fieldId, value } })
          });
        }
      } catch (fieldErr) {
        // Silently continue — fields might not exist yet
      }
    }

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
