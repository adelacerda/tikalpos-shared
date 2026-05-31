import type { HighPrecisionTimestamp } from './loyalty';
export type ChatRoomKind = 'PRESALES' | 'B2B';
export declare const CHAT_ROOMS: readonly ChatRoomKind[];
export declare function isChatRoomKind(value: unknown): value is ChatRoomKind;
export type ChatSenderRole = 'VISITOR' | 'FRANCHISE' | 'OPERATOR' | 'SYSTEM';
export interface ChatMessage {
    id: string;
    room: ChatRoomKind;
    sessionId: string;
    fromRole: ChatSenderRole;
    fromDisplayName: string;
    body: string;
    createdAt: HighPrecisionTimestamp;
    organizationId?: string;
}
export type ChatClientEventType = 'JOIN' | 'MESSAGE' | 'TYPING' | 'CLOSE';
export type ChatClientEvent = {
    type: 'JOIN';
    sessionId?: string;
    displayName?: string;
} | {
    type: 'MESSAGE';
    body: string;
    clientNonce: string;
} | {
    type: 'TYPING';
} | {
    type: 'CLOSE';
    reason?: string;
};
export type ChatServerEventType = 'JOINED' | 'MESSAGE' | 'PEER_TYPING' | 'PEER_CLOSED' | 'BACKLOG' | 'ERROR';
export type ChatServerEvent = {
    type: 'JOINED';
    sessionId: string;
    room: ChatRoomKind;
    operatorPresent: boolean;
} | {
    type: 'MESSAGE';
    message: ChatMessage;
    ackForClientNonce?: string;
} | {
    type: 'PEER_TYPING';
    fromRole: ChatSenderRole;
} | {
    type: 'PEER_CLOSED';
    reason?: string;
} | {
    type: 'BACKLOG';
    messages: ChatMessage[];
} | {
    type: 'ERROR';
    code: ChatErrorCode;
    message: string;
};
export type ChatErrorCode = 'RATE_LIMITED' | 'BACKPRESSURE_KILL' | 'AUTH_REQUIRED' | 'INVALID_PAYLOAD' | 'SESSION_NOT_FOUND' | 'INTERNAL';
export declare const CHAT_LIMITS: {
    readonly MAX_MESSAGE_BYTES: 4096;
    readonly PRESALES_MAX_CONNECTIONS: 200;
    readonly B2B_MAX_CONNECTIONS: 50;
    readonly PRESALES_IDLE_TTL_MS: number;
    readonly B2B_IDLE_TTL_MS: number;
    readonly PING_INTERVAL_MS: 30000;
    readonly PONG_TIMEOUT_MS: 5000;
    readonly BACKPRESSURE_KILL_BYTES: number;
    readonly BACKLOG_REPLAY_COUNT: 50;
    readonly RETENTION_DAYS: 30;
};
export type PushSubscriptionOwnerKind = 'GUEST' | 'STAFF' | 'DEVICE' | 'LOYALTY_GUEST';
export declare const PUSH_OWNERS: readonly PushSubscriptionOwnerKind[];
export declare function isPushSubscriptionOwnerKind(value: unknown): value is PushSubscriptionOwnerKind;
export interface WebPushKeys {
    p256dh: string;
    auth: string;
}
export interface WebPushSubscriptionInput {
    endpoint: string;
    keys: WebPushKeys;
    ownerType: PushSubscriptionOwnerKind;
    ownerId: string;
    organizationId?: string;
    userAgent?: string;
}
export interface ExpoPushSubscriptionInput {
    expoPushToken: string;
    ownerType: PushSubscriptionOwnerKind;
    ownerId: string;
    organizationId?: string;
    userAgent?: string;
}
export type PushSubscriptionInput = WebPushSubscriptionInput | ExpoPushSubscriptionInput;
export declare function isExpoPushSubscription(input: PushSubscriptionInput): input is ExpoPushSubscriptionInput;
export interface WebPushPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    url?: string;
    tag?: string;
    data?: Record<string, unknown>;
}
export interface PushBroadcastFilter {
    organizationId?: string;
    ownerType?: PushSubscriptionOwnerKind;
    ownerIds?: string[];
}
export interface PushDispatchResult {
    endpointHash: string;
    ok: boolean;
    httpStatus?: number;
    errorCode?: 'EXPIRED' | 'PAYLOAD_TOO_LARGE' | 'RATE_LIMITED' | 'UNAUTHORIZED' | 'NETWORK';
}
export interface PushBroadcastReport {
    attempted: number;
    succeeded: number;
    revoked: number;
    failed: number;
    durationMs: number;
}
export declare const WEBPUSH_LIMITS: {
    readonly MAX_PAYLOAD_BYTES: 3900;
    readonly DEFAULT_TTL_SECONDS: 86400;
    readonly MAX_CONSECUTIVE_FAILURES_BEFORE_REVOKE: 5;
    readonly BROADCAST_BATCH_SIZE: 100;
};
//# sourceMappingURL=messaging.d.ts.map