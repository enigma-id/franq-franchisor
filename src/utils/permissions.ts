/**
 * Permission slug constants — single source of truth.
 *
 * Dua namespace (lihat docs/RBAC.md):
 * - MENU:  `frontend.franchisor.<group>.<action>` → sidebar + akses page (route guard)
 * - ACTION: `svc-franchisor.<module>.manage` → tombol aksi per page
 *
 * Slug berasal dari seed tabel `permission` (backend). Jangan invent slug baru.
 */

// ─── Menu / page slugs (application 'frontend') ──────────────────────────────
export const MENU = {
  dashboard: "frontend.franchisor.dashboard",
  // Sales
  b2bOrder: "frontend.franchisor.sales.b2b-order",
  salesOrder: "frontend.franchisor.sales.sales-order",
  purchaseRequest: "frontend.franchisor.sales.purchase-request",
  withdrawal: "frontend.franchisor.sales.withdrawal",
  outletTopup: "frontend.franchisor.sales.outlet-topup",
  // Purchase
  supplier: "frontend.franchisor.purchase.supplier",
  purchaseOrder: "frontend.franchisor.purchase.purchase-order",
  // Master Data (Inventory & Warehouse)
  inventoryItem: "frontend.franchisor.master-data.item",
  inventoryCatalog: "frontend.franchisor.master-data.catalog",
  // Production
  demand: "frontend.franchisor.production.demand",
  productionPlan: "frontend.franchisor.production.production-plan",
  // Report POS
  reportPosOutstanding: "frontend.franchisor.report.pos.outstanding",
  reportPosSettlement: "frontend.franchisor.report.pos.settlement",
  reportPosProductSales: "frontend.franchisor.report.pos.product-sales",
  reportPosProductItem: "frontend.franchisor.report.pos.product-item",
  reportPosTransactionCancelled:
    "frontend.franchisor.report.pos.transaction-cancelled",

  // Report Mitra
  reportMitraSettlement: "frontend.franchisor.report.mitra.settlement",
  reportMitraProductSales: "frontend.franchisor.report.mitra.product-sales",
  reportMitraProductItem: "frontend.franchisor.report.mitra.product-item",
  reportMitraOutletSaldo: "frontend.franchisor.report.mitra.outlet-saldo",

  // Report B2B
  reportB2BSettlement: "frontend.franchisor.report.b2b.settlement",
  reportB2BProductSales: "frontend.franchisor.report.b2b.product-sales",
  reportB2BProductItem: "frontend.franchisor.report.b2b.product-item",

  reportInventoryMaterialSales: "frontend.franchisor.report.material-sales",
  reportWarehouseStock: "frontend.franchisor.report.warehouse-stock",
  reportOutletMap: "frontend.franchisor.report.outlet-maps",
  reportMembership: "frontend.franchisor.report.membership",
  reportMembershipSaldoLog: "frontend.franchisor.report.membership-saldo-log",
  // Setting
  franchise: "frontend.franchisor.setting.franchise",
  outlet: "frontend.franchisor.setting.outlet",
  outletType: "frontend.franchisor.setting.outlet-type",
  posChannel: "frontend.franchisor.setting.pos-channel",
  posCategory: "frontend.franchisor.setting.pos-category",
  posMenu: "frontend.franchisor.setting.pos-menu",
  posPayment: "frontend.franchisor.setting.pos-payment",
  topupBonus: "frontend.franchisor.setting.topup-bonus",
  user: "frontend.franchisor.setting.user",
  usergroup: "frontend.franchisor.setting.usergroup",
} as const;

export type MenuSlug = (typeof MENU)[keyof typeof MENU];

// ─── Button action slugs (application 'svc-franchisor', action 'manage') ─────
export const ACTION = {
  franchise: "svc-franchisor.franchise.manage",
  user: "svc-franchisor.user.manage",
  usergroup: "svc-franchisor.usergroup.manage",
  outlet: "svc-franchisor.outlet.manage",
  outletType: "svc-franchisor.outlet-type.manage",
  inventory: "svc-franchisor.inventory.manage",
  catalog: "svc-franchisor.catalog.manage",
  posChannel: "svc-franchisor.pos-channel.manage",
  posCategory: "svc-franchisor.pos-category.manage",
  posMenu: "svc-franchisor.pos-menu.manage",
  supplier: "svc-franchisor.supplier.manage",
  paymentMethod: "svc-franchisor.payment-method.manage",
  memberTopup: "svc-franchisor.member-topup.manage",
  purchaseOrder: "svc-franchisor.purchase-order.manage",
  salesOrder: "svc-franchisor.sales-order.manage",
  purchaseRequest: "svc-franchisor.purchase-request.manage",
  production: "svc-franchisor.production.manage",
  b2b: "svc-franchisor.b2b.manage",
  b2bCancel: "svc-franchisor.b2b.cancel",
  outletTopupRequest: "svc-franchisor.outlet-topup-request.manage",
  withdrawalRequest: "svc-franchisor.withdrawal-request.manage",
} as const;

export type ActionSlug = (typeof ACTION)[keyof typeof ACTION];
