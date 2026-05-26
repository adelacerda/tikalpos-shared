// ──────────────────────────────────────────────
// Tenant Hierarchy
// System Owner -> Organization -> Location -> Staff/Guest
// ──────────────────────────────────────────────
// Staff role — what a human user can do in the POS.
// `STAFF_ROLES` is the canonical runtime list; the union type below is
// derived from it so they stay in sync. Mirrors the convention used by
// `DEVICE_ROLES` in ./device.ts.
export const STAFF_ROLES = ['OWNER', 'MANAGER', 'CASHIER', 'SERVER', 'HOST', 'SELLER'];
/** Type guard for validating values coming from URLs / external inputs. */
export function isStaffRole(value) {
    return typeof value === 'string' && STAFF_ROLES.includes(value);
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
export function allowedStaffRolesFor(franchiseType) {
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
export function allowedDeviceRolesFor(franchiseType) {
    return DEVICE_ROLES_BY_FRANCHISE[franchiseType];
}
//# sourceMappingURL=tenant.js.map