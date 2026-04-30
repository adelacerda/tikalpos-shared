# @tikalpos/shared - Test Suite Documentation

## Overview

This document provides comprehensive information about tests in the @tikalpos/shared package.

## Test Summary

- **Total Test Files**: 0
- **Total Test Suites**: 0
- **Test Framework**: None
- **Current Status**: No tests exist

## Why No Tests?

The @tikalpos/shared package is a **type definitions only** package. It contains:

- TypeScript interfaces
- TypeScript type aliases
- TypeScript enums
- Type utilities

Since this package does not contain any runtime code (no functions, no classes, no business logic), traditional unit tests are not applicable.

## Type Validation

Instead of tests, type validation is achieved through:

### 1. TypeScript Compilation
```bash
npm run build
```
This command:
- Compiles all TypeScript files
- Validates type correctness
- Exports type definitions to `dist/`
- Catches type errors at build time

### 2. Strict Type Checking
```bash
npm run lint
```
This command:
- Runs TypeScript with strict mode
- Catches unsafe type patterns
- Validates enum naming conventions
- Ensures proper type exports

### 3. Consumer Testing
Types are validated through:
- **Backend tests** - Import and use types in backend route/service tests
- **Web tests** - Import and use types in component/store tests
- **Tablet tests** - Import and use types in React Native tests

If a type is incorrect, it will cause compilation errors in the consuming projects.

## Type Coverage

The package includes type definitions for:

| Domain | File | Types |
|--------|------|-------|
| Tenant | `src/types/tenant.ts` | Organization, Location, Staff, SystemOwner |
| Menu | `src/types/menu.ts` | MenuItem, MenuCategory, ModifierGroup, Modifier |
| Order | `src/types/order.ts` | Order, OrderLineItem, OrderStatus |
| Payment | `src/types/payment.ts` | PaymentTransaction, PaymentMethod |
| Loyalty | `src/types/loyalty.ts` | LoyaltyMember, Reward, LoyaltyProgram |
| Sync | `src/types/sync.ts` | SyncLedgerEntry, SyncOperation |
| Kitchen | `src/types/kds.ts` | KDSScreen, KDSOrder |
| Reservations | `src/types/reservation.ts` | Reservation, ReservationStatus |
| FEL | `src/types/fel.ts` | FelEmissionRequest (Guatemala tax) |
| API | `src/types/api.ts` | ApiResponse, ApiError |

## Quality Assurance

### Type Safety Guarantees

1. **No Runtime Code**: Package contains only type definitions
2. **Backward Compatibility**: Types are additive, never removed
3. **Strict Enums**: All enums use UPPERCASE values
4. **Proper Exports**: All types exported from `src/index.ts`
5. **Documentation**: Complex types include JSDoc comments

### Build Process

The `npm run build` command:
1. Runs TypeScript compiler with strict mode
2. Generates declaration files (`.d.ts`)
3. Outputs to `dist/` directory
4. Validates all type relationships

### Linting

The `npm run lint` command:
1. Runs TypeScript compiler with `--noEmit`
2. Checks for type errors without emitting files
3. Validates strict type checking
4. Ensures no `any` types (unless explicitly needed)

## Running Validation

```bash
# Build and type check
npm run build

# Type check only (faster)
npm run lint

# Both (recommended before commit)
npm run build && npm run lint
```

## When to Add Tests

If runtime code is ever added to this package (e.g., utility functions), tests should be added:

```typescript
// Example: If we add a utility function
export function formatCurrency(cents: number, currency: string): string {
  // implementation
}

// Then add test
// src/lib/currency.test.ts
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('should format cents as currency', () => {
    expect(formatCurrency(100, 'USD')).toBe('$1.00');
  });
});
```

## Type Testing Best Practices

### For Consumers

When consuming types from this package:

1. **Use Type Guards**: Validate runtime data against types
2. **Zod Schemas**: Create Zod schemas matching TypeScript types
3. **Test Data**: Use realistic test data matching type structure

Example:
```typescript
import type { MenuItem } from '@tikalpos/shared';

// Create Zod schema matching the type
const MenuItemSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  basePrice: z.number().int().min(0),
  // ... all fields
});

// Use in tests
const mockItem: MenuItem = {
  id: 'item-123',
  name: 'Coffee',
  basePrice: 300,
  // ... all required fields
};
```

## Type Evolution Guidelines

### Adding New Types

1. Add interface/enum to appropriate file in `src/types/`
2. Export from `src/index.ts`
3. Add JSDoc comments explaining purpose
4. Run `npm run build` to validate
5. Update consumer projects if needed

### Modifying Existing Types

1. Make changes backward compatible when possible
2. Add new fields as optional if existing code may not use them
3. Document breaking changes
4. Update all consumer projects
5. Run `npm run build` in all projects

### Deprecating Types

1. Mark with `@deprecated` JSDoc tag
2. Keep type for backward compatibility
3. Document migration path
4. Remove in next major version

## Related Documentation

- [SWE.md](../SWE.md) - Implementation guidelines for type definitions
- [CLAUDE.md](../CLAUDE.md) - Architecture overview
- [README.md](../README.md) - Package overview

## Change History

- v1.0 - Initial documentation (2025-04-30)
