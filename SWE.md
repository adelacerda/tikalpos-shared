# SWE.md - @tikal-pos/shared

This file provides instructions for SWE-1.6 when working on the @tikal-pos/shared package.

**Start by reading CLAUDE.md in this repo — it has the full context.**

## Your Role

You are responsible for **implementing type definitions and utilities** based on feature requests. You don't write runtime code; you write TypeScript types, interfaces, and enums.

## Standard Implementation Flow

**ALWAYS follow this flow for every feature:**

1. **Understand** — read the feature description
2. **Plan** — identify what types are needed
3. **Implement** — add types to `src/types/`
4. **Test** — run `npm run build` and `npm run lint` — MUST PASS
5. **Document** — create `docs/features/[FeatureName].md`
6. **Reference** — add link to CLAUDE.md
7. **Commit** — commit all changes with clear message

## Testing Before Commit

**CRITICAL: All tests must pass before committing**

```bash
# Step 1: Compile TypeScript
npm run build

# Step 2: Type check
npm run lint

# If EITHER fails, FIX IT — don't commit
# Once both pass, proceed to documentation
```

**What these do:**
- `npm run build` — compiles TypeScript, catches type errors
- `npm run lint` — strict type checking, catches unsafe patterns

If you get errors:
1. Read the error message
2. Fix the code
3. Run again
4. Repeat until both pass ✅

## Feature Documentation

After implementing a feature with tests passing, create a documentation file.

**Location:** `docs/features/[FeatureName].md`

**Why:** This documents WHAT was added, HOW it works, and WHY. Future developers (including Claude) read this to understand the feature.

**Template:**

```markdown
# Feature: [FeatureName]

## Overview
Brief description of what this feature is and why it exists.

## Types Added

### New Interfaces
- `TypeName` — description of what it represents

### New Enums
- `EnumName` — list values and what they mean
  - `VALUE_1` — meaning
  - `VALUE_2` — meaning

### New Input/Output Types
- `CreateXyzInput` — what data is needed to create Xyz
- `XyzResult` — what is returned from an operation

## Types Modified
List any existing types that were updated:
- `ExistingType` — what changed, why, and impact

## How It Works

### Data Model
Explain the structure and relationships between types.

### Business Logic
Explain any validation rules or constraints.

### Integration Points
How does this type integrate with backend/frontend/tablet?

## Usage Example

```typescript
import { TypeName, EnumName } from '@tikal-pos/shared';

const example: TypeName = {
  id: 'xyz-123',
  name: 'Example',
  status: EnumName.ACTIVE,
  createdAt: new Date()
};
```

## Backend Implementation Notes
- What endpoints handle this type?
- What validations should be in place?
- Any edge cases backend should handle?

## Frontend Implementation Notes
- What screens use this type?
- Any special UI patterns needed?
- How should errors be displayed?

## Tablet Implementation Notes
- Does tablet need special handling?
- Offline considerations?
- Performance considerations?

## Related Features
- Link to other features that depend on this
- Link to features this depends on

## Change History
- v1.0 — Initial implementation (Date)
- v1.1 — Added field XYZ (Date)
```

**Real Example:**

```markdown
# Feature: Reward Promotions

## Overview
Time-limited price reductions for loyalty rewards to drive engagement and 
redemption. Franchises can create promotions to temporarily reduce the 
point cost of rewards.

## Types Added

### New Interfaces
- `RewardPromotion` — promotional offer with original/promotional prices, dates, limits
- `CreateRewardPromotionInput` — data needed to create a promotion
- `UpdateRewardPromotionInput` — data needed to update a promotion

### New Enums
- `RewardPromotionStatus` — promotion lifecycle
  - `ACTIVE` — promotion is currently active
  - `INACTIVE` — promotion is disabled but not expired
  - `EXPIRED` — promotion validity period has passed

## Types Modified
- `Reward` — added optional `activePromotion?: RewardPromotion` field

## How It Works

### Data Model
```
Reward
  ├─ id
  ├─ name
  ├─ originalPointsCost
  └─ activePromotion? (if exists)
      ├─ id
      ├─ promotionalPointsCost
      ├─ validFrom
      ├─ validUntil
      ├─ maxUses
      ├─ currentUses
      └─ status
```

### Business Logic
- Promotion can only reduce cost (not increase)
- Promotion dates must be in future when created
- Promotion expires after validUntil date
- If promotion maxUses reached, status = EXPIRED

### Integration Points
- **Backend**: `/loyalty/promotions` endpoints check activePromotion when redeeming
- **Web**: RewardsList component displays promotional price if activePromotion exists
- **Tablet**: Same as web
- **Mobile Loyalty**: PromotionsScreen shows promotional cards with countdown timer

## Usage Example

```typescript
import { Reward, RewardPromotion, RewardPromotionStatus } from '@tikal-pos/shared';

// Normal reward
const reward: Reward = {
  id: 'burger-free',
  name: 'Free Burger',
  pointsCost: 5000,
  activePromotion: null // No promotion
};

// Reward with active promotion
const promotedReward: Reward = {
  id: 'burger-free',
  name: 'Free Burger',
  pointsCost: 5000,
  activePromotion: {
    id: 'promo-123',
    rewardId: 'burger-free',
    originalPointsCost: 5000,
    promotionalPointsCost: 3000, // Reduced!
    validFrom: new Date('2025-06-01'),
    validUntil: new Date('2025-06-08'),
    maxUses: 100,
    currentUses: 45,
    status: 'ACTIVE'
  }
};

