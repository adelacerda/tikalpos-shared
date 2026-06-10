// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────

import { LoyaltyTier } from './tenant';

export interface LoyaltyConfig {
  organizationId: string;
  pointsPerDollar: number; // e.g. 10 = 10 points per $1
  redemptionRate: number; // cents per point, e.g. 1 = 1¢ per point
  tierThresholds: TierThreshold[];
  tierDiscounts: TierDiscount[];
}

export interface TierThreshold {
  tier: LoyaltyTier;
  minPoints: number;
  multiplier: number; // earning multiplier, e.g. 1.5x for gold
}

export interface TierDiscount {
  tier: LoyaltyTier;
  minPoints: number; // minimum points to qualify
  discountBps: number; // discount in basis points (500 = 5%)
}

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE';

export interface LoyaltyTransaction {
  id: string;
  guestId: string;
  organizationId: string;
  orderId?: string;
  type: LoyaltyTransactionType;
  points: number; // positive for earn/adjust, negative for redeem/expire
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
  redemptionWindowDays?: number;
  discountType?: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  // Reward promotion (Sprint 12.5d / FT-GROWTH-002): a temporary reduced
  // point cost with an end date. A promotion is "active" when promoEndsAt is
  // in the future and promoPointsCost is below the regular pointsCost. When
  // active the mobile feed surfaces promoPointsCost as the cost and pointsCost
  // as the struck-through original.
  promoPointsCost?: number;
  promoEndsAt?: string; // ISO-8601
  // Featured boost (FT-GROWTH-017 §Canal 2): a paid highlight that renders the
  // reward in neon + top placement in the app for a window. Independent of a
  // promotion (though usually paired). "Active" when featured && featuredUntil
  // is in the future.
  featured?: boolean;
  featuredUntil?: string; // ISO-8601
  // Corporate-only (FT-GROWTH-018 §Canal 1): redeemable only by employees of a
  // company with an active CorporateAccount for this franchise.
  corporateOnly?: boolean;
  // Welcome reward (Discovery Carousel): the merchant flags ONE reward as the
  // card shown to non-members in the home discovery carousel. If a franchise
  // has no welcome reward, the carousel falls back to its lowest-cost reward.
  welcome?: boolean;
  // Discovery highlight opt-in (Discovery Carousel — paid neon spotlight, a SKU
  // separate from `featured`). When active, the franchise's discovery card is
  // eligible to win the rotated neon slot. The fee is LOCKED at opt-in time
  // (`discoveryHighlightLockedFeeCents`), so later system-rate changes do not
  // affect an existing opt-in. The merchant sets the start/end window.
  discoveryHighlight?: boolean;
  discoveryHighlightStartsAt?: string; // ISO-8601
  discoveryHighlightEndsAt?: string; // ISO-8601
  discoveryHighlightLockedFeeCents?: number; // system rate snapshotted at opt-in
}

/** True when a catalog item has an active promotion at `now`. */
export function isRewardPromotionActive(item: RewardCatalogItem, now: number = Date.now()): boolean {
  return (
    typeof item.promoPointsCost === 'number' &&
    typeof item.promoEndsAt === 'string' &&
    item.promoPointsCost < item.pointsCost &&
    new Date(item.promoEndsAt).getTime() > now
  );
}

/** True when a catalog item is a featured (neon-boosted) reward at `now`. */
export function isRewardBoostActive(item: RewardCatalogItem, now: number = Date.now()): boolean {
  return (
    item.featured === true &&
    typeof item.featuredUntil === 'string' &&
    new Date(item.featuredUntil).getTime() > now
  );
}

/**
 * True when a reward's discovery-highlight opt-in is active at `now` — i.e.
 * the merchant opted in and `now` falls within [startsAt, endsAt]. Such a
 * reward's franchise is eligible to win the rotated neon spotlight in the
 * home discovery carousel.
 */
export function isDiscoveryHighlightActive(
  item: RewardCatalogItem,
  now: number = Date.now(),
): boolean {
  return (
    item.discoveryHighlight === true &&
    typeof item.discoveryHighlightStartsAt === 'string' &&
    typeof item.discoveryHighlightEndsAt === 'string' &&
    new Date(item.discoveryHighlightStartsAt).getTime() <= now &&
    new Date(item.discoveryHighlightEndsAt).getTime() > now
  );
}

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

// Manual account linking — for TikalLoyalty-only franchises (no POS). Staff enter
// an external POS account number + total paid; points are earned from the total.
export interface LinkManualAccountInput {
  guestId: string;
  accountNumber: string;   // external POS account/check number — unique per franchise
  totalCents: number;      // total paid in the franchise currency (minor units)
  occurredAt?: string;     // ISO-8601 of the original transaction; defaults to now
}

export interface LinkManualAccountResult {
  pointsEarned: number;
  newBalance: number;
}
