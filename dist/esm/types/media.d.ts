export type MediaAssetKind = 'LOGO' | 'PRODUCT' | 'BANNER' | 'GENERIC';
export declare const MEDIA_KINDS: readonly MediaAssetKind[];
export declare function isMediaAssetKind(value: unknown): value is MediaAssetKind;
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
export declare const MEDIA_LIMITS: {
    readonly MAX_BYTES: number;
    readonly MAX_WIDTH: 1920;
    readonly WEBP_QUALITY: 80;
    readonly WEBP_EFFORT: 4;
    readonly HASH_LENGTH: 32;
    readonly ALLOWED_MIME: readonly ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    readonly CACHE_CONTROL: "public, max-age=31536000, immutable";
    readonly VIDEO_MAX_BYTES: number;
    readonly VIDEO_MAX_SECONDS: 8;
    readonly VIDEO_ALLOWED_MIME: readonly ["video/mp4", "video/webm", "video/quicktime"];
};
//# sourceMappingURL=media.d.ts.map