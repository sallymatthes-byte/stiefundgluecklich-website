// Cloudflare Pages Function — Quiz / Warteliste → ActiveCampaign
// Env vars needed: AC_API_URL, AC_API_KEY (set in Cloudflare Pages dashboard)

// AC List IDs
const LISTS = {
  quiz: '27',        // Quiz Leads
  its: '25',         // It's time to shine
  beyondbonus: '24', // BeyondBonus
  warteliste: '23',  // Warteliste 1:1 Babypause
};

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { firstname, email, tags, result } = await request.json();

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

    // 2. Add to appropriate list
    // Quiz results → Quiz Leads list + result-specific list
    // Warteliste → Warteliste list
    const listsToAdd = [LISTS.quiz]; // Always add to Quiz Leads

    if (result === 'warteliste') {
      listsToAdd.push(LISTS.warteliste);
    }

    for (const listId of listsToAdd) {
      try {
        await fetch(`${AC_URL}/api/3/contactLists`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contactList: {
              list: listId,
              contact: contactId,
              status: '1', // 1 = subscribed
            }
          })
        });
      } catch (e) {
        console.error(`Failed to add contact to list ${listId}:`, e);
      }
    }

    // 3. Add result-specific ergebnis tag (for AC automation follow-ups)
    const ergebnisTagMap = {
      'its': 'quiz-ergebnis-its-bundle',
      'beyondbonus': 'quiz-ergebnis-beyondbonus',
      'warteliste': 'quiz-ergebnis-warteliste',
    };
    const ergebnisTag = ergebnisTagMap[result];
    const allTags = [...(tags || [])];
    if (ergebnisTag && !allTags.includes(ergebnisTag)) {
      allTags.push(ergebnisTag);
    }

    // 3. Add tags
    if (allTags && allTags.length > 0) {
      for (const tagName of allTags) {
        let tagId;
        
        // Search for existing tag
        const searchRes = await fetch(`${AC_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`, { headers });
        const searchData = await searchRes.json();
        const existingTag = searchData?.tags?.find(t => t.tag === tagName);
        
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // Create tag
          const createRes = await fetch(`${AC_URL}/api/3/tags`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ tag: { tag: tagName, tagType: 'contact', description: 'Quiz tag' } })
          });
          const createData = await createRes.json();
          tagId = createData?.tag?.id;
        }

        if (tagId) {
          await fetch(`${AC_URL}/api/3/contactTags`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } })
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, contactId, result }), { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error('Quiz API error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
}

// Handle preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
