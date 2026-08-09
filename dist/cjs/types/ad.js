"use strict";
// Loyalty Ad system — FT-GROWTH-017 / reward-wizard SS5, generalized into
// "promociones" (see docs/feature-promociones.md).
//
// A franchise promotes SOMETHING to the TikalLoyalty app on two paid surfaces:
// the full-screen ad carousel and/or the Discovery neon highlight. The promoted
// subject is the `adKind` — historically always a reward, now also cashback,
// tier discounts, stamps, or a free-form message. Billing mirrors the discovery
// highlight on both surfaces: a flat, system-admin-configured per-impression
// fee, deduped per user/day, with the rate snapshotted (`lockedFeeCents` /
// `discoveryLockedFeeCents`) at opt-in so later system-rate changes never
// affect an existing campaign. The merchant sets the start/end window.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_KINDS = void 0;
exports.promoSectionForKind = promoSectionForKind;
exports.isPromoKindAvailable = isPromoKindAvailable;
exports.isLoyaltyAdActive = isLoyaltyAdActive;
exports.AD_KINDS = [
    'REWARD',
    'CASHBACK',
    'TIER_DISCOUNT',
    'STAMPS',
    'GENERIC',
];
/** The franchise-profile section a kind's CTA focuses (null → open the reward). */
function promoSectionForKind(kind) {
    switch (kind) {
        case 'REWARD':
            return null;
        case 'CASHBACK':
            return 'cashback';
        case 'TIER_DISCOUNT':
            return 'tiers';
        case 'STAMPS':
            return 'stamps';
        case 'GENERIC':
            return 'general';
    }
}
/**
 * True when a franchise may promote `kind` — a merchant can't advertise a
 * feature it doesn't run. GENERIC is always allowed (it's a free-form message).
 * The same predicate gates the web creator and the served carousel, so an ad
 * whose feature is switched off later stops being served.
 */
function isPromoKindAvailable(kind, ctx) {
    switch (kind) {
        case 'REWARD':
            return ctx.hasRewards;
        case 'CASHBACK':
            return ctx.loyaltyMode === 'CASHBACK' || ctx.loyaltyMode === 'BOTH';
        case 'TIER_DISCOUNT':
            return ctx.tiersEnabled;
        case 'STAMPS':
            return ctx.stampsEnabled;
        case 'GENERIC':
            return true;
    }
}
/** True when an ad is live (active and within its window) at `now` (epoch ms). */
function isLoyaltyAdActive(ad, now = Date.now()) {
    return (ad.active === true &&
        typeof ad.startsAt === 'string' &&
        typeof ad.endsAt === 'string' &&
        new Date(ad.startsAt).getTime() <= now &&
        new Date(ad.endsAt).getTime() > now);
}
//# sourceMappingURL=ad.js.map