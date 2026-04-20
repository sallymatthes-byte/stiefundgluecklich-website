import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const email = String(formData.get('email') || '').trim();
  const next = String(formData.get('next') || '/members').trim() || '/members';

  if (!email) {
    return context.redirect('/login?error=missing-email');
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return context.redirect(`/login?error=supabase-config&next=${encodeURIComponent(next)}`);
  }

  const callbackUrl = new URL('/auth/callback', context.url);
  callbackUrl.searchParams.set('next', next);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      shouldCreateUser: false,
    },
  });

  if (error) {
    return context.redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  return context.redirect(`/login?sent=1&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);
};

