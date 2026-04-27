const DEFAULT_ADMIN_EMAILS = ['sallymatthes@googlemail.com'];

export function getAdminEmails() {
  const configured = import.meta.env.ADMIN_EMAILS || '';
  const emails = configured
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return emails.length > 0 ? emails : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
