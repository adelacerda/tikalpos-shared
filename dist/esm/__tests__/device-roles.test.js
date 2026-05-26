import { describe, expect, it, expectTypeOf } from 'vitest';
import { DEVICE_ROLES, isDeviceRole, } from '../index';
// Smoke tests for `@tikalpos/shared`. Their job is twofold:
//   1. Prove the test pipeline runs (this used to `echo "No tests yet"`).
//   2. Lock down the canonical `DEVICE_ROLES` business constant so any
//      future drift (e.g. someone adding a 6th role without updating the
//      tablet's pin-confirm whitelist) shows up as a failing test.
describe('DEVICE_ROLES (runtime constant)', () => {
    it('contains exactly the 5 supported roles in the documented order', () => {
        expect(DEVICE_ROLES).toEqual(['SERVER', 'KITCHEN', 'BAR', 'HOST', 'SELLER']);
    });
    it('is a readonly tuple (frozen at the const-assertion level)', () => {
        // `as const` makes it `readonly [...]` at the type level; we just
        // sanity-check the runtime shape here.
        expect(Array.isArray(DEVICE_ROLES)).toBe(true);
        expect(DEVICE_ROLES.length).toBe(5);
    });
});
describe('isDeviceRole (type guard)', () => {
    it('returns true for every value in DEVICE_ROLES', () => {
        for (const role of DEVICE_ROLES) {
            expect(isDeviceRole(role)).toBe(true);
        }
    });
    it('returns false for unknown strings', () => {
        expect(isDeviceRole('OWNER')).toBe(false);
        expect(isDeviceRole('WAITER')).toBe(false); // legacy role removed in Sprint 1 R1
        expect(isDeviceRole('server')).toBe(false); // case-sensitive
        expect(isDeviceRole('')).toBe(false);
    });
    it('returns false for non-string inputs', () => {
        expect(isDeviceRole(undefined)).toBe(false);
        expect(isDeviceRole(null)).toBe(false);
        expect(isDeviceRole(42)).toBe(false);
        expect(isDeviceRole({})).toBe(false);
    });
});
describe('Type-level contracts', () => {
    it('DeviceRole is the union of DEVICE_ROLES literals', () => {
        expectTypeOf().toEqualTypeOf();
    });
    it('EnrollDeviceResult exposes orgLanguage (relied on by tablet + web for i18n)', () => {
        expectTypeOf().toHaveProperty('orgLanguage').toBeString();
        expectTypeOf().toHaveProperty('role').toEqualTypeOf();
    });
});
//# sourceMappingURL=device-roles.test.js.map