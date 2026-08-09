/**
 * What a promotion is about. Drives eligibility (the kind is only offered when
 * the underlying feature is on), the CTA target, and the default copy.
 * `REWARD` is the legacy kind — every ad created before promotions existed.
 */
export type AdKind = 'REWARD' | 'CASHBACK' | 'TIER_DISCOUNT' | 'STAMPS' | 'GENERIC';
export declare const AD_KINDS: readonly AdKind[];
/**
 * Where a non-reward promotion's CTA lands inside the franchise profile. The
 * app opens the franchise and focuses this section; `REWARD` promotions instead
 * open the reward itself, so they resolve to `null`.
 */
export type PromoFranchiseSection = 'cashback' | 'tiers' | 'stamps' | 'general';
/** The franchise-profile section a kind's CTA focuses (null → open the reward). */
export declare function promoSectionForKind(kind: AdKind): PromoFranchiseSection | null;
/** The franchise's loyalty capabilities that decide which kinds it may promote. */
export interface PromoEligibilityContext {
    /** LoyaltyRule.loyaltyMode — 'POINTS' | 'CASHBACK' | 'BOTH'. */
    loyaltyMode: string;
    tiersEnabled: boolean;
    stampsEnabled: boolean;
    /** False when the franchise has no reward catalog to point a REWARD ad at. */
    hasRewards: boolean;
}
/**
 * True when a franchise may promote `kind` — a merchant can't advertise a
 * feature it doesn't run. GENERIC is always allowed (it's a free-form message).
 * The same predicate gates the web creator and the served carousel, so an ad
 * whose feature is switched off later stops being served.
 */
export declare function isPromoKindAvailable(kind: AdKind, ctx: PromoEligibilityContext): boolean;
/** A promotion a franchise runs on the full-screen and/or discovery surface. */
export interface LoyaltyAd {
    id: string;
    organizationId: string;
    /** What this promotion is about. Legacy rows are `REWARD`. */
    adKind: AdKind;
    /** The catalog reward this ad promotes (CTA target for members). Null for
     *  every kind other than `REWARD`. */
    rewardId: string | null;
    title: string;
    /** Optional second line under the title — the body of a GENERIC message. */
    subtitle?: string | null;
    /** Brand icon, 512×512, rendered ~44pt circular over the creative. */
    iconUrl: string;
    /** Full-screen creative, 1080×2400 (9:20), rendered cover. Image OR video
     *  (exactly one); null when the ad is video-only. */
    imageUrl?: string | null;
    /** Optional 8-second video creative. When set, the loyalty app plays it
     *  (muted, no loop, capped at 8s) instead of the static image. */
    videoUrl?: string | null;
    /** Big bottom CTA button label. */
    ctaLabel: string;
    startsAt: string;
    endsAt: string;
    /** Runs in the app's full-screen ad carousel (billed per impression). */
    fullScreen: boolean;
    /** Ad-impression system rate snapshotted at opt-in. */
    lockedFeeCents: number;
    /** Runs as the paid neon highlight in the Discovery carousel. */
    discoveryHighlight: boolean;
    /** Discovery-highlight system rate snapshotted at opt-in; null when the
     *  promotion doesn't run on that surface. */
    discoveryLockedFeeCents?: number | null;
    active: boolean;
    createdAt: string;
}
/** Merchant-supplied fields when creating a promotion (the rest is server-assigned). */
export interface CreateLoyaltyAdInput {
    /** Defaults to `REWARD` (the reward-wizard path) when omitted. */
    adKind?: AdKind;
    /** Required for `REWARD`, ignored otherwise. */
    rewardId?: string | null;
    title: string;
    subtitle?: string | null;
    /** @deprecated The ad icon is the franchise logo, served at runtime. */
    iconUrl?: string;
    /** Image OR video (exactly one). Image is also the video poster when both. */
    imageUrl?: string | null;
    /** Optional 8s video creative URL (uploaded via /media/upload-video). */
    videoUrl?: string | null;
    ctaLabel: string;
    startsAt: string;
    endsAt: string;
    /** Surfaces to run on. Defaults to full-screen only (legacy behaviour); at
     *  least one must be true. */
    fullScreen?: boolean;
    discoveryHighlight?: boolean;
}
/** Editable fields of an existing promotion. */
export type UpdateLoyaltyAdInput = Partial<CreateLoyaltyAdInput> & {
    active?: boolean;
};
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