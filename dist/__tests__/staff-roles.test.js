"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../index");
// Locks down the canonical staff-role set and the franchise-type policy
// matrix. These are consumed by the web Admin UI, the backend zod
// validators, and (indirectly) the tablet onboarding screen.
(0, vitest_1.describe)('STAFF_ROLES (runtime constant)', () => {
    (0, vitest_1.it)('contains exactly the 6 supported staff roles in the documented order', () => {
        (0, vitest_1.expect)(index_1.STAFF_ROLES).toEqual([
            'OWNER',
            'MANAGER',
            'CASHIER',
            'SERVER',
            'HOST',
            'SELLER',
        ]);
    });
    (0, vitest_1.it)('is a readonly tuple (frozen at the const-assertion level)', () => {
        (0, vitest_1.expect)(Array.isArray(index_1.STAFF_ROLES)).toBe(true);
        (0, vitest_1.expect)(index_1.STAFF_ROLES.length).toBe(6);
    });
});
(0, vitest_1.describe)('isStaffRole (type guard)', () => {
    (0, vitest_1.it)('returns true for every value in STAFF_ROLES', () => {
        for (const role of index_1.STAFF_ROLES) {
            (0, vitest_1.expect)((0, index_1.isStaffRole)(role)).toBe(true);
        }
    });
    (0, vitest_1.it)('returns false for legacy WAITER role (removed in Sprint 1 R1)', () => {
        (0, vitest_1.expect)((0, index_1.isStaffRole)('WAITER')).toBe(false);
    });
    (0, vitest_1.it)('returns false for unknown strings and non-strings', () => {
        (0, vitest_1.expect)((0, index_1.isStaffRole)('system_owner')).toBe(false);
        (0, vitest_1.expect)((0, index_1.isStaffRole)('owner')).toBe(false); // case-sensitive
        (0, vitest_1.expect)((0, index_1.isStaffRole)('')).toBe(false);
        (0, vitest_1.expect)((0, index_1.isStaffRole)(undefined)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isStaffRole)(null)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isStaffRole)(42)).toBe(false);
    });
});
(0, vitest_1.describe)('allowedStaffRolesFor (franchise-type policy)', () => {
    (0, vitest_1.it)('RESTAURANT allows OWNER, MANAGER, CASHIER, SERVER, HOST', () => {
        (0, vitest_1.expect)((0, index_1.allowedStaffRolesFor)('RESTAURANT')).toEqual([
            'OWNER',
            'MANAGER',
            'CASHIER',
            'SERVER',
            'HOST',
        ]);
    });
    (0, vitest_1.it)('RESTAURANT does NOT allow SELLER', () => {
        (0, vitest_1.expect)((0, index_1.allowedStaffRolesFor)('RESTAURANT')).not.toContain('SELLER');
    });
    (0, vitest_1.it)('RETAIL allows only OWNER, MANAGER, SELLER', () => {
        (0, vitest_1.expect)((0, index_1.allowedStaffRolesFor)('RETAIL')).toEqual(['OWNER', 'MANAGER', 'SELLER']);
    });
    (0, vitest_1.it)('SERVICE has the same policy as RETAIL', () => {
        (0, vitest_1.expect)((0, index_1.allowedStaffRolesFor)('SERVICE')).toEqual(['OWNER', 'MANAGER', 'SELLER']);
    });
    (0, vitest_1.it)('RETAIL/SERVICE do NOT allow CASHIER, SERVER, or HOST', () => {
        for (const ft of ['RETAIL', 'SERVICE']) {
            const roles = (0, index_1.allowedStaffRolesFor)(ft);
            (0, vitest_1.expect)(roles).not.toContain('CASHIER');
            (0, vitest_1.expect)(roles).not.toContain('SERVER');
            (0, vitest_1.expect)(roles).not.toContain('HOST');
        }
    });
});
(0, vitest_1.describe)('allowedDeviceRolesFor (franchise-type policy)', () => {
    (0, vitest_1.it)('RESTAURANT enrolls SERVER, KITCHEN, BAR, HOST (no SELLER)', () => {
        (0, vitest_1.expect)((0, index_1.allowedDeviceRolesFor)('RESTAURANT')).toEqual([
            'SERVER',
            'KITCHEN',
            'BAR',
            'HOST',
        ]);
    });
    (0, vitest_1.it)('RETAIL only enrolls SELLER tablets', () => {
        (0, vitest_1.expect)((0, index_1.allowedDeviceRolesFor)('RETAIL')).toEqual(['SELLER']);
    });
    (0, vitest_1.it)('SERVICE only enrolls SELLER tablets', () => {
        (0, vitest_1.expect)((0, index_1.allowedDeviceRolesFor)('SERVICE')).toEqual(['SELLER']);
    });
});
(0, vitest_1.describe)('Type-level contracts', () => {
    (0, vitest_1.it)('StaffRole is the union of STAFF_ROLES literals', () => {
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
    });
    (0, vitest_1.it)('allowedStaffRolesFor narrows by FranchiseType', () => {
        (0, vitest_1.expectTypeOf)(index_1.allowedStaffRolesFor)
            .parameter(0)
            .toEqualTypeOf();
    });
});
//# sourceMappingURL=staff-roles.test.js.map