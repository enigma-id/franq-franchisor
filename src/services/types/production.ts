/**
 * Production Types
 */

export interface ProductionPlanItem {
  id: string;
  catalog_id: string;
  quantity: number;
  note?: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface ProductionPlanBase {
  outlet_id: string;
  production_date: string;
  note?: string;
}

export interface ProductionPlanRequest extends ProductionPlanBase {
  items: Array<{
    catalog_id: string;
    quantity: number;
    note?: string;
  }>;
}

export interface ProductionPlanDetail extends ProductionPlanBase {
  id: string;
  number: string;
  status: "draft" | "published" | "completed" | "cancelled";
  warehouse?: { id: string; name: string };
  date: string;
  items: ProductionPlanItem[];
  created_at: string;
  updated_at: string;
}

export interface ProductionItemUpdateRequest {
  quantity: number;
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
  item_id: string;
  name: string;
  total_demand: number;
  uom: string;
}

export interface DemandQueryParams {
  production_date?: string;
  outlet_id?: string;
}
