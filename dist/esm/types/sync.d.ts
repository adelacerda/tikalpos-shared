export type SyncEntityType = 'ORDER' | 'MENU_ITEM' | 'MODIFIER_GROUP' | 'GUEST' | 'LOYALTY_TRANSACTION';
export type SyncAction = 'CREATE' | 'UPDATE' | 'DELETE';
/**
 * A single change record produced by the mobile POS client while offline.
 */
export interface SyncChangeRecord {
    id: string;
    entityType: SyncEntityType;
    entityId: string;
    action: SyncAction;
    payload: Record<string, unknown>;
    timestamp: string;
    deviceId: string;
    locationId: string;
    organizationId: string;
    version: number;
}
/**
 * Request body for pushing offline changes to the cloud.
 */
export interface SyncPushRequest {
    deviceId: string;
    locationId: string;
    organizationId: string;
    changes: SyncChangeRecord[];
    lastPulledAt: string;
}
/**
 * Server response after processing a push request.
 */
export interface SyncPushResponse {
    accepted: string[];
    rejected: SyncConflict[];
    serverTimestamp: string;
}
export interface SyncConflict {
    changeId: string;
    entityId: string;
    entityType: SyncEntityType;
    reason: 'version_conflict' | 'entity_deleted' | 'validation_error';
    serverVersion?: number;
    serverPayload?: Record<string, unknown>;
}
/**
 * Request to pull changes from the server since last sync.
 */
export interface SyncPullRequest {
    deviceId: string;
    locationId: string;
    organizationId: string;
    lastPulledAt: string;
    entityTypes?: SyncEntityType[];
}
export interface SyncPullResponse {
    changes: SyncChangeRecord[];
    serverTimestamp: string;
    hasMore: boolean;
}
//# sourceMappingURL=sync.d.ts.map