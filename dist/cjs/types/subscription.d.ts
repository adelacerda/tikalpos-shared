export type PlanTier = 'STARTER' | 'PRO' | 'SCALE' | 'ENTERPRISE';
export declare const PLAN_TIERS: readonly PlanTier[];
export declare function isPlanTier(value: unknown): value is PlanTier;
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
    includedTransactions: number;
    overagePerTxCents: number;
    maxLocations: number;
    maxEnrolledDevices: number;
    maxLoyaltyMembers: number;
    maxConcurrentWsSessions: number;
    maxActiveAdCampaigns: number;
    adRevenueTakeRateBps: number;
    welcomeRewardVariantsMax: number;
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
    closedAt: string | null;
}
export type SubscriptionEventKind = 'CREATED' | 'TIER_CHANGED' | 'STATUS_CHANGED' | 'PERIOD_ROLLED' | 'MANUAL_SUSPEND' | 'MANUAL_REACTIVATE';
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
//# sourceMappingURL=subscription.d.ts.map