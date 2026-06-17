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

export interface DashboardData {
  total_revenue: number;
  po_pending: number;
  withdrawal_pending: number;
  withdrawal_pending_amount: number;
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
  total_service_charge: number;
  total_discount: number;
  outstanding_total: number;
  outstanding_count: number;
  total_withdrawal_bulan_ini: number;
  so_pipeline: PipelineSummary;
  po_pipeline: PipelineSummary;
  revenue_composition: RevenueComposition;
  b2b_summary: B2BSummary;
  production_plan_summary: ProductionPlanSummary;
  outlet_balance_total: OutletBalanceTotal;
}
