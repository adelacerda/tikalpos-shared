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

export type PlanTier = 'LOYALTY_LITE' | 'STARTER' | 'PRO' | 'SCALE' | 'ENTERPRISE';

export const PLAN_TIERS: readonly PlanTier[] = ['LOYALTY_LITE', 'STARTER', 'PRO', 'SCALE', 'ENTERPRISE'] as const;

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

  // Free trial before plan billing begins. 0 = no trial (e.g. ENTERPRISE).
  // Ads & highlights are NEVER on trial — they bill from day 1 regardless.
  trialDays: number;

  // Loyalty add-on impression fees, per plan (centavos per user/day impression).
  // Each plan INCLUDES an allotment of impressions in the monthly fee; only the
  // excess (used − included) is billed at period close, like transactions.
  adFeeCents: number;
  highlightFeeCents: number;
  includedHighlightImpressions: number;
  includedAdImpressions: number;

  // Transaction quota + overage
  includedTransactions: number;
  overagePerTxCents: number;

  // Hardware + capacity caps
  maxLocations: number;
  maxEnrolledDevices: number; // iOS/Android devices (web app does not count)
  maxLoyaltyMembers: number;
  maxConcurrentWsSessions: number; // concurrent chat sessions

  // FT-GROWTH-017 — Ad carousel monetization
  maxActiveAdCampaigns: number;
  adSegmentationKinds: readonly AdSegmentationKind[];

  // FT-GROWTH-017 — Promo push monetization
  includedPromoPushPerMonth: number;
  promoPushOveragePerPushCents: number;
  promoPushSegmentationKinds: readonly PushSegmentationKind[];
  promoPushSchedulingKinds: readonly PushSchedulingKind[];
}

const UNLIMITED = 999_999;

