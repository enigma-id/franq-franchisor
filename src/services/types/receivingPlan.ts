/**
 * Receiving Plan & Receiving Types
 * Data di-proxy dari warehouse (gRPC).
 */

export interface ReceivingPlanItem {
  id: string;
  item_id: string;
  item?: {
    /** ID item di warehouse (proxy memakai ref_id, bukan id). */
    ref_id?: string;
    name?: string;
    alias_name?: string;
    code?: string;
    default_fraction?: string;
    is_batch_tracking?: boolean;
    picking_strategy?: string;
  };
  fraction_id?: string;
  quantity_planned: number;
  quantity_received: number;
  quantity_defect: number;
  quantity_planned_fracted?: string;
  quantity_received_fracted?: string;
  quantity_defect_fracted?: string;
  quantity_remaining_fracted?: string;
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
  created_at?: string;
  created_by?: string;
  warehouse?: { id?: string; name?: string };
  items?: ReceivingPlanItem[];
}

export interface ReceivingPlanSummary {
  total: number;
  process: number;
  completed: number;
}

export interface ItemFraction {
  id: string;
  /** ID fraction di franchisor (item fraction dari warehouse memakai ref_id). */
  ref_id?: string;
  item_id?: string;
  name: string;
  quantity: number;
  is_smallest?: boolean;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  area_type?: string;
  warehouse_id?: string;
}

export interface ItemBatch {
  id: string;
  code?: string;
  item_id?: string;
  expired_at?: string;
  entry_at?: string;
  is_createable?: boolean;
}

export interface ReceivingItem {
  id: string;
  plan_item_id: string;
  plan_item?: {
    id: string;
    item?: {
      name?: string;
      alias_name?: string;
      code?: string;
      default_fraction?: string;
      is_batch_tracking?: boolean;
      picking_strategy?: string;
    };
  };
  received_fraction?: ItemFraction;
  defect_fraction?: ItemFraction;
  receive_location?: WarehouseLocation;
  quarantine_location?: WarehouseLocation;
  batch?: ItemBatch;
  quantity_received: number;
  quantity_defect: number;
  quantity_received_fracted?: string;
  quantity_defect_fracted?: string;
  note: string;
}

export interface Receiving {
  id: string;
  code: string;
  plan_id: string;
  warehouse_id: string;
  received_at: string;
  received_by?: string;
  created_by?: string;
  document_status: string;
  note: string;
  photos?: string[];
  warehouse?: { id?: string; name?: string };
  plan?: ReceivingPlanDetail;
  items?: ReceivingItem[];
}

export interface ReceivingItemRequest {
  id?: string | null;
  plan_item_id: string;
  receive_location_id?: string;
  quarantine_location_id?: string;
  received_fraction_id?: string;
  quantity_received: number;
  defect_fraction_id?: string;
  quantity_defect: number;
  batch_id?: string | null;
  batch_identifier?: string | null;
  note?: string;
}

export interface ReceivingRequest {
  /** Hanya dikirim saat create. */
  plan_id?: string;
  receive_date: string;
  receive_time: string;
  note?: string;
  photos?: string[];
  items: ReceivingItemRequest[];
}
