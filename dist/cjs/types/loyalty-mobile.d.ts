import type { AdKind } from './ad';
export type LoyaltyAuthProvider = 'GOOGLE' | 'APPLE' | 'EMAIL';
export declare const LOYALTY_AUTH_PROVIDERS: readonly LoyaltyAuthProvider[];
export declare function isLoyaltyAuthProvider(value: unknown): value is LoyaltyAuthProvider;
export type LoyaltyTransactionKind = 'EARN' | 'REDEEM' | 'EXPIRY' | 'ADJUSTMENT' | 'CASHBACK_EARN' | 'CASHBACK_SPEND' | 'CASHBACK_EXPIRY';
export declare const LOYALTY_TRANSACTION_KINDS: readonly LoyaltyTransactionKind[];
export declare function isLoyaltyTransactionKind(value: unknown): value is LoyaltyTransactionKind;
export type LoyaltyPushTopic = 'REWARD_EXPIRING' | 'NEW_PROMOTION' | 'REDEMPTION_READY' | 'BALANCE_MILESTONE' | 'WELCOME' | 'ENGAGEMENT' | 'MODE_CHANGE' | 'BALANCE_EXPIRING' | 'REMOTE_PROCESSED' | 'REMOTE_RESOLVED' | 'NEW_MERCHANT' | 'MERCHANT_SURVEY';
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
    /** Opt-in to the platform notice when a new merchant opens in their city. */
    newMerchantAlertOptIn?: boolean;
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
    /** Org-level default images for discovery cards + the franchise page banner.
     *  Overridden per-reward by the reward's own image when present. */
    discoveryImageUrl?: string | null;
    discoveryVerticalImageUrl?: string | null;
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
    /** Points that expire on/before the end of next month (block-based expiry). 0/omitted = none upcoming. */
    expiringPoints?: number;
    tier?: string | null;
    joinedAt: string;
    lastActivityAt?: string | null;
    /** Points-redeemable rewards (asc by cost) for the next-reward progress bar. */
    rewardMilestones: LoyaltyRewardMilestone[];
    /** How this franchise rewards: POINTS (default) | CASHBACK | BOTH. */
    loyaltyMode?: 'POINTS' | 'CASHBACK' | 'BOTH';
    /** This member's cashback balance at this franchise (cents). */
    cashbackBalanceCents?: number;
    /** ISO-4217 currency for this franchise (e.g. "GTQ") — money rendered client-side. */
    currency?: string;
    /** In BOTH mode, this member's chosen earn preference at this franchise. */
    memberEarnPreference?: 'POINTS' | 'CASHBACK';
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
    /** Max discount cap (cents) for a percentage reward — shown as a redemption condition. */
    maxDiscountValue?: number;
    /** Locations where this reward is valid (resolved). Empty = all franchise locations. */
    validLocations?: LoyaltyLocation[];
    /** Redeemable as an at-home service (home-services). Shown alongside locations. */
    validAtHome?: boolean;
    /** Age-restricted product — show label + one-time age gate. */
    ageRestricted?: boolean;
    /** Reward kind (config vocabulary). FREE_PRODUCT/GIFT render as "gratis"/"Obsequio"
     *  instead of a "-Q" discount label. Absent = legacy DISCOUNT. */
    rewardKind?: 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT';
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
    /** Max discount cap (cents) for a percentage reward — shown as a redemption condition. */
    maxDiscountValue?: number;
    /** Locations where this reward is valid (resolved). Empty = all franchise locations. */
    validLocations?: LoyaltyLocation[];
    /** Redeemable as an at-home service (home-services). Shown alongside locations. */
    validAtHome?: boolean;
    /** Age-restricted product (alcohol, vape…). Shows a 🔞 badge + a one-time gate. */
    ageRestricted?: boolean;
    /** Reward kind (config vocabulary). FREE_PRODUCT/GIFT render as "gratis"/"Obsequio". */
    rewardKind?: 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT';
    /** "Flotante": held by an in-flight online (escrow) redemption — shown but not usable. */
    reserved?: boolean;
    /** The in-flight redemption holding it, so the app can link to its detail. */
    reservedRemoteRedemptionId?: string | null;
}
export interface LoyaltyFranchiseDetail {
    branding: LoyaltyFranchiseBranding;
    /** True when the franchise is on the LOYALTY_LITE plan → in-store QR redemption. */
    isLoyaltyLite: boolean;
    /** How this merchant redeems: QR (present-only) | CODE | BOTH. Default QR. */
    redemptionChannel?: RedemptionChannel;
    pointsBalance: number;
    lifetimePoints: number;
    /** Points that expire on/before the end of next month (block-based expiry). 0/omitted = none upcoming. */
    expiringPoints?: number;
    tier?: string | null;
    /** How this franchise rewards: POINTS (default) | CASHBACK | BOTH. */
    loyaltyMode?: 'POINTS' | 'CASHBACK' | 'BOTH';
    /** This member's cashback balance (cents). */
    cashbackBalanceCents?: number;
    /** Cashback earn rate (basis points) shown as the "%" hook. */
    cashbackRateBps?: number;
    /** Max % of a bill payable with cashback balance. */
    cashbackBillCapPct?: number;
    /** In BOTH mode, this member's chosen earn preference at this franchise. */
    memberEarnPreference?: 'POINTS' | 'CASHBACK';
    /** Active cashback boost (e.g. "doble cashback"), or null. */
    cashbackBoost?: {
        multiplier: number;
        endsAt: string;
    } | null;
    /** ISO-4217 currency of this franchise (e.g. "GTQ") — money rendered client-side. */
    currency?: string;
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
    /** Cashback (cents) each side earns instead, on cashback-mode merchants. */
    referrerRewardCashbackCents?: number;
    referredRewardCashbackCents?: number;
    /** Currency the referral pays in when the merchant runs BOTH mode ('POINTS' |
     * 'CASHBACK'), declared by the merchant. Both sides get it regardless of the
     * member's own earn preference. Defaults to POINTS in single-currency modes. */
    referralRewardCurrency?: 'POINTS' | 'CASHBACK';
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
    /** Published reviews (most recent first), with the merchant's reply if any.
     *  Read-only on the franchise screen — members add reviews via the post-visit
     *  prompt (see LoyaltyReviewPrompt), not an inline box. */
    reviews?: LoyaltyReview[];
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
/**
 * A pending post-visit review prompt. The app shows a modal the day after a
 * qualifying transaction (earned points/cashback or redeemed a reward — NOT a
 * gifted-points adjustment). The member can review, snooze ("remind me later"),
 * or dismiss ("don't remind me"). One prompt per transaction.
 */
export interface LoyaltyReviewPrompt {
    /** The visit being reviewed — pass this back when submitting/snoozing/dismissing. */
    loyaltyTransactionId: string;
    orgId: string;
    branding: LoyaltyFranchiseBranding;
    /** What qualified the visit (drives the prompt copy). */
    reason: 'EARN' | 'REDEEM' | 'CASHBACK_EARN';
    /** ISO time of the transaction. */
    occurredAt: string;
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
export type RedemptionHoldMode = 'REDEEM' | 'POINTS_ONLY' | 'CASHBACK_APPLY' | 'COUPON';
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
    /** The owned CouponGrant to redeem (COUPON mode only). */
    couponGrantId?: string;
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
        discountType: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NONE' | null;
        discountValue: number;
        /** Reward kind — lets the web redemption screen show "Entregar: X" and skip the amount for GIFT. */
        rewardKind?: 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT';
    } | null;
    /** Present in COUPON mode — the coupon being redeemed. The web previews the
     * benefit live before consuming and re-validates min-check/PLU at the register. */
    coupon: {
        couponGrantId: string;
        name: string;
        benefitKind: 'DISCOUNT' | 'FREE_PRODUCT' | 'GIFT' | 'POINTS_BONUS' | 'CASHBACK_BONUS';
        minCheckAmountCents: number;
        discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NONE' | null;
        discountValue: number;
        maxDiscountValue?: number;
        /** Label handed over for FREE_PRODUCT/GIFT. */
        benefitLabel?: string;
        /** Bonus amounts for POINTS_BONUS / CASHBACK_BONUS. */
        bonusPoints?: number;
        bonusCashbackCents?: number;
    } | null;
    tier: string | null;
    tierDiscountBps: number;
}
/** Web (owner) consumes the hold after entering the spend + choices. */
export interface RedemptionConsumeInput {
    amountCents: number;
    applyReward: boolean;
    applyTierDiscount: boolean;
    applyCoupon?: boolean;
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
    /** Cashback (cents) credited to the member's balance on this scan. */
    cashbackEarnedCents?: number;
    /** Cashback (cents) applied from the member's balance to this bill. */
    cashbackAppliedCents?: number;
    /** COUPON mode: the coupon grant was consumed on this scan. */
    couponRedeemed?: boolean;
    /** COUPON mode: bonus points credited by a POINTS_BONUS coupon. */
    couponBonusPoints?: number;
    /** COUPON mode: bonus cashback (cents) credited by a CASHBACK_BONUS coupon. */
    couponBonusCashbackCents?: number;
}
export interface ReserveRewardInput {
    note?: string;
}
/** How a franchise exposes redemption in the app. Default `QR` (presencial). */
export type RedemptionChannel = 'QR' | 'CODE' | 'BOTH';
/**
 * How the guest pays a remote (delivery/online) order. Declared by the merchant
 * at "procesada". Drives the earn-on-non-delivery reconciliation (escrow v2):
 * the earn is credited on the amount the merchant CONFIRMS was paid.
 */
