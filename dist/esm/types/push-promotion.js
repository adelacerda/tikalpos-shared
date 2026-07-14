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
/** True when a push campaign is live (active and within its window) at `now`. */
export function isPushPromotionActive(p, now = Date.now()) {
    return (p.active === true &&
        typeof p.startsAt === 'string' &&
        typeof p.endsAt === 'string' &&
        new Date(p.startsAt).getTime() <= now &&
        new Date(p.endsAt).getTime() > now);
}
/**
 * The `tikalpos://` deep-link a campaign opens on tap. REWARD points at the
 * reward; everything else (NONE, CASHBACK_BOOST) opens the franchise screen,
 * which already renders the active cashback boost. Single source of truth for
 * both the scheduler (send) and the web composer (preview).
 */
export function buildPushDeepLink(anchorType, organizationId, rewardId) {
    if (anchorType === 'REWARD' && rewardId) {
        return `tikalpos://reward/${organizationId}/${rewardId}`;
    }
    return `tikalpos://franchise/${organizationId}`;
}
/**
 * Validate a campaign's anchor against its own run window. Advertising a boost
 * BEFORE or overlapping it is valid (that's the point — announce a December
 * boost in November); only warn when the campaign runs entirely AFTER the
 * anchor has already expired. Blocks when a REWARD anchor has no reward, or a
 * CASHBACK_BOOST anchor points at a boost that is not configured.
 */
export function validateCampaignAnchor(input) {
    if (input.anchorType === 'NONE')
        return { ok: true };
    if (input.anchorType === 'REWARD') {
        return input.rewardId ? { ok: true } : { ok: false, error: 'REWARD_REQUIRED' };
    }
    // CASHBACK_BOOST
    const boost = input.cashbackBoost;
    const configured = !!boost && !!boost.multiplier && boost.multiplier > 1 && !!boost.startsAt && !!boost.endsAt;
    if (!configured)
        return { ok: false, error: 'CASHBACK_BOOST_NOT_CONFIGURED' };
    const boostEnd = Date.parse(boost.endsAt);
    const campaignStart = Date.parse(input.campaignStartsAt);
    if (!Number.isNaN(boostEnd) && !Number.isNaN(campaignStart) && campaignStart > boostEnd) {
        return { ok: true, warning: 'CAMPAIGN_ENTIRELY_AFTER_ANCHOR_EXPIRY' };
    }
    return { ok: true };
}
/** Ratio helper — 0 when the denominator is 0, so a rate never yields NaN. */
export function pushRate(numerator, denominator) {
    if (denominator <= 0)
        return 0;
    return numerator / denominator;
}
//# sourceMappingURL=push-promotion.js.map