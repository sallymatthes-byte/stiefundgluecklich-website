import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { beyondBonusModules, getLessonKey } from '../../../lib/beyondbonus/content';

const validLessonKeys = new Set(
  beyondBonusModules.flatMap((module) => module.lessons.map((lesson) => getLessonKey(module.slug, lesson.slug))),
);

export const GET: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient(context);
  const user = context.locals.user;

  if (!supabase || !user) {
    return new Response(JSON.stringify({ error: 'not-authenticated' }), { status: 401 });
  }

  const { data, error } = await supabase
    .from('member_lesson_progress')
    .select('lesson_key, completed, completed_at, updated_at')
    .eq('user_id', user.id)
    .eq('product_key', 'beyondbonus');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ progress: data || [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient(context);
  const user = context.locals.user;

  if (!supabase || !user) {
    return new Response(JSON.stringify({ error: 'not-authenticated' }), { status: 401 });
  }

  const body = await context.request.json().catch(() => null);
  const lessonKey = String(body?.lessonKey || '').trim();
  const completed = Boolean(body?.completed);

  if (!validLessonKeys.has(lessonKey)) {
    return new Response(JSON.stringify({ error: 'unknown-lesson' }), { status: 400 });
  }

  const now = new Date().toISOString();
  const payload = {
    user_id: user.id,
    product_key: 'beyondbonus',
    lesson_key: lessonKey,
    completed,
    completed_at: completed ? now : null,
    updated_at: now,
  };

  const { error } = await supabase
    .from('member_lesson_progress')
    .upsert(payload, { onConflict: 'user_id,product_key,lesson_key' });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, lessonKey, completed }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
