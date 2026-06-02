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
    /** Reward photo (relative media URL, e.g. /api/v1/public/media/<hash>.webp). */
    imageUrl?: string;
    active: boolean;
    requiredProductIds?: string[];
    minCheckAmount?: number;
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
    orderId: string;
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
//# sourceMappingURL=loyalty.d.ts.map