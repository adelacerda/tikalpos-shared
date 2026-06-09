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

/** Who a push campaign may reach. */
export type PushPromotionTarget = 'NON_MEMBERS' | 'MEMBERS' | 'BOTH';

/** A push campaign a franchise created to promote a catalog reward. */
export interface PushPromotion {
  id: string;
  organizationId: string;
  /** The catalog reward this push promotes (deep-link target on tap). */
  rewardId: string;
  /** Notification title (merchant-authored). */
  title: string;
  /** Notification body (merchant-authored). */
  body: string;
  /** Eligible audience: acquisition, retention, or both. */
  target: PushPromotionTarget;
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
  rewardId: string;
  title: string;
  body: string;
  target: PushPromotionTarget;
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
