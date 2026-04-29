# CLAUDE.md - @tikalpos/shared

This file provides context for Claude AI assistants working on the @tikalpos/shared package.

## Project Overview

@tikalpos/shared is a TypeScript package that provides centralized type definitions and utilities for the TikalPOS ecosystem. It is published to npm and used by both the web frontend and the backend to ensure type consistency across the system.

## Purpose

This package eliminates duplication and ensures type safety across:
- Backend API (tikalpos-backend)
- Web frontend (tikalpos-web)
- Tablet app (tikalpos-tablet)
- Any future clients

## Technology Stack

- **TypeScript** - Type definitions only
- No runtime dependencies
- Published to npm as a public package

## Key Type Categories

Located in `src/types/`:

- `tenant.ts` - Organizational hierarchy (SystemOwner, Organization, Location, Staff, Guest)
- `menu.ts` - Menu management (MenuItem, Category, Modifier, Combo, Override)
- `order.ts` - Order types (Order, OrderLineItem, OrderStatus)
- `payment.ts` - Payment processing (PaymentMethod, PaymentTransaction)
- `sync.ts` - Data synchronization (SyncLedgerEntry, SyncProtocol)
- `kds.ts` - Kitchen Display System types
- `loyalty.ts` - Loyalty program types (LoyaltyProgram, Tier, Reward)
- `api.ts` - API request/response contracts

## Installation

```bash
npm install @tikalpos/shared
```

## Usage

```typescript
import type {
  Organization,
  MenuItem,
  Order,
  PaymentMethodType,
} from '@tikalpos/shared';
```

## Development Commands

```bash
npm run build    # Compile TypeScript to JavaScript
npm run lint     # Type-check with TypeScript
```

## Important Notes

- This is a **types-only package** - no runtime code
- All types must be backward compatible when published
- Changes to types should be coordinated across all consuming projects
- The sync protocol types in `types/sync.ts` are critical for offline-first tablet app synchronization
