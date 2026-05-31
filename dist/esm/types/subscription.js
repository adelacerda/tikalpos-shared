// ──────────────────────────────────────────────
// Subscription Tiers & Multi-Line Monetization
// (FT-MONETIZATION-001, Sprint 11.1)
// ──────────────────────────────────────────────
//
// Canonical contracts for the TikalPOS subscription engine. Powers:
//   - Per-tenant plan tier (Starter / Pro / Scale / Enterprise)
//   - Hard limits per tier (locations, devices, loyalty members, WS sessions)
//   - Transaction quotas + per-tx overage in Q centavos
//   - Ad-carousel monetization slots (FT-GROWTH-017)
//     · campaign cap, take-rate basis-points, welcome-reward variant cap, segmentation kinds
//   - Promo push monetization slots (FT-GROWTH-017)
//     · included pushes/mo, overage cents/push, segmentation + scheduling kinds
//   - Usage tracking windows (one row per org × billing month)
//   - Audit log of subscription transitions
//   - Composite UsageSnapshot returned by subscriptionGuard for in-request checks
//
// Money convention: every monetary value is stored as integer Q centavos
// (the same convention used by tikalpos-backend's pricing arithmetic).
// 1 Q = 100 cents. Q 249/mes → 24_900.
export const PLAN_TIERS = ['STARTER', 'PRO', 'SCALE', 'ENTERPRISE'];
export function isPlanTier(value) {
    return typeof value === 'string' && PLAN_TIERS.includes(value);
}
export const BILLING_CYCLES = ['MONTHLY', 'ANNUAL'];
export function isBillingCycle(value) {
    return typeof value === 'string' && BILLING_CYCLES.includes(value);
}
export const SUBSCRIPTION_STATUSES = [
    'ACTIVE',
    'TRIAL',
    'PAST_DUE',
    'SUSPENDED',
    'CANCELED',
];
export function isSubscriptionStatus(value) {
    return typeof value === 'string' && SUBSCRIPTION_STATUSES.includes(value);
}
const UNLIMITED = 999999;
export const PLAN_LIMITS = {
    STARTER: {
        tier: 'STARTER',
        monthlyFeeCents: 24900,
        annualFeeCents: 239000,
        includedTransactions: 500,
        overagePerTxCents: 50,
        maxLocations: 1,
        maxEnrolledDevices: 1,
        maxLoyaltyMembers: 200,
        maxConcurrentWsSessions: 5,
        maxActiveAdCampaigns: 1,
        adRevenueTakeRateBps: 2500,
        welcomeRewardVariantsMax: 1,
        adSegmentationKinds: ['NONE'],
        includedPromoPushPerMonth: 0,
        promoPushOveragePerPushCents: 0,
        promoPushSegmentationKinds: ['NONE'],
        promoPushSchedulingKinds: [],
        loyaltyBoostFeeCents: 6000,
    },
    PRO: {
        tier: 'PRO',
        monthlyFeeCents: 74900,
        annualFeeCents: 719000,
        includedTransactions: 5000,
        overagePerTxCents: 30,
        maxLocations: 5,
        maxEnrolledDevices: 5,
        maxLoyaltyMembers: 2000,
        maxConcurrentWsSessions: 30,
        maxActiveAdCampaigns: 5,
        adRevenueTakeRateBps: 2000,
        welcomeRewardVariantsMax: 3,
        adSegmentationKinds: ['NONE', 'BY_TIER'],
        includedPromoPushPerMonth: 5000,
        promoPushOveragePerPushCents: 2,
        promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION'],
        promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED'],
        loyaltyBoostFeeCents: 5000,
    },
    SCALE: {
        tier: 'SCALE',
        monthlyFeeCents: 199900,
        annualFeeCents: 1919000,
        includedTransactions: 25000,
        overagePerTxCents: 20,
        maxLocations: 25,
        maxEnrolledDevices: 25,
        maxLoyaltyMembers: 20000,
        maxConcurrentWsSessions: 150,
        maxActiveAdCampaigns: 20,
        adRevenueTakeRateBps: 1500,
        welcomeRewardVariantsMax: 10,
        adSegmentationKinds: ['NONE', 'BY_TIER', 'BY_LOCATION', 'BY_CATEGORY'],
        includedPromoPushPerMonth: 50000,
        promoPushOveragePerPushCents: 2, // 1.5¢ rounds up to 2 for billing simplicity
        promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION', 'BY_LAST_VISIT', 'BY_PURCHASE'],
        promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED', 'RECURRING'],
        loyaltyBoostFeeCents: 4000,
    },
    ENTERPRISE: {
        tier: 'ENTERPRISE',
        monthlyFeeCents: 0, // negotiated per contract
        annualFeeCents: 0,
        includedTransactions: 0, // unlimited / negotiated
        overagePerTxCents: 0,
        maxLocations: UNLIMITED,
        maxEnrolledDevices: UNLIMITED,
        maxLoyaltyMembers: UNLIMITED,
        maxConcurrentWsSessions: UNLIMITED,
        maxActiveAdCampaigns: UNLIMITED,
        adRevenueTakeRateBps: 1000,
        welcomeRewardVariantsMax: UNLIMITED,
        adSegmentationKinds: ['NONE', 'BY_TIER', 'BY_LOCATION', 'BY_CATEGORY', 'CUSTOM_RULES'],
        includedPromoPushPerMonth: UNLIMITED,
        promoPushOveragePerPushCents: 0,
        promoPushSegmentationKinds: [
            'BY_TIER',
            'BY_LOCATION',
            'BY_LAST_VISIT',
            'BY_PURCHASE',
            'CUSTOM_RULES',
        ],
        promoPushSchedulingKinds: [
            'IMMEDIATE',
            'SCHEDULED',
            'RECURRING',
            'AB_TEST',
            'EVENT_TRIGGERED',
        ],
        loyaltyBoostFeeCents: 0, // negotiated per contract
    },
};
export const SUBSCRIPTION_EVENT_KINDS = [
    'CREATED',
    'TIER_CHANGED',
    'STATUS_CHANGED',
    'PERIOD_ROLLED',
    'MANUAL_SUSPEND',
    'MANUAL_REACTIVATE',
    'BOOST_CHARGED',
];
export function isSubscriptionEventKind(value) {
    return (typeof value === 'string' && SUBSCRIPTION_EVENT_KINDS.includes(value));
}
//# sourceMappingURL=subscription.js.map