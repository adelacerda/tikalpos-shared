// ──────────────────────────────────────────────
// Active Countries (phased country-by-country rollout)
// ──────────────────────────────────────────────
//
// The platform is designed for many countries but is released one at a time
// (Guatemala first). A `Country` is activated in System Administration; the set
// of ACTIVE countries propagates everywhere: franchise creation (country →
// currency/timezone/language), the website lead form, phone formatting, and the
// mobile app (signup country gate + country-scoped franchise visibility).

/** Platform-supported UI locales. A country's languages are a subset of these. */
export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * A country available on the platform. `code` is ISO 3166-1 alpha-2. `currency`
 * is fixed per country (ISO-4217). `timezones`/`languages` are the choices a
 * franchise in this country may pick from; `default*` apply when there's only
 * one (or as the form default). `phoneNationalDigits` drives phone validation
 * (the national part, excluding the dial code); null = no length check.
 */
export interface Country {
  code: string;
  name: string;
  dialCode: string; // E.164 calling code WITH '+', e.g. "+502"
  currency: string;
  timezones: string[];
  languages: SupportedLocale[];
  defaultTimezone: string;
  defaultLanguage: SupportedLocale;
  phoneNationalDigits: number | null;
  /** Tax-ID label for this country (e.g. "NIT", "RFC", "EIN"). */
  taxIdLabel: string;
  /** Regex (string) the tax id must match; null = no strict format check. */
  taxIdPattern: string | null;
  active: boolean;
  isDefault: boolean; // the platform default country (used when exactly one applies)
}

/** Read-only reference data for a country the admin can activate. */
export interface CountryCatalogEntry {
  code: string;
  name: string;
  dialCode: string;
  currency: string;
  timezones: string[];
  languages: SupportedLocale[];
  defaultTimezone: string;
  defaultLanguage: SupportedLocale;
  phoneNationalDigits: number | null;
  taxIdLabel: string;
  taxIdPattern: string | null;
}

/** Activate a catalog country, optionally narrowing its timezones/languages. */
export interface ActivateCountryInput {
  code: string;
  timezones?: string[];
  languages?: SupportedLocale[];
  defaultTimezone?: string;
  defaultLanguage?: SupportedLocale;
  isDefault?: boolean;
}

export interface UpdateCountryInput {
  active?: boolean;
  timezones?: string[];
  languages?: SupportedLocale[];
  defaultTimezone?: string;
  defaultLanguage?: SupportedLocale;
  isDefault?: boolean;
}

/**
 * Curated catalog of countries the platform can be rolled out to. Not the full
 * ISO-3166 set — just the regions we target — expandable without a migration.
 * The DB only stores the ACTIVATED subset (with any admin overrides).
 */
