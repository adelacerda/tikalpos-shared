// ──────────────────────────────────────────────
// Loyalty System
// ──────────────────────────────────────────────

import { LoyaltyTier } from './tenant';

export interface LoyaltyConfig {
  organizationId: string;
  pointsPerDollar: number; // e.g. 10 = 10 points per $1
  redemptionRate: number; // cents per point, e.g. 1 = 1¢ per point
  tierThresholds: TierThreshold[];
  tierDiscounts: TierDiscount[];
}

export interface TierThreshold {
  tier: LoyaltyTier;
  minPoints: number;
  multiplier: number; // earning multiplier, e.g. 1.5x for gold
}

export interface TierDiscount {
  tier: LoyaltyTier;
  minPoints: number; // minimum points to qualify
  discountBps: number; // discount in basis points (500 = 5%)
}

export type LoyaltyTransactionType = 'earn' | 'redeem' | 'adjust' | 'expire';

export interface LoyaltyTransaction {
  id: string;
  guestId: string;
  organizationId: string;
  orderId?: string;
  type: LoyaltyTransactionType;
  points: number; // positive for earn/adjust, negative for redeem/expire
  balanceAfter: number;
  description?: string;
  createdAt: string;
}
