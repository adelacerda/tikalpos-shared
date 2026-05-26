"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeviceRole = exports.DEVICE_ROLES = exports.allowedDeviceRolesFor = exports.allowedStaffRolesFor = exports.isStaffRole = exports.STAFF_ROLES = void 0;
var tenant_1 = require("./types/tenant");
Object.defineProperty(exports, "STAFF_ROLES", { enumerable: true, get: function () { return tenant_1.STAFF_ROLES; } });
Object.defineProperty(exports, "isStaffRole", { enumerable: true, get: function () { return tenant_1.isStaffRole; } });
Object.defineProperty(exports, "allowedStaffRolesFor", { enumerable: true, get: function () { return tenant_1.allowedStaffRolesFor; } });
Object.defineProperty(exports, "allowedDeviceRolesFor", { enumerable: true, get: function () { return tenant_1.allowedDeviceRolesFor; } });
var device_1 = require("./types/device");
Object.defineProperty(exports, "DEVICE_ROLES", { enumerable: true, get: function () { return device_1.DEVICE_ROLES; } });
Object.defineProperty(exports, "isDeviceRole", { enumerable: true, get: function () { return device_1.isDeviceRole; } });
//# sourceMappingURL=index.js.map