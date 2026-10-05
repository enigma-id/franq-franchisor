// Daily Sales
export interface DailySalesRow {
  date: string;
  total_charges: number;
}

// Outstanding Bills
export interface OutstandingBill {
  id: number;
  code: string;
  ordered_at: string;
  cashier: { name: string };
  ticket: string;
  membership: { name: string } | null;
  total_charges: number;
}

export interface OutstandingSummary {
  total_charges: number;
}

// Settlement
export interface SettlementRow {
  periode: string;
  started_at?: string;
  finished_at?: string;
  payment_methods: string[];
  nominals: number[];
}

export interface SettlementSummaryItem {
  payment_method: string;
  nominal: number;
}

// Item Sales
export interface ItemSalesRow {
  name: string;
  quantity: number;
}

// Product Sales
export interface ProductSalesRow {
  date: string;
  channel: string;
  payment: string;
  outlet: string;
  code: string;
  menu: string;
  quantity: number;
  unit_nett: number;
  discount: number;
  total_nett: number;
}

// Outlet Maps
export interface OutletMapHistory {
  latitude: number;
  longitude: number;
  created_at: string;
  cashier_id?: string;
  cashier_name?: string;
  battery_health?: string;
  total_charges?: number;
  total_transactions?: number;
}

/** Satu kasir + jejak GPS-nya di dalam sebuah outlet. */
export interface OutletMapCashier {
  cashier_id: string;
  cashier_name: string;
  historys: OutletMapHistory[];
}

export interface OutletMapRow {
  outlet: string;
  outlet_name: string;
  total_charges: number;
  cashiers: OutletMapCashier[];
}

// Membership Report
export interface MembershipReportRow {
  membership_id: string;
  date: string;
  card_id: string;
  name: string;
  reff_code: string;
  saldo: number;
  /** Saldo point member (`membership.point`) — global, tidak terikat brand. */
  point: number;
  /** Kosong jika member belum pernah bertransaksi. */
  last_transaction: string;
}

export interface MembershipReportSummary {
  total_member: number;
  total_saldo: number;
  total_point: number;
}

// Point Log Report (ledger point murni — tanpa status)
export interface PointLogReportRow {
  date: string;
  reference_type: string;
  reference_code: string;
  /** Delta saldo point: earn & revert positif, redeem & revert_earn negatif. */
  nominal: number;
  membership: string;
  card_id: string;
  outlet: string;
  cashier_name: string;
}

export interface PointLogReportSummary {
  total_earn: number;
  total_redeem: number;
  total_revert: number;
  total_revert_earn: number;
  total_count: number;
}

// Membership Settlement (HO ↔ outlet) — header per (outlet, tanggal)
export interface MembershipSettlementRow {
  id: string;
  franchisor_id: string;
  outlet_id: string;
  date: string;
  topup_cash: number;
  payment_saldo: number;
  payment_point: number;
  payment_total: number;
  net_amount: number;
  /** `ho_to_outlet` | `outlet_to_ho` | kosong saat net = 0. */
  transfer_direction: string;
  /** `pending` | `settled`. */
  status: string;
  settled_by: string;
  settled_at: string;
  transfer_reference: string;
  transfer_note: string;
  unsettled_reason: string;
  created_at: string;
  updated_at: string;
  outlet?: { id: string; name: string };
  franchisor?: { id: string; name: string };
  /** Cuma ada di response `GET /report/membership-settlement/{id}` (show). */
  items?: MembershipSettlementItemRow[];
}

export interface MembershipSettlementSummary {
  topup_cash: number;
  payment_saldo: number;
  payment_point: number;
  payment_total: number;
  net_amount: number;
  total_data: number;
}

// Item sumber settlement (topup / pemakaian saldo & point per transaksi)
export interface MembershipSettlementItemRow {
  id: string;
  settlement_id: string;
  franchisor_id: string;
  outlet_id: string;
  date: string;
  /** `topup_cash` | `payment_saldo` | `payment_point`. */
  type: string;
  /** `normal` | `reversal`. */
  kind: string;
  amount: number;
  reference_id: string;
  reference_code: string;
  created_at: string;
}

export interface MembershipSettlementItemSummary {
  topup_cash: number;
  payment_saldo: number;
  payment_point: number;
  total_data: number;
}

