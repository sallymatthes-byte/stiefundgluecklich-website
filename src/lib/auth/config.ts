export const PROTECTED_PREFIXES = ['/members', '/livecalls', '/admin'];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

