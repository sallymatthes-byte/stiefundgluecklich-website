import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const password = String(formData.get('password') || '');
  const passwordRepeat = String(formData.get('password_repeat') || '');

  if (!password) {
    return context.redirect('/reset-password?error=missing-password');
  }

  if (password.length < 10) {
    return context.redirect('/reset-password?error=password-too-short');
  }

  if (password !== passwordRepeat) {
    return context.redirect('/reset-password?error=password-mismatch');
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return context.redirect('/reset-password?error=supabase-config');
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return context.redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  return context.redirect('/members?password-updated=1');
};
