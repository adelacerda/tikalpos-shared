/**
 * What a coupon gives when redeemed — mirrors the reward `rewardKind`s and adds
 * the two "bonus" kinds a coupon can grant on purchase:
 *   - DISCOUNT       — % or fixed Q off the bill.
 *   - FREE_PRODUCT   — a sellable product given free (discounts the bill by its value).
 *   - GIFT           — an extra giveaway NOT on the bill (never touches the total).
 *   - POINTS_BONUS   — bonus loyalty points credited on the qualifying purchase.
 *   - CASHBACK_BONUS — bonus cashback (cents) credited to the wallet on purchase
 *                      (only offered when the merchant has cashback enabled).
 */
export type CouponBenefitKind = 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT' | 'POINTS_BONUS' | 'CASHBACK_BONUS';
/** Discount shape for a DISCOUNT/FREE_PRODUCT benefit (mirrors reward discounts). */
export type CouponDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NONE';
/** Definition lifecycle: DRAFT (not distributed) → ACTIVE → CANCELED (distribution stopped; live grants honored). */
export type CouponStatus = 'DRAFT' | 'ACTIVE' | 'CANCELED';
/** One issued instance's lifecycle. */
export type CouponGrantStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
/** How a grant was delivered — a public shared code (social post) vs a per-person unique code. */
export type CouponGrantSource = 'DIRECT' | 'CAMPAIGN' | 'LINK' | 'PUBLIC';
/** Aggregate report numbers for one coupon (funnel + live liability). */
export interface CouponStats {
    /** Grants created (pool consumed). */
    claimed: number;
    /** Grants redeemed at a register. */
    redeemed: number;
    /** Grants that expired unredeemed. */
    expired: number;
    /** Live outstanding = claimed − redeemed − expired (the retention liability). */
    outstanding: number;
    /** Total benefit value delivered on redemptions (cents; discounts + bonuses). */
    valueDeliveredCents: number;
    /** Grants redeemed by a guest who was NOT a member before claiming (acquisition). */
    newMembersAcquired: number;
}
/** A coupon definition (merchant-facing). */
export interface Coupon {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    /** Landscape 2:1 · 1200×600 (relative media URL). REQUIRED — shown on card + coupon screen. */
    imageUrl: string;
    benefitKind: CouponBenefitKind;
    /** DISCOUNT/FREE_PRODUCT: how the bill is reduced. */
    discountType?: CouponDiscountType;
    /** PERCENTAGE = percent (e.g. 15); FIXED_AMOUNT = cents. */
    discountValue?: number;
    /** Worst-case cap (cents) for a PERCENTAGE discount. */
    maxDiscountValue?: number;
    /** FREE_PRODUCT / GIFT: what is handed over (label). */
    benefitLabel?: string;
    /** POINTS_BONUS: bonus points credited on the purchase. */
    bonusPoints?: number;
    /** CASHBACK_BONUS: bonus cashback (cents) credited to the wallet. */
    bonusCashbackCents?: number;
    /** Minimum bill (cents) required to redeem (0 = any). */
    minCheckCents: number;
    /** Products (PLU/ids) that must be on the bill to qualify. Empty/undefined = any. */
    requiredProductIds?: string[];
    /** Branches where the coupon is valid. Empty/undefined = ALL branches. */
    locationIds?: string[];
    /** Redeemable at-home (owner-scan) — offered only when the merchant has offersAtHome. */
    validAtHome?: boolean;
    /** Absolute expiry (ISO-8601). Availability ends at pool exhaustion OR this date, whichever first. */
    expiresAt: string;
    /** Total instances that can be claimed. */
    poolTotal: number;
    /** Instances already claimed (grants created). */
    poolClaimed: number;
    /** Convenience — poolTotal − poolClaimed. */
    poolRemaining: number;
    /** Public shared code for the social-post channel (null = no public channel). */
    publicCode?: string | null;
    /** Stacking: this coupon's welcome bonus replaces the org welcome reward (avoid double-pay). */
    replacesWelcome: boolean;
    /** Stacking: allow the coupon discount to stack with the member/tier discount (default false). */
    combinableWithDiscounts: boolean;
    status: CouponStatus;
    createdAt: string;
    updatedAt: string;
    /** Report aggregates (present in list/detail responses). */
    stats?: CouponStats;
}
/** True when a coupon can still be claimed (active, in-window, pool left). */
export declare function isCouponClaimable(c: Pick<Coupon, 'status' | 'expiresAt' | 'poolClaimed' | 'poolTotal'>, now?: number): boolean;
/** Merchant-supplied fields when creating a coupon. */
export interface CreateCouponInput {
    name: string;
    description?: string;
    imageUrl: string;
    benefitKind: CouponBenefitKind;
    discountType?: CouponDiscountType;
    discountValue?: number;
    maxDiscountValue?: number;
    benefitLabel?: string;
    bonusPoints?: number;
    bonusCashbackCents?: number;
    minCheckCents?: number;
    requiredProductIds?: string[];
    locationIds?: string[];
    validAtHome?: boolean;
    expiresAt: string;
    poolTotal: number;
    /** Generate a public shared code for social distribution. */
    enablePublicCode?: boolean;
    replacesWelcome?: boolean;
    combinableWithDiscounts?: boolean;
    /** DRAFT to save without distributing; ACTIVE to open for claims. Default ACTIVE. */
    status?: Extract<CouponStatus, 'DRAFT' | 'ACTIVE'>;
}
/** Editable-once-issued fields (cosmetic only) + status transitions. */
export interface UpdateCouponInput {
    name?: string;
    description?: string;
    imageUrl?: string;
    benefitLabel?: string;
    /** ACTIVE ↔ DRAFT before any grant; CANCELED stops distribution (live grants honored). */
    status?: CouponStatus;
}
/** Direct grant to one member (admin). */
export interface GrantCouponInput {
    /** The guest to grant to (must resolve to a guest of this platform). */
    guestId: string;
}
/** A coupon as the guest sees it in "Mis Cupones" (one of their grants). */
export interface GuestCoupon {
    grantId: string;
    couponId: string;
    organizationId: string;
    merchantName: string;
    /** Merchant logo (relative URL) for the card label. */
    merchantLogoUrl?: string | null;
    name: string;
    description?: string;
    imageUrl: string;
    /** Short human benefit label, e.g. "15% de descuento", "Q5 de cashback". */
    benefitSummary: string;
    status: CouponGrantStatus;
    expiresAt: string;
    redeemedAt?: string | null;
    /** True when the guest is already enrolled in this merchant (drives "Canjear" vs "Unirme"). */
    isMember: boolean;
    minCheckCents: number;
    validAtHome?: boolean;
}
/** Mobile → claim a coupon by code (link/public). */
export interface ClaimCouponInput {
    code: string;
}
/** Result of a claim attempt. `ok:false` carries a warm reason for the UI. */
export interface ClaimCouponResult {
    ok: boolean;
    grant?: GuestCoupon;
    reason?: 'NOT_FOUND' | 'SOLD_OUT' | 'EXPIRED' | 'ALREADY_CLAIMED' | 'RATE_LIMITED';
}
/** Public landing (`/cupon/:code`) — pre-download preview, shows live remaining + sold-out. */
export interface PublicCouponView {
    code: string;
    organizationId: string;
    merchantName: string;
    merchantLogoUrl?: string | null;
    name: string;
    description?: string;
    imageUrl: string;
    benefitSummary: string;
    expiresAt: string;
    poolRemaining: number;
    /** True when nothing is left to claim (pool exhausted OR past expiry). */
    soldOut: boolean;
}
//# sourceMappingURL=coupon.d.ts.map