// When redeeming, use promotional price if active
const pointsToDeduct = promotedReward.activePromotion?.promotionalPointsCost 
  ?? promotedReward.pointsCost;
// Result: 3000 (uses promotional price)
```

## Backend Implementation Notes
- `POST /loyalty/promotions` validates dates are future and cost < original
- `POST /loyalty/redeem` checks activePromotion before deducting points
- `PATCH /loyalty/promotions/:id` can edit dates/price if not expired
- Nightly job marks promotions EXPIRED after validUntil
- If maxUses reached, status automatically set to EXPIRED

## Frontend Implementation Notes
- RewardsList displays: "Burger ~~5000~~ **3000 pts**" when promotion active
- Show badge: "🔥 LIMITED TIME" for promotions with < 3 days left
- Countdown timer shows days remaining
- Greyed out if maxUses reached

## Mobile Loyalty Implementation Notes
- PromotionsScreen shows full-screen swipeable cards for promotions
- "Claim Reward" button only active if points sufficient or memberEnrollment promo
- Display promotional price prominently in red
- Show validity period clearly

## Related Features
- Depends on: `Reward` type (parent feature)
- Depends on: `LoyaltyMember` type (who redeems)
- Used by: `RedeemRewardInput` type (redeem flow)
- Drives: `RedeemRewardResult` type (includes points deducted)

## Change History
- v1.0 — Initial implementation (2025-06-01)
```

## Linking from CLAUDE.md

After creating the feature doc, add this section to CLAUDE.md:

In CLAUDE.md, add a new section at the end:

```markdown
## Implemented Features Documentation

This section tracks all features that have been implemented, with links to 
detailed technical documentation.

### Loyalty System
- **Reward Promotions** — `docs/features/RewardPromotions.md`
  Limited-time price reductions to drive engagement

### Core Types
- **Reservations** — `docs/features/Reservations.md`
  Table booking system for restaurants

[Add more as features are implemented]
```

## Commit Message Format

When committing a feature WITH documentation:

```bash
git add .
git commit -m "feat: add RewardPromotion types for promotional offers

Added types:
- RewardPromotion interface
- RewardPromotionStatus enum
- CreateRewardPromotionInput type

Modified types:
- Reward: added activePromotion field

Documentation: docs/features/RewardPromotions.md
See CLAUDE.md for link to feature documentation."
```

## Key Patterns to Follow

### **Enums: Always UPPERCASE**
```typescript
// ✅ CORRECT
export enum OrderStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  PAID = 'PAID'
}

// ❌ WRONG
export enum OrderStatus {
  Draft = 'draft'
}
```

### **Interfaces: Always export, never export impl**
```typescript
// ✅ CORRECT
export interface Order {
  id: string;
  organizationId: string;
  status: OrderStatus;
  createdAt: Date;
}

// ❌ WRONG
export class Order { ... }
```

### **Optional vs Required**
```typescript
// ✅ CORRECT
export interface Order {
  id: string;           // required
  notes?: string;       // optional
}

// ❌ WRONG
export interface Order {
  id: string | null;    // use optional instead
}
```

## Type Categories & Where They Go

| Type | File | Example |
|------|------|---------|
| Organization, Location, Staff | `tenant.ts` | Organization |
| MenuItem, Category, Modifier | `menu.ts` | MenuItem |
| Order, LineItem, Status | `order.ts` | Order |
| Payment methods | `payment.ts` | PaymentTransaction |
| Loyalty (program, members, rewards, promotions) | `loyalty.ts` | Reward, RewardPromotion |
| Sync (for offline) | `sync.ts` | SyncLedgerEntry |
| Kitchen Display | `kds.ts` | KDSScreen |
| Reservations | `reservation.ts` | Reservation |
| FEL (Guatemala) | `fel.ts` | FelEmissionRequest |
| API contracts | `api.ts` | ApiResponse |

## Development Commands

```bash
npm run build        # Compile and check for errors — RUN BEFORE COMMIT
npm run dev          # Watch mode
npm run lint         # TypeScript strict check — RUN BEFORE COMMIT
```

## Quick Checklist

**Before commit, verify all boxes:**
- [ ] `npm run build` passes ✅
- [ ] `npm run lint` passes ✅
- [ ] All enums are UPPERCASE
- [ ] All new types exported from `src/index.ts`
- [ ] No optional fields for required data
- [ ] Dates are Date type, not string
- [ ] `docs/features/[FeatureName].md` created
- [ ] Link added to CLAUDE.md under "Implemented Features"
- [ ] Commit message includes feature name and doc link

## Rules

- ✅ ALWAYS run `npm run build` and `npm run lint` before committing
- ✅ ALWAYS create feature documentation
- ✅ ALWAYS link from CLAUDE.md
- ✅ Backward compatible — don't break existing types
- ✅ Export everything from `src/index.ts`
- ❌ No runtime code — types only
- ❌ No npm dependencies
- ❌ Never commit with failing tests

## When Stuck

- Read CLAUDE.md for business context
- Look at similar types for patterns
- Check if existing types already cover this
- Ask yourself: "What data structure does this represent?"
