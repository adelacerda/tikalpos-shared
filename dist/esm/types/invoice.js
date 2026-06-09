// Billing & Invoicing (Facturación) — see docs/feature-billing-invoicing.md.
// Invoices are internal billing records (no FEL yet). A period close (manual or
// the monthly cron) materializes an immutable Invoice with a full charge
// breakdown; payments are tracked in a ledger and the status is derived.
// ── Enums (UPPERCASE values, per repo convention) ────────────────────────────
export const INVOICE_STATUSES = [
    'OPEN',
    'PARTIALLY_PAID',
    'PAID',
    'OVERDUE',
    'VOID',
];
export const INVOICE_CLOSE_TYPES = ['MANUAL', 'AUTO'];
export const PAYMENT_METHODS = ['CARD', 'BANK_TRANSFER', 'CASH'];
// Canonical charge lines — every invoice carries all of them, even at 0.
// HIGHLIGHT_IMPRESSIONS is the Discovery-carousel "destacado" billed per
// impression/user/day; AD_IMPRESSIONS is the ad carousel billed the same way.
// (Legacy REWARD_BOOST / DISCOVERY_HIGHLIGHT channels were dropped — boosts were
// never charged and the discovery highlight is billed via HIGHLIGHT_IMPRESSIONS.)
export const INVOICE_LINE_KINDS = [
    'PLAN_FEE',
    'TRANSACTION_OVERAGE',
    'HIGHLIGHT_IMPRESSIONS',
    'AD_IMPRESSIONS',
    'PROMO_PUSH_OVERAGE',
];
// ── Type guards ──────────────────────────────────────────────────────────────
export function isInvoiceStatus(value) {
    return typeof value === 'string' && INVOICE_STATUSES.includes(value);
}
export function isInvoicePaymentMethod(value) {
    return typeof value === 'string' && PAYMENT_METHODS.includes(value);
}
//# sourceMappingURL=invoice.js.map