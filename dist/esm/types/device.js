// Device role — what POS function this tablet serves.
// `DEVICE_ROLES` is the canonical runtime list; the union type below is
// derived from it so they stay in sync.
export const DEVICE_ROLES = ['SERVER', 'KITCHEN', 'BAR', 'HOST', 'SELLER'];
/** Type guard for validating values coming from URLs / external inputs. */
export function isDeviceRole(value) {
    return typeof value === 'string' && DEVICE_ROLES.includes(value);
}
//# sourceMappingURL=device.js.map