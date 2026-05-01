import { createSupabaseAdminClient } from '../supabase/admin';
import { beyondBonusModules, type BeyondBonusLesson, type BeyondBonusModule } from './content';
import { beyondBonusLivecallRecordings, type BeyondBonusLivecallRecording } from './livecalls';

export type ContentStatus = 'published' | 'draft' | 'hidden';

type RuntimeEnv = Record<string, string | undefined> | undefined;

export type EditableLesson = BeyondBonusLesson & {
  status?: ContentStatus;
};

export type EditableModule = Omit<BeyondBonusModule, 'lessons'> & {
  lessons: EditableLesson[];
};

type LessonOverrideRow = {
  product_key: string;
  module_slug: string;
  lesson_slug: string;
  title: string | null;
  description: string | null;
  duration: string | null;
  media_type: 'video' | 'audio' | null;
  media_url: string | null;
  drive_id: string | null;
  status: ContentStatus | null;
};

type LivecallRow = {
  slug: string;
  date: string;
  date_label: string;
  title: string;
  description: string;
  source_name: string | null;
  drive_id: string | null;
  size_label: string | null;
  duration_label: string | null;
  media_url: string;
  status: ContentStatus | null;
};

const publishedStatuses = new Set<ContentStatus>(['published']);

function normalizeStatus(value: string | null | undefined): ContentStatus {
  return value === 'draft' || value === 'hidden' ? value : 'published';
}

function cleanNullable(value: string | null | undefined) {
  const cleaned = String(value || '').trim();
  return cleaned || null;
}

export function mergeLessonOverrides(
  modules: BeyondBonusModule[],
  rows: LessonOverrideRow[],
  options: { includeDrafts?: boolean } = {},
): EditableModule[] {
  const byKey = new Map(rows.map((row) => [`${row.module_slug}::${row.lesson_slug}`, row]));

  return modules
    .map((module) => {
      const lessons = module.lessons
        .map((lesson) => {
          const row = byKey.get(`${module.slug}::${lesson.slug}`);
          const status = normalizeStatus(row?.status);
          const merged: EditableLesson = {
            ...lesson,
            title: cleanNullable(row?.title) || lesson.title,
            description: cleanNullable(row?.description) || lesson.description,
            duration: cleanNullable(row?.duration) || lesson.duration,
            mediaType: row?.media_type || lesson.mediaType,
            mediaUrl: cleanNullable(row?.media_url) || lesson.mediaUrl,
            driveId: cleanNullable(row?.drive_id) || lesson.driveId,
            status,
          };
          return merged;
        })
        .filter((lesson) => options.includeDrafts || publishedStatuses.has(normalizeStatus(lesson.status)));

      return { ...module, lessons };
    })
    .filter((module) => options.includeDrafts || module.lessons.length > 0);
}

export async function loadBeyondBonusModules(
  runtimeEnv?: RuntimeEnv,
  options: { includeDrafts?: boolean } = {},
): Promise<EditableModule[]> {
  const admin = createSupabaseAdminClient(runtimeEnv);
  if (!admin) return mergeLessonOverrides(beyondBonusModules, [], options);

  const { data, error } = await admin
    .from('content_lesson_overrides')
    .select('product_key, module_slug, lesson_slug, title, description, duration, media_type, media_url, drive_id, status')
    .eq('product_key', 'beyondbonus');

  if (error) {
    console.warn('content_lesson_overrides unavailable', error.message);
    return mergeLessonOverrides(beyondBonusModules, [], options);
  }

  return mergeLessonOverrides(beyondBonusModules, (data || []) as LessonOverrideRow[], options);
}

export function getModuleFromModules(modules: EditableModule[], slug: string) {
  return modules.find((module) => module.slug === slug) || null;
}

export function getLessonFromModules(modules: EditableModule[], moduleSlug: string, lessonSlug: string) {
  return getModuleFromModules(modules, moduleSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug) || null;
}

export async function loadBeyondBonusLivecalls(
  runtimeEnv?: RuntimeEnv,
  options: { includeDrafts?: boolean } = {},
): Promise<BeyondBonusLivecallRecording[]> {
  const admin = createSupabaseAdminClient(runtimeEnv);
  if (!admin) return beyondBonusLivecallRecordings;

  const { data, error } = await admin
    .from('content_livecalls')
    .select('slug, date, date_label, title, description, source_name, drive_id, size_label, duration_label, media_url, status')
    .eq('product_key', 'beyondbonus')
    .order('date', { ascending: true });

  if (error) {
    console.warn('content_livecalls unavailable', error.message);
    return beyondBonusLivecallRecordings;
  }

  const rows = (data || []) as LivecallRow[];
  if (rows.length === 0) return beyondBonusLivecallRecordings;

  return rows
    .filter((row) => options.includeDrafts || normalizeStatus(row.status) === 'published')
    .map((row) => ({
      slug: row.slug,
      date: row.date,
      dateLabel: row.date_label,
      title: row.title,
      description: row.description,
      sourceName: row.source_name || '',
      driveId: row.drive_id || '',
      sizeLabel: row.size_label || '',
      durationLabel: row.duration_label || '',
      mediaUrl: row.media_url,
      status: normalizeStatus(row.status),
    }));
}

export async function getBeyondBonusLivecallFromStore(runtimeEnv: RuntimeEnv, slug: string) {
  const recordings = await loadBeyondBonusLivecalls(runtimeEnv);
  return recordings.find((recording) => recording.slug === slug) || null;
}