export type RemotePaymentType = 'PREPAID' | 'ON_DELIVERY';
/** Escrow lifecycle of a remote (code-based) transaction. */
export type RemoteRedemptionStatus = 'PENDING' | 'ACCEPTED' | 'PROCESSED' | 'CONFIRMED' | 'DISPUTED' | 'RELEASED' | 'EXPIRED';
/** System-admin dispute SLA (business days). */
export declare const REMOTE_REDEMPTION_DISPUTE_SLA_BUSINESS_DAYS = 5;
/** Escrow time windows (days), per the closed design. */
export declare const REMOTE_REDEMPTION_WINDOWS: {
    readonly honorDays: 3;
    readonly autoConfirmDays: 7;
    readonly snoozeCapDays: 30;
};
/** The escrow transaction the merchant works and the guest tracks. */
export interface RemoteRedemption {
    id: string;
    code: string;
    orgId: string;
    guestId: string;
    mode: RedemptionHoldMode;
    status: RemoteRedemptionStatus;
    /** Owned entitlement held in escrow (by mode). */
    giftedRewardId?: string | null;
    couponGrantId?: string | null;
    /** Merchant inputs captured at "procesada". */
    amountCents?: number | null;
    accountNumber?: string | null;
    note?: string | null;
    applyTierDiscount?: boolean;
    paymentType?: RemotePaymentType | null;
    /** Payment reconciliation on a non-delivery dispute (escrow v2). */
    paidDeclaredCents?: number | null;
    paidConfirmedCents?: number | null;
    /** Lifecycle timestamps (ISO-8601). */
    createdAt: string;
    acceptedAt?: string | null;
    processedAt?: string | null;
    confirmedAt?: string | null;
    disputedAt?: string | null;
    resolvedAt?: string | null;
    /** Absolute deadlines (ISO-8601) from the windows above. */
    honorExpiresAt: string;
    autoConfirmAt?: string | null;
    snoozeHardCapAt?: string | null;
}
/** Mobile → generate a remote code (reserves the benefit → flotante). */
export interface CreateRemoteRedemptionInput {
    mode: RedemptionHoldMode;
    giftedRewardId?: string;
    couponGrantId?: string;
}
/** Merchant → mark the code processed (ships with the benefit applied). */
export interface ProcessRemoteRedemptionInput {
    amountCents: number;
    accountNumber: string;
    applyTierDiscount: boolean;
    note?: string;
    /** Only false when the merchant cannot fulfil the reward (→ RELEASED). */
    applyReward?: boolean;
    paymentType?: RemotePaymentType;
}
/**
 * Guest → open a non-delivery dispute (escrow v2). The guest declares how much
 * they actually paid (0 if they returned the whole order / paid nothing); the
 * merchant then confirms the amount, and the earn is credited on it.
 */
