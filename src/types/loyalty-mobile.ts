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
  /** City — used for push-promotion city targeting (matches branch cities). */
  city?: string | null;
  /** Explicit opt-in to marketing/promotional push (Apple 4.5.4). */
  marketingPushOptIn?: boolean;
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
  country?: string;         // ISO 3166-1 alpha-2 picked at signup (new guests)
}

export interface LoyaltyAuthAppleInput {
  identityToken: string;    // raw token from expo-apple-authentication
  authorizationCode?: string;
  fullName?: { givenName?: string; familyName?: string } | null;
  email?: string | null;    // Apple only provides on first signin
  expoPushToken?: string;
  country?: string;         // ISO 3166-1 alpha-2 picked at signup (new guests)
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
  imageUrl?: string | null;           // landscape 2:1 (1200×600) — carousel card banner
  verticalImageUrl?: string | null;   // portrait 3:4 (1080×1440) — discover card strip
  promotionEndsAt?: string | null;
  redeemableUntil?: string | null;
  featured?: boolean; // FT-GROWTH-017 §Canal 2 — neon-boosted highlight
  corporateOnly?: boolean; // FT-GROWTH-018 §Canal 1 — corporate-member-only
  // Eligibility — what the check must contain to redeem this reward.
  requiredProducts?: string[]; // product names (resolved); empty = any purchase
  minCheckAmount?: number; // minimum check total in cents (0 = none)
  /** Locations where this reward is valid (resolved). Empty = all franchise locations. */
  validLocations?: LoyaltyLocation[];
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
  acquiredAt: string; // ISO-8601 — when the member got it
  expiresAt: string; // ISO-8601
  // Eligibility resolved from the catalog reward (for the owned-reward detail).
  requiredProducts?: string[]; // product names; empty = any purchase
  minCheckAmount?: number; // minimum check total in cents (0 = none)
  /** Locations where this reward is valid (resolved). Empty = all franchise locations. */
  validLocations?: LoyaltyLocation[];
}

export interface LoyaltyFranchiseDetail {
  branding: LoyaltyFranchiseBranding;
  /** True when the franchise is on the LOYALTY_LITE plan → in-store QR redemption. */
  isLoyaltyLite: boolean;
  pointsBalance: number;
  lifetimePoints: number;
  tier?: string | null;
  transactions: LoyaltyTransactionEntry[];
  /** Rewards the member already owns (gifted), e.g. the welcome gift. */
  myRewards: LoyaltyGiftedRewardCard[];
  /** Catalog rewards available to redeem (never includes the welcome reward). */
  rewards: LoyaltyRewardCard[];
  /** Franchise locations where rewards can be redeemed. */
  locations: LoyaltyLocation[];
  /** True when the business offers "Atención a domicilio" (services at the
   *  customer's location). Drives the at-home badge/section in the app. */
  offersAtHome?: boolean;
  /** Free-text coverage area shown when offersAtHome is on. */
  coverageArea?: string | null;
  /** Org-level WhatsApp (E.164) + template → "Agendar a domicilio" button. */
  whatsapp?: string | null;
  whatsappTemplate?: string | null;
  // ── Stamp card ("tarjeta de sellos") — opt-in, off by default ──
  /** True when the merchant enabled the stamp card. When false the app shows
   *  the classic points UI only (current behavior, untouched). */
  stampsEnabled?: boolean;
  /** Stamps needed to complete the card (e.g. 10). UI + grant threshold. */
  stampGoal?: number | null;
  /** When true, a valid scan grants points AND a stamp; when false, only a
   *  stamp (no points). Fixed in the merchant's stamp panel. */
  stampsAlsoEarnPoints?: boolean;
  /** This member's current stamps toward the goal (0..stampGoal-1 after wrap). */
  stampCount?: number;
  // ── Referral program ("trae a una amiga") — opt-in, off by default ──
  /** True when the merchant enabled referrals. Drives the "Invita y ganen" UI. */
  referralEnabled?: boolean;
  /** This member's shareable referral code (present only when referrals are on). */
  referralCode?: string | null;
  /** Points the referrer earns when a referred member completes their first service. */
  referrerRewardPoints?: number;
  /** Points the referred member earns on their first service. */
  referredRewardPoints?: number;
}

/** A franchise location (name + address) shown in a reward's "Válida en". */
export interface LoyaltyLocation {
  name: string;
  address: string | null;
  /** Branch coordinates → drives the in-app "navigate" (Waze/Maps) button. */
  latitude?: number | null;
  longitude?: number | null;
  /** Branch WhatsApp (E.164) → drives the in-app "contact via WhatsApp" button.
   *  Null/absent = no button. */
  whatsapp?: string | null;
}

