// ──────────────────────────────────────────────
// TikalLoyalty Mobile App (Sprint 12.1 / FT-GROWTH-002)
// ──────────────────────────────────────────────
//
// Canonical contracts consumed by the `tikalpos-loyalty` React Native app
// against the loyalty-mobile endpoints in `tikalpos-backend/src/routes/
// loyalty-mobile.routes.ts`. Mirrors what the existing web portal under
// `tikalpos-web/src/pages/guest-auth/*` consumes, plus mobile-specific
// concerns: social auth providers, push topics, ad-carousel cards, and
// redemption holds (QR-based pre-authorizations).

export type LoyaltyAuthProvider = 'GOOGLE' | 'APPLE' | 'EMAIL';

export const LOYALTY_AUTH_PROVIDERS: readonly LoyaltyAuthProvider[] = [
  'GOOGLE',
  'APPLE',
  'EMAIL',
] as const;

export function isLoyaltyAuthProvider(value: unknown): value is LoyaltyAuthProvider {
  return typeof value === 'string' && (LOYALTY_AUTH_PROVIDERS as readonly string[]).includes(value);
}

export type LoyaltyTransactionKind = 'EARN' | 'REDEEM' | 'EXPIRY' | 'ADJUSTMENT';

export const LOYALTY_TRANSACTION_KINDS: readonly LoyaltyTransactionKind[] = [
  'EARN',
  'REDEEM',
  'EXPIRY',
  'ADJUSTMENT',
] as const;

export function isLoyaltyTransactionKind(value: unknown): value is LoyaltyTransactionKind {
  return typeof value === 'string' && (LOYALTY_TRANSACTION_KINDS as readonly string[]).includes(value);
}

export type LoyaltyPushTopic =
  | 'REWARD_EXPIRING'
  | 'NEW_PROMOTION'
  | 'REDEMPTION_READY'
  | 'BALANCE_MILESTONE'
  | 'WELCOME'
  | 'ENGAGEMENT';

export const LOYALTY_PUSH_TOPICS: readonly LoyaltyPushTopic[] = [
  'REWARD_EXPIRING',
  'NEW_PROMOTION',
  'REDEMPTION_READY',
  'BALANCE_MILESTONE',
  'WELCOME',
  'ENGAGEMENT',
] as const;

export function isLoyaltyPushTopic(value: unknown): value is LoyaltyPushTopic {
  return typeof value === 'string' && (LOYALTY_PUSH_TOPICS as readonly string[]).includes(value);
}

// ── Session ────────────────────────────────────────────────────────────────

