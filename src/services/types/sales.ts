/**
 * Sales Types
 */

export interface SalesOrderItem {
  catalog_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
}

export interface SalesOrderBase {
  outlet_id: string;
  customer_name?: string;
  customer_phone?: string;
  transaction_date: string;
  note?: string;
  discount: number;
  tax: number;
  service_charge: number;
}

export interface SalesOrderRequest extends SalesOrderBase {
  items: SalesOrderItem[];
  payment_method_id: string;
  pos_channel_id: string;
}

export interface SalesOrderDetail extends SalesOrderBase {
  id: string;
  number: string;
  code: string;
  ordered_at: string;
  shipping_date: string;
  order_status: string;
  payment_status: string;
  delivery_status: string;
  payment_expired_at: string;
  paid_at?: string;
  void_note?: string;
  subtotal_nett: number;
  subtotal_tax: number;
  shipping_charges: number;
  total_bill: number;
  outlet: any;
  bank?: any;
  expedisi: string;
  status: string;
  type: string;
  sales_order_items: (SalesOrderItem & { id: string; name: string; quantity_ordered: number; unit_nett: number; total_nett: number; catalog?: any; item?: any })[];
  created_at: string;
  updated_at: string;
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
