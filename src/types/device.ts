// Device role — what POS function this tablet serves.
// `DEVICE_ROLES` is the canonical runtime list; the union type below is
// derived from it so they stay in sync.
export const DEVICE_ROLES = ['SERVER', 'KITCHEN', 'BAR', 'HOST', 'SELLER'] as const;

export type DeviceRole = typeof DEVICE_ROLES[number];

/** Type guard for validating values coming from URLs / external inputs. */
export function isDeviceRole(value: unknown): value is DeviceRole {
  return typeof value === 'string' && (DEVICE_ROLES as readonly string[]).includes(value);
}

// Activation code — generated per location, time-limited
export interface ActivationCode {
  id: string;
  locationId: string;
  organizationId: string;
  code: string;           // 12-char alphanumeric uppercase
  expiresAt: string;      // ISO 8601
  usedAt: string | null;
  enrolledDeviceId: string | null;
  createdAt: string;
}

// Enrolled device — a tablet that has completed onboarding
export interface EnrolledDevice {
  id: string;
  locationId: string;
  organizationId: string;
  role: DeviceRole;
  label: string | null;
  enrolledAt: string;     // ISO 8601
  lastSeenAt: string | null;
  enrolledByUserId: string | null;
  deviceModel: string | null;   // e.g. "iPad (9th generation)"
  deviceType: string | null;    // e.g. "iPad", "Samsung Galaxy Tab S8"
  appVersion: string | null;    // e.g. "1.2.0"
  createdAt: string;
  updatedAt: string;
}

// POST /api/devices/enroll — request body
export interface EnrollDeviceInput {
  code: string;
  deviceRole: DeviceRole;
  pin?: string;           // Manager PIN (4–6 digits)
  ownerEmail?: string;    // Owner email (if using password auth)
  ownerPassword?: string; // Owner password (if using password auth)
  deviceModel?: string;   // e.g. "iPad (9th generation)"
  deviceType?: string;    // e.g. "iPad"
  appVersion?: string;    // e.g. "1.2.0"
}

// POST /api/devices/enroll — response data
export interface EnrollDeviceResult {
  deviceToken: string;    // JWT for future device API calls
  deviceId: string;
  locationId: string;
  organizationId: string;
  locationName: string;
  orgName: string;
  orgLanguage: string;    // e.g. "en" or "es"
  orgLogoUrl: string | null; // Franchise-uploaded logo; null = use bundled TikalPOS logo
  role: DeviceRole;
}

// POST /api/devices/activation-codes — response data
export interface ActivationCodeResult {
  code: string;           // formatted XXXX-XXXX-XXXX
  expiresAt: string;      // ISO 8601
  expiresInHours: number;
}
