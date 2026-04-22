import type { PrepDestination } from './menu';
import type { SelectedModifier } from './menu';

// ──────────────────────────────────────────────
// Kitchen Display System (KDS) Types
// ──────────────────────────────────────────────

export type KdsTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VOIDED';

export type KdsItemStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'DELIVERED';

export interface KdsTicketItem {
  id: string;
  ticketId: string;
  lineItemId: string;
  productName: string;
  quantity: number;
  modifiers: SelectedModifier[];
  notes?: string;
  prepTimeMinutes: number;
  status: KdsItemStatus;
  startedAt?: string;
  readyAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KdsTicket {
  id: string;
  organizationId: string;
  locationId: string;
  checkId: string;
  checkDisplayNumber: string;
  tableLabel: string;
  destination: PrepDestination;
  status: KdsTicketStatus;
  serverName?: string;
  sentAt: string;
  completedAt?: string;
  items: KdsTicketItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SendToKdsRequest {
  checkId: string;
  checkDisplayNumber: string;
  tableLabel: string;
  serverName?: string;
  items: {
    lineItemId: string;
    productId: string;
    productName: string;
    quantity: number;
    modifiers: SelectedModifier[];
    notes?: string;
    destination: PrepDestination;
    prepTimeMinutes: number;
  }[];
}
