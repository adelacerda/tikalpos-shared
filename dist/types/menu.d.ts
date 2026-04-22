export type MenuItemStatus = 'active' | 'inactive' | 'out_of_stock';
export interface MenuCategory {
    id: string;
    organizationId: string;
    name: string;
    sortOrder: number;
    parentCategoryId?: string;
    createdAt: string;
    updatedAt: string;
}
export type ComboSlotType = 'fixed' | 'choice';
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
    basePrice: number;
    originalPrice?: number;
    activePeriodPrice?: number | null;
    activePeriodName?: string | null;
    imageUrl?: string;
    status: MenuItemStatus;
    modifierGroupIds: string[];
    taxable: boolean;
    sortOrder: number;
    prepTimeMinutes: number;
    destination: PrepDestination;
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
    maxSelections: number;
    modifiers: Modifier[];
    createdAt: string;
    updatedAt: string;
}
export interface Modifier {
    id: string;
    modifierGroupId: string;
    name: string;
    priceAdjustment: number;
    isDefault: boolean;
    sortOrder: number;
    nestedModifierGroupId?: string;
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
//# sourceMappingURL=menu.d.ts.map