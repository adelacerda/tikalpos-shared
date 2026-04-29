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

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE';

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

export interface RewardCatalogItem {
  rewardId: string;
  name: string;
  pointsCost: number;
  description?: string;
  active: boolean;
  requiredProductIds?: string[];
  minCheckAmount?: number;
  redemptionWindowDays?: number;
  discountType?: 'ITEM_COST' | 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
}

export interface EarnPointsInput {
  guestId: string;
  organizationId: string;
  orderId: string;
  transactionTotalCents: number;
}

export interface EarnPointsResult {
  pointsEarned: number;
  newBalance: number;
  calculation: {
    transactionTotalCents: number;
    transactionDollars: number;
    pointsRatio: number;
    tierMultiplier: number;
    rawPoints: number;
    finalPoints: number;
  };
}

export interface RedeemRewardInput {
  guestId: string;
  organizationId: string;
  rewardId: string;
  orderId?: string;
}

export interface RedeemRewardResult {
  rewardName: string;
  pointsSpent: number;
  newBalance: number;
}
