/** Who a push campaign may reach. */
export type PushPromotionTarget = 'NON_MEMBERS' | 'MEMBERS' | 'BOTH';
/** A push campaign a franchise created to promote a catalog reward. */
export interface PushPromotion {
    id: string;
    organizationId: string;
    /** The catalog reward this push promotes (deep-link target on tap). */
    rewardId: string;
    /** Notification title (merchant-authored). */
    title: string;
    /** Notification body (merchant-authored). */
    body: string;
    /** Eligible audience: acquisition, retention, or both. */
    target: PushPromotionTarget;
    startsAt: string;
    endsAt: string;
    /** Per-delivery system rate snapshotted at opt-in. */
    lockedFeeCents: number;
    /** Optional hard cap on total deliveries (budget); null = unlimited window. */
    maxDeliveries: number | null;
    active: boolean;
    createdAt: string;
}
/** Merchant-supplied fields when creating a push campaign. */
export interface CreatePushPromotionInput {
    rewardId: string;
    title: string;
    body: string;
    target: PushPromotionTarget;
    startsAt: string;
    endsAt: string;
    maxDeliveries?: number | null;
}
/** True when a push campaign is live (active and within its window) at `now`. */
export declare function isPushPromotionActive(p: PushPromotion, now?: number): boolean;
//# sourceMappingURL=push-promotion.d.ts.map