/**
 * Receiving Plan & Receiving Types
 * Data di-proxy dari warehouse (gRPC). created_at/created_by TIDAK dikirim.
 */

export interface ReceivingPlanItem {
  id: string;
  item_id: string;
  item?: { name?: string };
  quantity_planned: number;
  quantity_received: number;
  quantity_defect: number;
}

export interface ReceivingPlanDetail {
  id: string;
  ref_id: string;
  warehouse_id: string;
  outlet_id: string;
  code: string;
  ref_code: string;
  sender_name: string;
  plan_date: string;
  document_status: string;
  receiving_status: string;
  warehouse?: { id?: string; name?: string };
  items?: ReceivingPlanItem[];
}

export interface ReceivingPlanSummary {
  total: number;
  process: number;
  completed: number;
}

export interface Receiving {
  id: string;
  code: string;
  plan_id: string;
  warehouse_id: string;
  received_at: string;
  document_status: string;
  note: string;
  warehouse?: { id?: string; name?: string };
  items?: {
    id: string;
    plan_item_id: string;
    quantity_received: number;
    quantity_defect: number;
    note: string;
  }[];
}
