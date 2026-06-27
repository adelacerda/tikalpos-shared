export type PlanTier = 'LOYALTY_LITE' | 'LOYALTY_PRO' | 'LOYALTY_MAX' | 'STARTER' | 'PRO' | 'SCALE' | 'ENTERPRISE';
export declare const PLAN_TIERS: readonly PlanTier[];
export declare function isPlanTier(value: unknown): value is PlanTier;
/**
 * Loyalty-only plans (no POS / menu / devices): LOYALTY_LITE and LOYALTY_PRO.
 * They share the exact same admin permissions and feature gating — only their
 * branch limit (maxLocations) differs. Use this everywhere a feature is gated
 * "is this a loyalty-only plan?" instead of comparing to 'LOYALTY_LITE'.
 */
export declare function isLoyaltyOnlyPlan(tier: PlanTier | string | null | undefined): boolean;
/** Plan families: a franchise should only be recommended to upgrade WITHIN its
 *  family (Loyalty → Loyalty, POS → POS). */
export declare const LOYALTY_PLAN_LADDER: readonly PlanTier[];
export declare const POS_PLAN_LADDER: readonly PlanTier[];
/** The next plan up within the same family, or null if already at the top. */
export declare function nextPlanInFamily(tier: PlanTier): PlanTier | null;
/** One metered resource's current usage vs its plan allotment. */
export interface PlanUsageMetric {
    /** Stable key: 'members' | 'highlights' | 'ads' | 'pushes' | 'locations'. */
    key: 'members' | 'highlights' | 'ads' | 'pushes' | 'locations';
    used: number;
    included: number;
    /** 0–100+ (can exceed 100 when over). included=0/unlimited → 0. */
    percent: number;
    /** used >= 90% of included. */
    nearLimit: boolean;
    /** used > included. */
    over: boolean;
    /** Per-unit overage fee in centavos (0 when not billed as overage). */
    overageUnitCents: number;
}
/** Plan usage snapshot for a franchise (powers Mi Plan + the dashboard banner). */
export interface PlanUsage {
    planTier: PlanTier;
    currency: string;
    metrics: PlanUsageMetric[];
    /** Next plan to recommend within the same family, or null if at the top. */
    recommendedUpgrade: PlanTier | null;
    /** Any metric at/over 90%. */
    anyNearLimit: boolean;
    /** Any metric over its included allotment. */
    anyOver: boolean;
}
export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export declare const BILLING_CYCLES: readonly BillingCycle[];
export declare function isBillingCycle(value: unknown): value is BillingCycle;
export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELED';
export declare const SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[];
export declare function isSubscriptionStatus(value: unknown): value is SubscriptionStatus;
export type AdSegmentationKind = 'NONE' | 'BY_TIER' | 'BY_LOCATION' | 'BY_CATEGORY' | 'CUSTOM_RULES';
export type PushSegmentationKind = 'NONE' | 'BY_TIER' | 'BY_LOCATION' | 'BY_LAST_VISIT' | 'BY_PURCHASE' | 'CUSTOM_RULES';
export type PushSchedulingKind = 'IMMEDIATE' | 'SCHEDULED' | 'RECURRING' | 'AB_TEST' | 'EVENT_TRIGGERED';
export interface PlanLimits {
    tier: PlanTier;
    monthlyFeeCents: number;
    annualFeeCents: number;
    trialDays: number;
    adFeeCents: number;
    highlightFeeCents: number;
    includedHighlightImpressions: number;
    includedAdImpressions: number;
    includedTransactions: number;
    overagePerTxCents: number;
    maxLocations: number;
    maxEnrolledDevices: number;
    maxLoyaltyMembers: number;
    /** Soft cap: members beyond maxLoyaltyMembers are billed this much per
     *  member/month at period close (0 = no overage charge). Configurable per plan. */
    loyaltyMemberOverageCents: number;
    maxConcurrentWsSessions: number;
    maxActiveAdCampaigns: number;
    adSegmentationKinds: readonly AdSegmentationKind[];
    includedPromoPushPerMonth: number;
    promoPushOveragePerPushCents: number;
    promoPushSegmentationKinds: readonly PushSegmentationKind[];
    promoPushSchedulingKinds: readonly PushSchedulingKind[];
}
export declare const PLAN_LIMITS: Readonly<Record<PlanTier, PlanLimits>>;
export interface Subscription {
    organizationId: string;
    tier: PlanTier;
    billingCycle: BillingCycle;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    trialEndsAt: string | null;
    suspendedAt: string | null;
    suspendedReason: string | null;
    billingMetadata: Record<string, unknown> | null;
    lockedMonthlyFeeCents?: number | null;
    lockedAnnualFeeCents?: number | null;
    priceChangeEffectiveAt?: string | null;
}
export interface UsageWindow {
    organizationId: string;
    windowStart: string;
    windowEnd: string;
    transactionCount: number;
    overageCount: number;
    overageAmountCents: number;
    enrolledDeviceCount: number;
    concurrentWsPeak: number;
    adCampaignsActiveCount: number;
    adSpendCents: number;
    adFeeRevenueCents: number;
    promoPushCount: number;
    promoPushOverageCount: number;
    promoPushOverageCents: number;
    boostCount: number;
    boostChargeCents: number;
    discoveryHighlightCount: number;
    discoveryHighlightChargeCents: number;
    closedAt: string | null;
}
export type SubscriptionEventKind = 'CREATED' | 'TIER_CHANGED' | 'STATUS_CHANGED' | 'PERIOD_ROLLED' | 'MANUAL_SUSPEND' | 'MANUAL_REACTIVATE' | 'BOOST_CHARGED' | 'DISCOVERY_HIGHLIGHT_CHARGED';
export declare const SUBSCRIPTION_EVENT_KINDS: readonly SubscriptionEventKind[];
export declare function isSubscriptionEventKind(value: unknown): value is SubscriptionEventKind;
export interface SubscriptionEvent {
    id: string;
    organizationId: string;
    kind: SubscriptionEventKind;
    fromTier: PlanTier | null;
    toTier: PlanTier | null;
    fromStatus: SubscriptionStatus | null;
    toStatus: SubscriptionStatus | null;
    actorId: string;
    actorRole: string;
    reason: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
}
export interface UsageSnapshot {
    subscription: Subscription;
    limits: PlanLimits;
    current: UsageWindow;
    remainingTransactions: number;
    isOverLimit: boolean;
    isHardBlocked: boolean;
    isSoftOverage: boolean;
}
export interface UpdateSubscriptionInput {
    tier?: PlanTier;
    billingCycle?: BillingCycle;
    status?: SubscriptionStatus;
    reason?: string;
    suspendUntil?: string;
}
export interface ListUsageWindowsQuery {
    months?: number;
}
export interface ListSubscriptionEventsQuery {
    cursor?: string;
    limit?: number;
}
/**
 * A plan's live pricing/limits row (DB-backed, editable). Mirrors PlanLimits.
 * Pricing is per-country: one row per (countryCode, tier). Money values are in
 * the country's currency (centavos). `currency` is the ISO code (e.g. 'GTQ').
 */
