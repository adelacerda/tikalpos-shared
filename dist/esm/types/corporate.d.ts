export type CorporateAccountStatus = 'ACTIVE' | 'SUSPENDED';
export declare const CORPORATE_ACCOUNT_STATUSES: readonly CorporateAccountStatus[];
export interface CorporateAccount {
    id: string;
    organizationId: string;
    name: string;
    inviteCode: string;
    status: CorporateAccountStatus;
    memberCount: number;
    createdAt: string;
}
export type CorporateMembershipStatus = 'ACTIVE' | 'REVOKED';
export declare const CORPORATE_MEMBERSHIP_STATUSES: readonly CorporateMembershipStatus[];
export interface CorporateMembership {
    id: string;
    corporateAccountId: string;
    guestId: string;
    guestName: string | null;
    guestEmail: string | null;
    status: CorporateMembershipStatus;
    joinedAt: string;
    revokedAt?: string | null;
}
export interface CreateCorporateAccountInput {
    name: string;
}
export interface RedeemCorporateInviteInput {
    code: string;
}
//# sourceMappingURL=corporate.d.ts.map