export interface DisputeRemoteRedemptionInput {
    paidDeclaredCents: number;
}
/**
 * Merchant → "not delivered / I accept fault" (escrow v2). Confirms how much the
 * guest paid. If it matches the guest's declared amount, the earn is credited on
 * it and the reward is returned; otherwise it escalates to system-admin.
 */
export interface ReleaseRemoteRedemptionInput {
    paidConfirmedCents: number;
}
/**
 * Guest → resolve a remote redemption. CONFIRM/POSTPONE/DISPUTE act on a
 * PROCESSED escrow; CANCEL undoes a still-PENDING code the guest created by
 * mistake (releases the reserved benefit).
 */
export type RemoteRedemptionGuestAction = 'CONFIRM' | 'POSTPONE' | 'DISPUTE' | 'CANCEL';
/** System-admin → reconcile a dispute. */
export type RemoteRedemptionResolution = 'CONFIRM' | 'RELEASE';
/**
 * System-admin → reconcile a disputed remote redemption (escrow v2). On RELEASE,
 * the admin sets the final confirmed paid amount (used when merchant and guest
 * disagree); the earn is credited on it before returning the reward.
 */
export interface ReconcileRemoteRedemptionInput {
    resolution: RemoteRedemptionResolution;
    paidConfirmedCents?: number;
}
/** What the mobile app shows the guest for each of their remote (escrow) codes. */
export interface LoyaltyRemoteRedemptionCard {
    id: string;
    code: string;
    status: RemoteRedemptionStatus;
    mode: RedemptionHoldMode;
    orgId: string;
    merchantName: string;
    merchantLogoUrl?: string | null;
    /** The reserved benefit's display name (reward for REDEEM, coupon for COUPON). */
    benefitName?: string | null;
    /** How this merchant rewards the order — so the app says "points" vs "cashback". */
    earnKind?: 'POINTS' | 'CASHBACK';
    /** Merchant-entered once processed. */
    amountCents?: number | null;
    accountNumber?: string | null;
    createdAt: string;
    processedAt?: string | null;
    honorExpiresAt: string;
    autoConfirmAt?: string | null;
}
/**
 * Full transaction detail for one remote redemption (tap-through screen). The
 * money breakdown (`chargeCents`, discounts, earn) is present ONLY once the
 * merchant has processed the code (amount known). Before that (PENDING/ACCEPTED)
 * the guest just sees the code + benefit while waiting.
 */
