// Canonical city list per ISO 3166-1 alpha-2 country (FT-GROWTH-017).
//
// Single source of truth so the web (franchise location city) and the mobile
// app (guest profile city) pick from IDENTICAL values. Push-promotion targeting
// matches a guest's city against a franchise branch's city by exact string, so
// both sides MUST choose from this same list — free text would never match
// reliably ("Guatemala" vs "Ciudad de Guatemala" vs "Guate").
//
// Guatemala-first (the active market). To add a country, add its key here; to
// let system-admins manage cities later, move this to a `City` DB table with
// the same { countryCode -> string[] } shape — the dropdowns stay the same.

export const CITIES_BY_COUNTRY: Readonly<Record<string, readonly string[]>> = {
  GT: [
    'Ciudad de Guatemala',
    'Mixco',
    'Villa Nueva',
    'Petapa',
    'San José Pinula',
    'Santa Catarina Pinula',
    'Amatitlán',
    'Chinautla',
    'Villa Canales',
    'Antigua Guatemala',
    'Chimaltenango',
    'Escuintla',
    'Quetzaltenango',
    'Mazatenango',
    'Retalhuleu',
    'Sololá',
    'Panajachel',
    'Totonicapán',
    'Huehuetenango',
    'Quiché',
    'Cobán',
    'Salamá',
    'Jalapa',
    'Jutiapa',
    'Cuilapa',
    'Chiquimula',
    'Zacapa',
    'Puerto Barrios',
    'Flores',
  ],
};

/** Cities for a country code (case-insensitive), or [] when unknown. */
export function citiesForCountry(country: string | null | undefined): readonly string[] {
  if (!country) return [];
  return CITIES_BY_COUNTRY[country.toUpperCase()] ?? [];
}
