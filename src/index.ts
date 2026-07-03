// Design tokens (Full-Design-V1 — single source of truth for all surfaces)
export type { ThemeMode, ThemeColors, Tokens } from './tokens';
export {
  FONT,
  COLOR,
  THEME,
  RADIUS,
  SPACE,
  MOTION,
  DEFAULT_MODE,
  getThemeColors,
  tokens,
} from './tokens';

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
export { CITIES_BY_COUNTRY, citiesForCountry } from './types/cities';
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

// Active Countries (phased country-by-country rollout)
export type {
  SupportedLocale,
  Country,
  CountryCatalogEntry,
  ActivateCountryInput,
  UpdateCountryInput,
} from './types/country';
export {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  COUNTRY_CATALOG,
  getCatalogEntry,
  phoneDigits,
  toE164,
  nationalPart,
  isValidNationalPhone,
  isValidTaxId,
} from './types/country';

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
  LinkManualAccountInput,
  LinkManualAccountResult,
  HighPrecisionTimestamp,
  LoyaltyMutationOutcome,
  LoyaltyConflictReason,
  LoyaltyMutationEnvelope,
  LoyaltyMode,
  EarnPreference,
  ExpiryBlock,
  CashbackConfig,
  ExpiryPolicy,
  ExpiryExampleRow,
} from './types/loyalty';
export {
  isRewardPromotionActive,
  isRewardBoostActive,
  isDiscoveryHighlightActive,
  CASHBACK_APPLY_MODE,
  activeCashbackMultiplier,
  cashbackEarnedCents,
  cashbackApplicableCents,
  expiryBlockKey,
  expiryBlockStartsAt,
  expiryBlockEndsAt,
  balanceExpiresAt,
  expiryExamples,
  EXPIRY_BLOCK_MONTHS,
  EXPIRY_VALIDITY_MONTHS,
} from './types/loyalty';

// Loyalty Ad system (FT-GROWTH-017 / reward-wizard SS5)
export type {
  LoyaltyAd,
  CreateLoyaltyAdInput,
  AdImpressionPricing,
  CreateAdImpressionPricingInput,
} from './types/ad';
export { isLoyaltyAdActive } from './types/ad';

// Push Promotion system (FT-GROWTH-017 / reward-wizard)
export type {
  PushPromotion,
  CreatePushPromotionInput,
  PushPromotionTarget,
} from './types/push-promotion';
export { isPushPromotionActive } from './types/push-promotion';

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
  LoyaltyRewardMilestone,
  LoyaltyTransactionEntry,
  LoyaltyRewardCard,
  LoyaltyGiftedRewardCard,
  LoyaltyFranchiseDetail,
  LoyaltyLocation,
  LoyaltyMerchantSearchResult,
  LoyaltyMerchantSearchResponse,
  LoyaltyRedemptionHold,
  RedemptionHoldMode,
  CreateRedemptionHoldInput,
  RedemptionResolveResult,
  RedemptionConsumeInput,
  RedemptionConsumeResult,
  ReserveRewardInput,
  LoyaltyAdCampaignCard,
  LoyaltyAdCard,
  LoyaltyDiscoveryCard,
  LoyaltyDiscoveryPage,
  LoyaltyFranchisePreview,
  LoyaltyPushSubscribeInput,
  UpdateLoyaltyProfileInput,
  LoyaltyServiceItem,
  LoyaltyReviewSummary,
  LoyaltyReviewStatus,
  LoyaltyReview,
  CreateReviewInput,
  LoyaltyReviewPrompt,
  ReviewReportReason,
  LoyaltyDemoActivateInput,
} from './types/loyalty-mobile';
export {
  LOYALTY_AUTH_PROVIDERS,
  LOYALTY_TRANSACTION_KINDS,
  LOYALTY_PUSH_TOPICS,
  REVIEW_REPORT_REASONS,
  DEMO_MODE_HEADER,
  isLoyaltyAuthProvider,
  isLoyaltyTransactionKind,
  isLoyaltyPushTopic,
  isReviewReportReason,
} from './types/loyalty-mobile';

// Corporate Employee Benefits (FT-GROWTH-018 §Canal 1)
export type {
  CorporateAccountStatus,
  CorporateAccount,
  CorporateMembershipStatus,
  CorporateMembership,
  CreateCorporateAccountInput,
  RedeemCorporateInviteInput,
} from './types/corporate';
export {
  CORPORATE_ACCOUNT_STATUSES,
  CORPORATE_MEMBERSHIP_STATUSES,
} from './types/corporate';

