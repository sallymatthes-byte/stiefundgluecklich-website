const IMPORT_TOKEN = 'bb_r2_import_2026_04_21_8f3b0f6c7a3240c4b6d1e9a53e7f1b92';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function isAuthorized(request) {
  const url = new URL(request.url);
  const token = request.headers.get('x-import-token') || url.searchParams.get('token');
  return token === IMPORT_TOKEN;
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request)) return json({ error: 'unauthorized' }, 401);

  const bucket = context.env.MEMBERS_MEDIA;
  if (!bucket) return json({ error: 'missing-r2-binding' }, 500);

  const body = await context.request.json();
  const action = String(body.action || '');
  const key = String(body.key || '');
  if (!key) return json({ error: 'missing-key' }, 400);

  if (action === 'start') {
    const contentType = String(body.contentType || 'application/octet-stream');
    const upload = await bucket.createMultipartUpload(key, {
      httpMetadata: { contentType },
    });
    return json({ ok: true, uploadId: upload.uploadId });
  }

  if (action === 'complete') {
    const uploadId = String(body.uploadId || '');
    const parts = Array.isArray(body.parts) ? body.parts : [];
    if (!uploadId || parts.length === 0) return json({ error: 'missing-complete-data' }, 400);
    const upload = bucket.resumeMultipartUpload(key, uploadId);
    await upload.complete(parts);
    return json({ ok: true });
  }

  if (action === 'abort') {
    const uploadId = String(body.uploadId || '');
    if (!uploadId) return json({ error: 'missing-upload-id' }, 400);
    const upload = bucket.resumeMultipartUpload(key, uploadId);
    await upload.abort();
    return json({ ok: true });
  }

  return json({ error: 'invalid-action' }, 400);
}

export async function onRequestPut(context) {
  if (!isAuthorized(context.request)) return json({ error: 'unauthorized' }, 401);

  const bucket = context.env.MEMBERS_MEDIA;
  if (!bucket) return json({ error: 'missing-r2-binding' }, 500);

  const url = new URL(context.request.url);
  const key = url.searchParams.get('key') || '';
  const uploadId = url.searchParams.get('uploadId') || '';
  const partNumber = Number(url.searchParams.get('partNumber') || '0');
  if (!key || !uploadId || !partNumber) {
    return json({ error: 'missing-part-data' }, 400);
  }

  const upload = bucket.resumeMultipartUpload(key, uploadId);
  const body = await context.request.arrayBuffer();
  const part = await upload.uploadPart(partNumber, body);
  return json({ ok: true, etag: part.etag, partNumber: part.partNumber });
}