export interface LoyaltyRemoteRedemptionDetail extends LoyaltyRemoteRedemptionCard {
    applyTierDiscount?: boolean | null;
    /** Order amount the merchant entered (null until processed). */
    chargeCents?: number | null;
    rewardDiscountCents?: number | null;
    couponDiscountCents?: number | null;
    /** Cashback spent on this bill (CASHBACK_APPLY) — it is why the charge dropped,
     *  so the breakdown must name it rather than just show a smaller total. */
    cashbackAppliedCents?: number | null;
    tierDiscountCents?: number | null;
    /** What the guest earns on the charge — one of these per `earnKind`. */
    earnPoints?: number | null;
    earnCashbackCents?: number | null;
    /** Payment context + reconciliation (escrow v2). */
    paymentType?: RemotePaymentType | null;
    paidDeclaredCents?: number | null;
    paidConfirmedCents?: number | null;
    /** Reason the merchant/system-admin gave when resolving a dispute. */
    resolutionNote?: string | null;
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
 * A real full-screen promotion served to the loyalty app's ad carousel. The
 * server resolves `isMember` from the guest's enrolments so the app routes the
 * bottom CTA: for a `REWARD` promotion, member → the reward, non-member → the
 * franchise preview (to enrol); every other kind opens the franchise focused on
 * the kind's section (`promoSectionForKind`). One billable impression is
 * charged per promotion per user/day on serve, at the promotion's locked fee.
 */
export interface LoyaltyAdCard {
    adId: string;
    organizationId: string;
    /** What the promotion is about — drives the CTA target. */
    adKind: AdKind;
    /** The promoted reward. Null for every kind other than `REWARD`. */
    rewardId: string | null;
    sponsoredByOrgName: string;
    title: string;
    /** Optional second line under the title (the body of a GENERIC message). */
    subtitle?: string | null;
    iconUrl: string;
    imageUrl?: string | null;
    /** Optional 8s video creative. When present the app plays it (muted, no loop,
     *  capped at 8s) instead of the image. */
    videoUrl?: string | null;
    ctaLabel: string;
    /** True when the guest already belongs to this franchise. */
    isMember: boolean;
}
/**
 * The promotion behind a highlighted discovery card when the highlight was
 * bought as a generic promotion instead of on a reward. The card renders this
 * creative and copy; the CTA opens the franchise focused on the kind's section.
 */
export interface LoyaltyDiscoveryPromo {
    adId: string;
    adKind: AdKind;
    title: string;
    subtitle?: string | null;
    /** Landscape 1200×600 — the home carousel card's banner. */
    imageUrl?: string | null;
    /** Portrait 1080×1440 — the "Ver todas" feed card. Null → the card falls back
     *  to the franchise's own default image. */
    verticalImageUrl?: string | null;
    ctaLabel: string;
}
/**
 * A merchant's live coupon, surfaced to guests who are NOT its members.
 *
 * Carousel only — a coupon has no portrait art, so it would break the "Ver
 * todas" feed card, which is built around a 1080×1440 image.
 *
 * Claiming a coupon enrolls the guest (see `claimAndOpenHold`), so for a
 * non-member this is not a discount on the side: it IS the way in.
 */
export interface LoyaltyDiscoveryCoupon {
    couponId: string;
    name: string;
    /** One-line benefit, already localized ("Q50 de descuento"). */
    benefitSummary: string;
    imageUrl?: string | null;
    expiresAt: string;
    /** Left in the pool. Drives the "quedan N de M" urgency line. */
    remaining: number;
    poolTotal: number;
    /** The code the claim endpoint takes. Required: tapping the card opens the
     *  same modal the prompt uses, and without a code its button claims nothing. */
    publicCode: string;
    /** Claiming this replaces the franchise's welcome gift — the modal says so,
     *  because discovering it after committing is what burns trust. */
    replacesWelcome: boolean;
}
export interface LoyaltyDiscoveryCard {
    orgId: string;
    branding: LoyaltyFranchiseBranding;
    /** A reward the guest can still get. Null for cashback-only franchises (no
     *  points catalog) — the card then leads with cashback info. Rewards the guest
     *  already holds never become cards. */
    reward: LoyaltyRewardCard | null;
    highlighted: boolean;
    /** True when the guest already joined this franchise. The card then invites
     *  them in ("Ver") instead of offering to join. */
    isMember?: boolean;
    /** Set when `highlighted` came from a generic promotion (not a reward opt-in)
     *  — the card leads with this creative instead of the reward. */
    promo?: LoyaltyDiscoveryPromo | null;
    /**
     * A live coupon of this franchise, for non-members only.
     *
     * Never set together with a leading `promo`: that impression was PAID for,
     * and a coupon must not displace something a merchant bought.
     */
    coupon?: LoyaltyDiscoveryCoupon | null;
    tags: string[];
    /** How the franchise rewards → drives the points/cashback badges on the card. */
    loyaltyMode: 'POINTS' | 'CASHBACK' | 'BOTH';
    /** Cashback earn rate (basis points) — shown as "X%" when the franchise offers cashback. */
    cashbackRateBps?: number;
    /** ISO-4217 currency (e.g. "GTQ") — money rendered client-side. */
    currency?: string;
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
    /** The merchant's own photos, same as the member view. Deciding whether to
     *  join is exactly when someone wants to see the place. */
    gallery?: string[];
    /** What the merchant actually does, same as the member view. For a
     *  home-services business this is the offer itself — "¿qué hacen y cuánto
     *  cuesta?" is the question that decides whether joining is worth it, and it
     *  used to be answerable only AFTER joining. */
    services?: LoyaltyServiceItem[];
    /** WhatsApp in E.164 — makes a service row tappable to book. */
    whatsapp?: string | null;
    welcomeReward: LoyaltyRewardCard | null;
    otherRewards: LoyaltyRewardCard[];
    /** How the franchise rewards → drives points/cashback hooks on the preview. */
    loyaltyMode?: 'POINTS' | 'CASHBACK' | 'BOTH';
    /** Cashback earn rate (basis points) shown as "X%" when the franchise offers cashback. */
    cashbackRateBps?: number;
    /** ISO-4217 currency (e.g. "GTQ") — money rendered client-side. */
    currency?: string;
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
    /**
     * "Tell me when a new merchant opens in my city." A separate consent from
     * `marketingPushOptIn`: no merchant picks this audience and none is billed
     * for it, so declining merchant advertising does not decline this.
     */
    newMerchantAlertOptIn?: boolean;
}
/**
 * The one coupon to offer a guest this session, or null.
 *
 * Resolved server-side from: a merchant they opened within the last 30 days,
 * are STILL not a member of, whose coupon is live with stock left and has
 * never been shown to them. Picked at random among whatever qualifies.
 *
 * Deliberately NOT a discount they get for free: claiming it enrolls them.
 */
export interface CouponPromptCandidate {
    couponId: string;
    organizationId: string;
    organizationName: string;
    logoUrl?: string | null;
    name: string;
    description?: string | null;
    benefitSummary: string;
    imageUrl?: string | null;
    expiresAt: string;
    remaining: number;
    poolTotal: number;
    /** The code the claim endpoint takes. A coupon without one can't be claimed
     *  from the modal, so the resolver never offers it — the button would be a
     *  dead end. */
    publicCode: string;
    /** True when claiming this replaces the franchise's welcome gift — the modal
     *  must say so, or the guest discovers it after committing. */
    replacesWelcome: boolean;
}
/** A merchant somebody asked for, as they typed it. */
export interface MerchantRequestRaw {
    id: string;
    guestId: string;
    guestName: string | null;
    guestEmail: string | null;
    guestCity: string | null;
    /** Exactly what they wrote — never rewritten, so the tally stays auditable. */
    text: string;
    createdAt: string;
    canonicalId: string | null;
}
/**
 * The same merchant, however people spelled it.
 *
 * "Polo Campero", "pollocampero" and "Pollo Campero" are one demand signal;
 * counting them apart hides it. Merging is manual because only a human knows
 * that two strings mean one business.
 */
export interface MerchantRequestGroup {
    id: string;
    name: string;
    /** How many people asked for it. The number that decides anything. */
    requests: number;
    /** ISO — the most recent ask, so a stale demand is visible as stale. */
    lastRequestedAt: string;
    /** Set once the merchant actually joins → who to tell. */
    organizationId: string | null;
    organizationName: string | null;
    /** Guests already told it arrived, so nobody is told twice. */
    notified: number;
    /** Reachable askers still waiting for the news. */
    pending: number;
}
/** Who the survey invite would reach, before sending it. */
export interface SurveyAudiencePreview {
    /** Registered and never joined any merchant. */
    noMerchant: number;
    /** Joined exactly one and never transacted — they never found what to do. */
    oneAndIdle: number;
    /** In the chosen audience but with no live device: counted, not notified. */
    unreachable: number;
    /** Already answered, so they are never asked again. */
    alreadyAnswered: number;
}
export type SurveyAudience = 'NO_MERCHANT' | 'ONE_AND_IDLE' | 'BOTH';
//# sourceMappingURL=loyalty-mobile.d.ts.map