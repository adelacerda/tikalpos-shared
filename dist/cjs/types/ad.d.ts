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
    startsAt: string;
    endsAt: string;
    /** Ad-impression system rate snapshotted at opt-in. */
    lockedFeeCents: number;
    active: boolean;
    createdAt: string;
}
/** Merchant-supplied fields when creating an ad (the rest is server-assigned). */
export interface CreateLoyaltyAdInput {
    rewardId: string;
    title: string;
    /** @deprecated The ad icon is the franchise logo, served at runtime. */
    iconUrl?: string;
    imageUrl: string;
    ctaLabel: string;
    startsAt: string;
    endsAt: string;
}
/** True when an ad is live (active and within its window) at `now` (epoch ms). */
export declare function isLoyaltyAdActive(ad: LoyaltyAd, now?: number): boolean;
/**
 * System-admin-configured ad-impression pricing — a flat, date-ranged fee.
 * Mirrors the discovery-highlight pricing table; an open-ended row (`endsAt`
 * null) is the current rate. Premium surface → priced higher than highlight.
 */
export interface AdImpressionPricing {
    id: string;
    feeCents: number;
    startsAt: string;
    endsAt: string | null;
    createdAt: string;
}
export interface CreateAdImpressionPricingInput {
    feeCents: number;
    startsAt: string;
    endsAt?: string | null;
}
//# sourceMappingURL=ad.d.ts.map