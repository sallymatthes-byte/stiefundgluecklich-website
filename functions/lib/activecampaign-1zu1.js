// ActiveCampaign adapter for the 1:1 application.
// This module is intentionally separate from validation/routing so the form logic
// remains deterministic and can be tested without ActiveCampaign.
//
// Required env vars before launch:
// AC_API_URL, AC_API_KEY, AC_1ZU1_ENABLED=true
// AC_1ZU1_LIST_ID, AC_1ZU1_TAG_ID
// AC_1ZU1_ROUTE_A_TAG_ID ... AC_1ZU1_ROUTE_E_TAG_ID
// AC_1ZU1_FIELD_ROUTE_ID, AC_1ZU1_FIELD_ANSWERS_ID
// AC_1ZU1_FIELD_GOAL_ID, AC_1ZU1_FIELD_NOTES_ID

const ROUTE_TAG_ENV = {
  kennenlernen: 'AC_1ZU1_ROUTE_A_TAG_ID',
  'kleiner-schritt': 'AC_1ZU1_ROUTE_B_TAG_ID',
  beyondbonus: 'AC_1ZU1_ROUTE_C_TAG_ID',
  'noch-nicht': 'AC_1ZU1_ROUTE_D_TAG_ID',
  'andere-unterstuetzung': 'AC_1ZU1_ROUTE_E_TAG_ID',
};

export async function submitOneToOneApplication({ env, application, route }) {
  const config = getConfig(env, route);
  if (!config.ok) return config;

  const headers = {
    'Api-Token': config.apiKey,
    'Content-Type': 'application/json',
  };

  try {
    const contactData = await acRequest(`${config.apiUrl}/api/3/contact/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact: {
          email: application.email,
          firstName: application.firstname,
        },
      }),
    });

    const contactId = contactData?.contact?.id;
    if (!contactId) throw new Error('ActiveCampaign contact sync returned no contact ID');

    // Tags are assigned before list subscription so a list-triggered automation can route immediately.
    for (const tagId of [config.baseTagId, config.routeTagId]) {
      await acRequest(`${config.apiUrl}/api/3/contactTags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ contactTag: { contact: contactId, tag: String(tagId) } }),
      });
    }

    const compactAnswers = {
      version: application.formVersion,
      source: application.source,
      knownFrom: application.knownFrom,
      roleDuration: application.roleDuration,
      mainStrain: application.mainStrain,
      mainStrainOther: application.mainStrainOther || '',
      urgency: application.urgency,
      attempts: application.attempts,
      attemptsOther: application.attemptsOther || '',
      responsibility: application.responsibility,
      timeCapacity: application.timeCapacity,
      investmentRange: application.investmentRange,
      priceReality: application.priceReality || '',
      desiredStart: application.desiredStart || '',
      supportFrame: application.supportFrame || '',
      submittedAt: new Date().toISOString(),
    };

    await Promise.all([
      upsertFieldValue({ config, headers, contactId, fieldId: config.routeFieldId, value: route }),
      upsertFieldValue({ config, headers, contactId, fieldId: config.answersFieldId, value: JSON.stringify(compactAnswers) }),
      upsertFieldValue({ config, headers, contactId, fieldId: config.goalFieldId, value: application.goal }),
      upsertFieldValue({ config, headers, contactId, fieldId: config.notesFieldId, value: application.notes || '' }),
    ]);

    await acRequest(`${config.apiUrl}/api/3/contactLists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contactList: { list: String(config.listId), contact: contactId, status: '1' },
      }),
    });

    return { ok: true };
  } catch (error) {
    console.error('1:1 application ActiveCampaign submission failed:', error?.message || error);
    return { ok: false, status: 502, error: 'ActiveCampaign submission failed' };
  }
}

function getConfig(env, route) {
  if (env.AC_1ZU1_ENABLED !== 'true') {
    return { ok: false, status: 503, error: '1:1 application storage is not enabled' };
  }

  const routeTagEnv = ROUTE_TAG_ENV[route];
  const values = {
    apiUrl: env.AC_API_URL,
    apiKey: env.AC_API_KEY,
    listId: env.AC_1ZU1_LIST_ID,
    baseTagId: env.AC_1ZU1_TAG_ID,
    routeTagId: routeTagEnv ? env[routeTagEnv] : undefined,
    routeFieldId: env.AC_1ZU1_FIELD_ROUTE_ID,
    answersFieldId: env.AC_1ZU1_FIELD_ANSWERS_ID,
    goalFieldId: env.AC_1ZU1_FIELD_GOAL_ID,
    notesFieldId: env.AC_1ZU1_FIELD_NOTES_ID,
  };

  const missing = Object.entries(values).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    console.error('Missing 1:1 ActiveCampaign env configuration:', missing.join(', '));
    return { ok: false, status: 503, error: '1:1 application storage is not configured' };
  }

  return { ok: true, ...values, apiUrl: String(values.apiUrl).replace(/\/$/, '') };
}

async function upsertFieldValue({ config, headers, contactId, fieldId, value }) {
  const existing = await acRequest(`${config.apiUrl}/api/3/contacts/${encodeURIComponent(contactId)}/fieldValues`, { headers });
  const existingId = existing?.fieldValues?.find((item) => String(item.field) === String(fieldId))?.id;
  const body = JSON.stringify({
    fieldValue: { contact: contactId, field: String(fieldId), value: String(value || '') },
  });

  if (existingId) {
    await acRequest(`${config.apiUrl}/api/3/fieldValues/${existingId}`, { method: 'PUT', headers, body });
    return;
  }

  await acRequest(`${config.apiUrl}/api/3/fieldValues`, { method: 'POST', headers, body });
}

async function acRequest(url, init) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(10000) });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  if (!response.ok) {
    throw new Error(data?.message || data?.errors?.[0]?.title || `ActiveCampaign HTTP ${response.status}`);
  }
  return data;
}
