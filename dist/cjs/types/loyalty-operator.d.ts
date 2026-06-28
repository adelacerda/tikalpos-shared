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
export declare const OPERATOR_PIN_REGEX: RegExp;
export declare const OPERATOR_LOGIN_CODE_REGEX: RegExp;
//# sourceMappingURL=loyalty-operator.d.ts.map