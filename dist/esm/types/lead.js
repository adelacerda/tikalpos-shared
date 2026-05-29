// ──────────────────────────────────────────────
// Sales Lead Capture (Sprint Pre12.1)
// ──────────────────────────────────────────────
//
// Canonical contracts for the marketing-site lead form and the admin inbox
// that triages those leads. Anonymous POST from the public website creates
// a Lead; system_owner / OWNER / MANAGER consume them via the admin web app.
export const LEAD_STATUSES = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'CUSTOMER',
    'LOST',
    'NURTURING',
];
export function isLeadStatus(value) {
    return typeof value === 'string' && LEAD_STATUSES.includes(value);
}
export const LEAD_SOURCES = [
    'HERO_CTA',
    'CTA_STRIP',
    'FOOTER',
    'NAV',
    'CHAT_HANDOFF',
    'DIRECT',
    'OTHER',
];
export function isLeadSource(value) {
    return typeof value === 'string' && LEAD_SOURCES.includes(value);
}
export const LEAD_VERTICALS = [
    'RESTAURANT',
    'RETAIL',
    'BOTH',
    'OTHER',
];
export function isLeadVertical(value) {
    return typeof value === 'string' && LEAD_VERTICALS.includes(value);
}
export const LEAD_LIMITS = {
    NAME_MAX: 120,
    EMAIL_MAX: 254,
    PHONE_MAX: 40,
    COMPANY_MAX: 160,
    MESSAGE_MAX: 4000,
    NOTES_MAX: 8000,
    STATUS_HISTORY_MAX: 200,
    LIST_PAGE_DEFAULT: 25,
    LIST_PAGE_MAX: 100,
    POST_RATE_PER_MIN_PER_IP: 6,
};
//# sourceMappingURL=lead.js.map