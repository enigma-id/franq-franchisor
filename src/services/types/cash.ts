// Cash Control
export interface CashOverview {
  total_transaction: number
  total_topup: number
  total_session: number
  deficient: number
}

export interface CashSessionData {
  session: string
  cashier: string
  transaction_cash: number
  topup_cash: number
  session_cash: number
  status: string
}

export interface CashControl {
  overview_cash: CashOverview
  session_data: CashSessionData[]
}