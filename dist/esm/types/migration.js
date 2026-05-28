export const MIGRATION_SOURCES = [
    'TOAST',
    'SQUARE',
    'CLOVER',
    'LOYVERSE',
];
export function isMigrationSource(value) {
    return (typeof value === 'string' &&
        MIGRATION_SOURCES.includes(value));
}
export const MIGRATION_LIMITS = {
    MAX_FILE_BYTES: 32 * 1024 * 1024,
    MAX_ROWS_PER_JOB: 100000,
    MAX_ERROR_REPORT_ROWS: 5000,
};
//# sourceMappingURL=migration.js.map