export interface LoyaltyMobileProfile {
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface LoyaltyMobileSession {
  guestId: string;
  token: string;            // bearer JWT, expires per backend policy
  expiresAt: string;        // ISO-8601
  provider: LoyaltyAuthProvider;
  profile: LoyaltyMobileProfile;
}

// ── Auth input bodies ───────────────────────────────────────────────────────

export interface LoyaltyAuthGoogleInput {
  idToken: string;          // raw `id_token` from expo-auth-session
  expoPushToken?: string;   // optional — opt-in push registration at signin
}

export interface LoyaltyAuthAppleInput {
  identityToken: string;    // raw token from expo-apple-authentication
  authorizationCode?: string;
  fullName?: { givenName?: string; familyName?: string } | null;
  email?: string | null;    // Apple only provides on first signin
  expoPushToken?: string;
}

export interface LoyaltyAuthEmailInput {
  email: string;
  password: string;
  expoPushToken?: string;
}

// ── Multi-franchise view ───────────────────────────────────────────────────

export interface LoyaltyFranchiseBranding {
  orgId: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  primaryColorOklch?: string | null; // e.g. "oklch(68% 0.21 250)"
}

/**
 * A points-redeemable reward used as a milestone on the home progress bar.
 * Free welcome rewards (no points cost) are excluded — they're not a points
 * goal. Sorted ascending by costPoints by the backend.
 */
export interface LoyaltyRewardMilestone {
  rewardId: string;
  name: string;
  costPoints: number;
  imageUrl?: string | null; // null → render the TikalPOS logo fallback
}

export interface LoyaltyMemberSummary {
  branding: LoyaltyFranchiseBranding;
  pointsBalance: number;
  lifetimePoints: number;
  tier?: string | null;     // resolved tier label from LoyaltyConfig
  joinedAt: string;         // ISO-8601
  lastActivityAt?: string | null;
  /** Points-redeemable rewards (asc by cost) for the next-reward progress bar. */
  rewardMilestones: LoyaltyRewardMilestone[];
}

// ── Detail view ────────────────────────────────────────────────────────────

export interface LoyaltyTransactionEntry {
  id: string;
  kind: LoyaltyTransactionKind;
  points: number;           // signed: +earn, -redeem, -expiry
  balanceAfter: number;
  description: string;       // backend-generated (English); kept for web/legacy
  amountCents: number | null; // money tied to the txn (order total for EARN); null otherwise
  currency: string;         // ISO-4217 of the franchise (e.g. "GTQ") — money rendered client-side
  occurredAt: string;       // ISO-8601
  orgId: string;
}

export interface LoyaltyRewardCard {
  id: string;
  name: string;
  description: string;
  costPoints: number;
  originalCostPoints?: number | null; // populated when a promotion is active
  imageUrl?: string | null;
  promotionEndsAt?: string | null;
  redeemableUntil?: string | null;
  featured?: boolean; // FT-GROWTH-017 §Canal 2 — neon-boosted highlight
  corporateOnly?: boolean; // FT-GROWTH-018 §Canal 1 — corporate-member-only
}

/**
 * A reward the member already OWNS — a free GiftedReward (e.g. the welcome
 * gift granted on enrol). Shown under "Mis recompensas", separate from the
 * redeemable catalog. No points cost; it's already theirs until it expires.
 */
export interface LoyaltyGiftedRewardCard {
  id: string; // giftedReward id
  rewardId: string; // the catalog rewardId it was granted from
  name: string;
  description: string;
  imageUrl?: string | null;
  expiresAt: string; // ISO-8601
}

export interface LoyaltyFranchiseDetail {
  branding: LoyaltyFranchiseBranding;
  pointsBalance: number;
  lifetimePoints: number;
  tier?: string | null;
  transactions: LoyaltyTransactionEntry[];
  /** Rewards the member already owns (gifted), e.g. the welcome gift. */
  myRewards: LoyaltyGiftedRewardCard[];
  /** Catalog rewards available to redeem (never includes the welcome reward). */
  rewards: LoyaltyRewardCard[];
}

// ── Redemption holds (QR-based pre-authorization) ──────────────────────────

export interface LoyaltyRedemptionHold {
  id: string;
  nonce: string;            // opaque token included in QR payload
  rewardId: string;
  orgId: string;
  qrPayload: string;        // base64url-encoded JSON the staff tablet scans
  expiresAt: string;        // ISO-8601 — typically now() + 10 min
  consumedAt?: string | null;
}

export interface ReserveRewardInput {
  // intentionally empty body — guestId + orgId + rewardId come from path/auth
  // forward-compat: future seat/note metadata can be added without breaking
  note?: string;
}

// ── Ad carousel cards ──────────────────────────────────────────────────────

export interface LoyaltyAdCampaignCard {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;           // either `tikalpos://...` deep link or https://
  sponsoredByOrgId: string;
  sponsoredByOrgName: string;
  expiresAt?: string | null;
}

/**
 * A real full-screen ad served to the loyalty app's ad carousel (reward-wizard
 * SS5). The server resolves `isMember` from the guest's enrolments so the app
 * routes the bottom CTA: member → the reward, non-member → the franchise
 * preview (to enrol). One billable impression is charged per ad per user/day
 * on serve, at the ad's locked fee.
 */
export interface LoyaltyAdCard {
  adId: string;
  organizationId: string;
  rewardId: string;
  sponsoredByOrgName: string;
  title: string;
  iconUrl: string;
  imageUrl: string; // full-screen creative (cover)
  ctaLabel: string;
  /** True when the guest already belongs to this franchise. */
  isMember: boolean;
}

// ── Discovery carousel ──────────────────────────────────────────────────────
// Cross-merchant acquisition feed: one card per franchise the guest is NOT
// enrolled in, showing its welcome reward (or lowest-cost fallback). At most
// one card per response is `highlighted` (the rotated, paid neon winner —
// fixed per user/day, server-side), and the highlighted card is returned first.
// See docs/feature-discovery-carousel.md.
export interface LoyaltyDiscoveryCard {
  orgId: string;
  branding: LoyaltyFranchiseBranding;
  reward: LoyaltyRewardCard; // the welcome reward, else the lowest-cost one
  highlighted: boolean;      // neon spotlight winner for this user today
}

// Public franchise preview for NON-members (reached from a discovery card).
// No balance/transactions — just branding + the catalog, so the guest can
// decide to join. `welcomeReward` is the same card shown in discovery
// (welcome → else lowest-cost); `otherRewards` is the rest of the catalog.
export interface LoyaltyFranchisePreview {
  branding: LoyaltyFranchiseBranding;
  welcomeReward: LoyaltyRewardCard | null;
  otherRewards: LoyaltyRewardCard[];
}

// ── Push registration ──────────────────────────────────────────────────────

export interface LoyaltyPushSubscribeInput {
  // Either webPush keys (browser path) or expoPushToken (mobile path).
  // Exactly one must be set on the backend — type stays loose for callers.
  expoPushToken?: string;
  endpoint?: string;
  keys?: { p256dh: string; auth: string };
  topicsOptIn?: LoyaltyPushTopic[];
}

// ── Profile editing ────────────────────────────────────────────────────────

export interface UpdateLoyaltyProfileInput {
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  locale?: 'es' | 'en';
}