// ── Merchant search ─────────────────────────────────────────────────────────
// Search across ALL loyalty-enabled franchises (member or not) by name or tag.
// Tap a result → franchise preview (non-member) or detail (member). Backed by
// GET /loyalty-mobile/merchants/search?q=.

export interface LoyaltyMerchantSearchResult {
  orgId: string;
  branding: LoyaltyFranchiseBranding;
  tags: string[];                 // the franchise's category tags
  isMember: boolean;              // true → guest already enrolled (route to detail)
}

export interface LoyaltyMerchantSearchResponse {
  items: LoyaltyMerchantSearchResult[];
}

// ── Redemption holds (QR-based pre-authorization) ──────────────────────────

/**
 * REDEEM     — the guest is cashing in a reward they own; the merchant scan can
 *              redeem it and/or apply the tier discount.
 * POINTS_ONLY— "Obtener puntos por compra": no reward is redeemed, the merchant
 *              just records the spend (and optionally the tier discount).
 */
export type RedemptionHoldMode = 'REDEEM' | 'POINTS_ONLY';

export interface LoyaltyRedemptionHold {
  id: string;
  nonce: string;            // opaque token included in QR payload
  rewardId: string;
  orgId: string;
  qrPayload: string;        // base64url-encoded JSON the staff tablet scans
  mode: RedemptionHoldMode;
  expiresAt: string;        // ISO-8601
  consumedAt?: string | null;
}

/** Mobile → create a hold for the merchant to scan. */
export interface CreateRedemptionHoldInput {
  mode: RedemptionHoldMode;
  /** The owned GiftedReward to redeem (REDEEM mode only). */
  giftedRewardId?: string;
}

/** Web (owner) resolves a scanned hold before consuming it. */
export interface RedemptionResolveResult {
  nonce: string;
  mode: RedemptionHoldMode;
  expiresAt: string;
  consumedAt: string | null;
  orgId: string;
  currency: string;
  guest: { id: string; name: string | null };
  /** Present in REDEEM mode — the reward being cashed in. `discountType` /
   * `discountValue` let the web preview the charge live before consuming. */
  reward: {
    giftedRewardId: string;
    name: string;
    minCheckAmountCents: number;
    discountType: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT' | null;
    discountValue: number; // cents for FIXED_AMOUNT/ITEM_COST, percent for PERCENTAGE
  } | null;
  tier: string | null;
  tierDiscountBps: number; // the guest's tier discount (0 if none)
}

/** Web (owner) consumes the hold after entering the spend + choices. */
export interface RedemptionConsumeInput {
  amountCents: number;       // amount spent, before any discount
  applyReward: boolean;      // redeem the owned reward (ignored in POINTS_ONLY)
  applyTierDiscount: boolean; // apply the tier discount
  orderRef?: string;         // optional external order/check number (owner control)
}

export interface RedemptionConsumeResult {
  chargeCents: number;        // what to actually charge after discounts
  rewardRedeemed: boolean;
  tierDiscountApplied: boolean;
  pointsAwarded: number;
  /** Stamp card: a stamp was granted on this scan (only when stampsEnabled and
   *  the net charge met the configured minimum). */
  stampEarned?: boolean;
  /** Member's stamp count after this scan (post-wrap when a reward was granted). */
  stampCount?: number;
  /** A stamp reward was auto-granted because the goal was reached this scan. */
  stampRewardGranted?: boolean;
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
  // Full-screen creative (cover). Image OR video (exactly one); null when the
  // ad is video-only.
  imageUrl?: string | null;
  /** Optional 8s video creative. When present the app plays it (muted, no loop,
   *  capped at 8s) instead of the image. */
  videoUrl?: string | null;
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
  reward: LoyaltyRewardCard; // a reward from a franchise the guest hasn't joined
  highlighted: boolean;      // a paid discovery-highlight reward (shown + billed)
  tags: string[];            // the franchise's category tags (badge shows ≤2, client picks at random)
}

/**
 * A page of the discovery reward feed (the "Ver todas" screen). The feed is a
 * randomized stream of rewards from non-enrolled franchises; each page tries to
 * include one (not-yet-shown) highlight. `nextCursor` is the cursor to request
 * the next page, or null at the end.
 */
export interface LoyaltyDiscoveryPage {
  items: LoyaltyDiscoveryCard[];
  nextCursor: number | null;
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
  /** City for push-promotion targeting (matches branch cities). */
  city?: string | null;
  /** Marketing/promotional push consent toggle (Apple 4.5.4). */
  marketingPushOptIn?: boolean;
}
