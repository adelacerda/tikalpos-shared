"use strict";
// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRewardPromotionActive = isRewardPromotionActive;
/** True when a catalog item has an active promotion at `now`. */
function isRewardPromotionActive(item, now = Date.now()) {
    return (typeof item.promoPointsCost === 'number' &&
        typeof item.promoEndsAt === 'string' &&
        item.promoPointsCost < item.pointsCost &&
        new Date(item.promoEndsAt).getTime() > now);
}
//# sourceMappingURL=loyalty.js.map