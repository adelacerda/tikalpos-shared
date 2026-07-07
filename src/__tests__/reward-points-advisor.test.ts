import { describe, it, expect } from 'vitest';
import {
  expectedRewardCostCents,
  requiredSpendCents,
  recommendedRewardPoints,
  profitabilityForPoints,
  bandForMargin,
  ticketDriftExceeds,
} from '../types/reward-points-advisor';

describe('expectedRewardCostCents', () => {
  it('FREE_PRODUCT / GIFT → the real cost', () => {
    expect(expectedRewardCostCents({ rewardKind: 'FREE_PRODUCT', realCostCents: 2500 })).toBe(2500);
    expect(expectedRewardCostCents({ rewardKind: 'GIFT', realCostCents: 800 })).toBe(800);
  });

  it('FREE_PRODUCT with no cost → null (not ready)', () => {
    expect(expectedRewardCostCents({ rewardKind: 'FREE_PRODUCT' })).toBeNull();
  });

  it('DISCOUNT / FIXED_AMOUNT → the stored cents', () => {
    expect(expectedRewardCostCents({ rewardKind: 'DISCOUNT', discountType: 'FIXED_AMOUNT', discountValue: 2500 })).toBe(2500);
  });

  it('DISCOUNT / PERCENTAGE → ticket × percent', () => {
    // Q180 ticket, 20% → Q36 = 3600 cents
    expect(expectedRewardCostCents({ rewardKind: 'DISCOUNT', discountType: 'PERCENTAGE', discountValue: 20, avgTicketCents: 18000 })).toBe(3600);
  });

  it('PERCENTAGE is bounded by the max-discount cap (worst case)', () => {
    // 20% of Q500 = Q100, but capped at Q50 → 5000 cents
    expect(
      expectedRewardCostCents({ rewardKind: 'DISCOUNT', discountType: 'PERCENTAGE', discountValue: 20, avgTicketCents: 50000, maxDiscountCents: 5000 }),
    ).toBe(5000);
  });

  it('PERCENTAGE without a ticket → null', () => {
    expect(expectedRewardCostCents({ rewardKind: 'DISCOUNT', discountType: 'PERCENTAGE', discountValue: 20 })).toBeNull();
  });
});

describe('requiredSpendCents + recommendedRewardPoints', () => {
  it('spec example: Q25 cost, 5% margin → Q500 spend', () => {
    expect(requiredSpendCents(2500, 5)).toBe(50000);
  });

  it('spec example: Q25 cost, 5% margin, 2 pts/Q → 1000 points', () => {
    expect(recommendedRewardPoints(2500, 5, 2)).toBe(1000);
  });

  it('spec example: Q25 cost, 5% margin, 1 pt/Q → 500 points', () => {
    expect(recommendedRewardPoints(2500, 5, 1)).toBe(500);
  });

  it('adapts to fractional programs (0.5 pt/Q)', () => {
    expect(recommendedRewardPoints(2500, 5, 0.5)).toBe(250);
  });
});

describe('profitabilityForPoints + bandForMargin', () => {
  it('classifies bands at the 5% and 8% thresholds', () => {
    expect(bandForMargin(4)).toBe('GREEN');
    expect(bandForMargin(5)).toBe('GREEN');
    expect(bandForMargin(6)).toBe('YELLOW');
    expect(bandForMargin(8)).toBe('YELLOW');
    expect(bandForMargin(9)).toBe('RED');
  });

  it('recommended points land exactly on the target margin (green)', () => {
    // 1000 pts at 2 pts/Q ⇒ Q500 spend; cost Q25 ⇒ 5% ⇒ green
    const r = profitabilityForPoints(2500, 1000, 2);
    expect(Math.round(r.marginPct)).toBe(5);
    expect(r.band).toBe('GREEN');
  });

  it('too-few points → worse margin → red', () => {
    // 200 pts at 2 pts/Q ⇒ Q100 spend; cost Q25 ⇒ 25% ⇒ red
    const r = profitabilityForPoints(2500, 200, 2);
    expect(r.band).toBe('RED');
  });

  it('zero points → infinite margin → red', () => {
    expect(profitabilityForPoints(2500, 0, 2).band).toBe('RED');
  });
});

describe('ticketDriftExceeds', () => {
  it('flags a >20% change', () => {
    expect(ticketDriftExceeds(18000, 24500)).toBe(true); // Q180 → Q245 ≈ +36%
  });
  it('ignores a small change', () => {
    expect(ticketDriftExceeds(18000, 19000)).toBe(false); // ≈ +5.5%
  });
  it('never flags when there is no prior ticket', () => {
    expect(ticketDriftExceeds(0, 24500)).toBe(false);
  });
});
