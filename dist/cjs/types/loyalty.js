"use strict";
// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASHBACK_APPLY_MODE = void 0;
exports.activeCashbackMultiplier = activeCashbackMultiplier;
exports.cashbackEarnedCents = cashbackEarnedCents;
exports.cashbackApplicableCents = cashbackApplicableCents;
exports.expiryBlockKey = expiryBlockKey;
exports.expiryBlockEndsAt = expiryBlockEndsAt;
exports.isRewardPromotionActive = isRewardPromotionActive;
exports.isRewardBoostActive = isRewardBoostActive;
exports.isDiscoveryHighlightActive = isDiscoveryHighlightActive;
/** Hold mode signalling the member wants to apply their cashback balance to the bill. */
exports.CASHBACK_APPLY_MODE = 'CASHBACK_APPLY';
/**
 * Effective cashback rate multiplier right now: boostMultiplier if its window is
 * active, else 1. Pure helper shared by backend (earn) and web/app (preview).
 */
function activeCashbackMultiplier(cfg, now = new Date()) {
    const m = cfg.cashbackBoostMultiplier;
    if (!m || m <= 1 || !cfg.cashbackBoostStartsAt || !cfg.cashbackBoostEndsAt)
        return 1;
    const t = now.getTime();
    return t >= Date.parse(cfg.cashbackBoostStartsAt) && t <= Date.parse(cfg.cashbackBoostEndsAt) ? m : 1;
}
/** Cashback earned (cents) on a net-paid amount, applying the active boost. */
function cashbackEarnedCents(netPaidCents, cashbackRateBps, multiplier = 1) {
    if (netPaidCents <= 0 || cashbackRateBps <= 0)
        return 0;
    return Math.round((netPaidCents * cashbackRateBps * multiplier) / 10000);
}
/** Cashback applicable to a bill: min(balance, cap% × total). Pure; backend stays source of truth. */
function cashbackApplicableCents(balanceCents, billTotalCents, billCapPct) {
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
function expiryBlockKey(cadence, date = new Date()) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth(); // 0-11
    switch (cadence) {
        case 'MONTHLY':
            return `${y}-${String(m + 1).padStart(2, '0')}`;
        case 'QUARTERLY':
            return `${y}-Q${Math.floor(m / 3) + 1}`;
        case 'SEMIANNUAL':
            return `${y}-H${m < 6 ? 1 : 2}`;
        case 'ANNUAL':
            return `${y}`;
    }
}
/** Fixed expiry (last instant) of the block containing `date` under a cadence. */
function expiryBlockEndsAt(cadence, date = new Date()) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth(); // 0-11
    // End instant = start of the next block minus 1ms.
    let nextStart;
    switch (cadence) {
        case 'MONTHLY':
            nextStart = new Date(Date.UTC(y, m + 1, 1));
            break;
        case 'QUARTERLY':
            nextStart = new Date(Date.UTC(y, (Math.floor(m / 3) + 1) * 3, 1));
            break;
        case 'SEMIANNUAL':
            nextStart = new Date(Date.UTC(y, m < 6 ? 6 : 12, 1));
            break;
        case 'ANNUAL':
            nextStart = new Date(Date.UTC(y + 1, 0, 1));
            break;
    }
    return new Date(nextStart.getTime() - 1);
}
/** True when a catalog item has an active promotion at `now`. */
function isRewardPromotionActive(item, now = Date.now()) {
    return (typeof item.promoPointsCost === 'number' &&
        typeof item.promoEndsAt === 'string' &&
        item.promoPointsCost < item.pointsCost &&
        new Date(item.promoEndsAt).getTime() > now);
}
/** True when a catalog item is a featured (neon-boosted) reward at `now`. */
function isRewardBoostActive(item, now = Date.now()) {
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
function isDiscoveryHighlightActive(item, now = Date.now()) {
    return (item.discoveryHighlight === true &&
        typeof item.discoveryHighlightStartsAt === 'string' &&
        typeof item.discoveryHighlightEndsAt === 'string' &&
        new Date(item.discoveryHighlightStartsAt).getTime() <= now &&
        new Date(item.discoveryHighlightEndsAt).getTime() > now);
}
//# sourceMappingURL=loyalty.js.map