export type CoalitionStatus = 'ACTIVE' | 'INACTIVE';
export declare const COALITION_STATUSES: readonly CoalitionStatus[];
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
    createdAt: string;
}
export interface CreateCoalitionInput {
    name: string;
    redemptionValueCents?: number;
}
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
//# sourceMappingURL=coalition.d.ts.map