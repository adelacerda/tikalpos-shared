// Push Promotion system — FT-GROWTH-017 / reward-wizard.
//
// A franchise can promote a reward via push notification to TikalLoyalty users.
// Unlike highlight/ad (pull surfaces the user scrolls into view), push is an
// OUTBOUND message, so it is gated hard:
//   - opt-in only (Apple App Store guideline 4.5.4 — marketing push needs
//     explicit consent; transactional push is a separate channel),
//   - a global per-user frequency cap (across ALL franchises),
//   - quiet hours in the RECIPIENT's local time (the matched branch timezone),
//   - city-matched targeting: only users whose profile city has an active
//     branch where the reward is valid,
//   - per-franchise mute and an anti-repeat window.
// Sends rotate fairly across a queue of active promotions — no auction; the
// scarce per-user slot is shared round-robin. Billing mirrors the loyalty ad:
// a per-DELIVERY fee snapshotted at opt-in (`lockedFeeCents`), drawn first from
// the plan's included monthly quota, with overage billed per push.

import { LoyaltyTier } from './tenant';

/** Who a push campaign may reach. */
export type PushPromotionTarget = 'NON_MEMBERS' | 'MEMBERS' | 'BOTH';

/**
 * What a campaign is "about" — decides the tap deep-link and copy pre-fill:
 *   - NONE          → free-form message, deep-links to the franchise screen.
 *   - REWARD        → promotes a catalog reward, deep-links to that reward.
 *   - CASHBACK_BOOST→ announces the org's scheduled cashback boost (a single
 *                     slot on the loyalty rule), deep-links to the franchise
 *                     screen (which already surfaces the active boost).
 */
export type PushPromotionAnchorType = 'NONE' | 'REWARD' | 'CASHBACK_BOOST';

/** A push campaign a franchise created to reach loyalty users. */
export interface PushPromotion {
  id: string;
  organizationId: string;
  /** What this campaign is anchored to (drives deep-link + copy pre-fill). */
  anchorType: PushPromotionAnchorType;
  /** The catalog reward this push promotes; null unless `anchorType === 'REWARD'`. */
  rewardId: string | null;
  /** Notification title (merchant-authored). */
  title: string;
  /** Notification body (merchant-authored). */
  body: string;
  /** Eligible audience: acquisition, retention, or both. */
  target: PushPromotionTarget;
  /** Restrict the MEMBER side to a single tier (e.g. GOLD); null = all tiers. Ignored for non-members. */
  memberTier: LoyaltyTier | null;
  startsAt: string; // ISO-8601 — run window / opt-in
  endsAt: string; // ISO-8601
  /** Per-delivery system rate snapshotted at opt-in. */
  lockedFeeCents: number;
  /** Optional hard cap on total deliveries (budget); null = unlimited window. */
  maxDeliveries: number | null;
  active: boolean;
  createdAt: string; // ISO-8601
}

/** Merchant-supplied fields when creating a push campaign. */
export interface CreatePushPromotionInput {
  anchorType: PushPromotionAnchorType;
  /** Required when `anchorType === 'REWARD'`, otherwise omitted/null. */
  rewardId?: string | null;
  title: string;
  body: string;
  target: PushPromotionTarget;
  /** Optional single-tier filter for the member audience; null/omitted = all tiers. */
  memberTier?: LoyaltyTier | null;
  startsAt: string; // ISO-8601
  endsAt: string; // ISO-8601
  maxDeliveries?: number | null;
}

/** True when a push campaign is live (active and within its window) at `now`. */
export function isPushPromotionActive(p: PushPromotion, now: number = Date.now()): boolean {
  return (
    p.active === true &&
    typeof p.startsAt === 'string' &&
    typeof p.endsAt === 'string' &&
    new Date(p.startsAt).getTime() <= now &&
    new Date(p.endsAt).getTime() > now
  );
}

/**
 * The `tikalpos://` deep-link a campaign opens on tap. REWARD points at the
 * reward; everything else (NONE, CASHBACK_BOOST) opens the franchise screen,
 * which already renders the active cashback boost. Single source of truth for
 * both the scheduler (send) and the web composer (preview).
 */
export function buildPushDeepLink(
  anchorType: PushPromotionAnchorType,
  organizationId: string,
  rewardId: string | null,
): string {
  if (anchorType === 'REWARD' && rewardId) {
    return `tikalpos://reward/${organizationId}/${rewardId}`;
  }
  return `tikalpos://franchise/${organizationId}`;
}

