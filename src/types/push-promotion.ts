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
