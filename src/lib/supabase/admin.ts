import { createClient } from '@supabase/supabase-js';

type RuntimeEnv = Record<string, string | undefined> | undefined;

export function createSupabaseAdminClient(runtimeEnv?: RuntimeEnv) {
  const url = runtimeEnv?.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const secretKey =
    runtimeEnv?.SUPABASE_SECRET_KEY ||
    runtimeEnv?.SUPABASE_SERVICE_ROLE_KEY ||
    import.meta.env.SUPABASE_SECRET_KEY ||
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    return null;
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
