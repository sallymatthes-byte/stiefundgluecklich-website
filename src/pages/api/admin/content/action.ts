import type { APIRoute } from 'astro';
import { isAdminEmail } from '../../../../lib/admin/access';
import { createSupabaseAdminClient } from '../../../../lib/supabase/admin';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

function cleanNullable(value: FormDataEntryValue | null) {
  const cleaned = clean(value);
  return cleaned || null;
}

function validStatus(value: string) {
  return ['published', 'draft', 'hidden'].includes(value) ? value : 'published';
}

export const POST: APIRoute = async (context) => {
  const runtimeEnv = (context.locals as any).runtime?.env;

  if (!isAdminEmail(context.locals.user?.email, runtimeEnv)) {
    return context.redirect('/members?error=no-access');
  }

  const admin = createSupabaseAdminClient(runtimeEnv);
  if (!admin) {
    return context.redirect('/admin/content?error=supabase-admin-config');
  }

  try {
    const form = await context.request.formData();
    const action = clean(form.get('action'));

    if (action === 'save-livecall') {
      const slug = clean(form.get('slug'));
      const date = clean(form.get('date'));
      const title = clean(form.get('title'));
      const description = clean(form.get('description'));
      const mediaUrl = clean(form.get('media_url'));
      const status = validStatus(clean(form.get('status')));

      if (!slug || !date || !title || !description || !mediaUrl) {
        throw new Error('Livecall braucht Slug, Datum, Titel, Beschreibung und Medien-URL.');
      }

      const dateLabel = clean(form.get('date_label')) || new Date(`${date}T00:00:00`).toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const { error } = await admin.from('content_livecalls').upsert({
        product_key: 'beyondbonus',
        slug,
        date,
        date_label: dateLabel,
        title,
        description,
        source_name: cleanNullable(form.get('source_name')),
        drive_id: cleanNullable(form.get('drive_id')),
        size_label: cleanNullable(form.get('size_label')),
        duration_label: cleanNullable(form.get('duration_label')),
        media_url: mediaUrl,
        status,
        updated_at: new Date().toISOString(),
      });

      if (error) throw new Error(error.message);
      return context.redirect('/admin/content?saved=livecall');
    }

    if (action === 'delete-livecall') {
      const slug = clean(form.get('slug'));
      if (!slug) throw new Error('Livecall-Slug fehlt.');
      const { error } = await admin.from('content_livecalls').delete().eq('product_key', 'beyondbonus').eq('slug', slug);
      if (error) throw new Error(error.message);
      return context.redirect('/admin/content?deleted=livecall');
    }

    if (action === 'save-lesson') {
      const moduleSlug = clean(form.get('module_slug'));
      const lessonSlug = clean(form.get('lesson_slug'));
      const status = validStatus(clean(form.get('status')));
      if (!moduleSlug || !lessonSlug) throw new Error('Lektion fehlt.');

      const { error } = await admin.from('content_lesson_overrides').upsert({
        product_key: 'beyondbonus',
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        title: cleanNullable(form.get('title')),
        description: cleanNullable(form.get('description')),
        duration: cleanNullable(form.get('duration')),
        media_type: clean(form.get('media_type')) === 'audio' ? 'audio' : 'video',
        media_url: cleanNullable(form.get('media_url')),
        drive_id: cleanNullable(form.get('drive_id')),
        status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'product_key,module_slug,lesson_slug' });

      if (error) throw new Error(error.message);
      return context.redirect(`/admin/content?saved=lesson#lesson-${moduleSlug}-${lessonSlug}`);
    }

    throw new Error('Unbekannte Aktion.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return context.redirect(`/admin/content?error=${encodeURIComponent(message)}`);
  }
};
