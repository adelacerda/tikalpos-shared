export type LoyaltyAuthProvider = 'GOOGLE' | 'APPLE' | 'EMAIL';
export declare const LOYALTY_AUTH_PROVIDERS: readonly LoyaltyAuthProvider[];
export declare function isLoyaltyAuthProvider(value: unknown): value is LoyaltyAuthProvider;
export type LoyaltyTransactionKind = 'EARN' | 'REDEEM' | 'EXPIRY' | 'ADJUSTMENT';
export declare const LOYALTY_TRANSACTION_KINDS: readonly LoyaltyTransactionKind[];
export declare function isLoyaltyTransactionKind(value: unknown): value is LoyaltyTransactionKind;
export type LoyaltyPushTopic = 'REWARD_EXPIRING' | 'NEW_PROMOTION' | 'REDEMPTION_READY' | 'BALANCE_MILESTONE' | 'WELCOME' | 'ENGAGEMENT';
export declare const LOYALTY_PUSH_TOPICS: readonly LoyaltyPushTopic[];
export declare function isLoyaltyPushTopic(value: unknown): value is LoyaltyPushTopic;
export interface LoyaltyMobileProfile {
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    /** City — used for push-promotion city targeting (matches branch cities). */
    city?: string | null;
    /** Explicit opt-in to marketing/promotional push (Apple 4.5.4). */
    marketingPushOptIn?: boolean;
}
export interface LoyaltyMobileSession {
    guestId: string;
    token: string;
    expiresAt: string;
    provider: LoyaltyAuthProvider;
    profile: LoyaltyMobileProfile;
}
export interface LoyaltyAuthGoogleInput {
    idToken: string;
    expoPushToken?: string;
    country?: string;
}
export interface LoyaltyAuthAppleInput {
    identityToken: string;
    authorizationCode?: string;
    fullName?: {
        givenName?: string;
        familyName?: string;
    } | null;
    email?: string | null;
    expoPushToken?: string;
    country?: string;
}
export interface LoyaltyAuthEmailInput {
    email: string;
    password: string;
    expoPushToken?: string;
}
export interface LoyaltyFranchiseBranding {
    orgId: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    primaryColorOklch?: string | null;
}
/**
 * A points-redeemable reward used as a milestone on the home progress bar.
 * Free welcome rewards (no points cost) are excluded — they're not a points
 * goal. Sorted ascending by costPoints by the backend.
 */
export interface LoyaltyRewardMilestone {
    rewardId: string;
    name: string;
    costPoints: number;
    imageUrl?: string | null;
}
export interface LoyaltyMemberSummary {
    branding: LoyaltyFranchiseBranding;
    pointsBalance: number;
    lifetimePoints: number;
    tier?: string | null;
    joinedAt: string;
    lastActivityAt?: string | null;
    /** Points-redeemable rewards (asc by cost) for the next-reward progress bar. */
    rewardMilestones: LoyaltyRewardMilestone[];
}
export interface LoyaltyTransactionEntry {
    id: string;
    kind: LoyaltyTransactionKind;
    points: number;
    balanceAfter: number;
    description: string;
    amountCents: number | null;
    currency: string;
    occurredAt: string;
    orgId: string;
}
export interface LoyaltyRewardCard {
    id: string;
    name: string;
    description: string;
    costPoints: number;
    originalCostPoints?: number | null;
    imageUrl?: string | null;
    verticalImageUrl?: string | null;
    promotionEndsAt?: string | null;
    redeemableUntil?: string | null;
    featured?: boolean;
    corporateOnly?: boolean;
    requiredProducts?: string[];
    minCheckAmount?: number;
    /** Locations where this reward is valid (resolved). Empty = all franchise locations. */
    validLocations?: LoyaltyLocation[];
}
/**
 * A reward the member already OWNS — a free GiftedReward (e.g. the welcome
 * gift granted on enrol). Shown under "Mis recompensas", separate from the
 * redeemable catalog. No points cost; it's already theirs until it expires.
 */
export interface LoyaltyGiftedRewardCard {
    id: string;
    rewardId: string;
    name: string;
    description: string;
    imageUrl?: string | null;
    acquiredAt: string;
    expiresAt: string;
    requiredProducts?: string[];
    minCheckAmount?: number;
    /** Locations where this reward is valid (resolved). Empty = all franchise locations. */
    validLocations?: LoyaltyLocation[];
}
export interface LoyaltyFranchiseDetail {
    branding: LoyaltyFranchiseBranding;
    pointsBalance: number;
    lifetimePoints: number;
    tier?: string | null;
    transactions: LoyaltyTransactionEntry[];
    /** Rewards the member already owns (gifted), e.g. the welcome gift. */
    myRewards: LoyaltyGiftedRewardCard[];
    /** Catalog rewards available to redeem (never includes the welcome reward). */
    rewards: LoyaltyRewardCard[];
    /** Franchise locations where rewards can be redeemed. */
    locations: LoyaltyLocation[];
}
/** A franchise location (name + address) shown in a reward's "Válida en". */
export interface LoyaltyLocation {
    name: string;
    address: string | null;
    /** Branch coordinates → drives the in-app "navigate" (Waze/Maps) button. */
    latitude?: number | null;
    longitude?: number | null;
}
export interface LoyaltyMerchantSearchResult {
    orgId: string;
    branding: LoyaltyFranchiseBranding;
    tags: string[];
    isMember: boolean;
}
export interface LoyaltyMerchantSearchResponse {
    items: LoyaltyMerchantSearchResult[];
}
/**
 * REDEEM     — the guest is cashing in a reward they own; the merchant scan can
 *              redeem it and/or apply the tier discount.
 * POINTS_ONLY— "Obtener puntos por compra": no reward is redeemed, the merchant
 *              just records the spend (and optionally the tier discount).
 */
