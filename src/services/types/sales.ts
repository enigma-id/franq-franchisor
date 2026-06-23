/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sales Types
 */

import type { RegionDetail } from "./region";
import type { OutletDetail } from "./outlet";

export interface SalesOrderItem {
  catalog_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
}

export interface SalesOrderBase {
  ref_code: string;
  outlet_id: string;
  warehouse_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_region_id: string;
  payment_method_id: string;
  shipping_date: string;
  self_pickup: boolean;
  note: string;
}

export interface SalesOrderRequest extends SalesOrderBase {
  items: SalesOrderItem[];
}

export interface SalesOrderItemDetail {
  id: string;
  order_id: string;
  parent_id: string;
  catalog_id: string;
  item_id: string;
  fraction_id: string;
  quantity_ordered: number;
  quantity_fulfilled: number;
  unit_base: number;
  unit_gross: number;
  unit_taxed: number;
  unit_tax: number;
  unit_nett: number;
  catalog?: any;
  item?: any;
  fraction?: any;
  bundles?: SalesOrderItemDetail[];
}

export interface SalesOrderDetail extends SalesOrderBase {
  id: string;
  franchisor_id: string;
  code: string;
  warehouse_name: string;
  /** API field: the order type, e.g. "default" */
  order_type: string;
  /** API field: document/approval status, e.g. "pending" | "active" | "void" */
  document_status: string;
  /** API field: fulfillment/delivery status, e.g. "new" | "partial" | "fulfilled" */
  fulfillment_status: string;
  payment_status: string;
  subtotal_base: number;
  subtotal_gross: number;
  subtotal_taxed: number;
  subtotal_tax: number;
  subtotal_nett: number;
  shipping_charges: number;
  total_charges: number;
  void_note: string;
  fulfilled_at: string;
  paid_at: string;
  payment_expired_at: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  outlet: OutletDetail;
  region: RegionDetail;
  /** API returns this field as "items" */
  items: SalesOrderItemDetail[];
}

/**
 * Sales Return Types
 */

export interface SalesReturnItem {
  sales_order_item_id: string;
  quantity: number;
  reason: string;
}

export interface SalesReturnRequest {
  sales_order_id: string;
  date: string;
  items: SalesReturnItem[];
}

export interface SalesReturnDetail {
  id: string;
  sales_order_id: string;
  number: string;
  date: string;
  items: (SalesReturnItem & { id: string; unit_price: number })[];
  created_at: string;
  updated_at: string;
}
