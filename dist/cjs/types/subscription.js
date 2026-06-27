"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_EVENT_KINDS = exports.PLAN_LIMITS = exports.SUBSCRIPTION_STATUSES = exports.BILLING_CYCLES = exports.POS_PLAN_LADDER = exports.LOYALTY_PLAN_LADDER = exports.PLAN_TIERS = void 0;
exports.isPlanTier = isPlanTier;
exports.isLoyaltyOnlyPlan = isLoyaltyOnlyPlan;
exports.nextPlanInFamily = nextPlanInFamily;
exports.isBillingCycle = isBillingCycle;
exports.isSubscriptionStatus = isSubscriptionStatus;
exports.isSubscriptionEventKind = isSubscriptionEventKind;
exports.PLAN_TIERS = ['LOYALTY_LITE', 'LOYALTY_PRO', 'STARTER', 'PRO', 'SCALE', 'ENTERPRISE'];
function isPlanTier(value) {
    return typeof value === 'string' && exports.PLAN_TIERS.includes(value);
}
/**
 * Loyalty-only plans (no POS / menu / devices): LOYALTY_LITE and LOYALTY_PRO.
 * They share the exact same admin permissions and feature gating — only their
 * branch limit (maxLocations) differs. Use this everywhere a feature is gated
 * "is this a loyalty-only plan?" instead of comparing to 'LOYALTY_LITE'.
 */
function isLoyaltyOnlyPlan(tier) {
    return tier === 'LOYALTY_LITE' || tier === 'LOYALTY_PRO';
}
/** Plan families: a franchise should only be recommended to upgrade WITHIN its
 *  family (Loyalty → Loyalty, POS → POS). */
