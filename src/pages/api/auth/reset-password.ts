import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const email = String(formData.get('email') || '').trim();

  if (!email) {
    return context.redirect('/login?error=missing-email');
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return context.redirect('/login?error=supabase-config');
  }

  const redirectTo = new URL('/auth/callback', context.url);
  redirectTo.searchParams.set('next', '/reset-password');
  redirectTo.searchParams.set('type', 'recovery');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString(),
  });

  if (error) {
    return context.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return context.redirect('/login?reset=sent');
};
