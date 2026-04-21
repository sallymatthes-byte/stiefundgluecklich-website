import type { APIRoute } from 'astro';

export const prerender = false;

const IMPORT_TOKEN = 'bb_r2_import_2026_04_21_8f3b0f6c7a3240c4b6d1e9a53e7f1b92';

type RuntimeEnv = {
  MEMBERS_MEDIA?: {
    createMultipartUpload: (key: string, options?: Record<string, unknown>) => Promise<{ uploadId: string }>;
    resumeMultipartUpload: (key: string, uploadId: string) => {
      uploadPart: (partNumber: number, value: ReadableStream<Uint8Array> | ArrayBuffer | ArrayBufferView | Blob | string) => Promise<{ etag: string; partNumber: number }>;
      complete: (parts: { etag: string; partNumber: number }[]) => Promise<unknown>;
      abort: () => Promise<void>;
    };
  };
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function getBucket(context: Parameters<APIRoute>[0]) {
  return (context.locals as { runtime?: { env?: RuntimeEnv } }).runtime?.env?.MEMBERS_MEDIA ?? null;
}

function isAuthorized(context: Parameters<APIRoute>[0]) {
  const token = context.request.headers.get('x-import-token') || context.url.searchParams.get('token');
  return token === IMPORT_TOKEN;
}

export const POST: APIRoute = async (context) => {
  if (!isAuthorized(context)) return json({ error: 'unauthorized' }, 401);

  const bucket = getBucket(context);
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
};

export const PUT: APIRoute = async (context) => {
  if (!isAuthorized(context)) return json({ error: 'unauthorized' }, 401);

  const bucket = getBucket(context);
  if (!bucket) return json({ error: 'missing-r2-binding' }, 500);

  const key = context.url.searchParams.get('key') || '';
  const uploadId = context.url.searchParams.get('uploadId') || '';
  const partNumber = Number(context.url.searchParams.get('partNumber') || '0');

  if (!key || !uploadId || !partNumber) {
    return json({ error: 'missing-part-data' }, 400);
  }

  const upload = bucket.resumeMultipartUpload(key, uploadId);
  const arrayBuffer = await context.request.arrayBuffer();
  const part = await upload.uploadPart(partNumber, arrayBuffer);

  return json({ ok: true, etag: part.etag, partNumber: part.partNumber });
};
