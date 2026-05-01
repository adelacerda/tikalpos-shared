// ──────────────────────────────────────────────
// Payment Processor Abstraction
// ──────────────────────────────────────────────

export type PaymentMethod = 'CARD' | 'MOBILE';

export interface PaymentRequest {
  amount: number; // cents
  currency: string;
  orderId: string;
  locationId: string;
  organizationId: string;
  method: PaymentMethod;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  processorName: string;
  errorCode?: string;
  errorMessage?: string;
  rawResponse?: unknown;
}

export interface RefundRequest {
  transactionId: string;
  amount: number; // cents (partial refunds supported)
  reason?: string;
  idempotencyKey: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  processorName: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface ProcessorStatus {
  online: boolean;
  processorName: string;
  message?: string;
}

/**
 * Abstract interface every payment processor adapter must implement.
 *
 * authorize() — Place a hold / create a pre-auth on the payment method.
 * capture()   — Settle a previously authorized transaction.
 * refund()    — Return funds (full or partial) on a captured transaction.
 * void()      — Cancel a pre-auth before capture.
 * status()    — Check terminal/gateway connectivity (optional override).
 */
export interface IPaymentProcessor {
  readonly name: string;
  authorize(request: PaymentRequest): Promise<PaymentResult>;
  capture(transactionId: string, amount: number): Promise<PaymentResult>;
  refund(request: RefundRequest): Promise<RefundResult>;
  void(transactionId: string): Promise<PaymentResult>;
  status?(): Promise<ProcessorStatus>;
}
