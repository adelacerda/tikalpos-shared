// Platform sellers + commissions (FT-SELLERS).
//
// Sellers are platform-side (TikalLoyalty) users who sell franchises. A seller
// earns commission on their own clients' collected invoices; a seller who has a
// downline (other sellers with leaderId = them) also earns an override on the
// downline's collected invoices. Rates and taxes are stored as integer basis
// points (1000 = 10.00%) to avoid float drift; money is always integer cents.

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
  password: string;
  leaderId?: string | null;
  sellerMonthlyBps?: number | null;
  sellerAnnualBps?: number | null;
  overrideMonthlyBps?: number | null;
  overrideAnnualBps?: number | null;
}

export type UpdateSellerInput = Partial<Omit<CreateSellerInput, 'password'>> & {
  active?: boolean;
  /** Optional password reset. */
  password?: string;
};

/** Global, editable commission/tax parameters (basis points). */
export interface CommissionConfig {
  sellerMonthlyBps: number; // default 1000 (10%)
  sellerAnnualBps: number;  // default 1500 (15%)
  leaderMonthlyBps: number; // default 100 (1%)
  leaderAnnualBps: number;  // default 200 (2%)
  ivaBps: number;           // default 1200 (12%)
  isrBps: number;           // default 500 (5%)
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

// ── Seller / admin dashboard views ──────────────────────────────────────────

/** One invoice in a client's billing history (for the "collect" view). */
export interface SellerClientInvoice {
  id: string;
  number: string;
  periodStart: string;
  periodEnd: string;
  status: string; // InvoiceStatus
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
  payoutPeriod?: string; // YYYY-MM
  status?: CommissionStatus;
  kind?: CommissionKind;
}
