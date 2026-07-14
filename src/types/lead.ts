// ──────────────────────────────────────────────
// Sales Lead Capture (Sprint Pre12.1)
// ──────────────────────────────────────────────
//
// Canonical contracts for the marketing-site lead form and the admin inbox
// that triages those leads. Anonymous POST from the public website creates
// a Lead; system_owner / OWNER / MANAGER consume them via the admin web app.

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'CUSTOMER'
  | 'LOST'
  | 'NURTURING';

export const LEAD_STATUSES: readonly LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CUSTOMER',
  'LOST',
  'NURTURING',
] as const;

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STATUSES as readonly string[]).includes(value);
}

export type LeadSource =
  | 'HERO_CTA'
  | 'CTA_STRIP'
  | 'FOOTER'
  | 'NAV'
  | 'CHAT_HANDOFF'
  | 'DIRECT'
  | 'OTHER';

export const LEAD_SOURCES: readonly LeadSource[] = [
  'HERO_CTA',
  'CTA_STRIP',
  'FOOTER',
  'NAV',
  'CHAT_HANDOFF',
  'DIRECT',
  'OTHER',
] as const;

export function isLeadSource(value: unknown): value is LeadSource {
  return typeof value === 'string' && (LEAD_SOURCES as readonly string[]).includes(value);
}

// 'BOTH' is retained for legacy rows only — it is no longer an accepted input
// (see LEAD_VERTICALS). 'SERVICE' replaces it as a selectable vertical.
export type LeadVertical = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'BOTH' | 'OTHER';

export const LEAD_VERTICALS: readonly LeadVertical[] = [
  'RESTAURANT',
  'RETAIL',
  'SERVICE',
  'OTHER',
] as const;

export function isLeadVertical(value: unknown): value is LeadVertical {
  return typeof value === 'string' && (LEAD_VERTICALS as readonly string[]).includes(value);
}

export type LeadEventKind =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'NOTE_ADDED'
  | 'EDITED'
  | 'REASSIGNED'
  | 'CONTACTED'
  | 'CONVERTED';

export interface LeadEvent {
  kind: LeadEventKind;
  fromStatus?: LeadStatus;
  toStatus?: LeadStatus;
  note?: string;
  /** For 'EDITED' events: which contact/business fields were changed. */
  fields?: string[];
  /**
   * For 'REASSIGNED' events: who the lead moved between. Names are snapshotted
   * so the history still reads correctly if a seller is later renamed/removed.
   */
  fromSellerId?: string | null;
  fromSellerName?: string | null;
  toSellerId?: string;
  toSellerName?: string;
  actorId?: string;
  actorName?: string;
  at: string; // ISO 8601
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
  /** Platform seller this lead is assigned to (FT-SELLERS). */
  assignedSellerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Public POST body. Honeypot field is intentionally named after a common
// signup label so naive bots fill it; backend rejects silently when set.
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

/**
 * Editable contact/business fields of a lead. Admins (system_owner) and the
 * assigned platform seller can edit these. Omitted fields are left untouched;
 * `phone`/`company` set to an empty string clear the value (→ null).
 */
export interface EditLeadFieldsInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  vertical?: LeadVertical;
  message?: string;
}

export interface ListLeadsQuery {
  status?: LeadStatus;
  search?: string;
  cursor?: string;
  limit?: number;
  /** Filter by assigned platform seller. A seller id, or 'none' for unassigned. */
  assignedSellerId?: string;
}

export interface ListLeadsResult {
  items: Lead[];
  nextCursor: string | null;
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
} as const;
