// Loyalty operators ("cajeros") — limited per-organization users that can ONLY
// redeem rewards / give points at the register. Deliberately separate from the
// `User` (staff) table and from email-based login: an operator authenticates with
// the org's 6-digit numeric code + a PIN. The PIN is unique WITHIN the org, so it
// identifies the person; and because operators carry no email, the same person's
// email stays free to register their own business later (or be a staff elsewhere).

export interface LoyaltyOperator {
  id: string;
  organizationId: string;
  /** Branch this cashier is assigned to (redemptions are attributed to it). */
  locationId: string;
  name: string;
  /** True for the owner's auto-created entry (can't be deleted). */
  isOwner: boolean;
  active: boolean;
  createdAt: string;
}

export interface CreateLoyaltyOperatorInput {
  name: string;
  /** 4–6 digit numeric PIN; must be unique within the organization. */
  pin: string;
}

export interface UpdateLoyaltyOperatorInput {
  name?: string;
  pin?: string;
  active?: boolean;
}

/** Owner-facing view: the org's cashier login code + its operators. */
export interface LoyaltyOperatorsView {
  /** 6-digit numeric code the cashier types to pick this business at login. */
  loginCode: string;
  operators: LoyaltyOperator[];
}

export interface OperatorLoginInput {
  /** Org's 6-digit numeric login code. */
  code: string;
  pin: string;
}

/** What the cashier app gets after a successful operator login. */
export interface OperatorSession {
  token: string;
  operatorId: string;
  operatorName: string;
  organizationId: string;
  organizationName: string | null;
}

export const OPERATOR_PIN_REGEX = /^\d{4,6}$/;
export const OPERATOR_LOGIN_CODE_REGEX = /^\d{6}$/;
