# CLAUDE.md - @tikalpos/shared

This file provides context for Claude AI assistants working on the @tikalpos/shared package.

## Project Status

**In active development. Nothing is in production yet.**

## Project Overview

@tikalpos/shared is a TypeScript-only package that provides centralized type definitions for the TikalPOS ecosystem. It is the single source of truth for all shared types across backend, web, and tablet apps.

## Related Repos

| Repo | Role | Status |
|------|------|--------|
| `tikalpos-backend` | Node.js/Express API | In development |
| `tikalpos-web` | React web frontend (Vite) | In development |
| `tikalpos-tablet` | React tablet app | Early development |
| `@tikalpos/shared` *(this repo)* | Shared types (public npm) | In development |

All repos consume this package. **Changes to types here affect all consumers — coordinate before making breaking changes.**

## Technology Stack

- **TypeScript only** — no runtime code, no dependencies
- Published to npm as `@tikalpos/shared` (public package)

## Key Type Categories

Located in `src/types/`:

- `tenant.ts` — Organizational hierarchy: SystemOwner, Organization, Location, Staff, Guest
- `menu.ts` — Menu management: MenuItem, Category, Modifier, Combo, Override
- `order.ts` — Order types: Order, OrderLineItem, OrderStatus
- `payment.ts` — Payment processing: PaymentMethod, PaymentTransaction
- `sync.ts` — Data synchronization: SyncLedgerEntry, SyncProtocol (critical for offline-first tablet)
- `kds.ts` — Kitchen Display System types
- `loyalty.ts` — Loyalty program: LoyaltyProgram, Tier, Reward, EarnPointsInput, RedeemRewardInput
- `reservation.ts` — Reservations: Reservation, ReservationStatus, CreateReservationInput
- `fel.ts` — Guatemala fiscal system (FEL): NitLookupResult, FelEmissionRequest/Response, IFelProvider
- `api.ts` — Standard API request/response contracts

## Enum Convention

**All enums use UPPERCASE values** — standardized across the entire codebase:

```typescript
// Correct
OrderStatus: 'DRAFT' | 'OPEN' | 'PAID' | 'PARTIALLY_PAID' | 'VOIDED' | 'REFUNDED'
SyncAction: 'CREATE' | 'UPDATE' | 'DELETE'
StaffRole: 'OWNER' | 'MANAGER' | 'CASHIER' | 'SERVER' | 'WAITER' | 'SELLER'
LoyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'

// Never use lowercase
// OrderStatus: 'draft' | 'open'  ← wrong
```

## Local Development Workflow

This package uses `npm link` during local development so consuming repos don't need to publish to npm on every change:

```bash
# In this repo — build in watch mode
npm run dev

# In tikalpos-backend (first time setup)
npm link @tikalpos/shared

# In tikalpos-web (first time setup)
npm link @tikalpos/shared

# To revert to npm published version
npm unlink @tikalpos/shared
```

## Development Commands

```bash
npm run build        # Compile TypeScript to dist/
npm run dev          # Watch mode — compile on change
npm run lint         # Type-check with TypeScript
```

## Guatemala / FEL Context

This package includes FEL (Facturación Electrónica en Línea) types — Guatemala's mandatory electronic invoicing system. Types in `fel.ts` cover:
- NIT lookup (tax ID validation)
- Invoice emission and voiding
- Provider abstraction (INFILE, DIGIFACT, GUATEFACTURAS)
- XML signing and certificate info

## Important Rules

- **No runtime code** — types and interfaces only, no functions
- **Backward compatibility** — don't remove or rename exported types without coordinating with all repos
- **No duplicate types** — if a type is needed in backend or web, it belongs here, not defined locally in those repos
- All new types must be exported from `src/index.ts`