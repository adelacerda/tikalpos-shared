import type { PlanTier, BillingCycle } from './subscription';
export declare const INVOICE_STATUSES: readonly ["OPEN", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export declare const INVOICE_CLOSE_TYPES: readonly ["MANUAL", "AUTO"];
export type InvoiceCloseType = (typeof INVOICE_CLOSE_TYPES)[number];
export declare const PAYMENT_METHODS: readonly ["CARD", "BANK_TRANSFER", "CASH"];
export type InvoicePaymentMethod = (typeof PAYMENT_METHODS)[number];
export declare const INVOICE_LINE_KINDS: readonly ["PLAN_FEE", "TRANSACTION_OVERAGE", "HIGHLIGHT_IMPRESSIONS", "AD_IMPRESSIONS", "PROMO_PUSH_OVERAGE", "LOYALTY_MEMBER_OVERAGE"];
export type InvoiceLineKind = (typeof INVOICE_LINE_KINDS)[number];
export interface InvoiceLineItem {
    kind: InvoiceLineKind;
    /** Human-readable label (localized at the UI layer; raw label stored as fallback). */
    label: string;
    /** Units billed (e.g. overage transactions, excess impressions). 0 when N/A. */
    quantity: number;
    /** Price per unit in centavos (0 for flat or non-applicable lines). */
    unitPriceCents: number;
    /** Line total in centavos. Always present; 0 when the line does not apply. */
    amountCents: number;
}
export interface InvoicePayment {
    id: string;
    invoiceId: string;
    method: InvoicePaymentMethod;
    amountCents: number;
    reference: string | null;
    note: string | null;
    /** Optional uploaded payment-receipt image URL. */
    receiptImageUrl: string | null;
    paidAt: string;
    enteredByActorId: string | null;
    createdAt: string;
}
export interface Invoice {
    id: string;
    organizationId: string;
    /** Sequential per-franchise number, e.g. "TC-2026-0001". */
    number: string;
    periodStart: string;
    periodEnd: string;
    closeType: InvoiceCloseType;
    issuedAt: string;
    /** issuedAt + grace days; after this the invoice goes OVERDUE then suspends. */
    dueAt: string;
    status: InvoiceStatus;
    /** ISO-4217 currency for the franchise's country. */
    currency: string;
    planTier: PlanTier;
    billingCycle: BillingCycle;
    lineItems: InvoiceLineItem[];
    subtotalCents: number;
    totalCents: number;
    /** Cached sum of the payment ledger. */
    amountPaidCents: number;
    /** Link to the closed usage window this invoice was generated from. */
    usageWindowId: string | null;
    createdAt: string;
    updatedAt: string;
    /** Populated when fetching invoice detail. */
    payments?: InvoicePayment[];
}
export interface ClosePeriodInput {
    /** Defaults to now on the server. */
    asOf?: string;
    /**
     * Manual close only. When true the close date becomes the new period start
     * and the invoice charges the next period's full plan fee in advance (anchor
     * moves). When false the existing period dates are kept and the invoice
     * charges overage only — the already-prepaid fee still covers the original
     * period end. Ignored by the automatic close (always rolls at the boundary).
     */
    resetPeriodStart?: boolean;
}
export interface RecordPaymentInput {
    method: InvoicePaymentMethod;
    amountCents: number;
    reference?: string;
    note?: string;
    receiptImageUrl?: string;
    /** Defaults to now on the server. */
    paidAt?: string;
}
export interface ListInvoicesQuery {
    status?: InvoiceStatus;
    organizationId?: string;
    from?: string;
    to?: string;
    cursor?: string;
    limit?: number;
}
export declare function isInvoiceStatus(value: unknown): value is InvoiceStatus;
export declare function isInvoicePaymentMethod(value: unknown): value is InvoicePaymentMethod;
//# sourceMappingURL=invoice.d.ts.map