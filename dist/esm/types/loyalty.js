// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────
/** True when a catalog item has an active promotion at `now`. */
export function isRewardPromotionActive(item, now = Date.now()) {
    return (typeof item.promoPointsCost === 'number' &&
        typeof item.promoEndsAt === 'string' &&
        item.promoPointsCost < item.pointsCost &&
        new Date(item.promoEndsAt).getTime() > now);
}
//# sourceMappingURL=loyalty.js.map