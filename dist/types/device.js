"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVICE_ROLES = void 0;
exports.isDeviceRole = isDeviceRole;
// Device role — what POS function this tablet serves.
// `DEVICE_ROLES` is the canonical runtime list; the union type below is
// derived from it so they stay in sync.
exports.DEVICE_ROLES = ['WAITER', 'KITCHEN', 'BAR', 'HOST', 'SELLER'];
/** Type guard for validating values coming from URLs / external inputs. */
function isDeviceRole(value) {
    return typeof value === 'string' && exports.DEVICE_ROLES.includes(value);
}
//# sourceMappingURL=device.js.map