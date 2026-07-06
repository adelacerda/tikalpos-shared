export type RewardKind = 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT';
export type RewardDiscountType = 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NONE';
export type RewardProfitBand = 'GREEN' | 'YELLOW' | 'RED';
/** Green ≤5%, yellow ≤8%, red above — the profitability thresholds (percent). */
export declare const REWARD_MARGIN_GREEN_MAX = 5;
export declare const REWARD_MARGIN_YELLOW_MAX = 8;
/** Drift ratio that warrants recalculating a percentage reward's points. */
export declare const REWARD_TICKET_DRIFT_RATIO = 0.2;
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
export declare function expectedRewardCostCents(i: ExpectedRewardCostInput): number | null;
/** Spend (cents) a customer must make so the reward cost is `marginPct` of it. */
export declare function requiredSpendCents(expectedCostCents: number, marginPct: number): number;
/**
 * Recommended point price = requiredSpend × pointsPerCurrencyUnit. `pointsPerCurrencyUnit`
 * is how many points the program grants per 1 currency unit (e.g. 2 = 2 pts/Q).
 */
export declare function recommendedRewardPoints(expectedCostCents: number, marginPct: number, pointsPerCurrencyUnit: number): number;
/**
 * Given a chosen point price, back out the implied margin % and its band —
 * drives the live 🟢/🟡/🔴 indicator as the merchant edits the points field.
 */
export declare function profitabilityForPoints(expectedCostCents: number, pointsCost: number, pointsPerCurrencyUnit: number): {
    marginPct: number;
    band: RewardProfitBand;
};
/** Classify a margin percentage into a profitability band. */
export declare function bandForMargin(marginPct: number): RewardProfitBand;
/** True when the average ticket drifted enough to warrant recalculating points. */
export declare function ticketDriftExceeds(prevTicketCents: number, currentTicketCents: number, ratio?: number): boolean;
//# sourceMappingURL=reward-points-advisor.d.ts.map