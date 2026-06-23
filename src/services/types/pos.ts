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
  code: string;
  category_id: string;
  image: string;
  is_vatable: boolean;
  is_additional: boolean;
  channel_prices: POSChannelPrice[];
  ingredients: POSIngredient[];
  addon_groups?: POSAddonGroup[];
  outlet_type_ids?: string[];
  is_active: boolean;
  is_custom: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    franchisor_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  outlet_types: {
    id: string;
    menu_id: string;
    outlet_type_id: string;
    outlet_type: {
      id: string;
      franchisor_id: string;
      name: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  }[];
}

// ── POS Category ──

export interface POSCategoryBase {
  name: string;
  image?: string;
}

export type POSCategoryCreateRequest = POSCategoryBase;

export type POSCategoryUpdateRequest = Partial<POSCategoryBase>;

export interface POSCategoryDetail extends POSCategoryBase {
  id: string;
  franchisor_id: string;
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

export type POSChannelUpdateRequest = Partial<POSChannelCreateRequest>;

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

export type PaymentMethodCreateRequest = PaymentMethodBase;

export type PaymentMethodUpdateRequest = Partial<PaymentMethodBase>;

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

export type TopupBonusCreateRequest = TopupBonusBase;

export type TopupBonusUpdateRequest = Partial<TopupBonusBase>;

export interface TopupBonusDetail extends TopupBonusBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
