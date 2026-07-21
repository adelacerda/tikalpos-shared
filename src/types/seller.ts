// Platform sellers + commissions (FT-SELLERS).
//
// Sellers are platform-side (TikalLoyalty) users who sell franchises. A seller
// earns commission on their own clients' collected invoices; a seller who has a
// downline (other sellers with leaderId = them) also earns an override on the
// downline's collected invoices. Rates and taxes are stored as integer basis
// points (1000 = 10.00%) to avoid float drift; money is always integer cents.

import type { Lead } from './lead';

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
  /** Last successful login (ISO), or null if the seller has never signed in. */
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerInput {
  name: string;
  email: string;
  // No password: the seller sets it via an emailed invite link.
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
  /** Effective fee the client actually pays = locked fee if set, else list price. */
  monthlyFeeCents: number | null;
  annualFeeCents: number | null;
  currency: string;
  /** Owner (OWNER-role user) of the franchise. */
  ownerName: string | null;
  ownerEmail: string | null;
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
  payoutPeriod?: string; // YYYY-MM
  status?: CommissionStatus;
  kind?: CommissionKind;
  /** Exclude commissions of demo franchises (they don't pay). Seller portal sets this. */
  excludeDemo?: boolean;
}

// ── Payouts (the 5th-of-month seller payment record) ─────────────────────────

/** Records that a seller's commissions for a month were paid/deposited, with an
 *  optional transfer-receipt URL. One per (seller, payoutPeriod). */
export interface CommissionPayout {
  id: string;
  sellerId: string;
  sellerName?: string;
  payoutPeriod: string; // YYYY-MM
  totalCents: number;
  paidAt: string;
  receiptUrl: string | null;
  note: string | null;
  createdAt: string;
}

export interface MarkCommissionsPaidInput {
  sellerId: string;
  payoutPeriod: string; // YYYY-MM
  receiptUrl?: string | null;
  note?: string | null;
}

/** Register a (possibly partial) commission payment for a (seller, period).
 *  Multiple payments per period are allowed; pending = owed − sum(payments). */
export interface RegisterPayoutInput {
  sellerId: string;
  payoutPeriod: string; // YYYY-MM
  amountCents: number;
  receiptUrl?: string | null;
  note?: string | null;
}

// ── Seller documents: expense invoices + commission FEL (with file upload) ─────

/** EXPENSE = operating-expense invoice (FEL to the company NIT) presented while
 *  the seller cannot yet invoice commissions. COMMISSION_FEL = the seller's own
 *  commission invoice once registered with SAT. */
export type SellerDocumentKind = 'EXPENSE' | 'COMMISSION_FEL';
export type SellerDocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SellerDocument {
  id: string;
  sellerId: string;
  sellerName?: string;
  kind: SellerDocumentKind;
  /** Commission month this document applies to (YYYY-MM). */
  payoutPeriod: string;
  amountCents: number;
  description: string | null;
  /** Authenticated download path (not a public URL). */
  fileUrl: string;
  fileMimeType: string;
  fileName: string | null;
  status: SellerDocumentStatus;
  reviewNote: string | null;
  reviewedByActorId: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

/** Metadata sent alongside the multipart file upload. */
export interface UploadSellerDocumentInput {
  kind: SellerDocumentKind;
  payoutPeriod: string; // YYYY-MM
  amountCents: number;
  description?: string | null;
}

export interface ReviewSellerDocumentInput {
  status: Extract<SellerDocumentStatus, 'APPROVED' | 'REJECTED'>;
  reviewNote?: string | null;
}

export interface SellerDocumentsQuery {
  sellerId?: string;
  payoutPeriod?: string; // YYYY-MM
  status?: SellerDocumentStatus;
  kind?: SellerDocumentKind;
}

// ── Monthly statement: owed vs paid vs pending, with surplus carry-over ────────

/** Per-month financial summary for a seller. Surplus from approved expenses that
 *  exceed the month's commissions carries forward as `creditOutCents`. */
export interface SellerPeriodStatement {
  payoutPeriod: string; // YYYY-MM
  /** Commissions owed (earned, excluding reversed) for the month. */
  commissionsCents: number;
  /** Approved expense + commission-FEL documents applied to the month. */
  approvedDocsCents: number;
  /** Total actually paid out so far for the month. */
  paidCents: number;
  /** Still owed: max(0, commissions − paid). */
  pendingCents: number;
  /** Credit brought in from the previous month's surplus. */
  creditInCents: number;
  /** Surplus carried out to the next month (needs accounting/admin approval via
   *  approving the underlying expense documents). */
  creditOutCents: number;
  currency: string;
}

/** File-size + type limits for seller document uploads. */
export const SELLER_DOC_LIMITS = {
  MAX_BYTES: 10 * 1024 * 1024, // 10 MB
  MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const,
} as const;

// ── Leader view: the downline's leads, grouped by seller (FT-SELLERS) ────────
//
// "Leader" is derived, not a flag: a seller is a leader when it has a downline.
// The scope is the seller's whole SUBTREE (downline of downline), so a leader of
// leaders sees everything under them. It never includes the leader's own leads —
// those stay in their personal list, deliberately separate.

/** A seller in the leader's team, for pickers and grouping headers. */
export interface SellerTeamMember {
  id: string;
  name: string;
  email: string;
  active: boolean;
  /** Who this member reports to (lets the UI show the tree's shape). */
  leaderId: string | null;
  /** How deep under the leader: 1 = direct report, 2 = their report, … */
  depth: number;
  /** Leads currently assigned to this member. */
  leadCount: number;
}

/** One seller and the leads they currently hold. */
export interface TeamLeadGroup {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  active: boolean;
  depth: number;
  leads: Lead[];
}

/** The leader's team view: every member of the subtree, with their leads. */
export interface TeamLeadsResult {
  /** Groups with at least one lead are listed first, busiest first. */
  groups: TeamLeadGroup[];
  /** Everyone in the subtree — including members holding zero leads. */
  members: SellerTeamMember[];
  totalLeads: number;
}

/**
 * Move a lead to another seller. The target must be inside the leader's subtree,
 * or the leader themselves (that's how a leader takes a lead for themselves).
 */
export interface ReassignLeadInput {
  toSellerId: string;
}
