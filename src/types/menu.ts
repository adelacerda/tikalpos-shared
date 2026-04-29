// ──────────────────────────────────────────────
// Menu & Multi-Modifier Logic
// ──────────────────────────────────────────────

export type MenuItemStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface MenuCategory {
  id: string;
  organizationId: string;
  name: string;
  sortOrder: number;
  parentCategoryId?: string; // nested categories
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Combo Types
// ──────────────────────────────────────────────

export type ComboSlotType = 'FIXED' | 'CHOICE';

export interface ComboSlotOption {
  id: string;
  comboSlotId: string;
  productId: string;
  productName: string;
  productPrice: number;
  sortOrder: number;
}

export interface ComboSlot {
  id: string;
  productId: string;
  label: string;
  slotType: ComboSlotType;
  fixedProductId?: string;
  fixedProductName?: string;
  fixedProductPrice?: number;
  sortOrder: number;
  options: ComboSlotOption[];
}

export interface ComboSelection {
  slotId: string;
  slotLabel: string;
  slotType: ComboSlotType;
  productId: string;
  productName: string;
}

export type PrepDestination = 'KITCHEN' | 'BAR';

export interface MenuItem {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;        // effective price (period override > location override > base)
  originalPrice?: number;   // pre-period price — present when a period override is active
  activePeriodPrice?: number | null;  // non-null when a price period is currently active
  activePeriodName?: string | null;   // name of the active period, e.g. "Happy Hour"
  imageUrl?: string;
  status: MenuItemStatus;
  modifierGroupIds: string[];
  taxable: boolean;
  sortOrder: number;
  prepTimeMinutes: number;  // expected prep time in minutes
  destination: PrepDestination; // KITCHEN or BAR
  isCombo?: boolean;
  comboSlots?: ComboSlot[];
  createdAt: string;
  updatedAt: string;
}

/**
 * A modifier group bundles related modifiers together.
 * Examples: "Size", "Toppings", "Milk Type"
 */
export interface ModifierGroup {
  id: string;
  organizationId: string;
  name: string;
  required: boolean;
  minSelections: number;
  maxSelections: number; // 0 = unlimited
  modifiers: Modifier[];
  createdAt: string;
  updatedAt: string;
}

export interface Modifier {
  id: string;
  modifierGroupId: string;
  name: string;
  priceAdjustment: number; // in cents, can be negative
  isDefault: boolean;
  sortOrder: number;
  nestedModifierGroupId?: string; // for multi-level modifiers
  createdAt: string;
  updatedAt: string;
}

/**
 * A resolved line-item modifier selection made by the user.
 */
export interface SelectedModifier {
  modifierId: string;
  modifierGroupId: string;
  name: string;
  priceAdjustment: number;
  nestedSelections?: SelectedModifier[];
}

/**
 * Per-location overrides for menu items (pricing, availability).
 */
export interface LocationMenuOverride {
  id: string;
  locationId: string;
  menuItemId: string;
  priceOverride?: number;
  statusOverride?: MenuItemStatus;
}
