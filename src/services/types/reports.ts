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
}

export interface OutletMapRow {
  outlet: string
  outlet_name: string
  total_charges: number
  historys: OutletMapHistory[]
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
