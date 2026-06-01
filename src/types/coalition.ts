// ──────────────────────────────────────────────
// Cross-Tenant Loyalty Coalition (FT-GROWTH-008 §Canal 4)
// ──────────────────────────────────────────────
//
// Phase A (this contract): franchises join a coalition and a member sees a
// COMBINED points view across the coalition's franchises. No cross-spend, no
// settlement yet — those are Phase B (see docs/loyalty-coalition-rfc.md).

export type CoalitionStatus = 'ACTIVE' | 'INACTIVE';

export const COALITION_STATUSES: readonly CoalitionStatus[] = ['ACTIVE', 'INACTIVE'] as const;

// ── Admin (system console) ────────────────────────────────────────────────

export interface CoalitionMemberOrg {
  organizationId: string;
  name: string;
}

export interface Coalition {
  id: string;
  name: string;
  status: CoalitionStatus;
  /** Point value in Q centavos — used by Phase B settlement; informational now. */
  redemptionValueCents: number;
  members: CoalitionMemberOrg[];
  createdAt: string; // ISO-8601
}

export interface CreateCoalitionInput {
  name: string;
  redemptionValueCents?: number;
}

// ── Mobile (combined view) ────────────────────────────────────────────────

export interface LoyaltyCoalitionFranchise {
  orgId: string;
  name: string;
  pointsBalance: number;
}

export interface LoyaltyCoalitionSummary {
  coalitionId: string;
  name: string;
  combinedPoints: number;
  franchises: LoyaltyCoalitionFranchise[];
}

// ── Settlement (Phase B — cross-spend clearing) ───────────────────────────
//
// When a member redeems at F2 using points "from" F1 (cross-spend), F1 owes
// F2 the value of those points. Recorded as a settlement entry, cleared
// periodically (reuse FT-GROWTH-007). Deduction policy: PROPORTIONAL across
// the member's balances in the coalition's other franchises.

export interface CoalitionSettlement {
  id: string;
  coalitionId: string;
  debtorOrgId: string;
  debtorName: string;
  creditorOrgId: string;
  creditorName: string;
  points: number;
  valueCents: number;
  settledAt?: string | null;
  createdAt: string; // ISO-8601
}
