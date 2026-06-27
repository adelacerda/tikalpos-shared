"use strict";
// Billing & Invoicing (Facturación) — see docs/feature-billing-invoicing.md.
// Invoices are internal billing records (no FEL yet). A period close (manual or
// the monthly cron) materializes an immutable Invoice with a full charge
// breakdown; payments are tracked in a ledger and the status is derived.
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVOICE_LINE_KINDS = exports.PAYMENT_METHODS = exports.INVOICE_CLOSE_TYPES = exports.INVOICE_STATUSES = void 0;
exports.isInvoiceStatus = isInvoiceStatus;
exports.isInvoicePaymentMethod = isInvoicePaymentMethod;
// ── Enums (UPPERCASE values, per repo convention) ────────────────────────────
exports.INVOICE_STATUSES = [
    'OPEN',
    'PARTIALLY_PAID',
    'PAID',
    'OVERDUE',
    'VOID',
];
exports.INVOICE_CLOSE_TYPES = ['MANUAL', 'AUTO'];
exports.PAYMENT_METHODS = ['CARD', 'BANK_TRANSFER', 'CASH'];
// Canonical charge lines — every invoice carries all of them, even at 0.
// HIGHLIGHT_IMPRESSIONS is the Discovery-carousel "destacado" billed per
// impression/user/day; AD_IMPRESSIONS is the ad carousel billed the same way.
// (Legacy REWARD_BOOST / DISCOVERY_HIGHLIGHT channels were dropped — boosts were
// never charged and the discovery highlight is billed via HIGHLIGHT_IMPRESSIONS.)
exports.INVOICE_LINE_KINDS = [
    'PLAN_FEE',
    'TRANSACTION_OVERAGE',
    'HIGHLIGHT_IMPRESSIONS',
    'AD_IMPRESSIONS',
    'PROMO_PUSH_OVERAGE',
    'LOYALTY_MEMBER_OVERAGE',
];
// ── Type guards ──────────────────────────────────────────────────────────────
function isInvoiceStatus(value) {
    return typeof value === 'string' && exports.INVOICE_STATUSES.includes(value);
}
function isInvoicePaymentMethod(value) {
    return typeof value === 'string' && exports.PAYMENT_METHODS.includes(value);
}
//# sourceMappingURL=invoice.js.map