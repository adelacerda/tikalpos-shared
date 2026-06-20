"use strict";
// Multi-factor auth (TOTP / authenticator app) — "verificación en dos pasos".
// Per-franchise opt-in for OWNERs (Organization.mfaRequired) + always-on for
// system_owner in production. Trusted-device skip for N days.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MFA_BACKUP_CODE_COUNT = exports.MFA_TRUST_DEVICE_DAYS = void 0;
/** Days a "trust this device" choice suppresses the second step. */
exports.MFA_TRUST_DEVICE_DAYS = 7;
/** How many one-time backup codes are issued on enrollment. */
exports.MFA_BACKUP_CODE_COUNT = 10;
//# sourceMappingURL=mfa.js.map