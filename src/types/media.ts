// ──────────────────────────────────────────────
// Local Media Storage (FT-GROWTH-015 §2)
// ──────────────────────────────────────────────

export type MediaAssetKind = 'LOGO' | 'PRODUCT' | 'BANNER' | 'GENERIC';

export const MEDIA_KINDS: readonly MediaAssetKind[] = ['LOGO', 'PRODUCT', 'BANNER', 'GENERIC'] as const;

export function isMediaAssetKind(value: unknown): value is MediaAssetKind {
  return typeof value === 'string' && (MEDIA_KINDS as readonly string[]).includes(value);
}

export interface MediaAsset {
  hash: string;
  bytes: number;
  width: number;
  height: number;
  kind: MediaAssetKind;
  uploadedByStaffId: string;
  organizationId: string;
  createdAt: string;
  url: string;
}

export interface MediaUploadResult {
  hash: string;
  url: string;
  bytes: number;
  width: number;
  height: number;
  kind: MediaAssetKind;
  deduplicated: boolean;
}

export const MEDIA_LIMITS = {
  MAX_BYTES: 5 * 1024 * 1024,
  MAX_WIDTH: 1920,
  WEBP_QUALITY: 80,
  WEBP_EFFORT: 4,
  HASH_LENGTH: 32,
  ALLOWED_MIME: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] as const,
  CACHE_CONTROL: 'public, max-age=31536000, immutable',
} as const;
