/**
 * POS Types (v2 - New Collection)
 * Based on: pos/menu, pos/category, pos/channel, payment/method, member/topup-bonus
 */

// ── POS Menu ──

export interface POSChannelPrice {
  pos_channel_id: string;
  price: number;
}

export interface POSIngredient {
  catalog_id: string;
  porsi: number;
}

export interface POSAddonItem {
  addon_menu_id: string;
}

export interface POSAddonGroup {
  name: string;
  type: "options" | "checkbox" | "quantity";
  items: POSAddonItem[];
}

export interface POSMenuBase {
  category_id: string;
  name: string;
  base_price: number;
  image?: string;
  is_vatable: boolean;
  is_additional: boolean;
}

export interface POSMenuCreateRequest extends POSMenuBase {
  channel_prices: POSChannelPrice[];
  ingredients: POSIngredient[];
  addon_groups?: POSAddonGroup[];
}

export interface POSMenuUpdateRequest extends Partial<POSMenuCreateRequest> {
  id?: string;
}

export interface POSMenuTypesUpdateRequest {
  outlet_type_ids: string[];
}

export interface POSMenuDetail extends POSMenuBase {
  id: string;
  channel_prices: POSChannelPrice[];
  ingredients: POSIngredient[];
  addon_groups?: POSAddonGroup[];
  outlet_type_ids?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── POS Category ──

export interface POSCategoryBase {
  name: string;
  image?: string;
}

export interface POSCategoryCreateRequest extends POSCategoryBase {}

export interface POSCategoryUpdateRequest extends Partial<POSCategoryBase> {}

export interface POSCategoryDetail extends POSCategoryBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── POS Channel ──

export interface POSChannelBase {
  name: string;
  code: string;
}

export interface POSChannelCreateRequest extends POSChannelBase {
  is_active: boolean;
}

export interface POSChannelUpdateRequest extends Partial<POSChannelCreateRequest> {}

export interface POSChannelDetail extends POSChannelBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Payment Method ──

export interface PaymentMethodBase {
  name: string;
  provider: string;
  type: string;
}

export interface PaymentMethodCreateRequest extends PaymentMethodBase {}

export interface PaymentMethodUpdateRequest extends Partial<PaymentMethodBase> {}

export interface PaymentMethodDetail extends PaymentMethodBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Member Topup Bonus ──

export interface TopupBonusBase {
  name: string;
  amount: number;
  bonus: number;
}

export interface TopupBonusCreateRequest extends TopupBonusBase {}

export interface TopupBonusUpdateRequest extends Partial<TopupBonusBase> {}

export interface TopupBonusDetail extends TopupBonusBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
