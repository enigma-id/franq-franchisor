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

export interface B2BSummary {
  total_outstanding: number;
  unpaid_count: number;
}

export interface ProductionPlanSummary {
  plan: number;
  completed: number;
}

export interface OutletBalanceTotal {
  total_saldo: number;
  total_withdrawn: number;
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

export interface DashboardData {
  total_revenue: number;
  withdrawal_pending: number;
  stock_kritis: number;
  sales_graph: SalesGraph;
  omset_retail: number;
  omset_b2b: number;
  omset_franchise: number;
  omset_total: number;
  omset_bahan_baku: number;
  total_outlet: number;
  outlet_aktif: number;
  total_saldo_membership: number;
  outstanding_total: number;
  total_withdrawal_bulan_ini: number;
  so_pipeline: PipelineSummary;
  po_pipeline: PipelineSummary;
  revenue_composition: RevenueComposition;
  b2b_summary: B2BSummary;
  production_plan_summary: ProductionPlanSummary;
  outlet_balance_total: OutletBalanceTotal;
  top_menu: TopMenuItem[];
  top_member: TopMemberItem[];
  top_outlet: TopOutletItem[];
  top_outstanding_outlets?: TopOutstandingOutlet[];
}
