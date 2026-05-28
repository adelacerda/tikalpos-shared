import type { HighPrecisionTimestamp } from './loyalty';
export type MigrationSource = 'TOAST' | 'SQUARE' | 'CLOVER' | 'LOYVERSE';
export declare const MIGRATION_SOURCES: readonly MigrationSource[];
export declare function isMigrationSource(value: unknown): value is MigrationSource;
export type MigrationSourceFormat = 'JSON' | 'CSV' | 'API';
export type MigrationMode = 'DRY_RUN' | 'COMMIT';
export type MigrationEntityKind = 'MENU_CATEGORY' | 'MENU_ITEM' | 'MODIFIER_GROUP' | 'MODIFIER' | 'GUEST' | 'LOYALTY_BALANCE' | 'GIFTCARD' | 'SALES_HISTORY';
export type MigrationRowOutcome = 'IMPORTED' | 'SKIPPED_DUPLICATE' | 'SKIPPED_DRY_RUN' | 'REJECTED_VALIDATION' | 'REJECTED_CONFLICT' | 'QUARANTINED_MALFORMED';
export type MigrationConflictReason = 'EXISTING_SKU' | 'EXISTING_GUEST_EMAIL' | 'EXISTING_GIFTCARD_CODE' | 'CURRENCY_MISMATCH' | 'CATEGORY_NOT_FOUND' | 'MODIFIER_GROUP_UNRESOLVED';
export interface MigrationPayload {
    source: MigrationSource;
    format: MigrationSourceFormat;
    organizationId: string;
    initiatedByStaffId: string;
    mode: MigrationMode;
    sourceFingerprint: string;
    filename: string;
    byteSize: number;
    uploadedAt: HighPrecisionTimestamp;
    rawBody: string;
    vendorMetadata?: Record<string, string>;
}
export interface MigrationRowError {
    rowNumber: number;
    entityKind: MigrationEntityKind;
    externalId?: string;
    field?: string;
    message: string;
    rawSnippet?: string;
}
export interface MigrationEntityTally {
    entityKind: MigrationEntityKind;
    parsed: number;
    imported: number;
    skippedDuplicates: number;
    rejected: number;
    quarantined: number;
}
export interface MigrationConflict {
    entityKind: MigrationEntityKind;
    externalId: string;
    reason: MigrationConflictReason;
    incumbentEntityId?: string;
    proposedValue?: string;
}
export interface MigrationResultReport {
    jobId: string;
    source: MigrationSource;
    mode: MigrationMode;
    organizationId: string;
    sourceFingerprint: string;
    startedAt: HighPrecisionTimestamp;
    completedAt: HighPrecisionTimestamp;
    durationMs: number;
    totalRowsParsed: number;
    totalRowsImported: number;
    totalRowsSkipped: number;
    totalRowsRejected: number;
    entities: MigrationEntityTally[];
    conflicts: MigrationConflict[];
    errors: MigrationRowError[];
    committed: boolean;
    rollbackReason?: string;
}
export declare const MIGRATION_LIMITS: {
    readonly MAX_FILE_BYTES: number;
    readonly MAX_ROWS_PER_JOB: 100000;
    readonly MAX_ERROR_REPORT_ROWS: 5000;
};
//# sourceMappingURL=migration.d.ts.map