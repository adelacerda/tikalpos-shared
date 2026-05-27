import type { Order, OrderPayment } from './order';
import type { RefundResult } from './payment';
import type { EarnPointsInput, RedeemRewardInput, HighPrecisionTimestamp } from './loyalty';
import type { KdsTicket } from './kds';

// ──────────────────────────────────────────────
// Offline-First Resilience (FT-CORE-002)
// ──────────────────────────────────────────────

export type SyncStatus =
  | 'ONLINE'
  | 'DRAINING'
  | 'OFFLINE'
  | 'DEGRADED'
  | 'RECONCILING'
  | 'ERROR_BLOCKED';

export interface NetworkHealthSnapshot {
  status: SyncStatus;
  lastSuccessfulSyncAt: string | null;
  pendingEventCount: number;
  oldestPendingAgeMs: number | null;
  consecutiveFailures: number;
}

export type OfflineEventType =
  | 'ORDER_OPENED'
  | 'ORDER_LINE_ADDED'
  | 'ORDER_LINE_VOIDED'
  | 'ORDER_FINALIZED'
  | 'PAYMENT_CAPTURED'
  | 'PAYMENT_REFUNDED'
  | 'LOYALTY_EARN'
  | 'LOYALTY_REDEEM'
  | 'KDS_TICKET_SENT';

export type OfflineEventPayload =
  | { type: 'ORDER_OPENED'; orderSyncId: string; data: Record<string, unknown> }
  | { type: 'ORDER_LINE_ADDED'; orderSyncId: string; data: Record<string, unknown> }
  | { type: 'ORDER_LINE_VOIDED'; orderSyncId: string; data: Record<string, unknown> }
  | { type: 'ORDER_FINALIZED'; order: Order }
  | { type: 'PAYMENT_CAPTURED'; payment: OrderPayment; orderSyncId: string }
  | { type: 'PAYMENT_REFUNDED'; refund: RefundResult; orderSyncId: string }
  | { type: 'LOYALTY_EARN'; input: EarnPointsInput }
  | { type: 'LOYALTY_REDEEM'; input: RedeemRewardInput }
  | { type: 'KDS_TICKET_SENT'; ticket: KdsTicket };

export interface OfflineQueueEvent {
  idempotencyKey: string;
  eventType: OfflineEventType;
  payload: OfflineEventPayload;
  signedAt: HighPrecisionTimestamp;
  deviceId: string;
  locationId: string;
  organizationId: string;
  staffId: string;
  deviceSignature: string;
  causalSequence: number;
  parentEventKey?: string;
}

export interface RetryPayload {
  deviceId: string;
  locationId: string;
  organizationId: string;
  batchId: string;
  events: OfflineQueueEvent[];
  drainedAt: HighPrecisionTimestamp;
  clientVersion: string;
}

export type ReconciliationOutcome =
  | 'APPLIED'
  | 'DUPLICATE_IGNORED'
  | 'CAUSAL_GAP_DEFERRED'
  | 'BUSINESS_REJECTED'
  | 'SIGNATURE_INVALID';

export interface ReconciledEventReceipt {
  idempotencyKey: string;
  outcome: ReconciliationOutcome;
  serverEntityId?: string;
  rejectionReason?: string;
  appliedAt?: HighPrecisionTimestamp;
}

export interface ReconciliationResponse {
  batchId: string;
  serverReceivedAt: HighPrecisionTimestamp;
  receipts: ReconciledEventReceipt[];
  deferredKeys: string[];
  quarantinedKeys: string[];
  nextSuggestedDrainMs: number;
}
