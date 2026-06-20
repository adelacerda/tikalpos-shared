// Multi-factor auth (TOTP / authenticator app) — "verificación en dos pasos".
// Per-franchise opt-in for OWNERs (Organization.mfaRequired) + always-on for
// system_owner in production. Trusted-device skip for N days.
/** Days a "trust this device" choice suppresses the second step. */
export const MFA_TRUST_DEVICE_DAYS = 7;
/** How many one-time backup codes are issued on enrollment. */
export const MFA_BACKUP_CODE_COUNT = 10;
//# sourceMappingURL=mfa.js.map