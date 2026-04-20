import { createServerClient } from '@supabase/ssr';

type CookieSetOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  secure?: boolean;
};

type AstroLikeContext = {
  request: Request;
  cookies: {
    set: (name: string, value: string, options?: CookieSetOptions) => void;
  };
};

function readRequestCookies(request: Request) {
  const header = request.headers.get('cookie') ?? '';

  return header
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf('=');
      const name = index >= 0 ? part.slice(0, index) : part;
      const value = index >= 0 ? part.slice(index + 1) : '';

      return {
        name,
        value: decodeURIComponent(value),
      };
    });
}

export function createSupabaseServerClient(context: AstroLikeContext) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return readRequestCookies(context.request);
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          context.cookies.set(name, value, {
            path: '/',
            ...options,
          });
        });
      },
    },
  });
}

