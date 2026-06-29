import { describe, it, expect } from 'vitest';
import { activeCashbackMultiplier, cashbackEarnedCents, cashbackApplicableCents } from '../types/loyalty';

describe('activeCashbackMultiplier', () => {
  const win = { cashbackBoostMultiplier: 2, cashbackBoostStartsAt: '2026-12-01T00:00:00Z', cashbackBoostEndsAt: '2026-12-31T23:59:59Z' };
  it('returns the multiplier inside the window', () => {
    expect(activeCashbackMultiplier(win, new Date('2026-12-15T00:00:00Z'))).toBe(2);
  });
  it('returns 1 outside the window', () => {
    expect(activeCashbackMultiplier(win, new Date('2026-11-30T00:00:00Z'))).toBe(1);
    expect(activeCashbackMultiplier(win, new Date('2027-01-02T00:00:00Z'))).toBe(1);
  });
  it('returns 1 with no boost configured', () => {
    expect(activeCashbackMultiplier({ cashbackBoostMultiplier: null, cashbackBoostStartsAt: null, cashbackBoostEndsAt: null })).toBe(1);
  });
});

describe('cashbackEarnedCents', () => {
  it('applies the rate to the net paid', () => {
    expect(cashbackEarnedCents(10000, 500)).toBe(500); // 5% of Q100
  });
  it('applies the boost multiplier', () => {
    expect(cashbackEarnedCents(10000, 500, 2)).toBe(1000); // double cashback
  });
  it('is 0 for non-positive amount or rate', () => {
    expect(cashbackEarnedCents(0, 500)).toBe(0);
    expect(cashbackEarnedCents(10000, 0)).toBe(0);
  });
});

describe('cashbackApplicableCents', () => {
  it('caps at cap% of the bill', () => {
    expect(cashbackApplicableCents(15000, 20000, 50)).toBe(10000); // Q150 balance, 50% of Q200 = Q100
  });
  it('caps at the balance when balance is the limit', () => {
    expect(cashbackApplicableCents(3000, 20000, 50)).toBe(3000); // only Q30 balance
  });
  it('is 0 with no balance or no bill', () => {
    expect(cashbackApplicableCents(0, 20000, 50)).toBe(0);
    expect(cashbackApplicableCents(15000, 0, 50)).toBe(0);
  });
});
