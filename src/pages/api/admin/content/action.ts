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

function cleanNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(clean(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function validStatus(value: string) {
  return ['published', 'draft', 'hidden'].includes(value) ? value : 'published';
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

    if (action === 'save-module') {
      const originalSlug = clean(form.get('original_slug'));
      const slug = slugify(clean(form.get('slug')) || clean(form.get('title')));
      const title = clean(form.get('title'));
      if (!slug || !title) throw new Error('Modul braucht Slug und Titel.');

      const payload = {
        product_key: 'beyondbonus',
        slug,
        number: clean(form.get('number')) || '00',
        title,
        short_description: clean(form.get('short_description')),
        intro: clean(form.get('intro')),
        module_cover: clean(form.get('module_cover')) || '/images/beyondbonus/covers/lesson.png',
        sort_order: cleanNumber(form.get('sort_order'), 0),
        status: validStatus(clean(form.get('status'))),
        updated_at: new Date().toISOString(),
      };

      if (originalSlug && originalSlug !== slug) {
        const { error: moduleError } = await admin.from('content_modules').delete().eq('product_key', 'beyondbonus').eq('slug', originalSlug);
        if (moduleError) throw new Error(moduleError.message);
        await admin.from('content_lessons').update({ module_slug: slug, updated_at: new Date().toISOString() }).eq('product_key', 'beyondbonus').eq('module_slug', originalSlug);
      }

      const { error } = await admin.from('content_modules').upsert(payload, { onConflict: 'product_key,slug' });
      if (error) throw new Error(error.message);
      return context.redirect('/admin/content?saved=module');
    }

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
      const moduleSlug = slugify(clean(form.get('module_slug')));
      const lessonSlug = slugify(clean(form.get('lesson_slug')) || clean(form.get('title')));
      const title = clean(form.get('title'));
      const status = validStatus(clean(form.get('status')));
      if (!moduleSlug || !lessonSlug || !title) throw new Error('Lektion braucht Modul, Slug und Titel.');

      const { error } = await admin.from('content_lessons').upsert({
        product_key: 'beyondbonus',
        module_slug: moduleSlug,
        slug: lessonSlug,
        title,
        description: clean(form.get('description')),
        duration: cleanNullable(form.get('duration')),
        media_type: clean(form.get('media_type')) === 'audio' ? 'audio' : 'video',
        media_url: cleanNullable(form.get('media_url')),
        drive_id: cleanNullable(form.get('drive_id')),
        workbook_title: cleanNullable(form.get('workbook_title')),
        workbook_pages: cleanNullable(form.get('workbook_pages')),
        workbook_text: cleanNullable(form.get('workbook_text')),
        sort_order: cleanNumber(form.get('sort_order'), 0),
        status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'product_key,module_slug,slug' });

      if (error) throw new Error(error.message);
      return context.redirect(`/admin/content?saved=lesson#lesson-${moduleSlug}-${lessonSlug}`);
    }

    throw new Error('Unbekannte Aktion.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return context.redirect(`/admin/content?error=${encodeURIComponent(message)}`);
  }
};
