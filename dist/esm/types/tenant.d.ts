export interface SystemOwner {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
export type FranchiseType = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'LOYALTY_ONLY';
export interface Organization {
    id: string;
    systemOwnerId: string;
    name: string;
    slug: string;
    status: OrganizationStatus;
    franchiseType: FranchiseType;
    settings: OrganizationSettings;
    /** Owner-defined category tags (e.g. "belleza", "comida china"). Normalized lowercase. */
    tags: string[];
    /** True when the business offers its services at the customer's location
     *  ("Atención a domicilio" — services, NOT product delivery). Default false. */
    offersAtHome: boolean;
    /** Free-text coverage area shown when offersAtHome is on
     *  (e.g. "Zonas 9, 10, 14 · Antigua"). Null when not applicable. */
    coverageArea?: string | null;
    /** Org-level WhatsApp contact (E.164) for "Agendar a domicilio" — used when the
     *  business has no physical branch (pure at-home). Null = no button. */
    whatsapp?: string | null;
    /** Prefilled message template for the WhatsApp scheduling deep-link. */
    whatsappTemplate?: string | null;
    /** Portfolio photos (ordered media URLs) for the merchant profile (home-services). */
    gallery?: string[];
    /** True when the merchant enabled customer reviews (opt-in, off by default). */
    reviewsEnabled?: boolean;
    /** Demo franchise: hidden from the normal loyalty feed; shown ONLY to a guest
     *  whose session is in demo mode (vendor demoing to a prospect). Default false. */
    isDemo?: boolean;
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
    /** Structured city — used for push-promotion targeting (FT-GROWTH-017). */
    city?: string | null;
    /** Branch coordinates for "navigate" deep links (Waze / Maps). */
    latitude?: number | null;
    longitude?: number | null;
    /** Branch WhatsApp contact, stored E.164 (e.g. "+50255551234"). Drives the
     *  "contact via WhatsApp" button in the loyalty app. Null = no button. */
    whatsapp?: string | null;
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
export declare const STAFF_ROLES: readonly ["OWNER", "MANAGER", "CASHIER", "SERVER", "HOST", "SELLER"];
export type StaffRole = typeof STAFF_ROLES[number];
/** Type guard for validating values coming from URLs / external inputs. */
export declare function isStaffRole(value: unknown): value is StaffRole;
export declare function allowedStaffRolesFor(franchiseType: FranchiseType): readonly StaffRole[];
export declare function allowedDeviceRolesFor(franchiseType: FranchiseType): readonly string[];
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
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
//# sourceMappingURL=tenant.d.ts.map