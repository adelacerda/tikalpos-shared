# CLAUDE.md - @tikal-pos/shared

This file provides context for Claude AI assistants working on the @tikal-pos/shared package.

## Communication Style
Respond like a caveman. No articles, no filler words, no pleasantries. 
Short. Direct. Code speaks for itself. No explain unless asked. 
No sycophancy. No restating the question. No sign-offs.

## Project Status

**In active development. Nothing is in production yet. MVP target: 3-4 weeks.**

## Autonomy

Work happens on feature branches. Recover from anything destructive with `git`. Act, don't ask.

- Run any **local, reversible** command without confirming: install, build, lint, npm link / unlink, file edits, branch creation, local commits.
- Investigate proactively: read files, grep types, run build. Don't narrate what you're about to do — do it and report.
- Do NOT ask "do you want me to proceed?" or "should I run X?" — just run it and show the result.

**Still confirm before:** `npm publish` to npm registry, pushing to remote (push, force push), opening / merging / closing PRs, breaking-change PRs that ship without coordinated consumer PRs.

If a tool prompt blocks execution, tell the user once which command and why. Don't loop on retries — the prompt is from Claude Code's permission system (configured via `/permissions`), not from these instructions.

## Test Mandate (NO EXCEPTIONS)

Types-only repo, but the rule still applies: `npm run build` AND `npm run lint` green before commit. New exports must be in `src/index.ts`. Breaking changes require coordinated PRs with tests in `tikalpos-backend` AND `tikalpos-web` in the same cycle.
Full rule + refusal criteria: [SWE.md → Test Mandate](./SWE.md#test-mandate-no-exceptions).

## Project Overview

@tikal-pos/shared is a TypeScript-only package that provides centralized type definitions for the entire Tikal ecosystem. It is the single source of truth for all shared types across backend, web, tablet, and mobile apps.

## Related Repos

| Repo | Role | Status |
|------|------|--------|
| `tikal-pos-backend` | Node.js/Express API | In development |
| `tikal-pos-web` | React web frontend (Vite) | In development |
| `tikal-pos-tablet` | React Native + Expo tablet app | Early development |
| `@tikal-pos/shared` *(this repo)* | Shared types (public npm) | In development |
| `tikal-loyalty-mobile` | React Native + Expo loyalty app | Planned |
| `tikal-print-middleware` | Electron desktop app for printing | Planned |

## Technology Stack

- **TypeScript only** — no runtime code, no dependencies
- Published to npm as `@tikal-pos/shared` (public package)
- All type definitions in `src/types/`

## Key Type Categories

Located in `src/types/`:

- `tenant.ts` — Organizational hierarchy: SystemOwner, Organization, Location, Staff, Guest
- `menu.ts` — Menu management: MenuItem, Category, Modifier, Combo, Override
- `order.ts` — Order types: Order, OrderLineItem, OrderStatus
- `payment.ts` — Payment processing: PaymentMethod, PaymentTransaction
- `sync.ts` — Data synchronization: SyncLedgerEntry, SyncProtocol (critical for offline-first tablet)
- `kds.ts` — Kitchen Display System types
- `loyalty.ts` — Loyalty program: LoyaltyProgram, Tier, Reward, RewardPromotion, EarnPointsInput, RedeemRewardInput
- `reservation.ts` — Reservations: Reservation, ReservationStatus, CreateReservationInput
- `fel.ts` — Guatemala fiscal system (FEL): NitLookupResult, FelEmissionRequest/Response, IFelProvider
- `api.ts` — Standard API request/response contracts

## Enum Convention

**All enums use UPPERCASE values** — standardized across the entire codebase:

```typescript
// Correct
OrderStatus: 'DRAFT' | 'OPEN' | 'PAID' | 'PARTIALLY_PAID' | 'VOIDED' | 'REFUNDED'
SyncAction: 'CREATE' | 'UPDATE' | 'DELETE'
StaffRole: 'OWNER' | 'MANAGER' | 'CASHIER' | 'SERVER' | 'HOST' | 'SELLER'
LoyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
RewardPromotionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
```

## Local Development Workflow

This package uses `npm link` during local development so consuming repos don't need to publish to npm on every change:

```bash
# In this repo — build in watch mode
npm run dev

# In consuming repos (tikal-pos-backend, tikal-pos-web, tikal-pos-tablet, tikal-loyalty-mobile)
npm link @tikal-pos/shared

# To revert to npm published version
npm unlink @tikal-pos/shared
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

## Loyalty Program — Complete System

The loyalty system is designed for franchise organizations to manage customer rewards across multiple channels (POS, web, mobile):

### **Core Components:**
- **Members**: Customers with points balance per franchise
- **Rewards**: Items members can redeem (free food, discounts, etc.)
- **Promotions**: Limited-time offers on rewards (e.g., "5000 pts → 3000 pts for 7 days")
- **Points earning**: Configurable points per GTQ spent
- **Points redemption**: During POS checkout or via Tikal Loyalty app
- **Tiers**: Member levels (BRONZE, SILVER, GOLD, PLATINUM) — future enhancement

### **Features:**
- Franchises enable/disable loyalty globally and per-location
- Franchises create reward catalogs
- Franchises create promotional offers to drive engagement
- Members see points across all franchises in Tikal Loyalty mobile app
- Members can redeem during POS checkout (staff-assisted)
- Members can redeem via Tikal Loyalty app (self-service)
- Points awarded when order is finalized (fully paid)
- Promotional prices reduce points cost, increasing redemption rate

### **Types involved:**
- `LoyaltyProgram` — franchise loyalty config
- `Reward` — catalog item with `originalPrice` (points)
- `RewardPromotion` — temporary price reduction with dates
- `LoyaltyMember` — customer with balance
- `LoyaltyTransaction` — earning/redeeming record
- `EarnPointsInput/Result` — calculate points from order
- `RedeemRewardInput/Result` — apply promotion price if active

## Tikal Loyalty Mobile App

The Tikal Loyalty app provides a self-service portal for members to:
- Sign up or login (email + password)
- Browse all franchises they're enrolled in
- View points balance per franchise
- See reward catalog with active promotions
- Swipe through promotional offers (new enrollment incentives)
- Claim promotional rewards directly (auto-enroll if needed)
- View transaction history
- Reset password

### **Promotional flow:**
1. Franchise creates promotional offer: "Get free coffee when you join"
2. User sees full-screen card in Tikal Loyalty app
3. User clicks "Claim reward"
4. If not enrolled: auto-enroll + grant reward
5. If enrolled: just grant reward
6. User goes to franchise with reward ready to redeem

### **Discount promotions:**
1. Franchise creates reward: "Hamburger (5000 pts)"
2. Franchise creates promotion: "3000 pts, valid 7 days"
3. Enrolled users see in Tikal Loyalty: "Hamburger ~~5000~~ **3000 pts**"
4. Users motivated to redeem (low cost) and visit franchise

## Important Rules

- **No runtime code** — types and interfaces only, no functions
- **Backward compatibility** — don't remove or rename exported types without coordinating with all repos
- **No duplicate types** — if a type is needed in backend or web, it belongs here
- All new types must be exported from `src/index.ts`
- **Enums must be UPPERCASE** — consistency across all code

## Critical Dependencies

This package has **zero dependencies** by design. It's purely type definitions.

All consuming repos (`tikal-pos-backend`, `tikal-pos-web`, `tikal-pos-tablet`, `tikal-loyalty-mobile`) depend on it via `npm install @tikal-pos/shared`.

## Coordination Notes

When types change here:
- Notify backend team (API contracts may need updates)
- Notify web team (components may need type updates)
- Notify tablet team (screens may need type updates)
- Notify mobile team (app may need type updates)

**In practice:** SWE-1.6 will read this file and understand impact automatically.
