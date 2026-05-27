"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TELEMETRY_FLUSH_INTERVAL_MS = exports.TELEMETRY_BUFFER_CAPS = exports.isDeviceRole = exports.DEVICE_ROLES = exports.allowedDeviceRolesFor = exports.allowedStaffRolesFor = exports.isStaffRole = exports.STAFF_ROLES = void 0;
var tenant_1 = require("./types/tenant");
Object.defineProperty(exports, "STAFF_ROLES", { enumerable: true, get: function () { return tenant_1.STAFF_ROLES; } });
Object.defineProperty(exports, "isStaffRole", { enumerable: true, get: function () { return tenant_1.isStaffRole; } });
Object.defineProperty(exports, "allowedStaffRolesFor", { enumerable: true, get: function () { return tenant_1.allowedStaffRolesFor; } });
Object.defineProperty(exports, "allowedDeviceRolesFor", { enumerable: true, get: function () { return tenant_1.allowedDeviceRolesFor; } });
var device_1 = require("./types/device");
Object.defineProperty(exports, "DEVICE_ROLES", { enumerable: true, get: function () { return device_1.DEVICE_ROLES; } });
Object.defineProperty(exports, "isDeviceRole", { enumerable: true, get: function () { return device_1.isDeviceRole; } });
var telemetry_1 = require("./types/telemetry");
Object.defineProperty(exports, "TELEMETRY_BUFFER_CAPS", { enumerable: true, get: function () { return telemetry_1.TELEMETRY_BUFFER_CAPS; } });
Object.defineProperty(exports, "TELEMETRY_FLUSH_INTERVAL_MS", { enumerable: true, get: function () { return telemetry_1.TELEMETRY_FLUSH_INTERVAL_MS; } });
//# sourceMappingURL=index.js.map