/** The scheduled cashback boost a campaign may announce (subset of the rule config). */
export interface CampaignCashbackBoost {
  multiplier: number | null;
  startsAt: string | null;
  endsAt: string | null;
}

/** One send batch (deterministic assigned-hour bucket) for the current viewing day. */
export interface CampaignBatch {
  /** Local hour [10-19] of the branch's send window. */
  hour: number;
  /** Pending recipients assigned to this hour. */
  count: number;
  /** True when this hour already passed today (its people roll to the same slot tomorrow). */
  passed: boolean;
}

/**
 * Live projection of a campaign's reach + TODAY's send batches. Recomputed on
 * every read, relative to the day the owner opens it — so entering tomorrow shows
 * tomorrow's batches over whoever is still pending. It is an estimate: frequency
 * caps and anti-repeat may defer some recipients to a later day.
 */
/** Effective run state, mirroring what the scheduler actually acts on. */
export type CampaignRunStatus = 'RUNNING' | 'NOT_STARTED' | 'ENDED' | 'PAUSED';

/** Why nothing sends today while the campaign is RUNNING. */
export type CampaignPendingReason = 'NONE' | 'ALL_IN_COOLDOWN' | 'NO_RECIPIENTS' | 'NO_CITY';

export interface CampaignProjection {
  /**
   * Effective state the scheduler acts on: PAUSED (active=false), NOT_STARTED
   * (before startsAt), ENDED (at/after endsAt), or RUNNING. Only RUNNING can
   * send; the others always have empty batches.
   */
  status: CampaignRunStatus;
  /** When RUNNING but nothing goes out today, the reason (else 'NONE'). */
  pendingReason: CampaignPendingReason;
  /** Total eligible recipients (opt-in + city + audience/tier + push token − muted). */
  estimatedReach: number;
  /** Actually delivered so far, across all days. */
  delivered: number;
  /**
   * Eligible recipients NOT currently in the merchant's anti-repeat cooldown
   * (i.e. able to fire today) — the pool the batches draw from. Recipients in
   * cooldown re-enter once it lapses, since the engine has no per-campaign dedup.
   */
  pending: number;
  /** Campaign run window end (ISO) — the campaign keeps sending until this date. */
  campaignEndsAt: string;
  /** Representative branch timezone the batch hours are expressed in. */
  timezone: string;
  /** The viewing day (YYYY-MM-DD) in `timezone` — what "today's batches" refers to. */
  today: string;
  windowStartHour: number;
  windowEndHour: number;
  /** Pending recipients bucketed by their deterministic assigned hour, for `today`. */
  batches: CampaignBatch[];
}

export interface CampaignAnchorValidation {
  ok: boolean;
  /** Hard error — block submit. */
  error?: 'REWARD_REQUIRED' | 'CASHBACK_BOOST_NOT_CONFIGURED';
  /** Soft warning — allow submit, surface an alert. */
  warning?: 'CAMPAIGN_ENTIRELY_AFTER_ANCHOR_EXPIRY';
}

/**
 * Validate a campaign's anchor against its own run window. Advertising a boost
 * BEFORE or overlapping it is valid (that's the point — announce a December
 * boost in November); only warn when the campaign runs entirely AFTER the
 * anchor has already expired. Blocks when a REWARD anchor has no reward, or a
 * CASHBACK_BOOST anchor points at a boost that is not configured.
 */
export function validateCampaignAnchor(input: {
  anchorType: PushPromotionAnchorType;
  rewardId?: string | null;
  cashbackBoost?: CampaignCashbackBoost | null;
  campaignStartsAt: string;
  campaignEndsAt: string;
}): CampaignAnchorValidation {
  if (input.anchorType === 'NONE') return { ok: true };

  if (input.anchorType === 'REWARD') {
    return input.rewardId ? { ok: true } : { ok: false, error: 'REWARD_REQUIRED' };
  }

  // CASHBACK_BOOST
  const boost = input.cashbackBoost;
  const configured = !!boost && !!boost.multiplier && boost.multiplier > 1 && !!boost.startsAt && !!boost.endsAt;
  if (!configured) return { ok: false, error: 'CASHBACK_BOOST_NOT_CONFIGURED' };

  const boostEnd = Date.parse(boost!.endsAt!);
  const campaignStart = Date.parse(input.campaignStartsAt);
  if (!Number.isNaN(boostEnd) && !Number.isNaN(campaignStart) && campaignStart > boostEnd) {
    return { ok: true, warning: 'CAMPAIGN_ENTIRELY_AFTER_ANCHOR_EXPIRY' };
  }
  return { ok: true };
}

