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
  catalog_id: string;
  quantity: number;
  unit_price: number;
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

  items?: (PurchaseOrderItem & { id: string })[];

  status?: string;
  total_price?: number; // backward-compat if any older API still returns this
}
