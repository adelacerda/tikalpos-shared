export type CommissionKind = 'SELLER' | 'OVERRIDE';
export type CommissionStatus = 'ACCRUED' | 'PAID' | 'REVERSED';
/** A platform seller (and, when it has a downline, a leader). */
export interface Seller {
    id: string;
    name: string;
    email: string;
    active: boolean;
    /** The seller this one reports to (override flows up to them). Null = top. */
    leaderId: string | null;
    leaderName?: string | null;
    /** Per-seller rate overrides in basis points; null = use the global config. */
    sellerMonthlyBps: number | null;
    sellerAnnualBps: number | null;
    overrideMonthlyBps: number | null;
    overrideAnnualBps: number | null;
    createdAt: string;
    updatedAt: string;
}
export interface CreateSellerInput {
    name: string;
    email: string;
    leaderId?: string | null;
    sellerMonthlyBps?: number | null;
    sellerAnnualBps?: number | null;
    overrideMonthlyBps?: number | null;
    overrideAnnualBps?: number | null;
}
export type UpdateSellerInput = Partial<CreateSellerInput> & {
    active?: boolean;
};
/** Global, editable commission/tax parameters (basis points). */
export interface CommissionConfig {
    sellerMonthlyBps: number;
    sellerAnnualBps: number;
    leaderMonthlyBps: number;
    leaderAnnualBps: number;
    ivaBps: number;
    isrBps: number;
}
export type UpdateCommissionConfigInput = Partial<CommissionConfig>;
/** A commission line generated from a collected invoice. Snapshots the rates and
 *  taxes in effect at generation so config changes never rewrite the past. */
export interface Commission {
    id: string;
    sellerId: string;
    sellerName?: string;
    kind: CommissionKind;
    invoiceId: string;
    invoiceNumber?: string;
    /** Status of the source invoice (so sellers can chase unpaid ones). */
    invoiceStatus?: string;
    organizationId: string;
    organizationName?: string;
    /** For OVERRIDE rows: the downline seller whose sale produced it. */
    sourceSellerId: string | null;
    sourceSellerName?: string | null;
    /** Invoice total used as the base (cents). */
    baseCents: number;
    rateSnapshotBps: number;
    ivaSnapshotBps: number;
    isrSnapshotBps: number;
    computedAmountCents: number;
    /** Manual override by system-admin; null = use computed. */
    adjustedAmountCents: number | null;
    adjustmentReason: string | null;
    adjustedByActorId: string | null;
    adjustedAt: string | null;
    /** What will actually be paid: adjusted ?? computed. */
    amountToPayCents: number;
    status: CommissionStatus;
    /** Payout month (YYYY-MM): the month after collection (paid on the 5th). */
    payoutPeriod: string;
    /** When the source invoice was fully collected. */
    collectedAt: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
}
export interface AdjustCommissionInput {
    /** New amount to pay (cents). Null clears the override → back to computed. */
    adjustedAmountCents: number | null;
    reason: string;
}
export interface SetLockedFeeInput {
    lockedMonthlyFeeCents?: number | null;
    lockedAnnualFeeCents?: number | null;
    reason: string;
}
/** One invoice in a client's billing history (for the "collect" view). */
export interface SellerClientInvoice {
    id: string;
    number: string;
    periodStart: string;
    periodEnd: string;
    status: string;
    totalCents: number;
    amountPaidCents: number;
    issuedAt: string;
    dueAt: string;
    currency: string;
}
/** A client (franchise) a seller is responsible for. */
export interface SellerClient {
    organizationId: string;
    name: string;
    planTier: string;
    billingCycle: string;
    subscriptionStatus: string;
    currentPeriodEnd: string | null;
    lockedMonthlyFeeCents: number | null;
    lockedAnnualFeeCents: number | null;
    currency: string;
    /** Fiscal address + contact phone (to invoice/contact the client). */
    fiscalAddress: string | null;
    contactPhone: string | null;
    taxId: string | null;
    invoices: SellerClientInvoice[];
}
/** Commission totals for a payout period / filter. */
export interface CommissionTotals {
    accruedCents: number;
    paidCents: number;
    reversedCents: number;
    /** accrued + paid (what is owed/earned, excluding reversed). */
    earnedCents: number;
}
export interface SellerCommissionsQuery {
    sellerId?: string;
    payoutPeriod?: string;
    status?: CommissionStatus;
    kind?: CommissionKind;
}
/** Records that a seller's commissions for a month were paid/deposited, with an
 *  optional transfer-receipt URL. One per (seller, payoutPeriod). */
export interface CommissionPayout {
    id: string;
    sellerId: string;
    sellerName?: string;
    payoutPeriod: string;
    totalCents: number;
    paidAt: string;
    receiptUrl: string | null;
    note: string | null;
    createdAt: string;
}
export interface MarkCommissionsPaidInput {
    sellerId: string;
    payoutPeriod: string;
    receiptUrl?: string | null;
    note?: string | null;
}
//# sourceMappingURL=seller.d.ts.map