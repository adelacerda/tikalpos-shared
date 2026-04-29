import { SelectedModifier, ComboSelection } from './menu';

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────

export type OrderStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'VOIDED'
  | 'REFUNDED';

export type OrderType = 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';

export interface Order {
  id: string;
  organizationId: string;
  locationId: string;
  staffId: string;
  guestId?: string;
  guest?: { id: string; name: string | null; email: string | null; phone: string | null };
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  subtotal: number; // cents
  taxAmount: number; // cents
  discountAmount: number; // cents
  surchargeAmount: number; // cents
  tipAmount: number; // cents
  total: number; // cents
  payments: OrderPayment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncId: string; // for offline sync
}

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // cents (base + modifiers)
  selectedModifiers: SelectedModifier[];
  lineTotal: number; // cents
  notes?: string;
  voided: boolean;
  comboSelections?: ComboSelection[];
  sentToKds?: boolean;
  deliveredToTable?: boolean;
}

export type PaymentMethodType = 'CASH' | 'CARD' | 'CREDIT' | 'DEBIT' | 'MOBILE' | 'GIFT_CARD' | 'LOYALTY_POINTS';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderPayment {
  id: string;
  orderId: string;
  method: PaymentMethodType;
  status: PaymentStatus;
  amount: number; // cents
  tip: number; // cents
  processorTransactionId?: string;
  processorName?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
