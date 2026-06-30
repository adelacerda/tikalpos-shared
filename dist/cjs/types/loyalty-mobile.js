"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVIEW_REPORT_REASONS = exports.DEMO_MODE_HEADER = exports.LOYALTY_PUSH_TOPICS = exports.LOYALTY_TRANSACTION_KINDS = exports.LOYALTY_AUTH_PROVIDERS = void 0;
exports.isLoyaltyAuthProvider = isLoyaltyAuthProvider;
exports.isLoyaltyTransactionKind = isLoyaltyTransactionKind;
exports.isLoyaltyPushTopic = isLoyaltyPushTopic;
exports.isReviewReportReason = isReviewReportReason;
exports.LOYALTY_AUTH_PROVIDERS = [
    'GOOGLE',
    'APPLE',
    'EMAIL',
];
function isLoyaltyAuthProvider(value) {
    return typeof value === 'string' && exports.LOYALTY_AUTH_PROVIDERS.includes(value);
}
exports.LOYALTY_TRANSACTION_KINDS = [
    'EARN',
    'REDEEM',
    'EXPIRY',
    'ADJUSTMENT',
    'CASHBACK_EARN',
    'CASHBACK_SPEND',
];
function isLoyaltyTransactionKind(value) {
    return typeof value === 'string' && exports.LOYALTY_TRANSACTION_KINDS.includes(value);
}
exports.LOYALTY_PUSH_TOPICS = [
    'REWARD_EXPIRING',
    'NEW_PROMOTION',
    'REDEMPTION_READY',
    'BALANCE_MILESTONE',
    'WELCOME',
    'ENGAGEMENT',
    'MODE_CHANGE',
    'BALANCE_EXPIRING',
];
function isLoyaltyPushTopic(value) {
    return typeof value === 'string' && exports.LOYALTY_PUSH_TOPICS.includes(value);
}
/** HTTP header the app sends on feed requests while demo mode is active. The
 *  backend honors it only when the authenticated guest is isDemo. */
exports.DEMO_MODE_HEADER = 'x-demo-mode';
exports.REVIEW_REPORT_REASONS = [
    'FALSE_DEFAMATORY',
    'ABUSIVE',
    'PERSONAL_DATA',
    'SPAM',
    'CONFLICT_OF_INTEREST',
    'EXTORTION',
    'OFF_TOPIC',
];
function isReviewReportReason(value) {
    return typeof value === 'string' && exports.REVIEW_REPORT_REASONS.includes(value);
}
//# sourceMappingURL=loyalty-mobile.js.map