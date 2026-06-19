// System-admin view: every loyalty member across all franchises, with
// per-member aggregates and per-franchise enrollment detail (expandable row).

/** Platforms a member has opened the loyalty app on (forward-populated). */
export type LoyaltyMemberPlatform = 'ios' | 'android' | 'both' | 'none';

/** What the mobile app posts on each foreground→background session. */
export interface LoyaltySessionReportInput {
  platform: 'ios' | 'android';
  /** Foreground duration of the just-ended session, in seconds. */
  durationSeconds: number;
}

/** One franchise a member is enrolled in (shown when the row is expanded). */
export interface SystemLoyaltyMemberEnrollment {
  organizationId: string;
  organizationName: string;
  points: number;
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
  /** Average foreground session length in seconds (null until data exists). */
  avgSessionSeconds: number | null;
  /** Number of foreground sessions recorded. */
  sessionCount: number;
  /** Franchises the member is enrolled in (for the expanded row). */
  enrollments: SystemLoyaltyMemberEnrollment[];
}

export type SystemLoyaltyMemberSort =
  | 'createdAt'
  | 'lastActiveAt'
  | 'avgSessionSeconds'
  | 'sessionCount'
  | 'name'
  | 'city';

/** Query params for the system-admin members endpoint. */
export interface SystemLoyaltyMembersQuery {
  /** Filter by platform; 'none' = never opened the app. */
  platform?: LoyaltyMemberPlatform;
  /** Filter to members enrolled in a specific franchise. */
  organizationId?: string;
  sort?: SystemLoyaltyMemberSort;
  order?: 'asc' | 'desc';
}

export interface SystemLoyaltyMembersResponse {
  members: SystemLoyaltyMember[];
  total: number;
  /** Franchises present in the data, for the "group/filter by merchant" control. */
  franchises: Array<{ organizationId: string; organizationName: string }>;
}

export const LOYALTY_MEMBER_PLATFORMS: readonly LoyaltyMemberPlatform[] = [
  'ios',
  'android',
  'both',
  'none',
] as const;
