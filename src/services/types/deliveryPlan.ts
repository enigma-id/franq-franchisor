/**
 * Delivery Plan Types
 * Data di-proxy dari warehouse (gRPC). Hanya field yang benar-benar diisi
 * converter yang dipakai UI.
 */

import type { FranchisorDetail } from "./franchisor";
import type { OutletDetail } from "./outlet";

export interface DeliveryPlanItem {
  id: string;
  item_id: string;
  item?: {
    /** ID item di warehouse (proxy memakai ref_id, bukan id). */
    ref_id?: string;
    name?: string;
    code?: string;
    alias_name?: string;
    default_fraction?: string;
  };
  fraction_id?: string;
  quantity_planned: number;
  quantity_fulfilled: number;
  quantity_planned_fracted?: string;
  quantity_fulfilled_fracted?: string;
}

export interface DeliveryPlanWarehouse {
  id?: string;
  name?: string;
  type?: string;
  address?: string;
}

export interface DeliveryPlanDetail {
  id: string;
  ref_id: string;
  brand_id: string;
  warehouse_id: string;
  outlet_id: string;
  code: string;
  ref_code: string;
  name: string;
  phone: string;
  address: string;
  type: string;
  shipping_date: string;
  document_status: string;
  fulfillment_status: string;
  shipping_status: string;
  self_pickup: boolean;
  created_at?: string;
  created_by?: string;
  picked_up_by?: { id: string; name: string };
  warehouse?: DeliveryPlanWarehouse;
  items?: DeliveryPlanItem[];
  brand?: FranchisorDetail;
  outlet?: OutletDetail;
}

export interface DeliveryPlanSummary {
  total: number;
  process: number;
  completed: number;
}

export interface Fulfillment {
  id: string;
  plan_item_id: string;
  quantity: number;
  quantity_used: number;
}
