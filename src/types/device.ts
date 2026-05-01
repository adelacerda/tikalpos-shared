// Device role — what POS function this tablet serves
export type DeviceRole = 'WAITER' | 'KITCHEN' | 'BAR' | 'HOST' | 'SELLER';

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
}

// POST /api/devices/enroll — response data
export interface EnrollDeviceResult {
  deviceToken: string;    // JWT for future device API calls
  deviceId: string;
  locationId: string;
  organizationId: string;
  locationName: string;
  orgName: string;
  role: DeviceRole;
}

// POST /api/devices/activation-codes — response data
export interface ActivationCodeResult {
  code: string;           // formatted XXXX-XXXX-XXXX
  expiresAt: string;      // ISO 8601
  expiresInHours: number;
}
