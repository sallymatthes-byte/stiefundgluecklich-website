import type { APIRoute } from 'astro';
import { isAdminEmail } from '../../../../lib/admin/access';
import { createSupabaseAdminClient } from '../../../../lib/supabase/admin';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
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
    const action = clean(form.get('action'));
    const email = clean(form.get('email')).toLowerCase();
    const grantId = clean(form.get('grant_id'));
    const status = clean(form.get('status'));

    if (action === 'reset-password') {
      if (!email || !email.includes('@')) throw new Error('Bitte eine gültige E-Mail eintragen.');
      const { error } = await admin.auth.resetPasswordForEmail(email, {
        redirectTo: `${context.url.origin}/auth/callback?next=/reset-password&type=recovery`,
      });
      if (error) throw new Error(error.message);
      return context.redirect(`/admin/grants?reset=sent&email=${encodeURIComponent(email)}`);
    }

    if (action === 'update-grant-status') {
      if (!grantId) throw new Error('Grant fehlt.');
      if (!['active', 'expired'].includes(status)) throw new Error('Unbekannter Status.');
      const { error } = await admin
        .from('access_grants')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', grantId);
      if (error) throw new Error(error.message);
      return context.redirect('/admin/grants?saved=1');
    }

    throw new Error('Unbekannte Aktion.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return context.redirect(`/admin/grants?error=${encodeURIComponent(message)}`);
  }
};
