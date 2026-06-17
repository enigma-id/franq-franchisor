/**
 * Purchase Order Types
 */

export interface PurchaseOrderItem {
  catalog_id: string;
  quantity: number;
  unit_price: number;
}

export interface PurchaseOrderBase {
  supplier_id: string;
  number: string;
  date: string;
  note?: string;
  discount: number;
  tax: number;
  shipping_fee: number;
}

export interface PurchaseOrderRequest extends PurchaseOrderBase {
  items: PurchaseOrderItem[];
}

export interface PurchaseOrder extends PurchaseOrderBase {
  id: string;
  status: string;
  document_status: string;
  payment_status: string;
  items: (PurchaseOrderItem & { id: string })[];
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderDetail extends PurchaseOrderBase {
  id: string;
  status: string;
  items: (PurchaseOrderItem & { id: string })[];
  total_price: number;
  created_at: string;
  updated_at: string;
}

/**
 * Warehouse Types
 */

export interface WarehouseBase {
  outlet_id: string;
  name: string;
  is_active: boolean;
}

export type WarehouseRequest = WarehouseBase;

export interface WarehouseDetail extends WarehouseBase {
  id: string;
  created_at: string;
  updated_at: string;
}
