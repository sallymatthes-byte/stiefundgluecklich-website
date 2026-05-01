import type { APIRoute } from 'astro';
import { isAdminEmail } from '../../../../lib/admin/access';

export const prerender = false;

const allowedExtensions = new Set(['mp4', 'm4v', 'mov', 'webm', 'mp3', 'm4a', 'wav']);

function clean(value: unknown) {
  return String(value || '').trim();
}

function slugify(value: string) {
  return clean(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function getExtension(fileName: string, mediaKind: string) {
  const raw = clean(fileName).split('.').pop()?.toLowerCase() || '';
  if (allowedExtensions.has(raw)) return raw;
  return mediaKind === 'audio' ? 'mp3' : 'mp4';
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function hmac(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(sig));
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async (context) => {
  const runtimeEnv = (context.locals as any).runtime?.env;

  if (!isAdminEmail(context.locals.user?.email, runtimeEnv)) {
    return json({ error: 'no-access' }, 403);
  }

  const secret = runtimeEnv?.SUPABASE_SECRET_KEY || runtimeEnv?.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return json({ error: 'upload-secret-missing' }, 500);

  try {
    const body = await context.request.json();
    const targetType = clean(body.targetType);
    const mediaKind = clean(body.mediaKind) === 'audio' ? 'audio' : 'video';
    const extension = getExtension(clean(body.fileName), mediaKind);
    let mediaPath = '';

    if (targetType === 'livecall') {
      const slug = slugify(clean(body.slug) || clean(body.date));
      if (!slug) throw new Error('Livecall-Slug fehlt.');
      mediaPath = `beyondbonus/livecalls/${slug}/media.${extension}`;
    } else if (targetType === 'lesson') {
      const moduleSlug = slugify(clean(body.moduleSlug));
      const lessonSlug = slugify(clean(body.lessonSlug));
      if (!moduleSlug || !lessonSlug) throw new Error('Modul oder Lektion fehlt.');
      mediaPath = `beyondbonus/${moduleSlug}/${lessonSlug}/media.${extension}`;
    } else {
      throw new Error('Unbekanntes Upload-Ziel.');
    }

    const payload = {
      path: mediaPath,
      kind: mediaKind,
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    };
    const payloadPart = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
    const signature = await hmac(payloadPart, secret);
    const token = `${payloadPart}.${signature}`;

    return json({
      uploadUrl: `https://sally.sfrance.co/protected-upload?token=${encodeURIComponent(token)}`,
      path: mediaPath,
      expiresInSeconds: 15 * 60,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'upload-token-failed' }, 400);
  }
};
