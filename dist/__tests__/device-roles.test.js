"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../index");
// Smoke tests for `@tikalpos/shared`. Their job is twofold:
//   1. Prove the test pipeline runs (this used to `echo "No tests yet"`).
//   2. Lock down the canonical `DEVICE_ROLES` business constant so any
//      future drift (e.g. someone adding a 6th role without updating the
//      tablet's pin-confirm whitelist) shows up as a failing test.
(0, vitest_1.describe)('DEVICE_ROLES (runtime constant)', () => {
    (0, vitest_1.it)('contains exactly the 5 supported roles in the documented order', () => {
        (0, vitest_1.expect)(index_1.DEVICE_ROLES).toEqual(['WAITER', 'KITCHEN', 'BAR', 'HOST', 'SELLER']);
    });
    (0, vitest_1.it)('is a readonly tuple (frozen at the const-assertion level)', () => {
        // `as const` makes it `readonly [...]` at the type level; we just
        // sanity-check the runtime shape here.
        (0, vitest_1.expect)(Array.isArray(index_1.DEVICE_ROLES)).toBe(true);
        (0, vitest_1.expect)(index_1.DEVICE_ROLES.length).toBe(5);
    });
});
(0, vitest_1.describe)('isDeviceRole (type guard)', () => {
    (0, vitest_1.it)('returns true for every value in DEVICE_ROLES', () => {
        for (const role of index_1.DEVICE_ROLES) {
            (0, vitest_1.expect)((0, index_1.isDeviceRole)(role)).toBe(true);
        }
    });
    (0, vitest_1.it)('returns false for unknown strings', () => {
        (0, vitest_1.expect)((0, index_1.isDeviceRole)('OWNER')).toBe(false);
        (0, vitest_1.expect)((0, index_1.isDeviceRole)('waiter')).toBe(false); // case-sensitive
        (0, vitest_1.expect)((0, index_1.isDeviceRole)('')).toBe(false);
    });
    (0, vitest_1.it)('returns false for non-string inputs', () => {
        (0, vitest_1.expect)((0, index_1.isDeviceRole)(undefined)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isDeviceRole)(null)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isDeviceRole)(42)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isDeviceRole)({})).toBe(false);
    });
});
(0, vitest_1.describe)('Type-level contracts', () => {
    (0, vitest_1.it)('DeviceRole is the union of DEVICE_ROLES literals', () => {
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
    });
    (0, vitest_1.it)('EnrollDeviceResult exposes orgLanguage (relied on by tablet + web for i18n)', () => {
        (0, vitest_1.expectTypeOf)().toHaveProperty('orgLanguage').toBeString();
        (0, vitest_1.expectTypeOf)().toHaveProperty('role').toEqualTypeOf();
    });
});
//# sourceMappingURL=device-roles.test.js.map