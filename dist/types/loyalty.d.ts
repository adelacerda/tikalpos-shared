import { LoyaltyTier } from './tenant';
export interface LoyaltyConfig {
    organizationId: string;
    pointsPerDollar: number;
    redemptionRate: number;
    tierThresholds: TierThreshold[];
    tierDiscounts: TierDiscount[];
}
export interface TierThreshold {
    tier: LoyaltyTier;
    minPoints: number;
    multiplier: number;
}
export interface TierDiscount {
    tier: LoyaltyTier;
    minPoints: number;
    discountBps: number;
}
export type LoyaltyTransactionType = 'earn' | 'redeem' | 'adjust' | 'expire';
export interface LoyaltyTransaction {
    id: string;
    guestId: string;
    organizationId: string;
    orderId?: string;
    type: LoyaltyTransactionType;
    points: number;
    balanceAfter: number;
    description?: string;
    createdAt: string;
}
//# sourceMappingURL=loyalty.d.ts.map