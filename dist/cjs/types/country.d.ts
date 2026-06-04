/** Platform-supported UI locales. A country's languages are a subset of these. */
export declare const SUPPORTED_LOCALES: readonly ["es", "en"];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export declare function isSupportedLocale(value: unknown): value is SupportedLocale;
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
    dialCode: string;
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
    isDefault: boolean;
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
export declare const COUNTRY_CATALOG: readonly CountryCatalogEntry[];
export declare function getCatalogEntry(code: string): CountryCatalogEntry | undefined;
/** Strip everything but digits. */
export declare function phoneDigits(raw: string): string;
/**
 * Compose an E.164 number from a dial code + a national number (any format).
 * Returns e.g. "+50212345678". Drops a leading dial-code if the user re-typed it.
 */
export declare function toE164(dialCode: string, national: string): string;
/** The national part (digits after the dial code) of an E.164 / raw number. */
export declare function nationalPart(dialCode: string, value: string): string;
/**
 * Validate a phone for a country: the national part must be all digits and, when
 * the country specifies `phoneNationalDigits`, exactly that many. An empty
 * national part is considered valid (optional phone) — callers enforce required.
 */
export declare function isValidNationalPhone(country: Pick<Country, 'phoneNationalDigits'>, national: string): boolean;
/**
 * Validate a tax id (NIT/RFC/EIN/…) against the country's format. Empty is valid
 * (optional — callers enforce required). When the country has no pattern, any
 * non-empty value passes. The match is case-insensitive.
 */
export declare function isValidTaxId(country: Pick<Country, 'taxIdPattern'>, value: string): boolean;
//# sourceMappingURL=country.d.ts.map