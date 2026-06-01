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
