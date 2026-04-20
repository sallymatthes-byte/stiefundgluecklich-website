import { defineMiddleware } from 'astro:middleware';
import { isProtectedPath } from './lib/auth/config';
import { createSupabaseServerClient } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null;
  context.locals.session = null;

  const supabase = createSupabaseServerClient(context);

  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    context.locals.session = session;
    context.locals.user = session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
        }
      : null;
  }

  if (isProtectedPath(context.url.pathname) && !context.locals.user) {
    const redirectTo = new URL('/login', context.url);
    redirectTo.searchParams.set('next', context.url.pathname);
    return context.redirect(redirectTo.toString());
  }

  return next();
});

