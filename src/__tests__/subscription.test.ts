import { describe, expect, it, expectTypeOf } from 'vitest';
import {
  PLAN_TIERS,
  BILLING_CYCLES,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_EVENT_KINDS,
  PLAN_LIMITS,
  isPlanTier,
  isLoyaltyOnlyPlan,
  isBillingCycle,
  isSubscriptionStatus,
  isSubscriptionEventKind,
  type PlanTier,
  type PlanLimits,
} from '../index';

// Locks down the subscription-tier contract that powers `subscriptionGuard`
// in backend, the super-admin pricing UI in tikalpos-web, and the public
// Pricing section in tikalpos-website. Numeric defaults match the analysis
// in docs/market-price-analysis.md §2.1 and §3.2.

describe('PLAN_TIERS (runtime constant)', () => {
  it('contains the supported tiers in business order', () => {
    expect(PLAN_TIERS).toEqual(['LOYALTY_LITE', 'LOYALTY_PRO', 'LOYALTY_MAX', 'STARTER', 'PRO', 'SCALE', 'ENTERPRISE']);
  });
});

describe('BILLING_CYCLES, SUBSCRIPTION_STATUSES, SUBSCRIPTION_EVENT_KINDS', () => {
  it('billing cycles are MONTHLY and ANNUAL', () => {
    expect(BILLING_CYCLES).toEqual(['MONTHLY', 'ANNUAL']);
  });

  it('subscription statuses cover the lifecycle', () => {
    expect(SUBSCRIPTION_STATUSES).toEqual([
      'ACTIVE',
      'TRIAL',
      'PAST_DUE',
      'SUSPENDED',
      'CANCELED',
    ]);
  });

  it('event kinds cover audit log triggers', () => {
    expect(SUBSCRIPTION_EVENT_KINDS).toEqual([
      'CREATED',
      'TIER_CHANGED',
      'STATUS_CHANGED',
      'PERIOD_ROLLED',
      'MANUAL_SUSPEND',
      'MANUAL_REACTIVATE',
      'BOOST_CHARGED',
      'DISCOVERY_HIGHLIGHT_CHARGED',
    ]);
  });
});

describe('Type guards', () => {
  it('isPlanTier accepts canonical tiers, rejects strangers', () => {
    for (const t of PLAN_TIERS) expect(isPlanTier(t)).toBe(true);
    expect(isPlanTier('starter')).toBe(false); // case-sensitive
    expect(isPlanTier('FREE')).toBe(false);
    expect(isPlanTier(null)).toBe(false);
    expect(isPlanTier(42)).toBe(false);
  });

  it('isBillingCycle is strict', () => {
    expect(isBillingCycle('MONTHLY')).toBe(true);
    expect(isBillingCycle('ANNUAL')).toBe(true);
    expect(isBillingCycle('WEEKLY')).toBe(false);
    expect(isBillingCycle(undefined)).toBe(false);
  });

  it('isSubscriptionStatus is strict', () => {
    expect(isSubscriptionStatus('TRIAL')).toBe(true);
    expect(isSubscriptionStatus('EXPIRED')).toBe(false);
  });

  it('isSubscriptionEventKind is strict', () => {
    expect(isSubscriptionEventKind('TIER_CHANGED')).toBe(true);
    expect(isSubscriptionEventKind('TIER_DOWNGRADED')).toBe(false);
  });
});

