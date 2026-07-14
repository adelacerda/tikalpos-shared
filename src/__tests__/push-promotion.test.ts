import { describe, it, expect } from 'vitest';
import { buildPushDeepLink, validateCampaignAnchor, pushRate } from '../types/push-promotion';

describe('buildPushDeepLink', () => {
  it('points at the reward when anchored to a reward', () => {
    expect(buildPushDeepLink('REWARD', 'org1', 'rew1')).toBe('tikalpos://reward/org1/rew1');
  });
  it('falls back to the franchise screen when a REWARD anchor has no reward', () => {
    expect(buildPushDeepLink('REWARD', 'org1', null)).toBe('tikalpos://franchise/org1');
  });
  it('opens the franchise screen for NONE and CASHBACK_BOOST', () => {
    expect(buildPushDeepLink('NONE', 'org1', null)).toBe('tikalpos://franchise/org1');
    expect(buildPushDeepLink('CASHBACK_BOOST', 'org1', null)).toBe('tikalpos://franchise/org1');
  });
});

describe('validateCampaignAnchor', () => {
  const win = { campaignStartsAt: '2026-11-01T00:00:00Z', campaignEndsAt: '2026-12-15T00:00:00Z' };
  const boost = { multiplier: 2, startsAt: '2026-12-01T00:00:00Z', endsAt: '2026-12-31T23:59:59Z' };

  it('NONE is always ok', () => {
    expect(validateCampaignAnchor({ anchorType: 'NONE', ...win })).toEqual({ ok: true });
  });

  it('REWARD requires a rewardId', () => {
    expect(validateCampaignAnchor({ anchorType: 'REWARD', rewardId: 'r1', ...win })).toEqual({ ok: true });
    expect(validateCampaignAnchor({ anchorType: 'REWARD', rewardId: null, ...win })).toEqual({ ok: false, error: 'REWARD_REQUIRED' });
  });

  it('CASHBACK_BOOST blocks when no boost is configured', () => {
    expect(validateCampaignAnchor({ anchorType: 'CASHBACK_BOOST', cashbackBoost: null, ...win }))
      .toEqual({ ok: false, error: 'CASHBACK_BOOST_NOT_CONFIGURED' });
    expect(validateCampaignAnchor({ anchorType: 'CASHBACK_BOOST', cashbackBoost: { multiplier: 1, startsAt: boost.startsAt, endsAt: boost.endsAt }, ...win }))
      .toEqual({ ok: false, error: 'CASHBACK_BOOST_NOT_CONFIGURED' });
  });

  it('CASHBACK_BOOST allows advertising BEFORE / overlapping the boost window', () => {
    // Campaign Nov 1 → Dec 15 announcing a Dec 1 → Dec 31 boost.
    expect(validateCampaignAnchor({ anchorType: 'CASHBACK_BOOST', cashbackBoost: boost, ...win })).toEqual({ ok: true });
  });

  it('CASHBACK_BOOST warns (not blocks) when the campaign runs entirely after the boost expired', () => {
    expect(validateCampaignAnchor({
      anchorType: 'CASHBACK_BOOST',
      cashbackBoost: boost,
      campaignStartsAt: '2027-01-05T00:00:00Z',
      campaignEndsAt: '2027-01-20T00:00:00Z',
    })).toEqual({ ok: true, warning: 'CAMPAIGN_ENTIRELY_AFTER_ANCHOR_EXPIRY' });
  });
});

describe('pushRate', () => {
  it('returns the ratio', () => {
    expect(pushRate(1, 4)).toBe(0.25);
    expect(pushRate(3, 3)).toBe(1);
  });

  it('returns 0 instead of NaN/Infinity when nothing was sent', () => {
    expect(pushRate(0, 0)).toBe(0);
    expect(pushRate(5, 0)).toBe(0);
  });
});