export interface PlanPricing extends PlanLimits {
    countryCode: string;
    currency: string;
    isVisible: boolean;
    isActive: boolean;
    isNeon: boolean;
    updatedAt: string;
}
/** Editable fields for a plan. Money in the country's centavos; omit to keep. */
export interface UpdatePlanPricingInput {
    monthlyFeeCents?: number;
    annualFeeCents?: number;
    trialDays?: number;
    adFeeCents?: number;
    highlightFeeCents?: number;
    includedHighlightImpressions?: number;
    includedAdImpressions?: number;
    includedTransactions?: number;
    overagePerTxCents?: number;
    maxLocations?: number;
    maxEnrolledDevices?: number;
    maxLoyaltyMembers?: number;
    loyaltyMemberOverageCents?: number;
    maxConcurrentWsSessions?: number;
    maxActiveAdCampaigns?: number;
    includedPromoPushPerMonth?: number;
    promoPushOveragePerPushCents?: number;
    isVisible?: boolean;
    isActive?: boolean;
    isNeon?: boolean;
}
/**
 * A time-bound promotional price for a plan. Applies to NEW sign-ups only:
 * the active offer's price is snapshotted/locked onto the subscription at
 * opt-in (existing subscribers are unaffected). Ads/highlights are never on
 * offer here — they bill from day 1 at the plan's add-on fees.
 */
export interface PlanOffer {
    id: string;
    countryCode: string;
    tier: PlanTier;
    promoMonthlyFeeCents: number;
    promoAnnualFeeCents: number | null;
    startsAt: string;
    endsAt: string;
    note: string | null;
    createdAt: string;
}
export interface CreatePlanOfferInput {
    countryCode: string;
    tier: PlanTier;
    promoMonthlyFeeCents: number;
    promoAnnualFeeCents?: number | null;
    startsAt: string;
    endsAt: string;
    note?: string;
}
//# sourceMappingURL=subscription.d.ts.map