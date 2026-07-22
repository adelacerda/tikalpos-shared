"use strict";
// Cupones — free, single-use loyalty coupons for retention AND acquisition.
//
// A coupon = the benefit of a reward (reuses the reward engine's kinds) + an
// "entitlement" layer: a per-guest instance (a CouponGrant) with a unique
// code/QR, single-use, and an absolute expiry. It is FREE to the customer.
//
// Two objects:
//   • Coupon      — the merchant's definition (benefit, pool, rules, expiry).
//   • CouponGrant — one issued instance handed to (or claimed by) a guest.
//
// The pool decrements when a guest CLAIMS (a grant is created), not when they
// redeem. An unused grant is lost (never returns to the pool). Redemption
// reuses the redemption-scan hold+QR (CAS anti-double-use) via COUPON mode.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCouponClaimable = isCouponClaimable;
/** True when a coupon can still be claimed (active, in-window, pool left). */
function isCouponClaimable(c, now = Date.now()) {
    return c.status === 'ACTIVE' && new Date(c.expiresAt).getTime() > now && c.poolClaimed < c.poolTotal;
}
//# sourceMappingURL=coupon.js.map