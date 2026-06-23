/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductionPlanMaterial {
  id: string;
  plan_id: string;
  material_id: string;
  quantity_need: number;
  quantity_used: number;
  measurement: string;
  material: {
    id: string;
    code: string;
    name: string;
    variant: string;
    [key: string]: any;
  };
}

export interface ProductionPlanItem {
  id: string;
  plan_id: string;
  item_id: string;
  dest_warehouse_id: string;
  dest_warehouse_name: string;
  document_status: string;
  quantity_planned: number;
  quantity_produced: number;
  item: {
    id: string;
    code: string;
    name: string;
    variant: string;
    [key: string]: any;
  };
  materials: ProductionPlanMaterial[];
}

export interface ProductionPlanBase {
  franchisor_id: string;
  production_date: string;
  note?: string;
  warehouse_id: string;
  warehouse_name: string;
  is_ordered: boolean;
}

export interface ProductionPlanRequest extends ProductionPlanBase {
  items: Array<{
    item_id: string;
    quantity_planned: number;
  }>;
}

export interface ProductionPlanDetail extends ProductionPlanBase {
  id: string;
  code: string;
  document_status: "pending" | "process" | "completed" | "cancelled";
  items: ProductionPlanItem[];
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionItemUpdateRequest {
  quantity_planned: number;
  note?: string;
}

/**
 * Demand Types
 */

export interface DemandProductionData {
  catalog_id: string;
  name: string;
  total_demand: number;
  uom: string;
}

export interface DemandItemData {
  id: string;
  code: string;
  barcode: string;
  name: string;
  variant: string;
  packaging: string;
  size: string;
  default_fraction: string;
  stock_available: number;
  quantity_need: number;
  diff: number;
  alias_name: string;
}


export interface DemandQueryParams {
  production_date?: string;
  outlet_id?: string;
}
