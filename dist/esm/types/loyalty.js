// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────
/** How many months each ExpiryBlock cadence spans. */
export const EXPIRY_BLOCK_MONTHS = {
    MONTHLY: 1,
    BIMONTHLY: 2,
    QUARTERLY: 3,
    SEMIANNUAL: 6,
    ANNUAL: 12,
};
/** Validity presets (months a block lives AFTER it closes). Merchant picks one. */
export const EXPIRY_VALIDITY_MONTHS = [3, 6, 12, 18, 24, 36];
/** Hold mode signalling the member wants to apply their cashback balance to the bill. */
export const CASHBACK_APPLY_MODE = 'CASHBACK_APPLY';
/**
 * Effective cashback rate multiplier right now: boostMultiplier if its window is
 * active, else 1. Pure helper shared by backend (earn) and web/app (preview).
 */
export function activeCashbackMultiplier(cfg, now = new Date()) {
    const m = cfg.cashbackBoostMultiplier;
    if (!m || m <= 1 || !cfg.cashbackBoostStartsAt || !cfg.cashbackBoostEndsAt)
        return 1;
    const t = now.getTime();
    return t >= Date.parse(cfg.cashbackBoostStartsAt) && t <= Date.parse(cfg.cashbackBoostEndsAt) ? m : 1;
}
/** Cashback earned (cents) on a net-paid amount, applying the active boost. */
export function cashbackEarnedCents(netPaidCents, cashbackRateBps, multiplier = 1) {
    if (netPaidCents <= 0 || cashbackRateBps <= 0)
        return 0;
    return Math.round((netPaidCents * cashbackRateBps * multiplier) / 10000);
}
/** Cashback applicable to a bill: min(balance, cap% × total). Pure; backend stays source of truth. */
export function cashbackApplicableCents(balanceCents, billTotalCents, billCapPct) {
    if (balanceCents <= 0 || billTotalCents <= 0)
        return 0;
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
export function expiryBlockKey(cadence, date = new Date()) {
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
export function expiryBlockStartsAt(cadence, date = new Date()) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const span = EXPIRY_BLOCK_MONTHS[cadence];
    const startMonth = Math.floor(m / span) * span;
    return new Date(Date.UTC(y, startMonth, 1));
}
/** Fixed END (last instant) of the block containing `date` under a cadence. */
export function expiryBlockEndsAt(cadence, date = new Date()) {
    const start = expiryBlockStartsAt(cadence, date);
    const nextStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + EXPIRY_BLOCK_MONTHS[cadence], 1));
    return new Date(nextStart.getTime() - 1);
}
/**
 * Fixed expiry of a balance earned on `date`: END of its block + `validityMonths`.
 * Computed off the next block's start (day=1) so month-end never overflows.
 * Example: block MONTHLY, validity 12, earned 2026-01-15 → 2027-01-31 23:59:59.999.
 */
export function balanceExpiresAt(cadence, validityMonths, date = new Date()) {
    const start = expiryBlockStartsAt(cadence, date);
    const nextStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + EXPIRY_BLOCK_MONTHS[cadence], 1));
    const expiryStart = new Date(Date.UTC(nextStart.getUTCFullYear(), nextStart.getUTCMonth() + validityMonths, 1));
    return new Date(expiryStart.getTime() - 1);
}
/**
 * Worked examples for the merchant configuring expiry: the current block + the
 * next `count-1` blocks, each with its fixed expiry date. Pure — the UI formats
 * the dates in the merchant's locale.
 */
export function expiryExamples(cadence, validityMonths, now = new Date(), count = 3) {
    const rows = [];
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
/** True when a catalog item has an active promotion at `now`. */
export function isRewardPromotionActive(item, now = Date.now()) {
    return (typeof item.promoPointsCost === 'number' &&
        typeof item.promoEndsAt === 'string' &&
        item.promoPointsCost < item.pointsCost &&
        new Date(item.promoEndsAt).getTime() > now);
}
/** True when a catalog item is a featured (neon-boosted) reward at `now`. */
export function isRewardBoostActive(item, now = Date.now()) {
    return (item.featured === true &&
        typeof item.featuredUntil === 'string' &&
        new Date(item.featuredUntil).getTime() > now);
}
/**
 * True when a reward's discovery-highlight opt-in is active at `now` — i.e.
 * the merchant opted in and `now` falls within [startsAt, endsAt]. Such a
 * reward's franchise is eligible to win the rotated neon spotlight in the
 * home discovery carousel.
 */
export function isDiscoveryHighlightActive(item, now = Date.now()) {
    return (item.discoveryHighlight === true &&
        typeof item.discoveryHighlightStartsAt === 'string' &&
        typeof item.discoveryHighlightEndsAt === 'string' &&
        new Date(item.discoveryHighlightStartsAt).getTime() <= now &&
        new Date(item.discoveryHighlightEndsAt).getTime() > now);
}
//# sourceMappingURL=loyalty.js.map