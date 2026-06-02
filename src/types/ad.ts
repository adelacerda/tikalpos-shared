// Loyalty Ad system — FT-GROWTH-017 / reward-wizard SS5.
//
// A franchise can promote a reward with a full-screen ad in the TikalLoyalty
// app's ad carousel. Billing mirrors the discovery highlight: a flat,
// system-admin-configured per-impression fee, deduped per user/day, with the
// rate snapshotted (`lockedFeeCents`) at opt-in so later system-rate changes
// never affect an existing campaign. The merchant sets the start/end window.

/** A full-screen promotional ad a franchise created to promote a reward. */
export interface LoyaltyAd {
  id: string;
  organizationId: string;
  /** The catalog reward this ad promotes (CTA target for members). */
  rewardId: string;
  title: string;
  /** Brand icon, 512×512, rendered ~44pt circular over the creative. */
  iconUrl: string;
  /** Full-screen creative, 1080×2400 (9:20), rendered cover. */
  imageUrl: string;
  /** Big bottom CTA button label. */
  ctaLabel: string;
  startsAt: string; // ISO-8601 — run window / opt-in
  endsAt: string; // ISO-8601
  /** Ad-impression system rate snapshotted at opt-in. */
  lockedFeeCents: number;
  active: boolean;
  createdAt: string; // ISO-8601
}

/** Merchant-supplied fields when creating an ad (the rest is server-assigned). */
export interface CreateLoyaltyAdInput {
  rewardId: string;
  title: string;
  iconUrl: string;
  imageUrl: string;
  ctaLabel: string;
  startsAt: string; // ISO-8601
  endsAt: string; // ISO-8601
}

/** True when an ad is live (active and within its window) at `now` (epoch ms). */
export function isLoyaltyAdActive(ad: LoyaltyAd, now: number = Date.now()): boolean {
  return (
    ad.active === true &&
    typeof ad.startsAt === 'string' &&
    typeof ad.endsAt === 'string' &&
    new Date(ad.startsAt).getTime() <= now &&
    new Date(ad.endsAt).getTime() > now
  );
}

/**
 * System-admin-configured ad-impression pricing — a flat, date-ranged fee.
 * Mirrors the discovery-highlight pricing table; an open-ended row (`endsAt`
 * null) is the current rate. Premium surface → priced higher than highlight.
 */
export interface AdImpressionPricing {
  id: string;
  feeCents: number;
  startsAt: string; // ISO-8601
  endsAt: string | null; // ISO-8601, null = open-ended / current
  createdAt: string; // ISO-8601
}

export interface CreateAdImpressionPricingInput {
  feeCents: number;
  startsAt: string; // ISO-8601
  endsAt?: string | null; // ISO-8601
}
