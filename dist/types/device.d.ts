export type DeviceRole = 'WAITER' | 'KITCHEN' | 'BAR' | 'HOST' | 'SELLER';
export interface ActivationCode {
    id: string;
    locationId: string;
    organizationId: string;
    code: string;
    expiresAt: string;
    usedAt: string | null;
    enrolledDeviceId: string | null;
    createdAt: string;
}
export interface EnrolledDevice {
    id: string;
    locationId: string;
    organizationId: string;
    role: DeviceRole;
    label: string | null;
    enrolledAt: string;
    lastSeenAt: string | null;
    enrolledByUserId: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface EnrollDeviceInput {
    code: string;
    deviceRole: DeviceRole;
    pin?: string;
    ownerEmail?: string;
    ownerPassword?: string;
}
export interface EnrollDeviceResult {
    deviceToken: string;
    deviceId: string;
    locationId: string;
    organizationId: string;
    locationName: string;
    orgName: string;
    role: DeviceRole;
}
export interface ActivationCodeResult {
    code: string;
    expiresAt: string;
    expiresInHours: number;
}
//# sourceMappingURL=device.d.ts.map