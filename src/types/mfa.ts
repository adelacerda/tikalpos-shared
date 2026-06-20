// Multi-factor auth (TOTP / authenticator app) — "verificación en dos pasos".
// Per-franchise opt-in for OWNERs (Organization.mfaRequired) + always-on for
// system_owner in production. Trusted-device skip for N days.

/** Days a "trust this device" choice suppresses the second step. */
export const MFA_TRUST_DEVICE_DAYS = 7;
/** How many one-time backup codes are issued on enrollment. */
export const MFA_BACKUP_CODE_COUNT = 10;

/** Returned by POST /auth/mfa/setup — what the enrollment wizard renders. */
export interface MfaSetupResponse {
  /** otpauth:// URI encoded in the QR. */
  otpauthUri: string;
  /** PNG data-URL of the QR (data:image/png;base64,...). */
  qrDataUrl: string;
  /** Base32 secret, grouped in 4s for manual entry ("ABCD EFGH ..."). */
  manualKey: string;
}

export interface MfaEnableInput {
  /** 6-digit TOTP code from the authenticator app. */
  code: string;
}

export interface MfaEnableResponse {
  /** One-time backup codes — shown exactly once. */
  backupCodes: string[];
  /** Full session token issued on successful enrollment. */
  token: string;
  role: string;
}

export interface MfaVerifyInput {
  /** 6-digit TOTP code OR a one-time backup code. */
  code: string;
  /** "Confiar en este dispositivo" — suppress the step for MFA_TRUST_DEVICE_DAYS. */
  trustDevice?: boolean;
}

/**
 * When login needs a second step, the response carries these instead of a full
 * session. `mode` decides which screen the client shows.
 *   - 'verify' → account already enrolled; ask for the code.
 *   - 'setup'  → account must enroll first (forced); run the wizard.
 */
export interface MfaChallenge {
  mfaRequired: true;
  mfaMode: 'verify' | 'setup';
  /** Short-lived token (scope-bound) used only on the /auth/mfa/* endpoints. */
  mfaToken: string;
}

/** Reset another account's MFA (system_owner only). */
export interface MfaResetInput {
  /** Target staff user id (omit for a system owner target). */
  userId?: string;
  /** Target system owner id. */
  systemOwnerId?: string;
}