export const COUNTRY_CATALOG: readonly CountryCatalogEntry[] = [
  {
    code: 'GT',
    name: 'Guatemala',
    dialCode: '+502',
    currency: 'GTQ',
    timezones: ['America/Guatemala'],
    languages: ['es'],
    defaultTimezone: 'America/Guatemala',
    defaultLanguage: 'es',
    phoneNationalDigits: 8,
    taxIdLabel: 'NIT',
    taxIdPattern: '^(CF|[0-9]{1,12}-?[0-9Kk])$',
  },
  {
    code: 'MX',
    name: 'México',
    dialCode: '+52',
    currency: 'MXN',
    timezones: ['America/Mexico_City', 'America/Cancun', 'America/Monterrey', 'America/Tijuana'],
    languages: ['es'],
    defaultTimezone: 'America/Mexico_City',
    defaultLanguage: 'es',
    phoneNationalDigits: 10,
    taxIdLabel: 'RFC',
    taxIdPattern: '^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$',
  },
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    currency: 'USD',
    timezones: [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'Pacific/Honolulu',
    ],
    languages: ['en', 'es'],
    defaultTimezone: 'America/Chicago',
    defaultLanguage: 'en',
    phoneNationalDigits: 10,
    taxIdLabel: 'EIN',
    taxIdPattern: '^[0-9]{2}-?[0-9]{7}$',
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    dialCode: '+506',
    currency: 'CRC',
    timezones: ['America/Costa_Rica'],
    languages: ['es'],
    defaultTimezone: 'America/Costa_Rica',
    defaultLanguage: 'es',
    phoneNationalDigits: 8,
    taxIdLabel: 'Cédula Jurídica',
    taxIdPattern: null,
  },
  {
    code: 'SV',
    name: 'El Salvador',
    dialCode: '+503',
    currency: 'USD',
    timezones: ['America/El_Salvador'],
    languages: ['es'],
    defaultTimezone: 'America/El_Salvador',
    defaultLanguage: 'es',
    phoneNationalDigits: 8,
    taxIdLabel: 'NIT',
    taxIdPattern: null,
  },
  {
    code: 'HN',
    name: 'Honduras',
    dialCode: '+504',
    currency: 'HNL',
    timezones: ['America/Tegucigalpa'],
    languages: ['es'],
    defaultTimezone: 'America/Tegucigalpa',
    defaultLanguage: 'es',
    phoneNationalDigits: 8,
    taxIdLabel: 'RTN',
    taxIdPattern: '^[0-9]{14}$',
  },
  {
    code: 'PA',
    name: 'Panamá',
    dialCode: '+507',
    currency: 'USD',
    timezones: ['America/Panama'],
    languages: ['es'],
    defaultTimezone: 'America/Panama',
    defaultLanguage: 'es',
    phoneNationalDigits: 8,
    taxIdLabel: 'RUC',
    taxIdPattern: null,
  },
  {
    code: 'CO',
    name: 'Colombia',
    dialCode: '+57',
    currency: 'COP',
    timezones: ['America/Bogota'],
    languages: ['es'],
    defaultTimezone: 'America/Bogota',
    defaultLanguage: 'es',
    phoneNationalDigits: 10,
    taxIdLabel: 'NIT',
    taxIdPattern: null,
  },
];

export function getCatalogEntry(code: string): CountryCatalogEntry | undefined {
  return COUNTRY_CATALOG.find((c) => c.code === code.toUpperCase());
}

// ── Phone helpers ────────────────────────────────────────────────────────────

/** Strip everything but digits. */
export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

/**
 * Compose an E.164 number from a dial code + a national number (any format).
 * Returns e.g. "+50212345678". Drops a leading dial-code if the user re-typed it.
 */
export function toE164(dialCode: string, national: string): string {
  const cc = phoneDigits(dialCode);
  let n = phoneDigits(national);
  if (cc && n.startsWith(cc)) n = n.slice(cc.length);
  return `+${cc}${n}`;
}

/** The national part (digits after the dial code) of an E.164 / raw number. */
export function nationalPart(dialCode: string, value: string): string {
  const cc = phoneDigits(dialCode);
  const n = phoneDigits(value);
  return cc && n.startsWith(cc) ? n.slice(cc.length) : n;
}

/**
 * Validate a phone for a country: the national part must be all digits and, when
 * the country specifies `phoneNationalDigits`, exactly that many. An empty
 * national part is considered valid (optional phone) — callers enforce required.
 */
export function isValidNationalPhone(country: Pick<Country, 'phoneNationalDigits'>, national: string): boolean {
  const n = phoneDigits(national);
  if (n.length === 0) return true;
  if (country.phoneNationalDigits == null) return n.length >= 4 && n.length <= 15;
  return n.length === country.phoneNationalDigits;
}

// ── Tax id ───────────────────────────────────────────────────────────────────

/**
 * Validate a tax id (NIT/RFC/EIN/…) against the country's format. Empty is valid
 * (optional — callers enforce required). When the country has no pattern, any
 * non-empty value passes. The match is case-insensitive.
 */
export function isValidTaxId(country: Pick<Country, 'taxIdPattern'>, value: string): boolean {
  const v = value.trim();
  if (v.length === 0) return true;
  if (!country.taxIdPattern) return true;
  try {
    return new RegExp(country.taxIdPattern, 'i').test(v);
  } catch {
    return true; // a bad stored pattern must never block input
  }
}
