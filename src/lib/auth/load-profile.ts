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
    session?: {
      user?: {
        user_metadata?: Record<string, unknown>;
      };
    } | null;
  };
};

export type MemberProfile = {
  email: string;
  fullName: string;
  avatarUrl: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  roleTitle: string;
  aboutMe: string;
};

export const emptyMemberProfile: MemberProfile = {
  email: '',
  fullName: '',
  avatarUrl: '',
  addressLine1: '',
  postalCode: '',
  city: '',
  country: '',
  phone: '',
  roleTitle: '',
  aboutMe: '',
};

function readMeta(context: AstroLikeContext) {
  return context.locals.session?.user?.user_metadata ?? {};
}

export async function loadMemberProfile(context: AstroLikeContext): Promise<MemberProfile> {
  const userId = context.locals.user?.id;
  const userEmail = context.locals.user?.email ?? '';
  const meta = readMeta(context);

  if (!userId) {
    return {
      ...emptyMemberProfile,
      email: userEmail,
      fullName: String(meta.full_name || ''),
      avatarUrl: String(meta.avatar_url || ''),
      roleTitle: String(meta.role_title || ''),
      aboutMe: String(meta.about_me || ''),
    };
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return {
      ...emptyMemberProfile,
      email: userEmail,
      fullName: String(meta.full_name || ''),
      avatarUrl: String(meta.avatar_url || ''),
      roleTitle: String(meta.role_title || ''),
      aboutMe: String(meta.about_me || ''),
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('email, full_name, avatar_url, address_line1, postal_code, city, country, phone')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return {
      ...emptyMemberProfile,
      email: userEmail,
      fullName: String(meta.full_name || ''),
      avatarUrl: String(meta.avatar_url || ''),
      roleTitle: String(meta.role_title || ''),
      aboutMe: String(meta.about_me || ''),
    };
  }

  return {
    email: data.email ?? userEmail,
    fullName: data.full_name ?? String(meta.full_name || ''),
    avatarUrl: data.avatar_url ?? String(meta.avatar_url || ''),
    addressLine1: data.address_line1 ?? '',
    postalCode: data.postal_code ?? '',
    city: data.city ?? '',
    country: data.country ?? '',
    phone: data.phone ?? '',
    roleTitle: String(meta.role_title || ''),
    aboutMe: String(meta.about_me || ''),
  };
}
