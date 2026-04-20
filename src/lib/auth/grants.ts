export const PRODUCT_KEYS = ['its-bundle', 'beyondbonus', 'beyondblended'] as const;
export const ACCESS_AREAS = ['course', 'livecalls'] as const;

export type ProductKey = (typeof PRODUCT_KEYS)[number];
export type AccessArea = (typeof ACCESS_AREAS)[number];
export type GrantStatus = 'active' | 'expired';

export type AccessGrant = {
  productKey: ProductKey;
  area: AccessArea;
  status: GrantStatus;
  startsAt: string | null;
  endsAt: string | null;
  source?: 'stripe' | 'manual' | 'migration';
  note?: string | null;
};

export function isGrantActive(grant: AccessGrant, now = new Date()) {
  if (grant.status !== 'active') return false;
  if (grant.startsAt && new Date(grant.startsAt) > now) return false;
  if (grant.endsAt && new Date(grant.endsAt) < now) return false;
  return true;
}

export function hasAccessToArea(grants: AccessGrant[], productKey: ProductKey, area: AccessArea, now = new Date()) {
  return grants.some((grant) => grant.productKey === productKey && grant.area === area && isGrantActive(grant, now));
}

export function getAccessSnapshot(grants: AccessGrant[], productKey: ProductKey, now = new Date()) {
  return {
    course: hasAccessToArea(grants, productKey, 'course', now),
    livecalls: hasAccessToArea(grants, productKey, 'livecalls', now),
  };
}

