import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const password = String(formData.get('password') || '');
  const passwordRepeat = String(formData.get('password_repeat') || '');
  const next = String(formData.get('next') || '/members').trim() || '/members';
  const safeNext = next.startsWith('/') ? next : '/members';

  if (!password) {
    return context.redirect(`/reset-password?error=missing-password&next=${encodeURIComponent(safeNext)}`);
  }

  if (password.length < 10) {
    return context.redirect(`/reset-password?error=password-too-short&next=${encodeURIComponent(safeNext)}`);
  }

  if (password !== passwordRepeat) {
    return context.redirect(`/reset-password?error=password-mismatch&next=${encodeURIComponent(safeNext)}`);
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return context.redirect(`/reset-password?error=supabase-config&next=${encodeURIComponent(safeNext)}`);
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return context.redirect(`/reset-password?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(safeNext)}`);
  }

  const redirectTo = new URL(safeNext, context.url);
  redirectTo.searchParams.set('password-updated', '1');
  return context.redirect(redirectTo.toString());
};