// ── System-admin campaign report (cross-franchise) ───────────────────────────
//
// Rolls the send ledger (PushPromotionSend) up per campaign. Three distinct
// counts, in narrowing order — never conflate them:
//   sent      → rows written (an attempt)
//   delivered → Expo receipt OK; the message reached the device. THE BILLABLE
//               SIGNAL. It does NOT mean anyone looked at it.
//   tapped    → the recipient actually opened the app from the notification.
// Money mirrors billing: each delivery is free while the org is under its plan's
// included monthly quota, and billed at `lockedFeeCents` past it.

/** Campaign run-window state, relative to now. */
export type PushCampaignStatusFilter = 'ALL' | 'ACTIVE' | 'ENDED' | 'SCHEDULED';

/** Filters for the system-admin push campaign report. */
export interface PushCampaignReportQuery {
  /** ISO-8601. Filters the send ledger by `sentAt` (inclusive). */
  from?: string;
  to?: string;
  /** Restrict to one franchise; omit for all. */
  organizationId?: string;
  /** Campaign run-window state. */
  status?: PushCampaignStatusFilter;
  /** Audience the campaign targeted. */
  target?: PushPromotionTarget | 'ALL';
  /** What the campaign was anchored to. */
  anchorType?: PushPromotionAnchorType | 'ALL';
  /** Free-text match against campaign title/body and franchise name. */
  search?: string;
}

/** One campaign's delivery + effectiveness rollup. */
export interface PushCampaignReportRow {
  promotionId: string;
  organizationId: string;
  organizationName: string;
  title: string;
  body: string;
  anchorType: PushPromotionAnchorType;
  target: PushPromotionTarget;
  memberTier: LoyaltyTier | null;
  startsAt: string; // ISO-8601
  endsAt: string; // ISO-8601
  createdAt: string; // ISO-8601
  /** Rotation cursor — when this campaign last pushed. */
  lastSentAt: string | null;
  active: boolean;
  /** Budget cap on deliveries; null = limited by the window only. */
  maxDeliveries: number | null;

  /** Attempts written to the send ledger. */
  sent: number;
  /** Reached the device (Expo receipt OK) — the billable signal. */
  delivered: number;
  /** Recipients who opened the app from this campaign's notification. */
  tapped: number;
  /** delivered / sent, 0..1 (0 when sent = 0). */
  deliveryRate: number;
  /** tapped / delivered, 0..1 (0 when delivered = 0) — the campaign's CTR. */
  tapRate: number;

  /** Deliveries absorbed by the plan's included monthly quota (billed Q0). */
  freeDeliveries: number;
  /** Deliveries billed at the overage rate. */
  chargedDeliveries: number;
  /** Total billed for this campaign, in cents. */
  chargedCents: number;
  /** Per-delivery overage rate snapshotted at opt-in. */
  lockedFeeCents: number;
}

/** Roll-up counters shared by a franchise subtotal and the platform total. */
export interface PushCampaignTotals {
  campaigns: number;
  sent: number;
  delivered: number;
  tapped: number;
  deliveryRate: number;
  tapRate: number;
  freeDeliveries: number;
  chargedDeliveries: number;
  chargedCents: number;
}

/** Platform-wide totals across every campaign matching the filters. */
export type PushCampaignReportTotals = PushCampaignTotals;

/** One franchise and every campaign it sent in the filtered period. */
export interface PushCampaignOrgGroup {
  organizationId: string;
  organizationName: string;
  /** Subtotals across this franchise's campaigns. */
  totals: PushCampaignTotals;
  /**
   * Fatigue signal: guests who silenced THIS franchise's promo push. A spike
   * means it's burning the shared user base — worth acting on before users kill
   * the global opt-in. Not date-filtered (it's a current standing count).
   */
  mutes: number;
  /** This franchise's campaigns, most recently sent first. */
  campaigns: PushCampaignReportRow[];
}

export interface PushCampaignReport {
  /** Franchises, busiest first (by deliveries). */
  groups: PushCampaignOrgGroup[];
  totals: PushCampaignReportTotals;
}

/** Ratio helper — 0 when the denominator is 0, so a rate never yields NaN. */
export function pushRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}
