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