// Saldo Log Report
export interface SaldoLogReportRow {
  date: string;
  reference_type: string;
  reference_code: string;
  payment_type: string;
  nominal: number;
  status: string;
  membership: string;
  card_id: string;
  outlet: string;
  cancelled_reason: string;
  cancelled_by: string;
  cancelled_at: string;
}

export interface SaldoLogReportSummary {
  total_nominal: number;
  total_count: number;
}

// Laporan Outlet (rekap per-outlet — baris = outlet)
export interface ReportOutletRow {
  outlet_id: string;
  outlet_name: string;
  brand_name: string;
  brand_type: string;
  status: string;
  total_sales: number;
  omzet: number;
  total_outstanding: number;
  outstanding_amount: number;
  total_session: number;
  aov: number;
  cancelled_count: number;
}

export interface ReportOutletSummary {
  total_outlet: number;
  active_outlet: number;
  total_sales: number;
  total_omzet: number;
  total_outstanding: number;
  outstanding_amount: number;
  total_session: number;
  cancelled_count: number;
  /** Saldo outlet saat ini — ada pada summary ter-scope `outlet_id` (detail). */
  saldo?: number;
}

// Laporan Sesi
export interface ReportSessionRow {
  session_id: string;
  outlet_id: string;
  outlet_name: string;
  cashier_id: string;
  cashier_name: string;
  transaction_date: string;
  started_at: string;
  finished_at: string;
  status: string;
  cash_started: number;
  cash_finished: number;
  total_sales: number;
  total_discount: number;
  total_service: number;
  grand_total: number;
  outstanding_bill: number;
  /** Breakdown pembayaran per metode — dipakai tooltip Grand Total. */
  payment_methods?: SessionPaymentMethod[];
}

// Detail Sesi (GET /report/franchise/session/{id})
export interface SessionPaymentMethod {
  id?: string;
  name: string;
  total_paid: number;
}

export interface SessionCategorySold {
  category_name: string;
  is_non_bagi_hasil: boolean;
  total_qty: number;
  total_charges: number;
  total_nett: number;
}

export interface SessionSummaryData {
  id: string;
  session_id: string;
  sales: {
    total_sales: number;
    subtotal_nett_bagi_hasil: number;
    total_discount: number;
    total_after_discount: number;
    total_service: number;
    grand_total: number;
    outstanding_bill: number;
    outstanding_bill_payment: number;
  };
  payment_methods: SessionPaymentMethod[];
  category_solds: SessionCategorySold[];
  topups: { type: string; total_nominal: number }[];
  cash: { expected_cash: number; topup_cash: number };
  updated_at: string;
}

export interface SessionOrderRow {
  id: string;
  code: string;
  bill_name?: string;
  status: string;
  subtotal_nett?: number;
  discount_value?: number;
  service_charge_value?: number;
  total_charges: number;
  total_payment?: number;
  paid_at?: string;
  is_point?: boolean;
  point_earned?: number;
  sales_channel?: { name?: string } | null;
  payment_method?: { name?: string } | null;
}

export interface ReportSessionDetail {
  id: string;
  outlet_id: string;
  cashier_id: string;
  transaction_date: string;
  started_at: string;
  finished_at: string;
  cash_started: number;
  cash_finished: number;
  status: string;
  is_synced?: boolean;
  outlet?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    recipient_name?: string;
  } | null;
  cashier?: { id: string; name: string; username?: string } | null;
  summary?: SessionSummaryData | null;
  orders?: SessionOrderRow[];
}

// Live Map dashboard — satu item per operator (kasir/manager)
export interface CashierLiveMapItem {
  cashier_id: string;
  cashier_name: string;
  outlet_id?: string;
  outlet_name?: string;
  status: string;
  last_activity_at?: string;
  last_battery_health?: string;
  last_latitude: number;
  last_longitude: number;
  historys?: OutletMapHistory[];
}

/**
 * Item yang digambar di peta kasir — dipakai bersama oleh Live Map dashboard
 * (`CashierLiveMapItem`) dan Peta Outlet (hasil group `historys[]` per `cashier_id`).
 */
export interface CashierMapItem {
  cashier_id: string;
  cashier_name: string;
  outlet_id?: string;
  outlet_name?: string;
  status?: string;
  last_activity_at?: string;
  last_battery_health?: string;
  last_latitude?: number;
  last_longitude?: number;
  historys?: OutletMapHistory[];
}
