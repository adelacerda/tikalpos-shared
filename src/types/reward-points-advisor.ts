// Reward points advisor — pure, DB-free profitability math shared by the web
// wizard (live recompute) and the backend (drift checks). All money is CENTS.
//
// Model: a reward costs the merchant `expectedCost`. To keep it profitable that
// cost should be a small slice (marginPct, 1-5%) of what the customer must spend
// to earn it. So requiredSpend = expectedCost / marginPct, and the recommended
// point price = requiredSpend × (points the program grants per currency unit).

export type RewardKind = 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT';
export type RewardDiscountType = 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NONE';
export type RewardProfitBand = 'GREEN' | 'YELLOW' | 'RED';

/** Green ≤5%, yellow ≤8%, red above — the profitability thresholds (percent). */
export const REWARD_MARGIN_GREEN_MAX = 5;
export const REWARD_MARGIN_YELLOW_MAX = 8;
/** Drift ratio that warrants recalculating a percentage reward's points. */
export const REWARD_TICKET_DRIFT_RATIO = 0.2;

export interface ExpectedRewardCostInput {
  rewardKind: RewardKind;
  discountType?: RewardDiscountType;
  /** Percent (e.g. 20) for PERCENTAGE; cents for FIXED_AMOUNT/ITEM_COST. */
  discountValue?: number;
  /** Real cost to the merchant, cents — for FREE_PRODUCT / GIFT. */
  realCostCents?: number | null;
  /** Average ticket, cents — required for PERCENTAGE. */
  avgTicketCents?: number | null;
  /** Optional worst-case cap, cents — for PERCENTAGE. */
  maxDiscountCents?: number | null;
}

/**
 * Q-cost (cents) the merchant bears when this reward is redeemed, or null when
 * the required inputs aren't present yet. PERCENTAGE uses the average ticket and
 * is bounded by the optional max-discount cap.
 */
export function expectedRewardCostCents(i: ExpectedRewardCostInput): number | null {
  if (i.rewardKind === 'FREE_PRODUCT' || i.rewardKind === 'GIFT') {
    return i.realCostCents != null && i.realCostCents >= 0 ? Math.round(i.realCostCents) : null;
  }
  // DISCOUNT
  if (i.discountType === 'FIXED_AMOUNT' || i.discountType === 'ITEM_COST') {
    return i.discountValue != null && i.discountValue >= 0 ? Math.round(i.discountValue) : null;
  }
  if (i.discountType === 'PERCENTAGE') {
    if (i.avgTicketCents == null || i.avgTicketCents < 0 || i.discountValue == null) return null;
    const raw = Math.round((i.avgTicketCents * i.discountValue) / 100);
    return i.maxDiscountCents != null && i.maxDiscountCents > 0 ? Math.min(raw, i.maxDiscountCents) : raw;
  }
  return null;
}

/** Spend (cents) a customer must make so the reward cost is `marginPct` of it. */
export function requiredSpendCents(expectedCostCents: number, marginPct: number): number {
  if (marginPct <= 0) return 0;
  return Math.round(expectedCostCents / (marginPct / 100));
}

/**
 * Recommended point price = requiredSpend × pointsPerCurrencyUnit. `pointsPerCurrencyUnit`
 * is how many points the program grants per 1 currency unit (e.g. 2 = 2 pts/Q).
 */
export function recommendedRewardPoints(
  expectedCostCents: number,
  marginPct: number,
  pointsPerCurrencyUnit: number,
): number {
  const spendUnits = requiredSpendCents(expectedCostCents, marginPct) / 100;
  return Math.max(0, Math.round(spendUnits * pointsPerCurrencyUnit));
}

/**
 * Given a chosen point price, back out the implied margin % and its band —
 * drives the live 🟢/🟡/🔴 indicator as the merchant edits the points field.
 */
export function profitabilityForPoints(
  expectedCostCents: number,
  pointsCost: number,
  pointsPerCurrencyUnit: number,
): { marginPct: number; band: RewardProfitBand } {
  const spendUnits = pointsPerCurrencyUnit > 0 ? pointsCost / pointsPerCurrencyUnit : 0;
  const spendCents = spendUnits * 100;
  const marginPct = spendCents > 0 ? (expectedCostCents / spendCents) * 100 : Number.POSITIVE_INFINITY;
  return { marginPct, band: bandForMargin(marginPct) };
}

/** Classify a margin percentage into a profitability band. */
export function bandForMargin(marginPct: number): RewardProfitBand {
  if (marginPct <= REWARD_MARGIN_GREEN_MAX) return 'GREEN';
  if (marginPct <= REWARD_MARGIN_YELLOW_MAX) return 'YELLOW';
  return 'RED';
}

/** True when the average ticket drifted enough to warrant recalculating points. */
export function ticketDriftExceeds(
  prevTicketCents: number,
  currentTicketCents: number,
  ratio: number = REWARD_TICKET_DRIFT_RATIO,
): boolean {
  if (prevTicketCents <= 0) return false;
  return Math.abs(currentTicketCents - prevTicketCents) / prevTicketCents > ratio;
}
