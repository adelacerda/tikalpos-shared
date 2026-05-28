// ──────────────────────────────────────────────
// Local Media Storage (FT-GROWTH-015 §2)
// ──────────────────────────────────────────────
export const MEDIA_KINDS = ['LOGO', 'PRODUCT', 'BANNER', 'GENERIC'];
export function isMediaAssetKind(value) {
    return typeof value === 'string' && MEDIA_KINDS.includes(value);
}
export const MEDIA_LIMITS = {
    MAX_BYTES: 5 * 1024 * 1024,
    MAX_WIDTH: 1920,
    WEBP_QUALITY: 80,
    WEBP_EFFORT: 4,
    HASH_LENGTH: 32,
    ALLOWED_MIME: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    CACHE_CONTROL: 'public, max-age=31536000, immutable',
};
//# sourceMappingURL=media.js.map