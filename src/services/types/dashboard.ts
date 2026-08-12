export interface SalesGraphSeries {
  name: string;
  data: number[];
}

export interface SalesGraph {
  labels: string[];
  series: SalesGraphSeries[];
}

export interface PipelineSummary {
  pending: number;
  published: number;
  completed: number;
}

export interface RevenueComposition {
  labels: string[];
  data: number[];
}

export interface PosSummary {
  omset: number;
  outstanding: number;
}

export interface B2BSummary {
  omset: number;
  outstanding: number;
}

export interface ProductionPlanSummary {
  plan: number;
  completed: number;
}

export interface TopMenuItem {
  menu_name: string;
  total_qty: number;
  total_revenue: number;
}

export interface TopMemberItem {
  member_name: string;
  saldo: number;
}

export interface TopOutletItem {
  outlet_name: string;
  total_qty: number;
  total_revenue: number;
}

export interface TopOutstandingOutlet {
  outlet_name: string;
  total_outstanding: number;
  order_count: number;
}

export interface OutletMapItem {
  outlet_id: string;
  outlet_name: string;
  latitude: number;
  longitude: number;
  last_seen: string;
}

export interface DashboardData {
  withdrawal_pending: number;
  stock_kritis: number;
  sales_graph: SalesGraph;
  omset_total: number;
  omset_franchise: number;
  omset_bahan_baku: number;
  pos_summary: PosSummary;
  b2b_summary: B2BSummary;
  total_outlet: number;
  outlet_aktif: number;
  total_saldo_membership: number;
  top_menu: TopMenuItem[];
  top_member: TopMemberItem[];
  top_outlet: TopOutletItem[];
  so_pipeline: PipelineSummary;
  po_pipeline: PipelineSummary;
  revenue_composition: RevenueComposition;
  top_outstanding_outlets?: TopOutstandingOutlet[];
  outlet_map: OutletMapItem[];
  production_plan_summary: ProductionPlanSummary;
}
