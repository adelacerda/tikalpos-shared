// Tenant hierarchy
export type {
  SystemOwner,
  Organization,
  OrganizationStatus,
  FranchiseType,
  OrganizationSettings,
  Location,
  LocationStatus,
  LocationSettings,
  OperatingHours,
  Staff,
  StaffRole,
  Guest,
  LoyaltyTier,
} from './types/tenant';

// Menu & modifiers
export type {
  MenuCategory,
  MenuItem,
  MenuItemStatus,
  ModifierGroup,
  Modifier,
  SelectedModifier,
  LocationMenuOverride,
  ComboSlotType,
  ComboSlot,
  ComboSlotOption,
  ComboSelection,
  PrepDestination,
} from './types/menu';

// Orders
export type {
  Order,
  OrderStatus,
  OrderType,
  OrderLineItem,
  OrderPayment,
  PaymentMethodType,
  PaymentStatus,
} from './types/order';

// Payment processor abstraction
export type {
  PaymentRequest,
  PaymentResult,
  RefundRequest,
  RefundResult,
  ProcessorStatus,
  IPaymentProcessor,
} from './types/payment';

// Loyalty
export type {
  LoyaltyConfig,
  TierThreshold,
  LoyaltyTransaction,
  LoyaltyTransactionType,
} from './types/loyalty';

// Sync protocol
export type {
  SyncEntityType,
  SyncAction,
  SyncChangeRecord,
  SyncPushRequest,
  SyncPushResponse,
  SyncConflict,
  SyncPullRequest,
  SyncPullResponse,
} from './types/sync';

// KDS (Kitchen / Bar Display)
export type {
  KdsTicket,
  KdsTicketItem,
  KdsTicketStatus,
  KdsItemStatus,
  SendToKdsRequest,
} from './types/kds';

// API utilities
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginationParams,
  AuthTokenPayload,
} from './types/api';
