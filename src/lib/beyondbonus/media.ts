import type { ProductKey } from '../auth/grants';
import { getBeyondBonusLesson } from './content';

export type MediaProvider = 'drive-preview' | 'r2-proxy';
export type MediaKind = 'video';

export type ProtectedMediaAsset = {
  productKey: ProductKey;
  moduleSlug: string;
  lessonSlug: string;
  kind: MediaKind;
  title: string;
  driveId?: string;
  r2Key: string;
  mimeType: string;
};

export type ResolvedMediaPayload = {
  provider: MediaProvider;
  kind: MediaKind;
  title: string;
  url: string;
  expiresAt?: string | null;
  migrationState: 'drive-fallback' | 'r2-ready';
};

export function getProtectedLessonAsset(productKey: ProductKey, moduleSlug: string, lessonSlug: string): ProtectedMediaAsset | null {
  if (productKey !== 'beyondbonus') return null;

  const lesson = getBeyondBonusLesson(moduleSlug, lessonSlug);
  if (!lesson) return null;

  return {
    productKey,
    moduleSlug,
    lessonSlug,
    kind: 'video',
    title: lesson.title,
    driveId: lesson.driveId,
    r2Key: `${productKey}/${moduleSlug}/${lessonSlug}/video.mp4`,
    mimeType: 'video/mp4',
  };
}

export function buildDrivePreviewUrl(driveId: string) {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

export function buildProtectedMediaStreamUrl(productKey: ProductKey, moduleSlug: string, lessonSlug: string) {
  return `/api/members/media/${productKey}/${moduleSlug}/${lessonSlug}?stream=1`;
}

export function buildFallbackMediaPayload(asset: ProtectedMediaAsset): ResolvedMediaPayload | null {
  if (!asset.driveId) {
    return null;
  }

  return {
    provider: 'drive-preview',
    kind: asset.kind,
    title: asset.title,
    url: buildDrivePreviewUrl(asset.driveId),
    expiresAt: null,
    migrationState: 'drive-fallback',
  };
}

export function buildR2MediaPayload(asset: ProtectedMediaAsset): ResolvedMediaPayload {
  return {
    provider: 'r2-proxy',
    kind: asset.kind,
    title: asset.title,
    url: buildProtectedMediaStreamUrl(asset.productKey, asset.moduleSlug, asset.lessonSlug),
    expiresAt: null,
    migrationState: 'r2-ready',
  };
}
