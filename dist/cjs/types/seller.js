"use strict";
// Platform sellers + commissions (FT-SELLERS).
//
// Sellers are platform-side (TikalLoyalty) users who sell franchises. A seller
// earns commission on their own clients' collected invoices; a seller who has a
// downline (other sellers with leaderId = them) also earns an override on the
// downline's collected invoices. Rates and taxes are stored as integer basis
// points (1000 = 10.00%) to avoid float drift; money is always integer cents.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELLER_DOC_LIMITS = void 0;
/** File-size + type limits for seller document uploads. */
exports.SELLER_DOC_LIMITS = {
    MAX_BYTES: 10 * 1024 * 1024, // 10 MB
    MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};
//# sourceMappingURL=seller.js.map