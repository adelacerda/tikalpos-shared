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
export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE' | 'CASHBACK_EARN' | 'CASHBACK_SPEND';
/**
 * How a franchise rewards members:
 * - `POINTS`   — points + reward catalog + tiers (the classic model).
 * - `CASHBACK` — a Q balance that pays down the bill (no catalog, no tiers).
 * - `BOTH`     — both available; the member picks per-franchise (one OR the other per purchase).
 */
export type LoyaltyMode = 'POINTS' | 'CASHBACK' | 'BOTH';
/** In BOTH mode, what the member earns at this franchise (stored on the enrollment). */
export type EarnPreference = 'POINTS' | 'CASHBACK';
/** Block-based expiry cadence the merchant picks (balances in a block share one expiry date). */
export type ExpiryBlock = 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL';
/** How many months each ExpiryBlock cadence spans. */
export declare const EXPIRY_BLOCK_MONTHS: Record<ExpiryBlock, number>;
/** Validity presets (months a block lives AFTER it closes). Merchant picks one. */
export declare const EXPIRY_VALIDITY_MONTHS: readonly [3, 6, 12, 18, 24, 36];
/** Hold mode signalling the member wants to apply their cashback balance to the bill. */
export declare const CASHBACK_APPLY_MODE: "CASHBACK_APPLY";
/** Org-level cashback configuration (lives on the loyalty rule). */
export interface CashbackConfig {
    /** Cashback earn rate in basis points of the net paid (500 = 5%). */
    cashbackRateBps: number;
    /** Max % of the bill payable with cashback balance (e.g. 50). */
    cashbackBillCapPct: number;
    /** Optional minimum bill (cents) required to apply cashback (0 = none). */
    cashbackMinCheckCents: number;
    /** Active boost multiplier on the rate (e.g. 2 = double), with its window. Null = no boost. */
    cashbackBoostMultiplier: number | null;
    cashbackBoostStartsAt: string | null;
    cashbackBoostEndsAt: string | null;
}
/**
 * Expiry policy — separate config for points and cashback (block = null → no expiry).
 * A balance's fixed expiry = END of its block period + `validityMonths`. Example:
 * block MONTHLY + validity 12 → everything earned in Jan-2026 expires 31-Jan-2027.
 */
export interface ExpiryPolicy {
    pointsExpiryBlock: ExpiryBlock | null;
    pointsExpiryValidityMonths: number | null;
    cashbackExpiryBlock: ExpiryBlock | null;
    cashbackExpiryValidityMonths: number | null;
}
/**
 * Effective cashback rate multiplier right now: boostMultiplier if its window is
 * active, else 1. Pure helper shared by backend (earn) and web/app (preview).
 */
export declare function activeCashbackMultiplier(cfg: Pick<CashbackConfig, 'cashbackBoostMultiplier' | 'cashbackBoostStartsAt' | 'cashbackBoostEndsAt'>, now?: Date): number;
/** Cashback earned (cents) on a net-paid amount, applying the active boost. */
export declare function cashbackEarnedCents(netPaidCents: number, cashbackRateBps: number, multiplier?: number): number;
/** Cashback applicable to a bill: min(balance, cap% × total). Pure; backend stays source of truth. */
export declare function cashbackApplicableCents(balanceCents: number, billTotalCents: number, billCapPct: number): number;
/** Canonical key for the block containing `date` under a cadence (e.g. "2026-06", "2026-Q2", "2026-H1", "2026"). */
export declare function expiryBlockKey(cadence: ExpiryBlock, date?: Date): string;
/** Start (first instant) of the block containing `date` under a cadence. */
export declare function expiryBlockStartsAt(cadence: ExpiryBlock, date?: Date): Date;
/** Fixed END (last instant) of the block containing `date` under a cadence. */
export declare function expiryBlockEndsAt(cadence: ExpiryBlock, date?: Date): Date;
/**
 * Fixed expiry of a balance earned on `date`: END of its block + `validityMonths`.
 * Computed off the next block's start (day=1) so month-end never overflows.
 * Example: block MONTHLY, validity 12, earned 2026-01-15 → 2027-01-31 23:59:59.999.
 */
export declare function balanceExpiresAt(cadence: ExpiryBlock, validityMonths: number, date?: Date): Date;
/** One example row for the config UI: a block period and when its balances expire. */
export interface ExpiryExampleRow {
    blockStart: Date;
    blockEnd: Date;
    expiresAt: Date;
}
/**
 * Worked examples for the merchant configuring expiry: the current block + the
 * next `count-1` blocks, each with its fixed expiry date. Pure — the UI formats
 * the dates in the merchant's locale.
 */
export declare function expiryExamples(cadence: ExpiryBlock, validityMonths: number, now?: Date, count?: number): ExpiryExampleRow[];
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
    /** Age-restricted product (alcohol, vape, etc.). Shows a label + a one-time
     *  age-confirmation gate in the app. Set per reward in the wizard. */
    ageRestricted?: boolean;
    redemptionWindowDays?: number;
    /**
     * How the merchant thinks of this reward (config vocabulary, set in the wizard):
     * - `DISCOUNT`     — % or fixed Q off the bill (discountType PERCENTAGE/FIXED_AMOUNT).
     * - `FREE_PRODUCT` — a sellable product given free (e.g. "café gratis"); stored as
     *                    FIXED_AMOUNT = the product's value, so it discounts the bill by that much.
     * - `GIFT`         — an extra giveaway NOT on the bill (e.g. "vaso promocional"); discountType
     *                    NONE, discountValue 0 — never touches the bill, just handed over.
     * Absent = legacy reward; treat as DISCOUNT.
     */
    rewardKind?: 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT';
    discountType?: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NONE';
    discountValue?: number;
    /**
     * Worst-case cap (CENTS) for a PERCENTAGE discount, so a big ticket can't blow
     * the margin. When set, the redeemed discount is min(ticket×%, maxDiscountValue).
     * Advisory field from the points-advisor; only meaningful for DISCOUNT/PERCENTAGE.
     */
    maxDiscountValue?: number;
    /** Avg ticket (CENTS) used when computing points for a PERCENTAGE reward. */
    assistantTicketUsed?: number;
    /** Target margin % (1-5) chosen in the advisor when points were recommended. */
    assistantMarginPct?: number;
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