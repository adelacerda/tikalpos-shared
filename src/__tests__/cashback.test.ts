import { describe, it, expect } from 'vitest';
import { activeCashbackMultiplier, cashbackEarnedCents, cashbackApplicableCents, expiryBlockKey, expiryBlockEndsAt, balanceExpiresAt, expiryExamples } from '../types/loyalty';

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

describe('balanceExpiresAt (block end + validity)', () => {
  it("CEO example 1: monthly block + annual validity → Jan-2026 expires 31-Jan-2027", () => {
    const earned = new Date(Date.UTC(2026, 0, 15)); // 15 Jan 2026
    const exp = balanceExpiresAt('MONTHLY', 12, earned);
    expect(exp.toISOString()).toBe('2027-01-31T23:59:59.999Z');
  });

  it("CEO example 2: semiannual block + annual validity → Jan-Jun 2026 expires 30-Jun-2027", () => {
    const jan = balanceExpiresAt('SEMIANNUAL', 12, new Date(Date.UTC(2026, 0, 10)));
    const jun = balanceExpiresAt('SEMIANNUAL', 12, new Date(Date.UTC(2026, 5, 28)));
    expect(jan.toISOString()).toBe('2027-06-30T23:59:59.999Z');
    expect(jun.toISOString()).toBe('2027-06-30T23:59:59.999Z'); // same block → same date
  });

  it('bimonthly block groups two months', () => {
    expect(expiryBlockKey('BIMONTHLY', new Date(Date.UTC(2026, 2, 1)))).toBe('2026-B2'); // Mar → B2
    const exp = balanceExpiresAt('BIMONTHLY', 6, new Date(Date.UTC(2026, 2, 1))); // Mar-Apr block ends Apr-30
    expect(exp.toISOString()).toBe('2026-10-31T23:59:59.999Z'); // +6mo from Apr-30 end
  });

  it('expiryExamples returns consecutive blocks with their expiry dates', () => {
    const rows = expiryExamples('MONTHLY', 12, new Date(Date.UTC(2026, 0, 5)), 2);
    expect(rows).toHaveLength(2);
    expect(rows[0].expiresAt.toISOString()).toBe('2027-01-31T23:59:59.999Z');
    expect(rows[1].expiresAt.toISOString()).toBe('2027-02-28T23:59:59.999Z');
  });
});

describe('expiryBlockKey', () => {
  it('builds the canonical key per cadence', () => {
    const d = new Date('2026-05-15T00:00:00Z');
    expect(expiryBlockKey('MONTHLY', d)).toBe('2026-05');
    expect(expiryBlockKey('QUARTERLY', d)).toBe('2026-Q2');
    expect(expiryBlockKey('SEMIANNUAL', d)).toBe('2026-H1');
    expect(expiryBlockKey('ANNUAL', d)).toBe('2026');
  });
});

describe('expiryBlockEndsAt', () => {
  it('returns the last instant of the block', () => {
    const d = new Date('2026-05-15T12:00:00Z');
    expect(expiryBlockEndsAt('MONTHLY', d).toISOString()).toBe('2026-05-31T23:59:59.999Z');
    expect(expiryBlockEndsAt('QUARTERLY', d).toISOString()).toBe('2026-06-30T23:59:59.999Z');
    expect(expiryBlockEndsAt('SEMIANNUAL', d).toISOString()).toBe('2026-06-30T23:59:59.999Z');
    expect(expiryBlockEndsAt('ANNUAL', d).toISOString()).toBe('2026-12-31T23:59:59.999Z');
  });
});
