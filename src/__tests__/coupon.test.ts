import { describe, it, expect } from 'vitest';
import { isCouponClaimable } from '../types/coupon';

describe('isCouponClaimable', () => {
  const base = { status: 'ACTIVE' as const, expiresAt: '2999-01-01T00:00:00Z', poolClaimed: 0, poolTotal: 10 };

  it('is claimable when active, in-window, and pool remains', () => {
    expect(isCouponClaimable(base)).toBe(true);
  });
  it('is not claimable when the pool is exhausted', () => {
    expect(isCouponClaimable({ ...base, poolClaimed: 10 })).toBe(false);
  });
  it('is not claimable past the absolute expiry', () => {
    expect(isCouponClaimable({ ...base, expiresAt: '2000-01-01T00:00:00Z' })).toBe(false);
  });
  it('is not claimable when DRAFT or CANCELED', () => {
    expect(isCouponClaimable({ ...base, status: 'DRAFT' })).toBe(false);
    expect(isCouponClaimable({ ...base, status: 'CANCELED' })).toBe(false);
  });
});
