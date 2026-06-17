import { LoyaltyTier } from './tenant';
export interface LoyaltyConfig {
    organizationId: string;
    pointsPerDollar: number;
    redemptionRate: number;
    tierThresholds: TierThreshold[];
    tierDiscounts: TierDiscount[];
}
export interface TierThreshold {
    tier: LoyaltyTier;
    minPoints: number;
    multiplier: number;
}
export interface TierDiscount {
    tier: LoyaltyTier;
    minPoints: number;
    discountBps: number;
}
export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE';
export interface LoyaltyTransaction {
    id: string;
    guestId: string;
    organizationId: string;
    orderId?: string;
    type: LoyaltyTransactionType;
    points: number;
    balanceAfter: number;
    description?: string;
    createdAt: string;
}
export interface RewardCatalogItem {
    rewardId: string;
    name: string;
    pointsCost: number;
    description?: string;
    /** Reward photo — landscape 2:1 (relative media URL). Carousel card banner. */
    imageUrl?: string;
    /** Reward photo — portrait 3:4 (relative media URL). Discover card strip. */
    verticalImageUrl?: string;
    active: boolean;
    requiredProductIds?: string[];
    minCheckAmount?: number;
    /** Locations where this reward is valid/redeemable. Empty/undefined = ALL. */
    locationIds?: string[];
    /** Redeemable as an at-home service (home-services). Offered in the reward
     *  wizard's locations step only when the merchant has offersAtHome on. */
    validAtHome?: boolean;
    redemptionWindowDays?: number;
    discountType?: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue?: number;
    promoPointsCost?: number;
    promoEndsAt?: string;
    featured?: boolean;
    featuredUntil?: string;
    corporateOnly?: boolean;
    welcome?: boolean;
    discoveryHighlight?: boolean;
    discoveryHighlightStartsAt?: string;
    discoveryHighlightEndsAt?: string;
    discoveryHighlightLockedFeeCents?: number;
}
/** True when a catalog item has an active promotion at `now`. */
export declare function isRewardPromotionActive(item: RewardCatalogItem, now?: number): boolean;
/** True when a catalog item is a featured (neon-boosted) reward at `now`. */
export declare function isRewardBoostActive(item: RewardCatalogItem, now?: number): boolean;
/**
 * True when a reward's discovery-highlight opt-in is active at `now` — i.e.
 * the merchant opted in and `now` falls within [startsAt, endsAt]. Such a
 * reward's franchise is eligible to win the rotated neon spotlight in the
 * home discovery carousel.
 */
export declare function isDiscoveryHighlightActive(item: RewardCatalogItem, now?: number): boolean;
export interface EarnPointsInput {
    guestId: string;
    organizationId: string;
    /** Linked order; omitted for manual account linking (TikalLoyalty-only). */
    orderId?: string;
    transactionTotalCents: number;
}
export interface EarnPointsResult {
    pointsEarned: number;
    newBalance: number;
    calculation: {
        transactionTotalCents: number;
        transactionDollars: number;
        pointsRatio: number;
        tierMultiplier: number;
        rawPoints: number;
        finalPoints: number;
    };
}
export interface RedeemRewardInput {
    guestId: string;
    organizationId: string;
    rewardId: string;
    orderId?: string;
    /** Location where the redemption happens — validated against the reward's locationIds. */
    locationId?: string;
}
export interface HighPrecisionTimestamp {
    iso: string;
    epochMs: number;
    monotonicNs: string;
}
export type LoyaltyMutationOutcome = 'COMMITTED' | 'SERIALIZATION_CONFLICT';
export type LoyaltyConflictReason = 'CONCURRENT_REDEMPTION' | 'STALE_BALANCE';
export interface LoyaltyMutationEnvelope {
    outcome: LoyaltyMutationOutcome;
    observedAt: HighPrecisionTimestamp;
    committedAt?: HighPrecisionTimestamp;
    conflictReason?: LoyaltyConflictReason;
    version?: number;
}
export interface RedeemRewardResult {
    rewardName: string;
    pointsSpent: number;
    newBalance: number;
    envelope: LoyaltyMutationEnvelope;
}
export interface LinkManualAccountInput {
    guestId: string;
    accountNumber: string;
    totalCents: number;
    occurredAt?: string;
}
export interface LinkManualAccountResult {
    pointsEarned: number;
    newBalance: number;
}
//# sourceMappingURL=loyalty.d.ts.map