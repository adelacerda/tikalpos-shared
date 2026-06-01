// ──────────────────────────────────────────────
// Corporate Employee Benefits (FT-GROWTH-018 §Canal 1)
// ──────────────────────────────────────────────
//
// A franchise sells a company the ability for its employees to redeem
// rewards flagged `corporateOnly`. The company (HR) gets an invite code;
// employees redeem it in the loyalty app to become members. HR can see who
// joined and revoke a member who leaves the company.

export type CorporateAccountStatus = 'ACTIVE' | 'SUSPENDED';

export const CORPORATE_ACCOUNT_STATUSES: readonly CorporateAccountStatus[] = [
  'ACTIVE',
  'SUSPENDED',
] as const;

export interface CorporateAccount {
  id: string;
  organizationId: string; // the franchise that owns the corporate deal
  name: string; // company name
  inviteCode: string; // code employees redeem to join (regenerable)
  status: CorporateAccountStatus;
  memberCount: number; // active members
  createdAt: string; // ISO-8601
}

export type CorporateMembershipStatus = 'ACTIVE' | 'REVOKED';

export const CORPORATE_MEMBERSHIP_STATUSES: readonly CorporateMembershipStatus[] = [
  'ACTIVE',
  'REVOKED',
] as const;

export interface CorporateMembership {
  id: string;
  corporateAccountId: string;
  guestId: string;
  guestName: string | null;
  guestEmail: string | null;
  status: CorporateMembershipStatus;
  joinedAt: string; // ISO-8601
  revokedAt?: string | null;
}

// ── Input bodies ─────────────────────────────────────────────────────────────

export interface CreateCorporateAccountInput {
  name: string;
}

export interface RedeemCorporateInviteInput {
  code: string;
}
