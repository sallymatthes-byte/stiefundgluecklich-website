import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

export const POST: APIRoute = async (context) => {
  if (!context.locals.user) {
    return context.redirect('/login?next=%2Fmembers%2Fsettings%2Faccount');
  }

  const supabase = createSupabaseServerClient(context);
  if (!supabase) {
    return context.redirect('/members/settings/account?error=supabase-config');
  }

  const formData = await context.request.formData();
  const payload = {
    full_name: clean(formData.get('full_name')),
    avatar_url: clean(formData.get('avatar_url')),
    address_line1: clean(formData.get('address_line1')),
    postal_code: clean(formData.get('postal_code')),
    city: clean(formData.get('city')),
    country: clean(formData.get('country')),
    phone: clean(formData.get('phone')),
  };

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', context.locals.user.id);

  if (error) {
    return context.redirect(`/members/settings/account?error=${encodeURIComponent(error.message)}`);
  }

  return context.redirect('/members/settings/account?saved=1');
};
