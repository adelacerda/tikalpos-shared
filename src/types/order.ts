import { SelectedModifier, ComboSelection } from './menu';

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────

export type OrderStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'partially_paid'
  | 'voided'
  | 'refunded';

export type OrderType = 'dine_in' | 'takeout' | 'delivery';

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
  menuItemId: string;
  menuItemName: string;
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

export type PaymentMethodType = 'cash' | 'card' | 'mobile' | 'gift_card' | 'loyalty_points';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

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
