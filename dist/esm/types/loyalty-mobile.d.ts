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
    /** True when this account is allowed to enter demo mode (sales rep / test
     *  account). Set by system-admin. Only effect: gates demo-mode activation —
     *  does NOT affect reports. Default false/undefined. */
    isDemo?: boolean;
}
/** Body for activating demo mode: the global demo PIN (validated server-side
 *  against SystemConfig.demoPin). Only succeeds when the guest is isDemo. */
export interface LoyaltyDemoActivateInput {
    pin: string;
}
/** HTTP header the app sends on feed requests while demo mode is active. The
 *  backend honors it only when the authenticated guest is isDemo. */
export declare const DEMO_MODE_HEADER = "x-demo-mode";
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
    /** Redeemable as an at-home service (home-services). Shown alongside locations. */
    validAtHome?: boolean;
    /** Age-restricted product — show label + one-time age gate. */
    ageRestricted?: boolean;
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
    /** Redeemable as an at-home service (home-services). Shown alongside locations. */
    validAtHome?: boolean;
    /** Age-restricted product (alcohol, vape…). Shows a 🔞 badge + a one-time gate. */
    ageRestricted?: boolean;
}
export interface LoyaltyFranchiseDetail {
    branding: LoyaltyFranchiseBranding;
    /** True when the franchise is on the LOYALTY_LITE plan → in-store QR redemption. */
    isLoyaltyLite: boolean;
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
    /** True when the business offers "Atención a domicilio" (services at the
     *  customer's location). Drives the at-home badge/section in the app. */
    offersAtHome?: boolean;
    /** Free-text coverage area shown when offersAtHome is on. */
    coverageArea?: string | null;
    /** Org-level WhatsApp (E.164) + template → "Agendar a domicilio" button. */
    whatsapp?: string | null;
    whatsappTemplate?: string | null;
    /** True when the merchant enabled the stamp card. When false the app shows
     *  the classic points UI only (current behavior, untouched). */
    stampsEnabled?: boolean;
    /** Stamps needed to complete the card (e.g. 10). UI + grant threshold. */
    stampGoal?: number | null;
    /** When true, a valid scan grants points AND a stamp; when false, only a
     *  stamp (no points). Fixed in the merchant's stamp panel. */
    stampsAlsoEarnPoints?: boolean;
    /** This member's current stamps toward the goal (0..stampGoal-1 after wrap). */
    stampCount?: number;
    /** True when the merchant enabled referrals. Drives the "Invita y ganen" UI. */
    referralEnabled?: boolean;
    /** This member's shareable referral code (present only when referrals are on). */
    referralCode?: string | null;
    /** Points the referrer earns when a referred member completes their first service. */
    referrerRewardPoints?: number;
    /** Points the referred member earns on their first service. */
    referredRewardPoints?: number;
    /** Portfolio photos (ordered media URLs) shown in the merchant profile. */
    gallery?: string[];
    /** Simple service catalog (name + optional price/duration/note). Informational
     *  — not a POS; tapping one pre-fills the "book" message. */
    services?: LoyaltyServiceItem[];
    /** True when the merchant turned reviews on. When false the app shows a neutral
     *  "reviews not enabled" state instead of an empty void. */
    reviewsEnabled?: boolean;
    /** Aggregate of PUBLISHED reviews. `average` is null until the minimum count. */
    reviewSummary?: LoyaltyReviewSummary;
    /** Published reviews (most recent first), with the merchant's reply if any. */
    reviews?: LoyaltyReview[];
    /** This member's own review (any status), so they can see/edit/retract it. */
    myReview?: LoyaltyReview | null;
}
/** Aggregate rating shown on the merchant profile. */
export interface LoyaltyReviewSummary {
    /** Mean rating, or null until at least `minForAverage` published reviews exist. */
    average: number | null;
    /** Count of PUBLISHED reviews. */
    count: number;
    /** Minimum published reviews required before `average` is shown. */
    minForAverage: number;
}
export type LoyaltyReviewStatus = 'PENDING_WINDOW' | 'PUBLISHED' | 'HIDDEN';
/** A single review as shown in the app. */
export interface LoyaltyReview {
    id: string;
    rating: number;
    text?: string | null;
    /** Light identity — first name or initial, never fully anonymous. */
    authorName: string;
    /** Always true: only verified customers can review. */
    verified: boolean;
    status: LoyaltyReviewStatus;
    createdAt: string;
    /** ISO time the review becomes (or became) public. */
    publishAt: string;
    /** Merchant's single public reply, if any. */
    merchantReply?: string | null;
    merchantReplyAt?: string | null;
}
export interface CreateReviewInput {
    rating: number;
    text?: string;
}
export type ReviewReportReason = 'FALSE_DEFAMATORY' | 'ABUSIVE' | 'PERSONAL_DATA' | 'SPAM' | 'CONFLICT_OF_INTEREST' | 'EXTORTION' | 'OFF_TOPIC';
export declare const REVIEW_REPORT_REASONS: readonly ReviewReportReason[];
export declare function isReviewReportReason(value: unknown): value is ReviewReportReason;
/** A single informational service in the merchant's mini-catalog. */
export interface LoyaltyServiceItem {
    name: string;
    /** Optional price in cents (org currency). Omitted = "consultar". */
    priceCents?: number;
    /** Optional duration in minutes. */
    durationMin?: number;
    /** Optional short note. */
    note?: string;
}
/** A franchise location (name + address) shown in a reward's "Válida en". */
export interface LoyaltyLocation {
    name: string;
    address: string | null;
    /** Branch coordinates → drives the in-app "navigate" (Waze/Maps) button. */
    latitude?: number | null;
    longitude?: number | null;
    /** Branch WhatsApp (E.164) → drives the in-app "contact via WhatsApp" button.
     *  Null/absent = no button. */
    whatsapp?: string | null;
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
    /** Present in REDEEM mode — the reward being cashed in. `discountType` /
     * `discountValue` let the web preview the charge live before consuming. */
    reward: {
        giftedRewardId: string;
        name: string;
        minCheckAmountCents: number;
        discountType: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT' | null;
        discountValue: number;
    } | null;
    tier: string | null;
    tierDiscountBps: number;
}
/** Web (owner) consumes the hold after entering the spend + choices. */
export interface RedemptionConsumeInput {
    amountCents: number;
    applyReward: boolean;
    applyTierDiscount: boolean;
    orderRef?: string;
}
export interface RedemptionConsumeResult {
    chargeCents: number;
    rewardRedeemed: boolean;
    tierDiscountApplied: boolean;
    pointsAwarded: number;
    /** Stamp card: a stamp was granted on this scan (only when stampsEnabled and
     *  the net charge met the configured minimum). */
    stampEarned?: boolean;
    /** Member's stamp count after this scan (post-wrap when a reward was granted). */
    stampCount?: number;
    /** A stamp reward was auto-granted because the goal was reached this scan. */
    stampRewardGranted?: boolean;
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
    imageUrl?: string | null;
    /** Optional 8s video creative. When present the app plays it (muted, no loop,
     *  capped at 8s) instead of the image. */
    videoUrl?: string | null;
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