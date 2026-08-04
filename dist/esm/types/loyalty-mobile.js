// ──────────────────────────────────────────────
// TikalLoyalty Mobile App (Sprint 12.1 / FT-GROWTH-002)
// ──────────────────────────────────────────────
//
// Canonical contracts consumed by the `tikalpos-loyalty` React Native app
// against the loyalty-mobile endpoints in `tikalpos-backend/src/routes/
// loyalty-mobile.routes.ts`. Mirrors what the existing web portal under
// `tikalpos-web/src/pages/guest-auth/*` consumes, plus mobile-specific
// concerns: social auth providers, push topics, ad-carousel cards, and
// redemption holds (QR-based pre-authorizations).
export const LOYALTY_AUTH_PROVIDERS = [
    'GOOGLE',
    'APPLE',
    'EMAIL',
];
export function isLoyaltyAuthProvider(value) {
    return typeof value === 'string' && LOYALTY_AUTH_PROVIDERS.includes(value);
}
export const LOYALTY_TRANSACTION_KINDS = [
    'EARN',
    'REDEEM',
    'EXPIRY',
    'ADJUSTMENT',
    'CASHBACK_EARN',
    'CASHBACK_SPEND',
    'CASHBACK_EXPIRY',
];
export function isLoyaltyTransactionKind(value) {
    return typeof value === 'string' && LOYALTY_TRANSACTION_KINDS.includes(value);
}
export const LOYALTY_PUSH_TOPICS = [
    'REWARD_EXPIRING',
    'NEW_PROMOTION',
    'REDEMPTION_READY',
    'BALANCE_MILESTONE',
    'WELCOME',
    'ENGAGEMENT',
    'MODE_CHANGE',
    'BALANCE_EXPIRING',
];
export function isLoyaltyPushTopic(value) {
    return typeof value === 'string' && LOYALTY_PUSH_TOPICS.includes(value);
}
/** HTTP header the app sends on feed requests while demo mode is active. The
 *  backend honors it only when the authenticated guest is isDemo. */
export const DEMO_MODE_HEADER = 'x-demo-mode';
export const REVIEW_REPORT_REASONS = [
    'FALSE_DEFAMATORY',
    'ABUSIVE',
    'PERSONAL_DATA',
    'SPAM',
    'CONFLICT_OF_INTEREST',
    'EXTORTION',
    'OFF_TOPIC',
];
export function isReviewReportReason(value) {
    return typeof value === 'string' && REVIEW_REPORT_REASONS.includes(value);
}
/** System-admin dispute SLA (business days). */
export const REMOTE_REDEMPTION_DISPUTE_SLA_BUSINESS_DAYS = 5;
/** Escrow time windows (days), per the closed design. */
export const REMOTE_REDEMPTION_WINDOWS = {
    honorDays: 3, // merchant must enter the code within this
    autoConfirmDays: 7, // ghost backstop after PROCESSED
    snoozeCapDays: 30, // hard cap while the guest keeps postponing → dispute
};
//# sourceMappingURL=loyalty-mobile.js.map