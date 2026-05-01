# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Session: April 29, 2026 - 12:38 PM UTC-06:00
### Author: Cascade (SWE-1.6)

### Added

#### New Type Definitions

- **Reservations** (`src/types/reservation.ts`):
  - `ReservationStatus` enum: PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW
  - `Reservation` interface
  - `CreateReservationInput` interface
  - `UpdateReservationInput` interface

- **Loyalty System Extensions** (`src/types/loyalty.ts`):
  - `RewardCatalogItem` interface - Reward catalog items with points cost and discount rules
  - `EarnPointsInput` interface - Input for earning loyalty points
  - `EarnPointsResult` interface - Result of earning points with calculation breakdown
  - `RedeemRewardInput` interface - Input for redeeming rewards
  - `RedeemRewardResult` interface - Result of reward redemption

- **FEL (Guatemala Fiscal System)** (`src/types/fel.ts`):
  - `NitLookupResult` interface - NIT lookup results
  - `FelEmissionRequest` interface - FEL invoice emission request
  - `FelEmissionResponse` interface - FEL invoice emission response
  - `FelVoidRequest` interface - FEL invoice void request
  - `FelVoidResponse` interface - FEL invoice void response
  - `IFelProvider` interface - FEL provider abstraction
  - `FELInvoiceData` interface - FEL invoice data structure
  - `ValidationResult` interface - Validation result structure
  - `CertificateInfo` interface - Certificate information
  - `SignedXmlResult` interface - Signed XML result

#### Development Tooling

- Added `dev` script to package.json for watch mode TypeScript compilation
- Added `prepublishOnly` script to package.json to ensure build before publish

### Changed

#### Enum Normalization

All enums have been standardized to use uppercase values for consistency with Prisma schema:

- `OrderStatus`: 'DRAFT' | 'OPEN' | 'PAID' | 'PARTIALLY_PAID' | 'VOIDED' | 'REFUNDED'
- `OrderType`: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY'
- `PaymentMethodType`: 'CASH' | 'CARD' | 'CREDIT' | 'DEBIT' | 'MOBILE' | 'GIFT_CARD' | 'LOYALTY_POINTS'
- `PaymentStatus`: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
- `MenuItemStatus`: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
- `ComboSlotType`: 'FIXED' | 'CHOICE'
- `SyncEntityType`: 'ORDER' | 'MENU_ITEM' | 'MODIFIER_GROUP' | 'GUEST' | 'LOYALTY_TRANSACTION'
- `SyncAction`: 'CREATE' | 'UPDATE' | 'DELETE'
- `OrganizationStatus`: 'ACTIVE' | 'SUSPENDED' | 'TRIAL'
- `LocationStatus`: 'ACTIVE' | 'INACTIVE'
- `StaffRole`: 'OWNER' | 'MANAGER' | 'CASHIER' | 'SERVER' | 'WAITER' | 'SELLER'
- `LoyaltyTier`: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
- `LoyaltyTransactionType`: 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE'
- `PaymentMethod`: 'CARD' | 'MOBILE'

#### Type Extensions

- `StaffRole` extended to include 'WAITER' and 'SELLER' to match Prisma UserRole enum
- `PaymentMethodType` extended to include 'CREDIT' and 'DEBIT' to match Prisma PaymentMethod enum

### Export Updates

Updated `src/index.ts` to export all new types:
- Reservation types (Reservation, ReservationStatus, CreateReservationInput, UpdateReservationInput)
- Extended Loyalty types (RewardCatalogItem, EarnPointsInput, EarnPointsResult, RedeemRewardInput, RedeemRewardResult)
- FEL types (NitLookupResult, FelEmissionRequest, FelEmissionResponse, FelVoidRequest, FelVoidResponse, IFelProvider, FELInvoiceData, ValidationResult, CertificateInfo, SignedXmlResult)
- PaymentMethod type

## [0.1.4] - Previous Release

- Previous version before this refactoring session
