/**
 * Purchase Order Types
 *
 * Payload example (header):
 * {
 *   id, franchisor_id, code, ref_code, supplier_id, warehouse_id, warehouse_name,
 *   created_by, document_status, receiving_status, payment_status,
 *   address, recipient_name, recipient_phone,
 *   eta_date,
 *   subtotal_tax, subtotal_nett, shipping_charges, total_charges,
 *   receiving_at, paid_at,
 *   created_at, updated_at,
 *   supplier: { id, code, name, type, ... }
 * }
 */

import type { SupplierDetail } from "./supplier";

export interface PurchaseOrderItem {
  id: string;
  order_id: string;
  item_id: string;
  fraction_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_nett: number;
  unit_tax: number;
  item: {
    id: string;
    franchisor_id: string;
    supplier_id: string;
    type: string;
    code: string;
    barcode: string;
    name: string;
    variant: string;
    packaging: string;
    size: string;
    picking_strategy: string;
    is_batch_tracking: boolean;
    default_fraction: string;
    base_price: number;
    weight: number;
    volume: number;
    category: string;
    safety_stock: number;
    stock_available: number;
    stock_defect: number;
    in_catalog: boolean;
    is_vatable: boolean;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    alias_name: string;
  };
  fraction: {
    id: string;
    item_id: string;
    name: string;
    quantity: number;
    is_smallest: boolean;
  };
}

export interface PurchaseOrderBase {
  franchisor_id: string;
  code: string;
  ref_code?: string;

  supplier_id: string;

  warehouse_id: string;
  warehouse_name?: string;

  created_by?: string;

  document_status: string;
  receiving_status: string;
  payment_status: string;

  address?: string;
  recipient_name?: string;
  recipient_phone?: string;

  eta_date?: string;

  subtotal_tax: number;
  subtotal_nett: number;
  shipping_charges: number;
  total_charges: number;

  receiving_at?: string;
  paid_at?: string;

  updated_by?: string;
  created_at?: string;
  updated_at?: string;

  supplier?: SupplierDetail;
}

export interface PurchaseOrderRequest extends PurchaseOrderBase {
  // Some endpoints may include items; keep it optional to be safe.
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrder extends PurchaseOrderBase {
  id: string;

  items?: (PurchaseOrderItem & { id: string })[];

  // Some APIs may return these fields even if not used by the UI.
  status?: string;
}

export interface PurchaseOrderDetail extends PurchaseOrderBase {
  id: string;
  items?: PurchaseOrderItem[];
  status?: string;
  total_price?: number; // backward-compat if any older API still returns this
}
