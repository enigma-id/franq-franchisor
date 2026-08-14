/**
 * Permission slug constants — single source of truth.
 *
 * Dua namespace (lihat docs/RBAC.md):
 * - MENU:  `frontend.franchisor.<module>` → sidebar + akses page (route guard)
 * - ACTION: `svc-franchisor.<module>.manage` → tombol aksi per page
 *
 * Slug berasal dari seed tabel `permission` (backend). Jangan invent slug baru.
 */

// ─── Menu / page slugs (application 'frontend') ──────────────────────────────
export const MENU = {
  dashboard: "frontend.franchisor.dashboard",
  b2bOrder: "frontend.franchisor.b2b-order",
  salesOrder: "frontend.franchisor.sales-order",
  salesReturn: "frontend.franchisor.sales-return",
  withdrawal: "frontend.franchisor.withdrawal",
  outletTopup: "frontend.franchisor.outlet-topup",
  warehouse: "frontend.franchisor.warehouse",
  inventoryItem: "frontend.franchisor.inventory-item",
  inventoryCatalog: "frontend.franchisor.inventory-catalog",
  demand: "frontend.franchisor.demand",
  productionPlan: "frontend.franchisor.production-plan",
  supplier: "frontend.franchisor.supplier",
  purchaseOrder: "frontend.franchisor.purchase-order",
  reportPosOutstanding: "frontend.franchisor.report.pos-outstanding",
  reportPosSettlement: "frontend.franchisor.report.pos-settlement",
  reportProductSales: "frontend.franchisor.report.product-sales",
  reportPosProductItem: "frontend.franchisor.report.pos-product-item",
  reportCancelled: "frontend.franchisor.report.cancelled",
  reportB2BSettlement: "frontend.franchisor.report.b2b-settlement",
  reportB2BProductSales: "frontend.franchisor.report.b2b-product-sales",
  reportB2BProductItem: "frontend.franchisor.report.b2b-product-item",
  reportInventoryMaterialSales:
    "frontend.franchisor.report.inventory-material-sales",
  reportWarehouseStock: "frontend.franchisor.report.warehouse-stock",
  outlet: "frontend.franchisor.outlet",
  outletType: "frontend.franchisor.outlet-type",
  posChannel: "frontend.franchisor.pos-channel",
  posCategory: "frontend.franchisor.pos-category",
  posMenu: "frontend.franchisor.pos-menu",
  posPayment: "frontend.franchisor.pos-payment",
  topupBonus: "frontend.franchisor.topup-bonus",
  user: "frontend.franchisor.user",
  usergroup: "frontend.franchisor.usergroup",
} as const;

export type MenuSlug = (typeof MENU)[keyof typeof MENU];

// ─── Button action slugs (application 'svc-franchisor', action 'manage') ─────
export const ACTION = {
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
  salesReturn: "svc-franchisor.sales-return.manage",
  production: "svc-franchisor.production.manage",
  b2b: "svc-franchisor.b2b.manage",
  outletTopupRequest: "svc-franchisor.outlet-topup-request.manage",
  withdrawalRequest: "svc-franchisor.withdrawal-request.manage",
} as const;

export type ActionSlug = (typeof ACTION)[keyof typeof ACTION];
