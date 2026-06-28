"use strict";
// Loyalty operators ("cajeros") — limited per-organization users that can ONLY
// redeem rewards / give points at the register. Deliberately separate from the
// `User` (staff) table and from email-based login: an operator authenticates with
// the org's 6-digit numeric code + a PIN. The PIN is unique WITHIN the org, so it
// identifies the person; and because operators carry no email, the same person's
// email stays free to register their own business later (or be a staff elsewhere).
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATOR_LOGIN_CODE_REGEX = exports.OPERATOR_PIN_REGEX = void 0;
exports.OPERATOR_PIN_REGEX = /^\d{4,6}$/;
exports.OPERATOR_LOGIN_CODE_REGEX = /^\d{6}$/;
//# sourceMappingURL=loyalty-operator.js.map