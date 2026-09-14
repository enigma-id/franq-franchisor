// Daily Sales
export interface DailySalesRow {
  date: string
  total_charges: number
}

// Outstanding Bills
export interface OutstandingBill {
  id: number
  code: string
  ordered_at: string
  cashier: { name: string }
  ticket: string
  membership: { name: string } | null
  total_charges: number
}

export interface OutstandingSummary {
  total_charges: number
}

// Settlement
export interface SettlementRow {
  periode: string
  started_at?: string
  finished_at?: string
  payment_methods: string[]
  nominals: number[]
}

export interface SettlementSummaryItem {
  payment_method: string
  nominal: number
}

// Item Sales
export interface ItemSalesRow {
  name: string
  quantity: number
}

// Product Sales
export interface ProductSalesRow {
  date: string
  channel: string
  payment: string
  outlet: string
  code: string
  menu: string
  quantity: number
  unit_nett: number
  discount: number
  total_nett: number
}

// Outlet Maps
export interface OutletMapHistory {
  latitude: number
  longitude: number
  created_at: string
  cashier_id?: string
  cashier_name?: string
  battery_health?: string
  total_charges?: number
  total_transactions?: number
}

/** Satu kasir + jejak GPS-nya di dalam sebuah outlet. */
export interface OutletMapCashier {
  cashier_id: string
  cashier_name: string
  historys: OutletMapHistory[]
}

export interface OutletMapRow {
  outlet: string
  outlet_name: string
  total_charges: number
  cashiers: OutletMapCashier[]
}

// Membership Report
export interface MembershipReportRow {
  membership_id: string
  date: string
  card_id: string
  name: string
  reff_code: string
  saldo: number
  /** Kosong jika member belum pernah bertransaksi. */
  last_transaction: string
}

export interface MembershipReportSummary {
  total_member: number
  total_saldo: number
}

// Saldo Log Report
export interface SaldoLogReportRow {
  date: string
  reference_type: string
  reference_code: string
  payment_type: string
  nominal: number
  status: string
  membership: string
  card_id: string
  outlet: string
  cancelled_reason: string
  cancelled_by: string
  cancelled_at: string
}

export interface SaldoLogReportSummary {
  total_nominal: number
  total_count: number
}

// Laporan Outlet (rekap per-outlet — baris = outlet)
export interface ReportOutletRow {
  outlet_id: string
  outlet_name: string
  brand_name: string
  brand_type: string
  status: string
  total_sales: number
  omzet: number
  total_outstanding: number
  outstanding_amount: number
  total_session: number
  aov: number
  cancelled_count: number
}

export interface ReportOutletSummary {
  total_outlet: number
  active_outlet: number
  total_sales: number
  total_omzet: number
  total_outstanding: number
  outstanding_amount: number
  total_session: number
  cancelled_count: number
}

// Laporan Sesi
export interface ReportSessionRow {
  session_id: string
  outlet_id: string
  outlet_name: string
  cashier_id: string
  cashier_name: string
  transaction_date: string
  started_at: string
  finished_at: string
  status: string
  cash_started: number
  cash_finished: number
  total_sales: number
  total_discount: number
  total_service: number
  grand_total: number
  outstanding_bill: number
}

// Live Map dashboard — satu item per operator (kasir/manager)
export interface CashierLiveMapItem {
  cashier_id: string
  cashier_name: string
  outlet_id?: string
  outlet_name?: string
  status: string
  last_activity_at?: string
  last_battery_health?: string
  last_latitude: number
  last_longitude: number
  historys?: OutletMapHistory[]
}

/**
 * Item yang digambar di peta kasir — dipakai bersama oleh Live Map dashboard
 * (`CashierLiveMapItem`) dan Peta Outlet (hasil group `historys[]` per `cashier_id`).
 */
export interface CashierMapItem {
  cashier_id: string
  cashier_name: string
  outlet_id?: string
  outlet_name?: string
  status?: string
  last_activity_at?: string
  last_battery_health?: string
  last_latitude?: number
  last_longitude?: number
  historys?: OutletMapHistory[]
}
