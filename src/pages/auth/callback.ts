import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../lib/supabase/server';

export const GET: APIRoute = async (context) => {
  const tokenHash = context.url.searchParams.get('token_hash');
  const type = context.url.searchParams.get('type') || 'email';
  const next = context.url.searchParams.get('next') || '/members';

  const safeNext = next.startsWith('/') ? next : '/members';
  const redirectUrl = new URL(safeNext, context.url);

  const supabase = createSupabaseServerClient(context);
  if (!supabase || !tokenHash) {
    return context.redirect('/login?error=invalid-auth-link');
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as 'email' | 'recovery' | 'invite' | 'email_change',
  });

  if (error) {
    return context.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return context.redirect(redirectUrl.toString());
};

