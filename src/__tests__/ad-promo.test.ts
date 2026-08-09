import { describe, it, expect } from 'vitest';
import {
  AD_KINDS,
  promoSectionForKind,
  isPromoKindAvailable,
  type AdKind,
  type PromoEligibilityContext,
} from '../types/ad';

const fullyEnabled: PromoEligibilityContext = {
  loyaltyMode: 'BOTH',
  tiersEnabled: true,
  stampsEnabled: true,
  hasRewards: true,
};

describe('promoSectionForKind', () => {
  it('sends a reward promotion to the reward, not to a franchise section', () => {
    expect(promoSectionForKind('REWARD')).toBeNull();
  });

  it('maps every non-reward kind to its franchise section', () => {
    expect(promoSectionForKind('CASHBACK')).toBe('cashback');
    expect(promoSectionForKind('TIER_DISCOUNT')).toBe('tiers');
    expect(promoSectionForKind('STAMPS')).toBe('stamps');
    expect(promoSectionForKind('GENERIC')).toBe('general');
  });

  it('resolves a section for every kind (no kind falls through)', () => {
    for (const kind of AD_KINDS) {
      const section = promoSectionForKind(kind);
      expect(kind === 'REWARD' ? section === null : typeof section === 'string').toBe(true);
    }
  });
});

describe('isPromoKindAvailable', () => {
  it('allows every kind when the franchise runs everything', () => {
    for (const kind of AD_KINDS) {
      expect(isPromoKindAvailable(kind, fullyEnabled)).toBe(true);
    }
  });

  it('allows GENERIC even when the franchise runs nothing else', () => {
    const bare: PromoEligibilityContext = {
      loyaltyMode: 'POINTS',
      tiersEnabled: false,
      stampsEnabled: false,
      hasRewards: false,
    };
    expect(isPromoKindAvailable('GENERIC', bare)).toBe(true);
  });

  it('blocks REWARD when the franchise has no reward catalog', () => {
    expect(isPromoKindAvailable('REWARD', { ...fullyEnabled, hasRewards: false })).toBe(false);
  });

  it('allows CASHBACK only in CASHBACK or BOTH mode', () => {
    expect(isPromoKindAvailable('CASHBACK', { ...fullyEnabled, loyaltyMode: 'CASHBACK' })).toBe(true);
    expect(isPromoKindAvailable('CASHBACK', { ...fullyEnabled, loyaltyMode: 'BOTH' })).toBe(true);
    expect(isPromoKindAvailable('CASHBACK', { ...fullyEnabled, loyaltyMode: 'POINTS' })).toBe(false);
  });

  it('blocks TIER_DISCOUNT and STAMPS when those features are off', () => {
    expect(isPromoKindAvailable('TIER_DISCOUNT', { ...fullyEnabled, tiersEnabled: false })).toBe(false);
    expect(isPromoKindAvailable('STAMPS', { ...fullyEnabled, stampsEnabled: false })).toBe(false);
  });

  it('keeps an unknown mode string from enabling cashback', () => {
    const ctx: PromoEligibilityContext = { ...fullyEnabled, loyaltyMode: 'STAMPS_ONLY' };
    expect(isPromoKindAvailable('CASHBACK', ctx)).toBe(false);
  });

  it('covers every declared kind', () => {
    const kinds: AdKind[] = [...AD_KINDS];
    expect(kinds).toHaveLength(5);
  });
});
