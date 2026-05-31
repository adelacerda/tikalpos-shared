import type { HighPrecisionTimestamp } from './loyalty';

// ──────────────────────────────────────────────
// Zero-Third-Party Messaging (FT-GROWTH-015)
// ──────────────────────────────────────────────

export type ChatRoomKind = 'PRESALES' | 'B2B';

export const CHAT_ROOMS: readonly ChatRoomKind[] = ['PRESALES', 'B2B'] as const;

export function isChatRoomKind(value: unknown): value is ChatRoomKind {
  return typeof value === 'string' && (CHAT_ROOMS as readonly string[]).includes(value);
}

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

export type ChatClientEvent =
  | { type: 'JOIN'; sessionId?: string; displayName?: string }
  | { type: 'MESSAGE'; body: string; clientNonce: string }
  | { type: 'TYPING' }
  | { type: 'CLOSE'; reason?: string };

export type ChatServerEventType =
  | 'JOINED'
  | 'MESSAGE'
  | 'PEER_TYPING'
  | 'PEER_CLOSED'
  | 'BACKLOG'
  | 'ERROR';

export type ChatServerEvent =
  | { type: 'JOINED'; sessionId: string; room: ChatRoomKind; operatorPresent: boolean }
  | { type: 'MESSAGE'; message: ChatMessage; ackForClientNonce?: string }
  | { type: 'PEER_TYPING'; fromRole: ChatSenderRole }
  | { type: 'PEER_CLOSED'; reason?: string }
  | { type: 'BACKLOG'; messages: ChatMessage[] }
  | { type: 'ERROR'; code: ChatErrorCode; message: string };

export type ChatErrorCode =
  | 'RATE_LIMITED'
  | 'BACKPRESSURE_KILL'
  | 'AUTH_REQUIRED'
  | 'INVALID_PAYLOAD'
  | 'SESSION_NOT_FOUND'
  | 'INTERNAL';

export const CHAT_LIMITS = {
  MAX_MESSAGE_BYTES: 4_096,
  PRESALES_MAX_CONNECTIONS: 200,
  B2B_MAX_CONNECTIONS: 50,
  PRESALES_IDLE_TTL_MS: 5 * 60_000,
  B2B_IDLE_TTL_MS: 30 * 60_000,
  PING_INTERVAL_MS: 30_000,
  PONG_TIMEOUT_MS: 5_000,
  BACKPRESSURE_KILL_BYTES: 64 * 1024,
  BACKLOG_REPLAY_COUNT: 50,
  RETENTION_DAYS: 30,
} as const;

// ──────────────────────────────────────────────
// WebPush / VAPID (FT-GROWTH-015 §3)
// ──────────────────────────────────────────────

export type PushSubscriptionOwnerKind = 'GUEST' | 'STAFF' | 'DEVICE' | 'LOYALTY_GUEST';

export const PUSH_OWNERS: readonly PushSubscriptionOwnerKind[] = ['GUEST', 'STAFF', 'DEVICE', 'LOYALTY_GUEST'] as const;

export function isPushSubscriptionOwnerKind(value: unknown): value is PushSubscriptionOwnerKind {
  return typeof value === 'string' && (PUSH_OWNERS as readonly string[]).includes(value);
}

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

// Sprint 12.5 / FT-GROWTH-002 — Expo Push path for the native loyalty app.
// The backend stores an Expo push token instead of WebPush endpoint+keys and
// dispatches through Expo's push service. Same owner/org scoping as WebPush.
export interface ExpoPushSubscriptionInput {
  expoPushToken: string;
  ownerType: PushSubscriptionOwnerKind;
  ownerId: string;
  organizationId?: string;
  userAgent?: string;
}

export type PushSubscriptionInput = WebPushSubscriptionInput | ExpoPushSubscriptionInput;

export function isExpoPushSubscription(
  input: PushSubscriptionInput,
): input is ExpoPushSubscriptionInput {
  return (
    typeof (input as ExpoPushSubscriptionInput).expoPushToken === 'string' &&
    (input as ExpoPushSubscriptionInput).expoPushToken.length > 0
  );
}

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

export const WEBPUSH_LIMITS = {
  MAX_PAYLOAD_BYTES: 3_900,
  DEFAULT_TTL_SECONDS: 86_400,
  MAX_CONSECUTIVE_FAILURES_BEFORE_REVOKE: 5,
  BROADCAST_BATCH_SIZE: 100,
} as const;
