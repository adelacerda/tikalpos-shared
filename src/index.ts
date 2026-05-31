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
export {
  STAFF_ROLES,
  isStaffRole,
  allowedStaffRolesFor,
  allowedDeviceRolesFor,
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
  PaymentMethod,
} from './types/payment';

// Loyalty
export type {
  LoyaltyConfig,
  TierThreshold,
  LoyaltyTransaction,
  LoyaltyTransactionType,
  RewardCatalogItem,
  EarnPointsInput,
  EarnPointsResult,
  RedeemRewardInput,
  RedeemRewardResult,
  HighPrecisionTimestamp,
  LoyaltyMutationOutcome,
  LoyaltyConflictReason,
  LoyaltyMutationEnvelope,
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
  SendToKdsResponse,
} from './types/kds';

// Reservations
export type {
  Reservation,
  ReservationStatus,
  CreateReservationInput,
  UpdateReservationInput,
} from './types/reservation';

// FEL (Guatemala Fiscal System)
export type {
  NitLookupResult,
  FelEmissionRequest,
  FelEmissionResponse,
  FelVoidRequest,
  FelVoidResponse,
  IFelProvider,
  FELInvoiceData,
  ValidationResult,
  CertificateInfo,
  SignedXmlResult,
} from './types/fel';

// API utilities
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginationParams,
  AuthTokenPayload,
} from './types/api';

// Device enrollment
export type {
  DeviceRole,
  ActivationCode,
  EnrolledDevice,
  EnrollDeviceInput,
  EnrollDeviceResult,
  ActivationCodeResult,
} from './types/device';
export { DEVICE_ROLES, isDeviceRole } from './types/device';

// Offline-First Resilience (FT-CORE-002)
export type {
  SyncStatus,
  NetworkHealthSnapshot,
  OfflineEventType,
  OfflineEventPayload,
  OfflineQueueEvent,
  RetryPayload,
  ReconciliationOutcome,
  ReconciledEventReceipt,
  ReconciliationResponse,
} from './types/offline';

// Terminal Telemetry (FT-CORE-003)
export type {
  TelemetrySeverity,
  TelemetryHttpMethod,
  TelemetryNetworkFailureKind,
  TelemetryBatteryState,
  TelemetryThermalState,
  TelemetryAnomalyKind,
  NetworkMetric,
  HardwareMetric,
  TelemetryAnomaly,
  TelemetryPayload,
  TelemetryIngestResult,
} from './types/telemetry';
export {
  TELEMETRY_BUFFER_CAPS,
  TELEMETRY_FLUSH_INTERVAL_MS,
} from './types/telemetry';

// Franchise Migration Cannon (FT-GROWTH-005)
export type {
  MigrationSource,
  MigrationSourceFormat,
  MigrationMode,
  MigrationEntityKind,
  MigrationRowOutcome,
  MigrationConflictReason,
  MigrationPayload,
  MigrationRowError,
  MigrationEntityTally,
  MigrationConflict,
  MigrationResultReport,
} from './types/migration';
export {
  MIGRATION_SOURCES,
  isMigrationSource,
  MIGRATION_LIMITS,
} from './types/migration';

// Zero-Third-Party Messaging (FT-GROWTH-015)
export type {
  ChatRoomKind,
  ChatSenderRole,
  ChatMessage,
  ChatClientEventType,
  ChatClientEvent,
  ChatServerEventType,
  ChatServerEvent,
  ChatErrorCode,
  PushSubscriptionOwnerKind,
  WebPushKeys,
  WebPushSubscriptionInput,
  ExpoPushSubscriptionInput,
  PushSubscriptionInput,
  WebPushPayload,
  PushBroadcastFilter,
  PushDispatchResult,
  PushBroadcastReport,
} from './types/messaging';
export {
  CHAT_ROOMS,
  isChatRoomKind,
  CHAT_LIMITS,
  PUSH_OWNERS,
  isPushSubscriptionOwnerKind,
  isExpoPushSubscription,
  WEBPUSH_LIMITS,
} from './types/messaging';

// Local Media Storage (FT-GROWTH-015 §2)
export type {
  MediaAssetKind,
  MediaAsset,
  MediaUploadResult,
} from './types/media';
export {
  MEDIA_KINDS,
  isMediaAssetKind,
  MEDIA_LIMITS,
} from './types/media';

// Sales Lead Capture (Sprint Pre12.1)
export type {
  LeadStatus,
  LeadSource,
  LeadVertical,
  LeadEventKind,
  LeadEvent,
  Lead,
  CreateLeadInput,
  UpdateLeadInput,
  ListLeadsQuery,
  ListLeadsResult,
} from './types/lead';
export {
  LEAD_STATUSES,
  LEAD_SOURCES,
  LEAD_VERTICALS,
  LEAD_LIMITS,
  isLeadStatus,
  isLeadSource,
  isLeadVertical,
} from './types/lead';

// TikalLoyalty Mobile App (FT-GROWTH-002, Sprint 12.1)
export type {
  LoyaltyAuthProvider,
  LoyaltyTransactionKind,
  LoyaltyPushTopic,
  LoyaltyMobileProfile,
  LoyaltyMobileSession,
  LoyaltyAuthGoogleInput,
  LoyaltyAuthAppleInput,
  LoyaltyAuthEmailInput,
  LoyaltyFranchiseBranding,
  LoyaltyMemberSummary,
  LoyaltyTransactionEntry,
  LoyaltyRewardCard,
  LoyaltyFranchiseDetail,
  LoyaltyRedemptionHold,
  ReserveRewardInput,
  LoyaltyAdCampaignCard,
  LoyaltyPushSubscribeInput,
  UpdateLoyaltyProfileInput,
} from './types/loyalty-mobile';
export {
  LOYALTY_AUTH_PROVIDERS,
  LOYALTY_TRANSACTION_KINDS,
  LOYALTY_PUSH_TOPICS,
  isLoyaltyAuthProvider,
  isLoyaltyTransactionKind,
  isLoyaltyPushTopic,
} from './types/loyalty-mobile';

// Subscription Tiers & Monetization (FT-MONETIZATION-001, Sprint 11.1)
export type {
  PlanTier,
  BillingCycle,
  SubscriptionStatus,
  SubscriptionEventKind,
  AdSegmentationKind,
  PushSegmentationKind,
  PushSchedulingKind,
  PlanLimits,
  Subscription,
  UsageWindow,
  SubscriptionEvent,
  UsageSnapshot,
  UpdateSubscriptionInput,
  ListUsageWindowsQuery,
  ListSubscriptionEventsQuery,
} from './types/subscription';
export {
  PLAN_TIERS,
  BILLING_CYCLES,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_EVENT_KINDS,
  PLAN_LIMITS,
  isPlanTier,
  isBillingCycle,
  isSubscriptionStatus,
  isSubscriptionEventKind,
} from './types/subscription';
