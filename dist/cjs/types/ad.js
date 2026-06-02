"use strict";
// Loyalty Ad system — FT-GROWTH-017 / reward-wizard SS5.
//
// A franchise can promote a reward with a full-screen ad in the TikalLoyalty
// app's ad carousel. Billing mirrors the discovery highlight: a flat,
// system-admin-configured per-impression fee, deduped per user/day, with the
// rate snapshotted (`lockedFeeCents`) at opt-in so later system-rate changes
// never affect an existing campaign. The merchant sets the start/end window.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoyaltyAdActive = isLoyaltyAdActive;
/** True when an ad is live (active and within its window) at `now` (epoch ms). */
function isLoyaltyAdActive(ad, now = Date.now()) {
    return (ad.active === true &&
        typeof ad.startsAt === 'string' &&
        typeof ad.endsAt === 'string' &&
        new Date(ad.startsAt).getTime() <= now &&
        new Date(ad.endsAt).getTime() > now);
}
//# sourceMappingURL=ad.js.map