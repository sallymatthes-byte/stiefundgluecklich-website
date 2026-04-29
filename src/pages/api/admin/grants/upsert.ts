import type { APIRoute } from 'astro';
import { isAdminEmail } from '../../../../lib/admin/access';
import { createSupabaseAdminClient } from '../../../../lib/supabase/admin';
import { PRODUCT_KEYS, ACCESS_AREAS, type AccessArea, type ProductKey } from '../../../../lib/auth/grants';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

function toIsoOrNull(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59.000Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function monthsFromNow(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

type SupabaseAdmin = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

async function findUserByEmail(admin: SupabaseAdmin, email: string) {
  const { data: profile } = await admin
    .from('profiles')
    .select('id, email, full_name')
    .eq('email', email)
    .maybeSingle();

  if (profile?.id) return profile;

  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = data.users.find((entry) => entry.email?.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || email,
    full_name: String(user.user_metadata?.full_name || ''),
  };
}

async function ensureUser(admin: SupabaseAdmin, email: string, fullName: string) {
  const existing = await findUserByEmail(admin, email);
  if (existing?.id) {
    await admin.from('profiles').upsert({ id: existing.id, email, full_name: fullName || existing.full_name || null });
    return { id: existing.id, created: false };
  }

  const tempPassword = crypto.randomUUID() + crypto.randomUUID();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName || email.split('@')[0] },
  });

  if (error || !data.user) {
    throw new Error(error?.message || 'User konnte nicht angelegt werden.');
  }

  await admin.from('profiles').upsert({
    id: data.user.id,
    email,
    full_name: fullName || null,
  });

  return { id: data.user.id, created: true };
}

async function upsertGrant(
  admin: SupabaseAdmin,
  userId: string,
  productKey: ProductKey,
  area: AccessArea,
  endsAt: string | null,
  source: 'manual' | 'migration' | 'stripe',
  note: string,
) {
  const { data: existing } = await admin
    .from('access_grants')
    .select('id')
    .eq('user_id', userId)
    .eq('product_key', productKey)
    .eq('area', area)
    .eq('status', 'active')
    .maybeSingle();

  const payload = {
    user_id: userId,
    product_key: productKey,
    area,
    status: 'active',
    starts_at: new Date().toISOString(),
    ends_at: endsAt,
    source,
    note: note || null,
  };

  if (existing?.id) {
    const { error } = await admin.from('access_grants').update(payload).eq('id', existing.id);
    if (error) throw new Error(error.message);
    return existing.id;
  }

  const { data, error } = await admin.from('access_grants').insert(payload).select('id').single();
  if (error) throw new Error(error.message);
  return data.id;
}

export const POST: APIRoute = async (context) => {
  const runtimeEnv = (context.locals as any).runtime?.env;

  if (!isAdminEmail(context.locals.user?.email, runtimeEnv)) {
    return context.redirect('/members?error=no-access');
  }

  const admin = createSupabaseAdminClient(runtimeEnv);
  if (!admin) {
    return context.redirect('/admin/grants?error=supabase-admin-config');
  }

  try {
    const form = await context.request.formData();
    const email = clean(form.get('email')).toLowerCase();
    const fullName = clean(form.get('full_name'));
    const productKey = clean(form.get('product_key')) as ProductKey;
    const source = (clean(form.get('source')) || 'manual') as 'manual' | 'migration' | 'stripe';
    const note = clean(form.get('note'));

    if (!email || !email.includes('@')) throw new Error('Bitte eine gültige E-Mail eintragen.');
    if (!PRODUCT_KEYS.includes(productKey)) throw new Error('Unbekanntes Produkt.');

    const user = await ensureUser(admin, email, fullName);
    const courseEnds = toIsoOrNull(clean(form.get('course_ends_at'))) || monthsFromNow(productKey === 'its-bundle' ? 6 : 12);
    const livecallsEnabled = clean(form.get('livecalls_enabled')) === 'on';
    const livecallsEnds = toIsoOrNull(clean(form.get('livecalls_ends_at'))) || monthsFromNow(6);

    await upsertGrant(admin, user.id, productKey, 'course', courseEnds, source, note);
    if (livecallsEnabled) {
      await upsertGrant(admin, user.id, productKey, 'livecalls', livecallsEnds, source, note);
    }

    const params = new URLSearchParams({ saved: '1', email });
    if (user.created) params.set('created', '1');
    return context.redirect(`/admin/grants?${params.toString()}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return context.redirect(`/admin/grants?error=${encodeURIComponent(message)}`);
  }
};
