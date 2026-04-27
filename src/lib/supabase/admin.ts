import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdminClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const secretKey = import.meta.env.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

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
