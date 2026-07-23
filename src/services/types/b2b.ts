import type { DocumentStatusB2B, PaymentStatus, ApprovalStatus } from "./api";

export interface B2BOrderItemRequest {
  menu_id: string;
  menu_name: string;
  quantity: number;
}

export interface B2BOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string;
  discount: number;
  discount_value: number;
  is_discount_percentage: boolean;
  service_charge: number;
  shipping_date: string;
  items: B2BOrderItemRequest[];
}

export interface B2BOrderItemDetail {
  id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  quantity: number;
  unit_base: number;
  unit_gross: number;
  unit_tax: number;
  unit_taxed: number;
  unit_nett: number;
  sorting_id: number;
}

export interface B2BOrderDetail {
  id: string;
  franchisor_id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string;
  document_status: DocumentStatusB2B;
  payment_status: PaymentStatus;
  subtotal: number;
  subtotal_base: number;
  subtotal_gross: number;
  subtotal_tax: number;
  subtotal_taxed: number;
  subtotal_nett: number;
  discount: number;
  discount_value: number;
  is_discount_percentage: boolean;
  service_charge: number;
  service_charge_value: number;
  total_charges: number;
  shipping_date: string;
  payment_ref: string;
  paid_at: string;
  received_at: string;
  is_deleted: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  items: B2BOrderItemDetail[];
}

export interface OutletTopupDetail {
  id: string;
  outlet_id: string;
  ref_id: string;
  code: string;
  amount: number;
  payment_method_id: string;
  document_status: ApprovalStatus;
  rejected_reason: string | null;
  processed_by: string;
  processed_at: string;
  created_at: string;
  updated_at: string;
  outlet: {
    id: string;
    name: string;
    [k: string]: unknown;
  };
}

export interface OutletTopupRejectRequest {
  rejected_reason: string;
}
