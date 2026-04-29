const DEFAULT_ADMIN_EMAILS = ['sallymatthes@googlemail.com'];

type RuntimeEnv = Record<string, string | undefined> | undefined;

export function getAdminEmails(runtimeEnv?: RuntimeEnv) {
  const configured = runtimeEnv?.ADMIN_EMAILS || import.meta.env.ADMIN_EMAILS || '';
  const emails = configured
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return emails.length > 0 ? emails : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email?: string | null, runtimeEnv?: RuntimeEnv) {
  if (!email) return false;
  return getAdminEmails(runtimeEnv).includes(email.toLowerCase());
}
