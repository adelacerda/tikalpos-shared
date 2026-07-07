"use strict";
// Reward points advisor — pure, DB-free profitability math shared by the web
// wizard (live recompute) and the backend (drift checks). All money is CENTS.
//
// Model: a reward costs the merchant `expectedCost`. To keep it profitable that
// cost should be a small slice (marginPct, 1-5%) of what the customer must spend
// to earn it. So requiredSpend = expectedCost / marginPct, and the recommended
// point price = requiredSpend × (points the program grants per currency unit).
Object.defineProperty(exports, "__esModule", { value: true });
exports.REWARD_TICKET_DRIFT_RATIO = exports.REWARD_MARGIN_YELLOW_MAX = exports.REWARD_MARGIN_GREEN_MAX = void 0;
exports.expectedRewardCostCents = expectedRewardCostCents;
exports.requiredSpendCents = requiredSpendCents;
exports.recommendedRewardPoints = recommendedRewardPoints;
exports.profitabilityForPoints = profitabilityForPoints;
exports.bandForMargin = bandForMargin;
exports.ticketDriftExceeds = ticketDriftExceeds;
/** Green ≤5%, yellow ≤8%, red above — the profitability thresholds (percent). */
exports.REWARD_MARGIN_GREEN_MAX = 5;
exports.REWARD_MARGIN_YELLOW_MAX = 8;
/** Drift ratio that warrants recalculating a percentage reward's points. */
exports.REWARD_TICKET_DRIFT_RATIO = 0.2;
/**
 * Q-cost (cents) the merchant bears when this reward is redeemed, or null when
 * the required inputs aren't present yet. PERCENTAGE uses the average ticket and
 * is bounded by the optional max-discount cap.
 */
function expectedRewardCostCents(i) {
    if (i.rewardKind === 'FREE_PRODUCT' || i.rewardKind === 'GIFT') {
        return i.realCostCents != null && i.realCostCents >= 0 ? Math.round(i.realCostCents) : null;
    }
    // DISCOUNT
    if (i.discountType === 'FIXED_AMOUNT' || i.discountType === 'ITEM_COST') {
        return i.discountValue != null && i.discountValue >= 0 ? Math.round(i.discountValue) : null;
    }
    if (i.discountType === 'PERCENTAGE') {
        if (i.avgTicketCents == null || i.avgTicketCents < 0 || i.discountValue == null)
            return null;
        const raw = Math.round((i.avgTicketCents * i.discountValue) / 100);
        return i.maxDiscountCents != null && i.maxDiscountCents > 0 ? Math.min(raw, i.maxDiscountCents) : raw;
    }
    return null;
}
/** Spend (cents) a customer must make so the reward cost is `marginPct` of it. */
function requiredSpendCents(expectedCostCents, marginPct) {
    if (marginPct <= 0)
        return 0;
    return Math.round(expectedCostCents / (marginPct / 100));
}
/**
 * Recommended point price = requiredSpend × pointsPerCurrencyUnit. `pointsPerCurrencyUnit`
 * is how many points the program grants per 1 currency unit (e.g. 2 = 2 pts/Q).
 */
function recommendedRewardPoints(expectedCostCents, marginPct, pointsPerCurrencyUnit) {
    const spendUnits = requiredSpendCents(expectedCostCents, marginPct) / 100;
    return Math.max(0, Math.round(spendUnits * pointsPerCurrencyUnit));
}
/**
 * Given a chosen point price, back out the implied margin % and its band —
 * drives the live 🟢/🟡/🔴 indicator as the merchant edits the points field.
 */
function profitabilityForPoints(expectedCostCents, pointsCost, pointsPerCurrencyUnit) {
    const spendUnits = pointsPerCurrencyUnit > 0 ? pointsCost / pointsPerCurrencyUnit : 0;
    const spendCents = spendUnits * 100;
    const marginPct = spendCents > 0 ? (expectedCostCents / spendCents) * 100 : Number.POSITIVE_INFINITY;
    return { marginPct, band: bandForMargin(marginPct) };
}
/** Classify a margin percentage into a profitability band. */
function bandForMargin(marginPct) {
    if (marginPct <= exports.REWARD_MARGIN_GREEN_MAX)
        return 'GREEN';
    if (marginPct <= exports.REWARD_MARGIN_YELLOW_MAX)
        return 'YELLOW';
    return 'RED';
}
/** True when the average ticket drifted enough to warrant recalculating points. */
function ticketDriftExceeds(prevTicketCents, currentTicketCents, ratio = exports.REWARD_TICKET_DRIFT_RATIO) {
    if (prevTicketCents <= 0)
        return false;
    return Math.abs(currentTicketCents - prevTicketCents) / prevTicketCents > ratio;
}
//# sourceMappingURL=reward-points-advisor.js.map