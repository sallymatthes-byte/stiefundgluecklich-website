import type { APIRoute } from 'astro';
import { getAccessSnapshot, type ProductKey } from '../../../../../../lib/auth/grants';
import { loadUserGrants } from '../../../../../../lib/auth/load-grants';
import { buildFallbackMediaPayload, buildR2MediaPayload, getProtectedLessonAsset } from '../../../../../../lib/beyondbonus/media';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

type RuntimeEnv = {
  MEMBERS_MEDIA?: {
    head: (key: string) => Promise<R2Object | null>;
    get: (key: string) => Promise<R2ObjectBody | null>;
  };
};

async function getBucket(context: Parameters<APIRoute>[0]) {
  return (context.locals as { runtime?: { env?: RuntimeEnv } }).runtime?.env?.MEMBERS_MEDIA ?? null;
}

export const GET: APIRoute = async (context) => {
  if (!context.locals.user) {
    return json({ error: 'not-authenticated' }, 401);
  }

  const product = context.params.product as ProductKey | undefined;
  const moduleSlug = context.params.module;
  const lessonSlug = context.params.lesson;

  if (!product || !moduleSlug || !lessonSlug) {
    return json({ error: 'missing-params' }, 400);
  }

  const grants = await loadUserGrants(context as Parameters<typeof loadUserGrants>[0]);
  const access = getAccessSnapshot(grants, product);

  if (!access.course) {
    return json({ error: 'no-access' }, 403);
  }

  const asset = getProtectedLessonAsset(product, moduleSlug, lessonSlug);
  if (!asset) {
    return json({ error: 'asset-not-found' }, 404);
  }

  const stream = context.url.searchParams.get('stream') === '1';
  const bucket = await getBucket(context);
  const objectExists = bucket ? await bucket.head(asset.r2Key) : null;

  if (stream) {
    if (!bucket || !objectExists) {
      return json({ error: 'media-not-migrated' }, 404);
    }

    const object = await bucket.get(asset.r2Key);
    if (!object || !object.body) {
      return json({ error: 'media-unavailable' }, 404);
    }

    return new Response(object.body, {
      status: 200,
      headers: {
        'Content-Type': object.httpMetadata?.contentType || asset.mimeType,
        'Cache-Control': 'private, no-store',
        'Accept-Ranges': 'bytes',
        'Content-Disposition': `inline; filename="${asset.lessonSlug}.mp4"`,
        'ETag': object.httpEtag,
      },
    });
  }

  const media = objectExists ? buildR2MediaPayload(asset) : buildFallbackMediaPayload(asset);
  if (!media) {
    return json({ error: 'media-unavailable' }, 404);
  }

  return json({ media });
};
