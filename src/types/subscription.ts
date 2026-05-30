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

// ── Plan tiers and billing ────────────────────────────────────────────────

export type PlanTier = 'STARTER' | 'PRO' | 'SCALE' | 'ENTERPRISE';

export const PLAN_TIERS: readonly PlanTier[] = ['STARTER', 'PRO', 'SCALE', 'ENTERPRISE'] as const;

export function isPlanTier(value: unknown): value is PlanTier {
  return typeof value === 'string' && (PLAN_TIERS as readonly string[]).includes(value);
}

export type BillingCycle = 'MONTHLY' | 'ANNUAL';

export const BILLING_CYCLES: readonly BillingCycle[] = ['MONTHLY', 'ANNUAL'] as const;

export function isBillingCycle(value: unknown): value is BillingCycle {
  return typeof value === 'string' && (BILLING_CYCLES as readonly string[]).includes(value);
}

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIAL'
  | 'PAST_DUE'
  | 'SUSPENDED'
  | 'CANCELED';

export const SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = [
  'ACTIVE',
  'TRIAL',
  'PAST_DUE',
  'SUSPENDED',
  'CANCELED',
] as const;

export function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return typeof value === 'string' && (SUBSCRIPTION_STATUSES as readonly string[]).includes(value);
}

// ── Segmentation + scheduling kinds (referenced by PlanLimits) ────────────

export type AdSegmentationKind =
  | 'NONE'
  | 'BY_TIER'
  | 'BY_LOCATION'
  | 'BY_CATEGORY'
  | 'CUSTOM_RULES';

export type PushSegmentationKind =
  | 'NONE'
  | 'BY_TIER'
  | 'BY_LOCATION'
  | 'BY_LAST_VISIT'
  | 'BY_PURCHASE'
  | 'CUSTOM_RULES';

export type PushSchedulingKind =
  | 'IMMEDIATE'
  | 'SCHEDULED'
  | 'RECURRING'
  | 'AB_TEST'
  | 'EVENT_TRIGGERED';

// ── Plan limits ───────────────────────────────────────────────────────────

export interface PlanLimits {
  tier: PlanTier;

  // Pricing — all values are Q centavos
  monthlyFeeCents: number;
  annualFeeCents: number;

  // Transaction quota + overage
  includedTransactions: number;
  overagePerTxCents: number;

  // Hardware + capacity caps
  maxLocations: number;
  maxEnrolledDevices: number;
  maxLoyaltyMembers: number;
  maxConcurrentWsSessions: number;

  // FT-GROWTH-017 — Ad carousel monetization
  maxActiveAdCampaigns: number;
  adRevenueTakeRateBps: number; // 2500 = 25%
  welcomeRewardVariantsMax: number;
  adSegmentationKinds: readonly AdSegmentationKind[];

  // FT-GROWTH-017 — Promo push monetization
  includedPromoPushPerMonth: number;
  promoPushOveragePerPushCents: number;
  promoPushSegmentationKinds: readonly PushSegmentationKind[];
  promoPushSchedulingKinds: readonly PushSchedulingKind[];
}

const UNLIMITED = 999_999;

