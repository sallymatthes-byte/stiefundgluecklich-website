import type { AccessGrant } from './grants';
import { createSupabaseServerClient } from '../supabase/server';

type AstroLikeContext = {
  request: Request;
  cookies: {
    set: (name: string, value: string, options?: Record<string, unknown>) => void;
  };
  locals: {
    user?: {
      id: string;
      email?: string;
    } | null;
  };
};

export async function loadUserGrants(context: AstroLikeContext): Promise<AccessGrant[]> {
  const userId = context.locals.user?.id;
  if (!userId) return [];

  const supabase = createSupabaseServerClient(context);
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('access_grants')
    .select('product_key, area, status, starts_at, ends_at, source, note')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((grant) => ({
    productKey: grant.product_key,
    area: grant.area,
    status: grant.status,
    startsAt: grant.starts_at,
    endsAt: grant.ends_at,
    source: grant.source,
    note: grant.note,
  })) as AccessGrant[];
}

