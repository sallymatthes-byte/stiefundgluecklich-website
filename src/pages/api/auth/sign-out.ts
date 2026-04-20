import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient(context);

  if (supabase) {
    await supabase.auth.signOut();
  }

  return context.redirect('/login?signed-out=1');
};

