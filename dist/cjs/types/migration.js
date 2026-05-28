"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIGRATION_LIMITS = exports.MIGRATION_SOURCES = void 0;
exports.isMigrationSource = isMigrationSource;
exports.MIGRATION_SOURCES = [
    'TOAST',
    'SQUARE',
    'CLOVER',
    'LOYVERSE',
];
function isMigrationSource(value) {
    return (typeof value === 'string' &&
        exports.MIGRATION_SOURCES.includes(value));
}
exports.MIGRATION_LIMITS = {
    MAX_FILE_BYTES: 32 * 1024 * 1024,
    MAX_ROWS_PER_JOB: 100000,
    MAX_ERROR_REPORT_ROWS: 5000,
};
//# sourceMappingURL=migration.js.map