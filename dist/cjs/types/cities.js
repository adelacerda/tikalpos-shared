"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CITIES_BY_COUNTRY = void 0;
exports.citiesForCountry = citiesForCountry;
exports.CITIES_BY_COUNTRY = {
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
function citiesForCountry(country) {
    if (!country)
        return [];
    return exports.CITIES_BY_COUNTRY[country.toUpperCase()] ?? [];
}
//# sourceMappingURL=cities.js.map