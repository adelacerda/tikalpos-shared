"use strict";
// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRewardPromotionActive = isRewardPromotionActive;
exports.isRewardBoostActive = isRewardBoostActive;
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
//# sourceMappingURL=loyalty.js.map