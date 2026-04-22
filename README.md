# @tikal-pos/shared

Shared TypeScript type definitions and utilities for Tikal POS (Point of Sale) system.

## Overview

This package provides a centralized collection of type definitions for the Tikal POS ecosystem, including:

- **Tenant Hierarchy**: System owners, organizations, locations, staff, and guests
- **Menu Management**: Categories, items, modifiers, combos, and overrides
- **Orders**: Order types, statuses, line items, and tracking
- **Payments**: Payment methods, processors, and transactions
- **Sync & KDS**: Data synchronization and Kitchen Display System types
- **Loyalty**: Customer loyalty programs and tier management
- **API**: Standard API request/response contracts

## Installation

```bash
npm install @tikal-pos/shared
```

## Usage

```typescript
import type {
  Organization,
  MenuItem,
  Order,
  PaymentMethodType,
} from '@tikal-pos/shared';

// Use types in your application
const organization: Organization = {
  id: 'org-123',
  name: 'My Restaurant',
  status: 'active',
  // ... other properties
};
```

## Available Type Exports

All exports are TypeScript type definitions. Check the [source files](./src/types/) for complete type documentation:

- `types/tenant.ts` - Organizational hierarchy and staff management
- `types/menu.ts` - Menu, items, and modifiers
- `types/order.ts` - Order management
- `types/payment.ts` - Payment processing
- `types/sync.ts` - Data synchronization
- `types/kds.ts` - Kitchen Display System
- `types/loyalty.ts` - Loyalty programs
- `types/api.ts` - API contracts

## Building

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## License

MIT

## Contributing

Contributions welcome! Please ensure all types are well-documented and backward compatible.
