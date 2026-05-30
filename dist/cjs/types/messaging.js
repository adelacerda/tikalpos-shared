"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBPUSH_LIMITS = exports.PUSH_OWNERS = exports.CHAT_LIMITS = exports.CHAT_ROOMS = void 0;
exports.isChatRoomKind = isChatRoomKind;
exports.isPushSubscriptionOwnerKind = isPushSubscriptionOwnerKind;
exports.CHAT_ROOMS = ['PRESALES', 'B2B'];
function isChatRoomKind(value) {
    return typeof value === 'string' && exports.CHAT_ROOMS.includes(value);
}
exports.CHAT_LIMITS = {
    MAX_MESSAGE_BYTES: 4096,
    PRESALES_MAX_CONNECTIONS: 200,
    B2B_MAX_CONNECTIONS: 50,
    PRESALES_IDLE_TTL_MS: 5 * 60000,
    B2B_IDLE_TTL_MS: 30 * 60000,
    PING_INTERVAL_MS: 30000,
    PONG_TIMEOUT_MS: 5000,
    BACKPRESSURE_KILL_BYTES: 64 * 1024,
    BACKLOG_REPLAY_COUNT: 50,
    RETENTION_DAYS: 30,
};
exports.PUSH_OWNERS = ['GUEST', 'STAFF', 'DEVICE', 'LOYALTY_GUEST'];
function isPushSubscriptionOwnerKind(value) {
    return typeof value === 'string' && exports.PUSH_OWNERS.includes(value);
}
exports.WEBPUSH_LIMITS = {
    MAX_PAYLOAD_BYTES: 3900,
    DEFAULT_TTL_SECONDS: 86400,
    MAX_CONSECUTIVE_FAILURES_BEFORE_REVOKE: 5,
    BROADCAST_BATCH_SIZE: 100,
};
//# sourceMappingURL=messaging.js.map