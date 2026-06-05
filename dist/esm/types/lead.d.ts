export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CUSTOMER' | 'LOST' | 'NURTURING';
export declare const LEAD_STATUSES: readonly LeadStatus[];
export declare function isLeadStatus(value: unknown): value is LeadStatus;
export type LeadSource = 'HERO_CTA' | 'CTA_STRIP' | 'FOOTER' | 'NAV' | 'CHAT_HANDOFF' | 'DIRECT' | 'OTHER';
export declare const LEAD_SOURCES: readonly LeadSource[];
export declare function isLeadSource(value: unknown): value is LeadSource;
export type LeadVertical = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'BOTH' | 'OTHER';
export declare const LEAD_VERTICALS: readonly LeadVertical[];
export declare function isLeadVertical(value: unknown): value is LeadVertical;
export type LeadEventKind = 'CREATED' | 'STATUS_CHANGED' | 'NOTE_ADDED' | 'CONTACTED' | 'CONVERTED';
export interface LeadEvent {
    kind: LeadEventKind;
    fromStatus?: LeadStatus;
    toStatus?: LeadStatus;
    note?: string;
    actorId?: string;
    actorName?: string;
    at: string;
}
export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    vertical?: LeadVertical | null;
    message: string;
    source: LeadSource;
    /** ISO 3166-1 alpha-2 of the country the prospect selected on the form. */
    country?: string | null;
    /** UI locale the form was filled in (drives the acknowledgment email). */
    locale?: string | null;
    status: LeadStatus;
    notes: string;
    statusHistory: LeadEvent[];
    metaUserAgent?: string | null;
    metaIpHash?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface CreateLeadInput {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    vertical?: LeadVertical;
    message: string;
    source: LeadSource;
    country?: string;
    locale?: string;
    company_url?: string;
}
export interface UpdateLeadInput {
    status?: LeadStatus;
    note?: string;
}
export interface ListLeadsQuery {
    status?: LeadStatus;
    search?: string;
    cursor?: string;
    limit?: number;
}
export interface ListLeadsResult {
    items: Lead[];
    nextCursor: string | null;
}
export declare const LEAD_LIMITS: {
    readonly NAME_MAX: 120;
    readonly EMAIL_MAX: 254;
    readonly PHONE_MAX: 40;
    readonly COMPANY_MAX: 160;
    readonly MESSAGE_MAX: 4000;
    readonly NOTES_MAX: 8000;
    readonly STATUS_HISTORY_MAX: 200;
    readonly LIST_PAGE_DEFAULT: 25;
    readonly LIST_PAGE_MAX: 100;
    readonly POST_RATE_PER_MIN_PER_IP: 6;
};
//# sourceMappingURL=lead.d.ts.map