// Cross-Tenant Loyalty Coalition (FT-GROWTH-008 §Canal 4)
export type {
  CoalitionStatus,
  CoalitionMemberOrg,
  Coalition,
  CreateCoalitionInput,
  LoyaltyCoalitionFranchise,
  LoyaltyCoalitionSummary,
  CoalitionSettlement,
} from './types/coalition';
export { COALITION_STATUSES } from './types/coalition';

// Discovery Carousel — system-admin highlight pricing
export type {
  DiscoveryHighlightPricing,
  CreateDiscoveryHighlightPricingInput,
} from './types/discovery';

// MFA — two-step verification (TOTP / authenticator app)
export type {
  MfaSetupResponse,
  MfaEnableInput,
  MfaEnableResponse,
  MfaVerifyInput,
  MfaChallenge,
  MfaResetInput,
} from './types/mfa';
export { MFA_TRUST_DEVICE_DAYS, MFA_BACKUP_CODE_COUNT } from './types/mfa';

// System-admin — all loyalty members across franchises
export type {
  LoyaltyMemberPlatform,
  LoyaltySessionReportInput,
  SystemLoyaltyMemberEnrollment,
  SystemLoyaltyMember,
  SystemLoyaltyMemberSort,
  SystemLoyaltyMembersQuery,
  SystemLoyaltyMembersResponse,
} from './types/system-loyalty-members';
export { LOYALTY_MEMBER_PLATFORMS } from './types/system-loyalty-members';

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
  PlanPricing,
  UpdatePlanPricingInput,
  PlanOffer,
  CreatePlanOfferInput,
  PlanUsage,
  PlanUsageMetric,
} from './types/subscription';
export {
  PLAN_TIERS,
  BILLING_CYCLES,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_EVENT_KINDS,
  PLAN_LIMITS,
  LOYALTY_PLAN_LADDER,
  POS_PLAN_LADDER,
  isPlanTier,
  isLoyaltyOnlyPlan,
  isCashbackEligiblePlan,
  nextPlanInFamily,
  isBillingCycle,
  isSubscriptionStatus,
  isSubscriptionEventKind,
} from './types/subscription';

// Billing & Invoicing (Facturación) — see docs/feature-billing-invoicing.md
export type {
  InvoiceStatus,
  InvoiceCloseType,
  InvoicePaymentMethod,
  InvoiceLineKind,
  InvoiceLineItem,
  InvoicePayment,
  Invoice,
  ClosePeriodInput,
  RecordPaymentInput,
  ListInvoicesQuery,
} from './types/invoice';
export {
  INVOICE_STATUSES,
  INVOICE_CLOSE_TYPES,
  PAYMENT_METHODS,
  INVOICE_LINE_KINDS,
  isInvoiceStatus,
  isInvoicePaymentMethod,
} from './types/invoice';

// Platform sellers + commissions (FT-SELLERS)
export type {
  CommissionKind,
  CommissionStatus,
  Seller,
  CreateSellerInput,
  UpdateSellerInput,
  CommissionConfig,
  UpdateCommissionConfigInput,
  Commission,
  AdjustCommissionInput,
  SetLockedFeeInput,
  SellerClientInvoice,
  SellerClient,
  CommissionTotals,
  SellerCommissionsQuery,
  CommissionPayout,
  MarkCommissionsPaidInput,
  RegisterPayoutInput,
  SellerDocumentKind,
  SellerDocumentStatus,
  SellerDocument,
  UploadSellerDocumentInput,
  ReviewSellerDocumentInput,
  SellerDocumentsQuery,
  SellerPeriodStatement,
} from './types/seller';
export { SELLER_DOC_LIMITS } from './types/seller';

// Loyalty operators ("cajeros")
export type {
  LoyaltyOperator,
  CreateLoyaltyOperatorInput,
  UpdateLoyaltyOperatorInput,
  LoyaltyOperatorsView,
  OperatorLoginInput,
  OperatorSession,
} from './types/loyalty-operator';
export { OPERATOR_PIN_REGEX, OPERATOR_LOGIN_CODE_REGEX } from './types/loyalty-operator';
