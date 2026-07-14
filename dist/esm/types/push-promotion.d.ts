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
    startsAt: string;
    endsAt: string;
    /** Per-delivery system rate snapshotted at opt-in. */
    lockedFeeCents: number;
    /** Optional hard cap on total deliveries (budget); null = unlimited window. */
    maxDeliveries: number | null;
    active: boolean;
    createdAt: string;
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
    startsAt: string;
    endsAt: string;
    maxDeliveries?: number | null;
}
/** True when a push campaign is live (active and within its window) at `now`. */
export declare function isPushPromotionActive(p: PushPromotion, now?: number): boolean;
/**
 * The `tikalpos://` deep-link a campaign opens on tap. REWARD points at the
 * reward; everything else (NONE, CASHBACK_BOOST) opens the franchise screen,
 * which already renders the active cashback boost. Single source of truth for
 * both the scheduler (send) and the web composer (preview).
 */
export declare function buildPushDeepLink(anchorType: PushPromotionAnchorType, organizationId: string, rewardId: string | null): string;
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
export interface CampaignProjection {
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
export declare function validateCampaignAnchor(input: {
    anchorType: PushPromotionAnchorType;
    rewardId?: string | null;
    cashbackBoost?: CampaignCashbackBoost | null;
    campaignStartsAt: string;
    campaignEndsAt: string;
}): CampaignAnchorValidation;
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
    startsAt: string;
    endsAt: string;
    createdAt: string;
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
export declare function pushRate(numerator: number, denominator: number): number;
//# sourceMappingURL=push-promotion.d.ts.map