export type RedemptionHoldMode = 'REDEEM' | 'POINTS_ONLY';
export interface LoyaltyRedemptionHold {
    id: string;
    nonce: string;
    rewardId: string;
    orgId: string;
    qrPayload: string;
    mode: RedemptionHoldMode;
    expiresAt: string;
    consumedAt?: string | null;
}
/** Mobile → create a hold for the merchant to scan. */
export interface CreateRedemptionHoldInput {
    mode: RedemptionHoldMode;
    /** The owned GiftedReward to redeem (REDEEM mode only). */
    giftedRewardId?: string;
}
/** Web (owner) resolves a scanned hold before consuming it. */
export interface RedemptionResolveResult {
    nonce: string;
    mode: RedemptionHoldMode;
    expiresAt: string;
    consumedAt: string | null;
    orgId: string;
    currency: string;
    guest: {
        id: string;
        name: string | null;
    };
    /** Present in REDEEM mode — the reward being cashed in. */
    reward: {
        giftedRewardId: string;
        name: string;
        minCheckAmountCents: number;
    } | null;
    tier: string | null;
    tierDiscountBps: number;
}
/** Web (owner) consumes the hold after entering the spend + choices. */
export interface RedemptionConsumeInput {
    amountCents: number;
    applyReward: boolean;
    applyTierDiscount: boolean;
}
export interface RedemptionConsumeResult {
    chargeCents: number;
    rewardRedeemed: boolean;
    tierDiscountApplied: boolean;
    pointsAwarded: number;
}
export interface ReserveRewardInput {
    note?: string;
}
export interface LoyaltyAdCampaignCard {
    id: string;
    title: string;
    subtitle?: string | null;
    imageUrl: string;
    ctaLabel: string;
    ctaUrl: string;
    sponsoredByOrgId: string;
    sponsoredByOrgName: string;
    expiresAt?: string | null;
}
/**
 * A real full-screen ad served to the loyalty app's ad carousel (reward-wizard
 * SS5). The server resolves `isMember` from the guest's enrolments so the app
 * routes the bottom CTA: member → the reward, non-member → the franchise
 * preview (to enrol). One billable impression is charged per ad per user/day
 * on serve, at the ad's locked fee.
 */
export interface LoyaltyAdCard {
    adId: string;
    organizationId: string;
    rewardId: string;
    sponsoredByOrgName: string;
    title: string;
    iconUrl: string;
    imageUrl: string;
    ctaLabel: string;
    /** True when the guest already belongs to this franchise. */
    isMember: boolean;
}
export interface LoyaltyDiscoveryCard {
    orgId: string;
    branding: LoyaltyFranchiseBranding;
    reward: LoyaltyRewardCard;
    highlighted: boolean;
    tags: string[];
}
/**
 * A page of the discovery reward feed (the "Ver todas" screen). The feed is a
 * randomized stream of rewards from non-enrolled franchises; each page tries to
 * include one (not-yet-shown) highlight. `nextCursor` is the cursor to request
 * the next page, or null at the end.
 */
export interface LoyaltyDiscoveryPage {
    items: LoyaltyDiscoveryCard[];
    nextCursor: number | null;
}
export interface LoyaltyFranchisePreview {
    branding: LoyaltyFranchiseBranding;
    welcomeReward: LoyaltyRewardCard | null;
    otherRewards: LoyaltyRewardCard[];
}
export interface LoyaltyPushSubscribeInput {
    expoPushToken?: string;
    endpoint?: string;
    keys?: {
        p256dh: string;
        auth: string;
    };
    topicsOptIn?: LoyaltyPushTopic[];
}
export interface UpdateLoyaltyProfileInput {
    name?: string;
    phone?: string | null;
    avatarUrl?: string | null;
    locale?: 'es' | 'en';
    /** City for push-promotion targeting (matches branch cities). */
    city?: string | null;
    /** Marketing/promotional push consent toggle (Apple 4.5.4). */
    marketingPushOptIn?: boolean;
}
//# sourceMappingURL=loyalty-mobile.d.ts.map