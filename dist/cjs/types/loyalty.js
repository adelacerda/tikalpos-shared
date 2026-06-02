"use strict";
// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRewardPromotionActive = isRewardPromotionActive;
exports.isRewardBoostActive = isRewardBoostActive;
exports.isDiscoveryHighlightActive = isDiscoveryHighlightActive;
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