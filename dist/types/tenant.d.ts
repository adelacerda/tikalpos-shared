export interface SystemOwner {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export type OrganizationStatus = 'active' | 'suspended' | 'trial';
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
export type LocationStatus = 'active' | 'inactive';
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
    openTime: string;
    closeTime: string;
    closed: boolean;
}
export type StaffRole = 'owner' | 'manager' | 'cashier' | 'server';
export interface Staff {
    id: string;
    organizationId: string;
    locationId: string;
    email: string;
    name: string;
    pin: string;
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
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';
//# sourceMappingURL=tenant.d.ts.map