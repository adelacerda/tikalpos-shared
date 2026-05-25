import { describe, expect, it, expectTypeOf } from 'vitest';
import {
  STAFF_ROLES,
  isStaffRole,
  allowedStaffRolesFor,
  allowedDeviceRolesFor,
  type StaffRole,
  type FranchiseType,
} from '../index';

// Locks down the canonical staff-role set and the franchise-type policy
// matrix. These are consumed by the web Admin UI, the backend zod
// validators, and (indirectly) the tablet onboarding screen.

describe('STAFF_ROLES (runtime constant)', () => {
  it('contains exactly the 6 supported staff roles in the documented order', () => {
    expect(STAFF_ROLES).toEqual([
      'OWNER',
      'MANAGER',
      'CASHIER',
      'SERVER',
      'HOST',
      'SELLER',
    ]);
  });

  it('is a readonly tuple (frozen at the const-assertion level)', () => {
    expect(Array.isArray(STAFF_ROLES)).toBe(true);
    expect(STAFF_ROLES.length).toBe(6);
  });
});

describe('isStaffRole (type guard)', () => {
  it('returns true for every value in STAFF_ROLES', () => {
    for (const role of STAFF_ROLES) {
      expect(isStaffRole(role)).toBe(true);
    }
  });

  it('returns false for legacy WAITER role (removed in Sprint 1 R1)', () => {
    expect(isStaffRole('WAITER')).toBe(false);
  });

  it('returns false for unknown strings and non-strings', () => {
    expect(isStaffRole('system_owner')).toBe(false);
    expect(isStaffRole('owner')).toBe(false); // case-sensitive
    expect(isStaffRole('')).toBe(false);
    expect(isStaffRole(undefined)).toBe(false);
    expect(isStaffRole(null)).toBe(false);
    expect(isStaffRole(42)).toBe(false);
  });
});

describe('allowedStaffRolesFor (franchise-type policy)', () => {
  it('RESTAURANT allows OWNER, MANAGER, CASHIER, SERVER, HOST', () => {
    expect(allowedStaffRolesFor('RESTAURANT')).toEqual([
      'OWNER',
      'MANAGER',
      'CASHIER',
      'SERVER',
      'HOST',
    ]);
  });

  it('RESTAURANT does NOT allow SELLER', () => {
    expect(allowedStaffRolesFor('RESTAURANT')).not.toContain('SELLER');
  });

  it('RETAIL allows only OWNER, MANAGER, SELLER', () => {
    expect(allowedStaffRolesFor('RETAIL')).toEqual(['OWNER', 'MANAGER', 'SELLER']);
  });

  it('SERVICE has the same policy as RETAIL', () => {
    expect(allowedStaffRolesFor('SERVICE')).toEqual(['OWNER', 'MANAGER', 'SELLER']);
  });

  it('RETAIL/SERVICE do NOT allow CASHIER, SERVER, or HOST', () => {
    for (const ft of ['RETAIL', 'SERVICE'] as const) {
      const roles = allowedStaffRolesFor(ft);
      expect(roles).not.toContain('CASHIER');
      expect(roles).not.toContain('SERVER');
      expect(roles).not.toContain('HOST');
    }
  });
});

describe('allowedDeviceRolesFor (franchise-type policy)', () => {
  it('RESTAURANT enrolls SERVER, KITCHEN, BAR, HOST (no SELLER)', () => {
    expect(allowedDeviceRolesFor('RESTAURANT')).toEqual([
      'SERVER',
      'KITCHEN',
      'BAR',
      'HOST',
    ]);
  });

  it('RETAIL only enrolls SELLER tablets', () => {
    expect(allowedDeviceRolesFor('RETAIL')).toEqual(['SELLER']);
  });

  it('SERVICE only enrolls SELLER tablets', () => {
    expect(allowedDeviceRolesFor('SERVICE')).toEqual(['SELLER']);
  });
});

describe('Type-level contracts', () => {
  it('StaffRole is the union of STAFF_ROLES literals', () => {
    expectTypeOf<StaffRole>().toEqualTypeOf<
      'OWNER' | 'MANAGER' | 'CASHIER' | 'SERVER' | 'HOST' | 'SELLER'
    >();
  });

  it('allowedStaffRolesFor narrows by FranchiseType', () => {
    expectTypeOf(allowedStaffRolesFor)
      .parameter(0)
      .toEqualTypeOf<FranchiseType>();
  });
});
