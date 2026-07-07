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

export type LoyaltyTransactionType =
  | 'EARN'
  | 'REDEEM'
  | 'ADJUST'
  | 'EXPIRE'
  | 'CASHBACK_EARN'   // cashback credited (in cents) on a purchase
  | 'CASHBACK_SPEND'; // cashback balance applied to a bill (in cents)

// ──────────────────────────────────────────────
// Cashback (alternative loyalty mode to points)
// ──────────────────────────────────────────────

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
export const EXPIRY_BLOCK_MONTHS: Record<ExpiryBlock, number> = {
  MONTHLY: 1,
  BIMONTHLY: 2,
  QUARTERLY: 3,
  SEMIANNUAL: 6,
  ANNUAL: 12,
};

/** Validity presets (months a block lives AFTER it closes). Merchant picks one. */
export const EXPIRY_VALIDITY_MONTHS = [3, 6, 12, 18, 24, 36] as const;

/** Hold mode signalling the member wants to apply their cashback balance to the bill. */
export const CASHBACK_APPLY_MODE = 'CASHBACK_APPLY' as const;

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
export function activeCashbackMultiplier(cfg: Pick<CashbackConfig, 'cashbackBoostMultiplier' | 'cashbackBoostStartsAt' | 'cashbackBoostEndsAt'>, now: Date = new Date()): number {
  const m = cfg.cashbackBoostMultiplier;
  if (!m || m <= 1 || !cfg.cashbackBoostStartsAt || !cfg.cashbackBoostEndsAt) return 1;
  const t = now.getTime();
  return t >= Date.parse(cfg.cashbackBoostStartsAt) && t <= Date.parse(cfg.cashbackBoostEndsAt) ? m : 1;
}

/** Cashback earned (cents) on a net-paid amount, applying the active boost. */
export function cashbackEarnedCents(netPaidCents: number, cashbackRateBps: number, multiplier = 1): number {
  if (netPaidCents <= 0 || cashbackRateBps <= 0) return 0;
  return Math.round((netPaidCents * cashbackRateBps * multiplier) / 10000);
}

/** Cashback applicable to a bill: min(balance, cap% × total). Pure; backend stays source of truth. */
export function cashbackApplicableCents(balanceCents: number, billTotalCents: number, billCapPct: number): number {
  if (balanceCents <= 0 || billTotalCents <= 0) return 0;
  const cap = Math.floor((billTotalCents * billCapPct) / 100);
  return Math.max(0, Math.min(balanceCents, cap));
}

// ── Block-based expiry (points & cashback) ──────────────────────────────────
//
// Balances earned within a calendar block (per the merchant's cadence) share one
// fixed expiry date = the END of that block period. A member earning early in a
// block gets a longer effective life than one earning at the end — an accepted
// fairness tradeoff in exchange for a single, easy-to-communicate date.

/** Canonical key for the block containing `date` under a cadence (e.g. "2026-06", "2026-Q2", "2026-H1", "2026"). */
export function expiryBlockKey(cadence: ExpiryBlock, date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth(); // 0-11
  switch (cadence) {
    case 'MONTHLY':
      return `${y}-${String(m + 1).padStart(2, '0')}`;
    case 'BIMONTHLY':
      return `${y}-B${Math.floor(m / 2) + 1}`;
    case 'QUARTERLY':
      return `${y}-Q${Math.floor(m / 3) + 1}`;
    case 'SEMIANNUAL':
      return `${y}-H${m < 6 ? 1 : 2}`;
    case 'ANNUAL':
      return `${y}`;
  }
}

/** Start (first instant) of the block containing `date` under a cadence. */
export function expiryBlockStartsAt(cadence: ExpiryBlock, date: Date = new Date()): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const span = EXPIRY_BLOCK_MONTHS[cadence];
  const startMonth = Math.floor(m / span) * span;
  return new Date(Date.UTC(y, startMonth, 1));
}

/** Fixed END (last instant) of the block containing `date` under a cadence. */
export function expiryBlockEndsAt(cadence: ExpiryBlock, date: Date = new Date()): Date {
  const start = expiryBlockStartsAt(cadence, date);
  const nextStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + EXPIRY_BLOCK_MONTHS[cadence], 1));
  return new Date(nextStart.getTime() - 1);
}

/**
 * Fixed expiry of a balance earned on `date`: END of its block + `validityMonths`.
 * Computed off the next block's start (day=1) so month-end never overflows.
 * Example: block MONTHLY, validity 12, earned 2026-01-15 → 2027-01-31 23:59:59.999.
 */
export function balanceExpiresAt(cadence: ExpiryBlock, validityMonths: number, date: Date = new Date()): Date {
  const start = expiryBlockStartsAt(cadence, date);
  const nextStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + EXPIRY_BLOCK_MONTHS[cadence], 1));
  const expiryStart = new Date(Date.UTC(nextStart.getUTCFullYear(), nextStart.getUTCMonth() + validityMonths, 1));
  return new Date(expiryStart.getTime() - 1);
}

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
export function expiryExamples(
  cadence: ExpiryBlock,
  validityMonths: number,
  now: Date = new Date(),
  count = 3,
): ExpiryExampleRow[] {
  const rows: ExpiryExampleRow[] = [];
  const span = EXPIRY_BLOCK_MONTHS[cadence];
  const firstStart = expiryBlockStartsAt(cadence, now);
  for (let i = 0; i < count; i++) {
    const blockStart = new Date(Date.UTC(firstStart.getUTCFullYear(), firstStart.getUTCMonth() + i * span, 1));
    rows.push({
      blockStart,
      blockEnd: expiryBlockEndsAt(cadence, blockStart),
      expiresAt: balanceExpiresAt(cadence, validityMonths, blockStart),
    });
  }
  return rows;
}

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
  // Points-advisor provenance (FT reward-points-advisor): what the recommended
  // pointsCost was derived from, so we can flag drift and offer "recalcular".
  /** Avg ticket (CENTS) used when computing points for a PERCENTAGE reward. */
  assistantTicketUsed?: number;
  /** Target margin % (1-5) chosen in the advisor when points were recommended. */
  assistantMarginPct?: number;
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
