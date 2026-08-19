/** Platforms a member has opened the loyalty app on (forward-populated). */
export type LoyaltyMemberPlatform = 'ios' | 'android' | 'both' | 'none';
/** What the mobile app posts on each foreground→background session. */
export interface LoyaltySessionReportInput {
    platform: 'ios' | 'android';
    /** Foreground duration of the just-ended session, in seconds. */
    durationSeconds: number;
    /** Running app version (expo config version, e.g. "0.3.0"). Optional. */
    appVersion?: string;
}
/** One franchise a member is enrolled in (shown when the row is expanded). */
export interface SystemLoyaltyMemberEnrollment {
    /** The membership row itself — what the movement tools address. */
    guestLoyaltyId: string;
    organizationId: string;
    organizationName: string;
    points: number;
    /** Cashback balance in cents. Shown beside points because a member can hold
     *  cashback and zero points, which otherwise reads as an empty membership. */
    cashbackBalanceCents: number;
    /** True when the franchise itself is a demo. Drives the "only demo" badge and
     *  is the ONLY safe criterion for the demo purge — never the member. */
    organizationIsDemo: boolean;
    /** Rewards obtained (purchased with points + welcome gifts). */
    rewardsPurchased: number;
    /** Of those, how many were actually redeemed at POS. */
    rewardsRedeemed: number;
}
/** A row in the system-admin loyalty members table. */
export interface SystemLoyaltyMember {
    guestId: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    /** ISO timestamp the account was created. */
    createdAt: string;
    /** ISO timestamp of the last authenticated app activity (null if never). */
    lastActiveAt: string | null;
    platform: LoyaltyMemberPlatform;
    /** Last reported running app version (e.g. "0.3.0"); null until data exists. */
    appVersion: string | null;
    /** Average foreground session length in seconds (null until data exists). */
    avgSessionSeconds: number | null;
    /** Number of foreground sessions recorded. */
    sessionCount: number;
    /** Demo member: allowed to enter demo mode in the app (sales rep / test
     *  account). System-admin toggle. Does NOT affect franchise reports. */
    isDemo: boolean;
    /** Forced-demo member: ALWAYS scoped to demo franchises only — can never see
     *  or enroll in real franchises, and is excluded from real franchises' member
     *  lists and billable member consumption. System-admin toggle, stronger than
     *  isDemo (no in-app opt-in). */
    forceDemo: boolean;
    /** Franchises the member is enrolled in (for the expanded row). */
    enrollments: SystemLoyaltyMemberEnrollment[];
    /** Enrolled somewhere, and every one of those franchises is a demo. Such a
     *  member has nothing in a real merchant, which is what makes them safe to
     *  wipe entirely. False for a member with no enrollments at all. */
    onlyDemoFranchises: boolean;
}
export type SystemLoyaltyMemberSort = 'createdAt' | 'lastActiveAt' | 'avgSessionSeconds' | 'sessionCount' | 'name' | 'city';
/** Query params for the system-admin members endpoint. */
export interface SystemLoyaltyMembersQuery {
    /** Filter by platform; 'none' = never opened the app. */
    platform?: LoyaltyMemberPlatform;
    /** Filter to members enrolled in a specific franchise. */
    organizationId?: string;
    /**
     * `'none'` = accounts that joined NO real merchant.
     *
     * Enrollments in demo franchises don't count as joining: the point of this
     * filter is the drop-off between "created an account" and "joined someone",
     * and a demo enrollment is not someone.
     */
    enrollment?: 'none';
    /** Filter to members running a specific app version. */
    appVersion?: string;
    /** Case-insensitive match against name, email or phone. */
    search?: string;
    /** Only members active within the last N days (by lastActiveAt). */
    activeWithinDays?: number;
    sort?: SystemLoyaltyMemberSort;
    order?: 'asc' | 'desc';
    /** Set true to stream an .xlsx export instead of JSON. */
    format?: 'json' | 'xlsx';
}
export interface SystemLoyaltyMembersResponse {
    members: SystemLoyaltyMember[];
    total: number;
    /** Franchises present in the data, for the "group/filter by merchant" control. */
    franchises: Array<{
        organizationId: string;
        organizationName: string;
    }>;
    /** Distinct app versions seen, for the version filter dropdown. */
    appVersions: string[];
}
export declare const LOYALTY_MEMBER_PLATFORMS: readonly LoyaltyMemberPlatform[];
/** What a demo purge would delete, or did delete. Counted per table so the
 *  operator sees the blast radius before confirming an irreversible action. */
export interface DemoLoyaltyPurgeCounts {
    memberships: number;
    transactions: number;
    giftedRewards: number;
    balanceBlocks: number;
    couponGrants: number;
    reviews: number;
    remoteRedemptions: number;
    redemptionHolds: number;
    pushSends: number;
    pushMutes: number;
    adImpressions: number;
    discoveryHighlights: number;
}
export interface DemoLoyaltyPurgePreview {
    /** Demo franchises in scope, with their member count. */
    organizations: {
        id: string;
        name: string;
        memberships: number;
    }[];
    counts: DemoLoyaltyPurgeCounts;
}
export type LoyaltyMovementUnit = 'POINTS' | 'CASHBACK';
export interface LoyaltyMovementRow {
    id: string;
    type: string;
    unit: LoyaltyMovementUnit;
    /** Signed delta: points, or cents for cashback. */
    points: number;
    balanceAfter: number;
    description: string | null;
    /** The sale it was earned on, when the merchant entered one. */
    originalAmountCents: number | null;
    orderId: string | null;
    createdAt: string;
}
export interface MemberMovementsResponse {
    guestLoyaltyId: string;
    guestName: string | null;
    guestEmail: string | null;
    orgId: string;
    orgName: string;
    pointsBalance: number;
    cashbackBalanceCents: number;
    movements: LoyaltyMovementRow[];
}
/** The exact state a deletion would leave — produced by the same replay the
 *  write uses, so it is the result rather than an estimate of it. */
export interface DeleteMovementsPreview {
    matched: number;
    requested: number;
    pointsBefore: number;
    pointsAfter: number;
    cashbackBeforeCents: number;
    cashbackAfterCents: number;
    remainingMovements: number;
    /** True when the result would leave a balance below zero. */
    goesNegative: boolean;
}
export interface DeleteMovementsResult {
    deleted: number;
    pointsAfter: number;
    cashbackAfterCents: number;
}
//# sourceMappingURL=system-loyalty-members.d.ts.map