describe('PLAN_LIMITS — pricing matrix (Q centavos)', () => {
  it('exposes one entry per tier', () => {
    expect(Object.keys(PLAN_LIMITS).sort()).toEqual([...PLAN_TIERS].sort());
  });

  it('STARTER pricing matches analysis §2.1 (Q 249/mes, Q 2,390/year, 500 tx incl., Q 0.50 overage)', () => {
    const p = PLAN_LIMITS.STARTER;
    expect(p.monthlyFeeCents).toBe(24_900);
    expect(p.annualFeeCents).toBe(239_000);
    expect(p.includedTransactions).toBe(500);
    expect(p.overagePerTxCents).toBe(50);
    expect(p.maxLocations).toBe(1);
    expect(p.maxEnrolledDevices).toBe(1);
    expect(p.includedPromoPushPerMonth).toBe(0); // promo push feature OFF on Starter
  });

  it('PRO pricing matches analysis §2.1 (Q 749/mes, 5,000 tx incl., Q 0.30 overage)', () => {
    const p = PLAN_LIMITS.PRO;
    expect(p.monthlyFeeCents).toBe(74_900);
    expect(p.annualFeeCents).toBe(719_000);
    expect(p.includedTransactions).toBe(5_000);
    expect(p.overagePerTxCents).toBe(30);
    expect(p.maxLocations).toBe(5);
    expect(p.includedHighlightImpressions).toBe(5_000);
    expect(p.includedPromoPushPerMonth).toBe(5_000);
  });

  it('SCALE pricing matches analysis §2.1 (Q 1,999/mes, 25,000 tx incl., Q 0.20 overage)', () => {
    const p = PLAN_LIMITS.SCALE;
    expect(p.monthlyFeeCents).toBe(199_900);
    expect(p.annualFeeCents).toBe(1_919_000);
    expect(p.includedTransactions).toBe(25_000);
    expect(p.overagePerTxCents).toBe(20);
    expect(p.maxLocations).toBe(25);
    expect(p.includedHighlightImpressions).toBe(25_000);
    expect(p.includedPromoPushPerMonth).toBe(50_000);
  });

  it('ENTERPRISE is unlimited / negotiated', () => {
    const p = PLAN_LIMITS.ENTERPRISE;
    expect(p.monthlyFeeCents).toBe(0); // negotiated per contract
    expect(p.maxLocations).toBeGreaterThanOrEqual(999_999);
    expect(p.maxEnrolledDevices).toBeGreaterThanOrEqual(999_999);
    expect(p.maxConcurrentWsSessions).toBeGreaterThanOrEqual(999_999);
    expect(p.includedHighlightImpressions).toBeGreaterThanOrEqual(999_999);
  });

  it('annual fee is exactly 12× monthly minus 20% (with rounding tolerance)', () => {
    // Ignore Enterprise (negotiated, both 0).
    for (const tier of ['STARTER', 'PRO', 'SCALE'] as const) {
      const p = PLAN_LIMITS[tier];
      const expectedAnnual = Math.round(p.monthlyFeeCents * 12 * 0.8);
      // tolerate ±100 cents (Q 1) of marketing rounding
      expect(Math.abs(p.annualFeeCents - expectedAnnual)).toBeLessThanOrEqual(100);
    }
  });

  it('included highlight impressions grow with tier', () => {
    expect(PLAN_LIMITS.PRO.includedHighlightImpressions).toBeGreaterThan(
      PLAN_LIMITS.STARTER.includedHighlightImpressions,
    );
    expect(PLAN_LIMITS.SCALE.includedHighlightImpressions).toBeGreaterThan(
      PLAN_LIMITS.PRO.includedHighlightImpressions,
    );
  });

  it('overage rate decreases monotonically as tier grows', () => {
    expect(PLAN_LIMITS.STARTER.overagePerTxCents).toBeGreaterThan(
      PLAN_LIMITS.PRO.overagePerTxCents,
    );
    expect(PLAN_LIMITS.PRO.overagePerTxCents).toBeGreaterThan(
      PLAN_LIMITS.SCALE.overagePerTxCents,
    );
  });

  it('capacity caps increase monotonically (Starter < Pro < Scale)', () => {
    const fields: (keyof PlanLimits)[] = [
      'maxLocations',
      'maxEnrolledDevices',
      'maxLoyaltyMembers',
      'maxConcurrentWsSessions',
      'maxActiveAdCampaigns',
      'includedTransactions',
    ];
    for (const f of fields) {
      const s = PLAN_LIMITS.STARTER[f] as number;
      const p = PLAN_LIMITS.PRO[f] as number;
      const sc = PLAN_LIMITS.SCALE[f] as number;
      expect(p).toBeGreaterThan(s);
      expect(sc).toBeGreaterThan(p);
    }
  });

  it('STARTER explicitly disables promo push (gancho de upsell)', () => {
    expect(PLAN_LIMITS.STARTER.includedPromoPushPerMonth).toBe(0);
    expect(PLAN_LIMITS.STARTER.promoPushSchedulingKinds).toEqual([]);
  });

  it('segmentation kinds expand as tier grows', () => {
    expect(PLAN_LIMITS.STARTER.adSegmentationKinds.length).toBeLessThan(
      PLAN_LIMITS.SCALE.adSegmentationKinds.length,
    );
    expect(PLAN_LIMITS.PRO.promoPushSegmentationKinds.length).toBeLessThan(
      PLAN_LIMITS.SCALE.promoPushSegmentationKinds.length,
    );
  });
});

describe('Loyalty Pro plan', () => {
  it('is an exact copy of Loyalty Lite except the branch limit (5 vs 1)', () => {
    const { tier: _l, maxLocations: liteMax, ...liteRest } = PLAN_LIMITS.LOYALTY_LITE;
    const { tier: _p, maxLocations: proMax, ...proRest } = PLAN_LIMITS.LOYALTY_PRO;
    expect(liteMax).toBe(1);
    expect(proMax).toBe(5);
    expect(proRest).toEqual(liteRest); // everything else identical
  });

  it('isLoyaltyOnlyPlan covers both LITE and PRO, not POS tiers', () => {
    expect(isLoyaltyOnlyPlan('LOYALTY_LITE')).toBe(true);
    expect(isLoyaltyOnlyPlan('LOYALTY_PRO')).toBe(true);
    expect(isLoyaltyOnlyPlan('STARTER')).toBe(false);
    expect(isLoyaltyOnlyPlan('ENTERPRISE')).toBe(false);
    expect(isLoyaltyOnlyPlan(null)).toBe(false);
  });

  it('LOYALTY_PRO is a recognized plan tier', () => {
    expect(isPlanTier('LOYALTY_PRO')).toBe(true);
    expect(PLAN_TIERS).toContain('LOYALTY_PRO');
  });
});

describe('Type-level contracts', () => {
  it('PlanTier is the union of PLAN_TIERS literals', () => {
    expectTypeOf<PlanTier>().toEqualTypeOf<'LOYALTY_LITE' | 'LOYALTY_PRO' | 'LOYALTY_MAX' | 'STARTER' | 'PRO' | 'SCALE' | 'ENTERPRISE'>();
  });
});