export const PLAN_LIMITS: Readonly<Record<PlanTier, PlanLimits>> = {
  // Loyalty-only plan: no POS, no transaction billing — just the loyalty layer.
  LOYALTY_LITE: {
    tier: 'LOYALTY_LITE',
    includedHighlightImpressions: 500,
    includedAdImpressions: 500,
    monthlyFeeCents: 9_900,
    annualFeeCents: 95_000,
    trialDays: 14,
    adFeeCents: 8,
    highlightFeeCents: 40,
    includedTransactions: 0, // no POS transactions
    overagePerTxCents: 0,
    maxLocations: 1,
    maxEnrolledDevices: 0, // no POS devices
    maxLoyaltyMembers: 500,
    maxConcurrentWsSessions: 5,
    maxActiveAdCampaigns: 1,
    adSegmentationKinds: ['NONE'],
    includedPromoPushPerMonth: 1_000,
    promoPushOveragePerPushCents: 2,
    promoPushSegmentationKinds: ['NONE'],
    promoPushSchedulingKinds: ['IMMEDIATE'],
  },
  STARTER: {
    tier: 'STARTER',
    includedHighlightImpressions: 1_000,
    includedAdImpressions: 1_000,
    monthlyFeeCents: 24_900,
    annualFeeCents: 239_000,
    trialDays: 14,
    adFeeCents: 8,
    highlightFeeCents: 40,
    includedTransactions: 500,
    overagePerTxCents: 50,
    maxLocations: 1,
    maxEnrolledDevices: 1,
    maxLoyaltyMembers: 200,
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
    includedHighlightImpressions: 5_000,
    includedAdImpressions: 5_000,
    monthlyFeeCents: 74_900,
    annualFeeCents: 719_000,
    trialDays: 14,
    adFeeCents: 6,
    highlightFeeCents: 30,
    includedTransactions: 5_000,
    overagePerTxCents: 30,
    maxLocations: 5,
    maxEnrolledDevices: 5,
    maxLoyaltyMembers: 2_000,
    maxConcurrentWsSessions: 30,
    maxActiveAdCampaigns: 5,
    adSegmentationKinds: ['NONE', 'BY_TIER'],
    includedPromoPushPerMonth: 5_000,
    promoPushOveragePerPushCents: 2,
    promoPushSegmentationKinds: ['BY_TIER', 'BY_LOCATION'],
    promoPushSchedulingKinds: ['IMMEDIATE', 'SCHEDULED'],
  },
  SCALE: {
    tier: 'SCALE',
    includedHighlightImpressions: 25_000,
    includedAdImpressions: 25_000,
    monthlyFeeCents: 199_900,
    annualFeeCents: 1_919_000,
    trialDays: 14,
    adFeeCents: 4,
    highlightFeeCents: 20,
    includedTransactions: 25_000,
    overagePerTxCents: 20,
    maxLocations: 25,
    maxEnrolledDevices: 25,
    maxLoyaltyMembers: 20_000,
    maxConcurrentWsSessions: 150,
    maxActiveAdCampaigns: 20,
    adSegmentationKinds: ['NONE', 'BY_TIER', 'BY_LOCATION', 'BY_CATEGORY'],
    includedPromoPushPerMonth: 50_000,
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

  // FT-GROWTH-017 §Canal 2 — featured reward boosts
  boostCount: number;
  boostChargeCents: number;

  // Discovery Carousel — paid neon highlight (per-user/day impression billing).
  // One impression per franchise per user per day, charged at the opt-in's
  // locked fee.
  discoveryHighlightCount: number;
  discoveryHighlightChargeCents: number;

  closedAt: string | null; // set by the cron job at month-end close
}

// ── Subscription event audit log ──────────────────────────────────────────

export type SubscriptionEventKind =
  | 'CREATED'
  | 'TIER_CHANGED'
  | 'STATUS_CHANGED'
  | 'PERIOD_ROLLED'
  | 'MANUAL_SUSPEND'
  | 'MANUAL_REACTIVATE'
  | 'BOOST_CHARGED'
  | 'DISCOVERY_HIGHLIGHT_CHARGED';

export const SUBSCRIPTION_EVENT_KINDS: readonly SubscriptionEventKind[] = [
  'CREATED',
  'TIER_CHANGED',
  'STATUS_CHANGED',
  'PERIOD_ROLLED',
  'MANUAL_SUSPEND',
  'MANUAL_REACTIVATE',
  'BOOST_CHARGED',
  'DISCOVERY_HIGHLIGHT_CHARGED',
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

// ── Editable plan pricing (system-admin) ──────────────────────────────────
// PLAN_LIMITS above is the seed/default. The live, editable values live in the
// DB and are surfaced through these types for the system-admin pricing screen
// and the public website pricing endpoint.

/**
 * A plan's live pricing/limits row (DB-backed, editable). Mirrors PlanLimits.
 * Pricing is per-country: one row per (countryCode, tier). Money values are in
 * the country's currency (centavos). `currency` is the ISO code (e.g. 'GTQ').
 */
export interface PlanPricing extends PlanLimits {
  countryCode: string; // ISO-3166 alpha-2 (e.g. 'GT')
  currency: string; // ISO-4217 (e.g. 'GTQ')
  updatedAt: string; // ISO 8601
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
  maxConcurrentWsSessions?: number;
  maxActiveAdCampaigns?: number;
  includedPromoPushPerMonth?: number;
  promoPushOveragePerPushCents?: number;
}

/**
 * A time-bound promotional price for a plan. Applies to NEW sign-ups only:
 * the active offer's price is snapshotted/locked onto the subscription at
 * opt-in (existing subscribers are unaffected). Ads/highlights are never on
 * offer here — they bill from day 1 at the plan's add-on fees.
 */
export interface PlanOffer {
  id: string;
  countryCode: string; // ISO-3166 alpha-2 — offer applies to this country's catalog
  tier: PlanTier;
  promoMonthlyFeeCents: number;
  promoAnnualFeeCents: number | null; // null = offer applies to monthly only
  startsAt: string; // ISO 8601 — inclusive
  endsAt: string; // ISO 8601 — exclusive
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