export const PLAN_LIMITS: Readonly<Record<PlanTier, PlanLimits>> = {
  STARTER: {
    tier: 'STARTER',
    monthlyFeeCents: 24_900,
    annualFeeCents: 239_000,
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
  },
  PRO: {
    tier: 'PRO',
    monthlyFeeCents: 74_900,
    annualFeeCents: 719_000,
    includedTransactions: 5_000,
    overagePerTxCents: 30,
    maxLocations: 5,
    maxEnrolledDevices: 5,
    maxLoyaltyMembers: 2_000,
    maxConcurrentWsSessions: 30,
    maxActiveAdCampaigns: 5,
    adRevenueTakeRateBps: 2000,
    welcomeRewardVariantsMax: 3,
    adSegmentationKinds: ['NONE', 'BY_TIER'],
    includedPromoPushPerMonth: 5_000,
    promoPushOveragePerPushCents: 2,
    promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION'],
    promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED'],
  },
  SCALE: {
    tier: 'SCALE',
    monthlyFeeCents: 199_900,
    annualFeeCents: 1_919_000,
    includedTransactions: 25_000,
    overagePerTxCents: 20,
    maxLocations: 25,
    maxEnrolledDevices: 25,
    maxLoyaltyMembers: 20_000,
    maxConcurrentWsSessions: 150,
    maxActiveAdCampaigns: 20,
    adRevenueTakeRateBps: 1500,
    welcomeRewardVariantsMax: 10,
    adSegmentationKinds: ['NONE', 'BY_TIER', 'BY_LOCATION', 'BY_CATEGORY'],
    includedPromoPushPerMonth: 50_000,
    promoPushOveragePerPushCents: 2, // 1.5¢ rounds up to 2 for billing simplicity
    promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION', 'BY_LAST_VISIT', 'BY_PURCHASE'],
    promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED', 'RECURRING'],
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
  },
} as const;

// ── Subscription record ───────────────────────────────────────────────────

export interface Subscription {
  organizationId: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  currentPeriodStart: string; // ISO 8601
  currentPeriodEnd: string; // ISO 8601
  trialEndsAt: string | null;
  suspendedAt: string | null;
  suspendedReason: string | null;
  billingMetadata: Record<string, unknown> | null;
}

// ── Usage tracking ────────────────────────────────────────────────────────

export interface UsageWindow {
  organizationId: string;
  windowStart: string; // ISO — first instant of the billing month
  windowEnd: string; // ISO

  // Transaction counters (Order.status PAID transitions)
  transactionCount: number;
  overageCount: number;
  overageAmountCents: number;

  // Hardware peak observed during the window
  enrolledDeviceCount: number;
  concurrentWsPeak: number;

  // FT-GROWTH-017 — ad carousel
  adCampaignsActiveCount: number;
  adSpendCents: number;
  adFeeRevenueCents: number;

  // FT-GROWTH-017 — promo push
  promoPushCount: number;
  promoPushOverageCount: number;
  promoPushOverageCents: number;

  closedAt: string | null; // set by the cron job at month-end close
}

// ── Subscription event audit log ──────────────────────────────────────────

export type SubscriptionEventKind =
  | 'CREATED'
  | 'TIER_CHANGED'
  | 'STATUS_CHANGED'
  | 'PERIOD_ROLLED'
  | 'MANUAL_SUSPEND'
  | 'MANUAL_REACTIVATE';

export const SUBSCRIPTION_EVENT_KINDS: readonly SubscriptionEventKind[] = [
  'CREATED',
  'TIER_CHANGED',
  'STATUS_CHANGED',
  'PERIOD_ROLLED',
  'MANUAL_SUSPEND',
  'MANUAL_REACTIVATE',
] as const;

export function isSubscriptionEventKind(value: unknown): value is SubscriptionEventKind {
  return (
    typeof value === 'string' && (SUBSCRIPTION_EVENT_KINDS as readonly string[]).includes(value)
  );
}

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

// ── Composite snapshot returned by the guard middleware ───────────────────

export interface UsageSnapshot {
  subscription: Subscription;
  limits: PlanLimits;
  current: UsageWindow;
  remainingTransactions: number; // max(0, includedTransactions − transactionCount)
  isOverLimit: boolean;
  isHardBlocked: boolean; // SUSPENDED or CANCELED
  isSoftOverage: boolean; // ACTIVE but past includedTransactions
}

// ── Inputs for super-admin endpoints ──────────────────────────────────────

export interface UpdateSubscriptionInput {
  tier?: PlanTier;
  billingCycle?: BillingCycle;
  status?: SubscriptionStatus;
  reason?: string;
  suspendUntil?: string; // ISO
}

export interface ListUsageWindowsQuery {
  months?: number; // how many windows back to return; default 6
}

export interface ListSubscriptionEventsQuery {
  cursor?: string; // ISO of createdAt to paginate from
  limit?: number; // default 50, max 200
}
