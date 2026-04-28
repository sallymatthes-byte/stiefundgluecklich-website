import type { AccessGrant } from '../auth/grants';

export type MembersNavItem = {
  href: string;
  label: string;
};

export function getBeyondBonusCourseItems(access: { course: boolean; livecalls: boolean }): MembersNavItem[] {
  const items: MembersNavItem[] = [];

  if (access.course) {
    items.push({ href: '/members/beyondbonus', label: 'BeyondBonus' });
  }

  if (access.livecalls) {
    items.push({ href: '/livecalls/beyondbonus', label: 'Livecalls' });
  }

  return items;
}

export function getGrantLabel(grant: AccessGrant, now = new Date()) {
  const base = grant.area === 'course' ? 'BeyondBonus Kurszugang' : 'BeyondBonus Livecalls';
  const endsAt = grant.endsAt ? new Date(grant.endsAt) : null;
  const dateLabel = endsAt ? endsAt.toLocaleDateString('de-DE') : '';
  const isExpired = grant.status !== 'active' || (endsAt ? endsAt < now : false);

  if (!dateLabel) {
    return isExpired ? `${base} · abgelaufen` : `${base} · aktiv`;
  }

  return isExpired ? `${base} · abgelaufen am ${dateLabel}` : `${base} · verfügbar bis ${dateLabel}`;
}
