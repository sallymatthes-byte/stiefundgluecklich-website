import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/members').trim() || '/members';

  if (!email) {
    return context.redirect('/login?error=missing-email');
  }

  if (!password) {
    return context.redirect('/login?error=missing-password');
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return context.redirect(`/login?error=supabase-config&next=${encodeURIComponent(next)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return context.redirect(`/login?error=invalid-credentials&next=${encodeURIComponent(next)}`);
  }

  return context.redirect(next);
};