exports.LOYALTY_PLAN_LADDER = ['LOYALTY_LITE', 'LOYALTY_PRO'];
exports.POS_PLAN_LADDER = ['STARTER', 'PRO', 'SCALE', 'ENTERPRISE'];
/** The next plan up within the same family, or null if already at the top. */
function nextPlanInFamily(tier) {
    const ladder = isLoyaltyOnlyPlan(tier) ? exports.LOYALTY_PLAN_LADDER : exports.POS_PLAN_LADDER;
    const i = ladder.indexOf(tier);
    return i >= 0 && i < ladder.length - 1 ? ladder[i + 1] : null;
}
exports.BILLING_CYCLES = ['MONTHLY', 'ANNUAL'];
function isBillingCycle(value) {
    return typeof value === 'string' && exports.BILLING_CYCLES.includes(value);
}
exports.SUBSCRIPTION_STATUSES = [
    'ACTIVE',
    'TRIAL',
    'PAST_DUE',
    'SUSPENDED',
    'CANCELED',
];
function isSubscriptionStatus(value) {
    return typeof value === 'string' && exports.SUBSCRIPTION_STATUSES.includes(value);
}
const UNLIMITED = 999999;
exports.PLAN_LIMITS = {
    // Loyalty-only plan: no POS, no transaction billing — just the loyalty layer.
    LOYALTY_LITE: {
        tier: 'LOYALTY_LITE',
        includedHighlightImpressions: 500,
        includedAdImpressions: 500,
        monthlyFeeCents: 9900,
        annualFeeCents: 95000,
        trialDays: 14,
        adFeeCents: 8,
        highlightFeeCents: 40,
        includedTransactions: 0, // no POS transactions
        overagePerTxCents: 0,
        maxLocations: 1,
        maxEnrolledDevices: 0, // no POS devices
        maxLoyaltyMembers: 500,
        loyaltyMemberOverageCents: 40,
        maxConcurrentWsSessions: 5,
        maxActiveAdCampaigns: 1,
        adSegmentationKinds: ['NONE'],
        includedPromoPushPerMonth: 1000,
        promoPushOveragePerPushCents: 2,
        promoPushSegmentationKinds: ['NONE'],
        promoPushSchedulingKinds: ['IMMEDIATE'],
    },
    // Exact copy of LOYALTY_LITE — same admin permissions/feature gating — except
    // the branch limit is 5 (vs 1). Loyalty-only: no POS, no transaction billing.
    LOYALTY_PRO: {
        tier: 'LOYALTY_PRO',
        includedHighlightImpressions: 500,
        includedAdImpressions: 500,
        monthlyFeeCents: 9900,
        annualFeeCents: 95000,
        trialDays: 14,
        adFeeCents: 8,
        highlightFeeCents: 40,
        includedTransactions: 0, // no POS transactions
        overagePerTxCents: 0,
        maxLocations: 5, // ← only difference vs Loyalty Lite
        maxEnrolledDevices: 0, // no POS devices
        maxLoyaltyMembers: 500,
        loyaltyMemberOverageCents: 40,
        maxConcurrentWsSessions: 5,
        maxActiveAdCampaigns: 1,
        adSegmentationKinds: ['NONE'],
        includedPromoPushPerMonth: 1000,
        promoPushOveragePerPushCents: 2,
        promoPushSegmentationKinds: ['NONE'],
        promoPushSchedulingKinds: ['IMMEDIATE'],
    },
    STARTER: {
        tier: 'STARTER',
        includedHighlightImpressions: 1000,
        includedAdImpressions: 1000,
        monthlyFeeCents: 24900,
        annualFeeCents: 239000,
        trialDays: 14,
        adFeeCents: 8,
        highlightFeeCents: 40,
        includedTransactions: 500,
        overagePerTxCents: 50,
        maxLocations: 1,
        maxEnrolledDevices: 1,
        maxLoyaltyMembers: 200,
        loyaltyMemberOverageCents: 40,
        maxConcurrentWsSessions: 5,
        maxActiveAdCampaigns: 1,
        adSegmentationKinds: ['NONE'],
        includedPromoPushPerMonth: 0,
        promoPushOveragePerPushCents: 0,
        promoPushSegmentationKinds: ['NONE'],
        promoPushSchedulingKinds: [],
    },
    PRO: {
        tier: 'PRO',
        includedHighlightImpressions: 5000,
        includedAdImpressions: 5000,
        monthlyFeeCents: 74900,
        annualFeeCents: 719000,
        trialDays: 14,
        adFeeCents: 6,
        highlightFeeCents: 30,
        includedTransactions: 5000,
        overagePerTxCents: 30,
        maxLocations: 5,
        maxEnrolledDevices: 5,
        maxLoyaltyMembers: 2000,
        loyaltyMemberOverageCents: 40,
        maxConcurrentWsSessions: 30,
        maxActiveAdCampaigns: 5,
        adSegmentationKinds: ['NONE', 'BY_TIER'],
        includedPromoPushPerMonth: 5000,
        promoPushOveragePerPushCents: 2,
        promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION'],
        promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED'],
    },
    SCALE: {
        tier: 'SCALE',
        includedHighlightImpressions: 25000,
        includedAdImpressions: 25000,
        monthlyFeeCents: 199900,
        annualFeeCents: 1919000,
        trialDays: 14,
        adFeeCents: 4,
        highlightFeeCents: 20,
        includedTransactions: 25000,
        overagePerTxCents: 20,
        maxLocations: 25,
        maxEnrolledDevices: 25,
        maxLoyaltyMembers: 20000,
        loyaltyMemberOverageCents: 40,
        maxConcurrentWsSessions: 150,
        maxActiveAdCampaigns: 20,
        adSegmentationKinds: ['NONE', 'BY_TIER', 'BY_LOCATION', 'BY_CATEGORY'],
        includedPromoPushPerMonth: 50000,
        promoPushOveragePerPushCents: 2, // 1.5¢ rounds up to 2 for billing simplicity
        promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION', 'BY_LAST_VISIT', 'BY_PURCHASE'],
        promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED', 'RECURRING'],
    },
    ENTERPRISE: {
        tier: 'ENTERPRISE',
        includedHighlightImpressions: UNLIMITED,
        includedAdImpressions: UNLIMITED,
        monthlyFeeCents: 0, // negotiated per contract
        annualFeeCents: 0,
        trialDays: 0, // no trial — negotiated per contract
        adFeeCents: 0, // negotiated per contract
        highlightFeeCents: 0, // negotiated per contract
        includedTransactions: 0, // unlimited / negotiated
        overagePerTxCents: 0,
        maxLocations: UNLIMITED,
        maxEnrolledDevices: UNLIMITED,
        maxLoyaltyMembers: UNLIMITED,
        loyaltyMemberOverageCents: 0,
        maxConcurrentWsSessions: UNLIMITED,
        maxActiveAdCampaigns: UNLIMITED,
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
    },
};
exports.SUBSCRIPTION_EVENT_KINDS = [
    'CREATED',
    'TIER_CHANGED',
    'STATUS_CHANGED',
    'PERIOD_ROLLED',
    'MANUAL_SUSPEND',
    'MANUAL_REACTIVATE',
    'BOOST_CHARGED',
    'DISCOVERY_HIGHLIGHT_CHARGED',
];
function isSubscriptionEventKind(value) {
    return (typeof value === 'string' && exports.SUBSCRIPTION_EVENT_KINDS.includes(value));
}
//# sourceMappingURL=subscription.js.map