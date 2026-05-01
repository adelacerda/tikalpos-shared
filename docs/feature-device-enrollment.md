# Feature: Device Enrollment — @tikal-pos/shared

## Context

First step of the device enrollment feature. The shared package is the single source of truth for all types. Backend, web, and tablet import from here.

**Read `CLAUDE.md` before implementing.**

---

## What to Implement

### 1. New file: `src/types/device.ts`

```typescript
// Device role — what POS function this tablet serves
export type DeviceRole = 'WAITER' | 'KITCHEN' | 'BAR' | 'HOST';

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
```

### 2. Edit: `src/index.ts`

Add at the end:

```typescript
export type {
  DeviceRole,
  ActivationCode,
  EnrolledDevice,
  EnrollDeviceInput,
  EnrollDeviceResult,
  ActivationCodeResult,
} from './types/device';
```

---

## Conventions

- All enum values are **UPPERCASE** strings (not TypeScript enums) — same as `StaffRole`, `OrderStatus`, etc.
- Use `string` for dates (ISO 8601), not `Date` — consistent with the rest of the package.
- No runtime code — types only.
- All new types must be exported from `src/index.ts`.

---

## Build & Verify

```bash
npm run build    # Must compile with zero errors
npm run lint     # Must pass with zero TypeScript errors
```

After building, run in consuming repos:

```bash
# In tikalpos-backend and tikalpos-tablet
npm link @tikal-pos/shared
```

---

## Done Criteria

- [ ] `src/types/device.ts` created with all 6 types/interfaces
- [ ] All types exported from `src/index.ts`
- [ ] `npm run build` passes
- [ ] `npm run lint` zero errors
