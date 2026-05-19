// Sales Session
export interface Cashier {
  id: number;
  name: string;
}

export interface SummaryOrder {
  total_nett: number;
  total_discount: number;
  total_service_charge: number;
  total_charges: number;
  total_openbill: number;
}

export interface CashPayment {
  payment_name: string | null;
  subtotal: number;
}

export interface CategorySold {
  name: string;
  quantity: number;
  total_charges: number;
}

// Village & Location Types
export interface VillageDistrict {
  id: number;
  name: string;
  regency: {
    regency_alias: string;
    id: number;
    name: string;
    is_active: number;
    shipping_percentage: number;
  };
}

export interface Village {
  city: string;
  id: number;
  district: VillageDistrict;
  name: string;
}

// Outlet Types
export interface OutletType {
  id: number;
  franchise_id: number;
  name: string;
}

export interface OutletFranchise {
  id: number;
  reff_id: number;
  name: string;
  company_name: string;
  legal_address: string;
  office_address: string;
  email: string;
  phone: string;
  finance_name: string;
  finance_phone: string;
  finance_email: string;
  bank_name: string;
  bank_number: string;
  bank_branch: string;
  bank_account: string;
  logo: string;
  is_pos: number;
  saldo_working_capital: number;
  saldo_commission: number;
}

export interface Outlet {
  alias: string;
  id: number;
  reff_id: number;
  franchise: OutletFranchise;
  type: OutletType;
  name: string;
  recipient_name: string;
  phone: string;
  address: string;
  village: Village;
  latitude: number;
  longitude: number;
  shipping_time: string;
  service_charge: number;
  is_managed_kora: number;
  last_order_at: string;
  default_pos_catalog: string | null;
}

// Bank Types
export interface Bank {
  id: number;
  name: string;
  alias_name: string;
  account_name: string;
  account_number: string;
  is_payment_gateway: number;
  payment_gateway_provider: string;
  is_active: number;
  is_ewallet: number;
  phone: string;
}

// Item & Catalog Types
export interface ItemSupplier {
  id: number;
  reff_id: number;
  franchise: OutletFranchise;
  supplier: string;
  category: string;
  code: string;
  barcode: string;
  brand: string;
  name: string;
  variant: string;
  packaging: string;
  size: string;
  max_price: number;
  base_price: number;
  margin: number;
  weight: number;
  volume: number;
  safety_stock: number;
  stock_available: number;
  is_active: number;
  is_vatable: number;
  is_deleted: number;
  is_stockable: number;
  is_dropship: number;
  is_supplied: number;
  in_catalog: number;
  fractions: unknown | null;
  alias: string;
  default_fraction: string;
}

export interface ItemFraction {
  id: number;
  reff_id: number;
  name: string;
  quantity: number;
  is_smallest: number;
}

export interface CatalogItem {
  id: number;
  reff_id: number;
  franchise_id: number;
  item: ItemSupplier;
  fraction: ItemFraction;
  code: string;
  name: string;
  base_price: number;
  commission: number;
  unit_price: number;
  image: string;
  weight: number;
  volume: number;
  description: string;
  measurement: string;
  unit: number;
  is_vatable: number;
  is_active: number;
  is_bundle: number;
  is_deleted: number;
  bundles: unknown | null;
}

// Sales Order Item
export interface SalesOrderItem {
  total_nett: number;
  id: number;
  order_id: number;
  catalog: CatalogItem;
  item: ItemSupplier;
  fraction: ItemFraction;
  quantity_ordered: number;
  commission: number;
  unit_base: number;
  unit_gross: number;
  unit_taxed: number;
  unit_tax: number;
  unit_nett: number;
  quantity_fulfilled: number;
}

export interface SalesSession {
  id: number;
  transaction_date: string;
  started_at: string;
  finished_at: string;
  status: string;
  cash_started: number;
  cash_finished: number;
  cash_due: number;
  cash_topup: number;
  bill_payment: number;
  cashier: Cashier;
  summary_order: SummaryOrder;
  cash_payments: CashPayment[];
  category_solds: CategorySold[];
  sales_orders: SalesOrderSummary[];
}

export interface SalesOrderSummary {
  id: number;
  code: string;
  ordered_at: string;
  channel: { name: string } | null;
  payment_method: { name: string } | null;
  total_charges: number;
}

// Sales Order Detail (from API response)
export interface SalesOrderDetail {
  id: number;
  outlet: Outlet;
  bank: Bank;
  expedisi: string;
  code: string;
  type: string;
  order_status: string;
  delivery_status: string;
  payment_status: string;
  subtotal_commission: number;
  subtotal_base: number;
  subtotal_taxed: number;
  subtotal_gross: number;
  subtotal_tax: number;
  subtotal_nett: number;
  shipping_charges: number;
  total_bill: number;
  shipping_date: string;
  void_note: string;
  ordered_at: string;
  delivered_at: string;
  paid_at: string;
  payment_expired_at: string;
  note: string;
  sales_order_items: SalesOrderItem[];
  shipping_items: unknown | null;
}

// Legacy Sales Order (old format)
export interface SalesOrderItemLegacy {
  id: number;
  catalog: { name: string };
  additional_id: number | null;
  quantity: number;
  unit_nett: number;
  total_nett: number;
  note?: string | null;
}

export interface SalesOrder {
  id: number;
  code: string;
  ordered_at: string;
  payment_ref: string | null;
  note: string | null;
  channel: { name: string } | null;
  payment_method: { name: string } | null;
  session: {
    id: number;
    cashier: Cashier;
  };
  total_bill: number;
  discount_value: number;
  service_charge: boolean;
  service_charge_value: number;
  total_charges: number;
  subtotal_tax: number;
  sales_order_items: SalesOrderItemLegacy[];
}
