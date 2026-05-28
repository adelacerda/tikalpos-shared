import type { HighPrecisionTimestamp } from './loyalty';

// ──────────────────────────────────────────────
// Franchise Migration Cannon (FT-GROWTH-005)
// ──────────────────────────────────────────────

export type MigrationSource = 'TOAST' | 'SQUARE' | 'CLOVER' | 'LOYVERSE';

export const MIGRATION_SOURCES: readonly MigrationSource[] = [
  'TOAST',
  'SQUARE',
  'CLOVER',
  'LOYVERSE',
] as const;

export function isMigrationSource(value: unknown): value is MigrationSource {
  return (
    typeof value === 'string' &&
    (MIGRATION_SOURCES as readonly string[]).includes(value)
  );
}

export type MigrationSourceFormat = 'JSON' | 'CSV' | 'API';

export type MigrationMode = 'DRY_RUN' | 'COMMIT';

export type MigrationEntityKind =
  | 'MENU_CATEGORY'
  | 'MENU_ITEM'
  | 'MODIFIER_GROUP'
  | 'MODIFIER'
  | 'GUEST'
  | 'LOYALTY_BALANCE'
  | 'GIFTCARD'
  | 'SALES_HISTORY';

export type MigrationRowOutcome =
  | 'IMPORTED'
  | 'SKIPPED_DUPLICATE'
  | 'SKIPPED_DRY_RUN'
  | 'REJECTED_VALIDATION'
  | 'REJECTED_CONFLICT'
  | 'QUARANTINED_MALFORMED';

export type MigrationConflictReason =
  | 'EXISTING_SKU'
  | 'EXISTING_GUEST_EMAIL'
  | 'EXISTING_GIFTCARD_CODE'
  | 'CURRENCY_MISMATCH'
  | 'CATEGORY_NOT_FOUND'
  | 'MODIFIER_GROUP_UNRESOLVED';

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

export const MIGRATION_LIMITS = {
  MAX_FILE_BYTES: 32 * 1024 * 1024,
  MAX_ROWS_PER_JOB: 100_000,
  MAX_ERROR_REPORT_ROWS: 5_000,
} as const;
