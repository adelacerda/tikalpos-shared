// ──────────────────────────────────────────────
// Tenant Hierarchy
// System Owner -> Organization -> Location -> Staff/Guest
// ──────────────────────────────────────────────

export interface SystemOwner {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export type FranchiseType = 'RESTAURANT' | 'RETAIL' | 'SERVICE';

export interface Organization {
  id: string;
  systemOwnerId: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  franchiseType: FranchiseType;
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  currency: string;
  timezone: string;
  taxRate: number;
  loyaltyEnabled: boolean;
  receiptHeader?: string;
  receiptFooter?: string;
}

export type LocationStatus = 'ACTIVE' | 'INACTIVE';

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  status: LocationStatus;
  settings: LocationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface LocationSettings {
  operatingHours: OperatingHours[];
  taxOverride?: number;
  receiptHeaderOverride?: string;
}

export interface OperatingHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  openTime: string;  // HH:mm
  closeTime: string; // HH:mm
  closed: boolean;
}

// Staff role — what a human user can do in the POS.
// `STAFF_ROLES` is the canonical runtime list; the union type below is
// derived from it so they stay in sync. Mirrors the convention used by
// `DEVICE_ROLES` in ./device.ts.
export const STAFF_ROLES = ['OWNER', 'MANAGER', 'CASHIER', 'SERVER', 'HOST', 'SELLER'] as const;

export type StaffRole = typeof STAFF_ROLES[number];

/** Type guard for validating values coming from URLs / external inputs. */
export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && (STAFF_ROLES as readonly string[]).includes(value);
}

/**
 * Allowed staff roles per franchise type.
 * Canonical policy — consumed by web UI, backend zod validators, and tablet.
 *
 * RESTAURANT: full-service operations (front-of-house + back-of-house).
 * RETAIL / SERVICE: simplified operations (no servers, no host).
 */
const ROLES_BY_FRANCHISE: Record<FranchiseType, readonly StaffRole[]> = {
  RESTAURANT: ['OWNER', 'MANAGER', 'CASHIER', 'SERVER', 'HOST'],
  RETAIL:     ['OWNER', 'MANAGER', 'SELLER'],
  SERVICE:    ['OWNER', 'MANAGER', 'SELLER'],
};

export function allowedStaffRolesFor(franchiseType: FranchiseType): readonly StaffRole[] {
  return ROLES_BY_FRANCHISE[franchiseType];
}

/**
 * Allowed device (tablet function) roles per franchise type.
 * RETAIL / SERVICE only enroll SELLER tablets; restaurants get the full set.
 */
const DEVICE_ROLES_BY_FRANCHISE: Record<FranchiseType, readonly string[]> = {
  RESTAURANT: ['SERVER', 'KITCHEN', 'BAR', 'HOST'],
  RETAIL:     ['SELLER'],
  SERVICE:    ['SELLER'],
};

export function allowedDeviceRolesFor(franchiseType: FranchiseType): readonly string[] {
  return DEVICE_ROLES_BY_FRANCHISE[franchiseType];
}

export interface Staff {
  id: string;
  organizationId: string;
  locationId: string;
  email: string;
  name: string;
  pin: string; // hashed 4-6 digit PIN for quick POS login
  role: StaffRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  organizationId: string;
  name?: string;
  email?: string;
  phone?: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  createdAt: string;
  updatedAt: string;
}

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
