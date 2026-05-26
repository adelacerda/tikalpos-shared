"use strict";
// ──────────────────────────────────────────────
// Tenant Hierarchy
// System Owner -> Organization -> Location -> Staff/Guest
// ──────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAFF_ROLES = void 0;
exports.isStaffRole = isStaffRole;
exports.allowedStaffRolesFor = allowedStaffRolesFor;
exports.allowedDeviceRolesFor = allowedDeviceRolesFor;
// Staff role — what a human user can do in the POS.
// `STAFF_ROLES` is the canonical runtime list; the union type below is
// derived from it so they stay in sync. Mirrors the convention used by
// `DEVICE_ROLES` in ./device.ts.
exports.STAFF_ROLES = ['OWNER', 'MANAGER', 'CASHIER', 'SERVER', 'HOST', 'SELLER'];
/** Type guard for validating values coming from URLs / external inputs. */
function isStaffRole(value) {
    return typeof value === 'string' && exports.STAFF_ROLES.includes(value);
}
/**
 * Allowed staff roles per franchise type.
 * Canonical policy — consumed by web UI, backend zod validators, and tablet.
 *
 * RESTAURANT: full-service operations (front-of-house + back-of-house).
 * RETAIL / SERVICE: simplified operations (no servers, no host).
 */
const ROLES_BY_FRANCHISE = {
    RESTAURANT: ['OWNER', 'MANAGER', 'CASHIER', 'SERVER', 'HOST'],
    RETAIL: ['OWNER', 'MANAGER', 'SELLER'],
    SERVICE: ['OWNER', 'MANAGER', 'SELLER'],
};
function allowedStaffRolesFor(franchiseType) {
    return ROLES_BY_FRANCHISE[franchiseType];
}
/**
 * Allowed device (tablet function) roles per franchise type.
 * RETAIL / SERVICE only enroll SELLER tablets; restaurants get the full set.
 */
const DEVICE_ROLES_BY_FRANCHISE = {
    RESTAURANT: ['SERVER', 'KITCHEN', 'BAR', 'HOST'],
    RETAIL: ['SELLER'],
    SERVICE: ['SELLER'],
};
function allowedDeviceRolesFor(franchiseType) {
    return DEVICE_ROLES_BY_FRANCHISE[franchiseType];
}
//# sourceMappingURL=tenant.js.map