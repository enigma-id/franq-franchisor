# RBAC — Permission Guide (Franchisor v2)

> Hak akses berbasis permission slug. Setiap **page** dan **button action** di-gate oleh permission yang berasal dari **data user** (usergroup → `permissions`), dikirim backend lewat `GET /profile/me` sebagai `permissions: string[]`.

---

## 1. Konsep

| Lapisan | Slug namespace | Contoh | Dipakai untuk |
|---|---|---|---|
| **Page / sidebar** | `frontend.franchisor.<module>` | `frontend.franchisor.sales-order` | Menu sidebar + akses page (route guard) |
| **Button action** | `svc-franchisor.<module>.manage` | `svc-franchisor.sales-order.manage` | Setiap tombol aksi (create/edit/delete/approve/publish/dll) |

- **Super admin**: user tanpa usergroup / tanpa `permissions` → akses **semua** (full access). Tidak ada slug yang menghalangi.
- **Format check**: slug array; frontend pakai `hasPermission()` / `hasAnyPermission()` (`src/utils/permission.ts`).
- **Button action tanpa permission → tombol DIHILANGKAN** (hidden), bukan disabled.

---

## 2. Sumber data permission user

`GET /profile/me` → `User` memuat `permissions: string[]` → disimpan di session (`state.auth.session.user.permissions`).

```ts
// src/services/types/auth.ts
export interface User {
  id: string;
  franchisor_id: string;
  usergroup_id: string;
  outlet_id: string;
  username: string;
  name: string;
  is_active: boolean;
  permissions?: string[];   // ← tambahan
  // ...
}
```

> **Dependency backend**: `/profile/me` wajib mengembalikan `permissions` berisi slug `frontend.franchisor.*` (view) **dan** `svc-franchisor.*.manage` (action) sesuai usergroup user. Tanpa itu, semua user = super admin.

---

## 3. Daftar slug — Page / Sidebar (`frontend.franchisor.*`)

> Slugs dari seed `permission` (application `frontend`). → dipakai di **sidebar menu** + **route guard**.

| Page / Menu | Slug | Route |
|---|---|---|
| Dashboard | `frontend.franchisor.dashboard` | `/dashboard` |
| B2B Order | `frontend.franchisor.b2b-order` | `/b2b/order` |
| Sales Order | `frontend.franchisor.sales-order` | `/sales/order` |
| Sales Return | `frontend.franchisor.sales-return` | `/sales/return` |
| Withdrawal | `frontend.franchisor.withdrawal` | `/withdrawal` |
| Outlet Topup | `frontend.franchisor.outlet-topup` | `/outlet-topup` |
| Warehouse | `frontend.franchisor.warehouse` | `/inventory/warehouse` |
| Inventory Item | `frontend.franchisor.inventory-item` | `/inventory/item` |
| Inventory Catalog | `frontend.franchisor.inventory-catalog` | `/inventory/catalog` |
| Demand | `frontend.franchisor.demand` | `/production/demand/production`, `/production/demand/item` |
| Production Plan | `frontend.franchisor.production-plan` | `/production/plan` |
| Supplier | `frontend.franchisor.supplier` | `/purchase/supplier` |
| Purchase Order | `frontend.franchisor.purchase-order` | `/purchase/order` |
| Report POS Outstanding | `frontend.franchisor.report.pos-outstanding` | `/report/pos/outstanding` |
| Report POS Settlement | `frontend.franchisor.report.pos-settlement` | `/report/pos/settlement`, `/report/pos/settlement/daily` |
| Report Product Sales | `frontend.franchisor.report.product-sales` | `/report/inventory/product-sales` |
| Report POS Product Item | `frontend.franchisor.report.pos-product-item` | `/report/pos/product-item` |
| Report Transaction Cancel | `frontend.franchisor.report.cancelled` | `/report/pos/cancelled-product-sales` |
| Report B2B Settlement | `frontend.franchisor.report.b2b-settlement` | `/report/b2b/settlement`, `/report/b2b/settlement/daily` |
| Report B2B Product Sales | `frontend.franchisor.report.b2b-product-sales` | `/report/b2b/product-sales` |
| Report B2B Product Item | `frontend.franchisor.report.b2b-product-item` | `/report/b2b/product-item` |
| Report Material Sales | `frontend.franchisor.report.inventory-material-sales` | `/report/inventory/material-sales` |
| Report Warehouse Stock | `frontend.franchisor.report.warehouse-stock` | `/report/inventory/warehouse-stock` |
| Setting Outlet | `frontend.franchisor.outlet` | `/setting/outlet` |
| Setting Tipe Outlet | `frontend.franchisor.outlet-type` | `/setting/type/outlet` |
| Setting POS Channel | `frontend.franchisor.pos-channel` | `/setting/pos/channel` |
| Setting POS Category | `frontend.franchisor.pos-category` | `/setting/pos/category` |
| Setting POS Menu | `frontend.franchisor.pos-menu` | `/setting/pos/menu` |
| Setting POS Payment | `frontend.franchisor.pos-payment` | `/setting/pos/payment` |
| Schema Bonus Topup | `frontend.franchisor.topup-bonus` | `/setting/member/topup-bonus` |
| User | `frontend.franchisor.user` | `/user` |
| Usergroup | `frontend.franchisor.usergroup` | `/user/group` |

> **Note**: `/franchisor` (Profil Franchisor) **tidak punya slug** → selalu tampil di semua user (hanya view).

---

## 4. Daftar slug — Button Action (`svc-franchisor.*.manage`)

> Slugs dari seed `permission` (application `svc-franchisor`, action `manage`). → dipakai di **tombol aksi tiap page**.

| Module (page) | Slug action | Tombol yang di-gate |
|---|---|---|
| User | `svc-franchisor.user.manage` | Create, Edit, Delete, Activate/Deactivate |
| Usergroup | `svc-franchisor.usergroup.manage` | Create, Edit, Delete |
| Outlet | `svc-franchisor.outlet.manage` | Create, Edit, Delete |
| Tipe Outlet | `svc-franchisor.outlet-type.manage` | Create, Edit, Delete |
| Inventory Item | `svc-franchisor.inventory.manage` | Create, Edit, Delete, Detail? |
| Catalog | `svc-franchisor.catalog.manage` | Create, Edit, Delete |
| POS Channel | `svc-franchisor.pos-channel.manage` | Create, Edit, Delete |
| POS Category | `svc-franchisor.pos-category.manage` | Create, Edit, Delete |
| POS Menu | `svc-franchisor.pos-menu.manage` | Create, Edit, Delete, Assign Outlet Type |
| Supplier | `svc-franchisor.supplier.manage` | Create, Edit, Delete |
| Payment Method | `svc-franchisor.payment-method.manage` | Create, Edit, Delete |
| Schema Bonus Topup | `svc-franchisor.member-topup.manage` | Create, Edit, Delete |
| Purchase Order | `svc-franchisor.purchase-order.manage` | Create, Edit, Delete, Publish, Paid |
| Sales Order | `svc-franchisor.sales-order.manage` | Create, Edit, Delete, Publish, Paid |
| Sales Return | `svc-franchisor.sales-return.manage` | Create, Edit, Delete |
| Production (plan + demand) | `svc-franchisor.production.manage` | Create, Edit, Delete, Publish, Complete |
| B2B Order | `svc-franchisor.b2b.manage` | Create, Edit, Delete, Ship, Invoice, Pay |
| Outlet Topup Request | `svc-franchisor.outlet-topup-request.manage` | Approve, Reject |
| Withdrawal Request | `svc-franchisor.withdrawal-request.manage` | Approve, Reject |

> **Tidak punya action slug** (view-only, tanpa tombol gate): Warehouse, semua Report, Dashboard, Profil Franchisor.

**Perhatian — nama module beda antar namespace:**
- Page `frontend.franchisor.inventory-item` ↔ action `svc-franchisor.inventory.manage`
- Page `inventory-catalog` ↔ action `catalog`
- Page `b2b-order` ↔ action `b2b`
- Page `outlet-topup` ↔ action `outlet-topup-request`
- Page `withdrawal` ↔ action `withdrawal-request`
- Page `topup-bonus` ↔ action `member-topup`

---

## 5. Implementasi frontend

### 5.1 Konstanta slug — `src/utils/permissions.ts` (baru)

```ts
// Menu/page slugs (frontend namespace)
export const MENU = {
  dashboard: "frontend.franchisor.dashboard",
  b2bOrder: "frontend.franchisor.b2b-order",
  // ... dst (lihat tabel §3)
} as const;

// Action slugs (svc-franchisor namespace)
export const ACTION = {
  user: "svc-franchisor.user.manage",
  // ... dst (lihat tabel §4)
} as const;
```

### 5.2 Helper — `src/utils/permission.ts`

```ts
export const useUserPermissions = (): string[] | undefined =>
  useAppSelector((s) => s.auth.session?.user?.permissions);

export const can = (slug: string): boolean =>
  hasPermission(useUserPermissions(), slug);
```

### 5.3 Guard komponen

- **`PermissionGuard`** (baru, `src/components/app/guards/PermissionGuard.tsx`) — wrapper route: `!canAny(perm)` → `<Navigate to="/dashboard"/>`.
- **Sidebar** (`AuthorizedLayout.tsx`) — `MenuItem`/`MenuChild` diberi `permission?: string`; item disaring: `!can(slug)` → hidden.

### 5.4 Pola gating tombol (di PAGE, bukan component)

```tsx
// header action — hidden jika tak ada permission
{can(ACTION.salesOrder) && (
  <Button variant="primary" onClick={() => navigate("/sales/order/create")}>
    Create
  </Button>
)}

// kolom aksi tabel
{can(ACTION.salesOrder) && <Button size="sm" onClick={...}><Pencil/></Button>}
```

> `GuardedButton` (sudah ada) **tetap dipakai hanya untuk state-based guards** (status dokumen), **tidak** dipakai untuk permission.

---

## 6. Struktur seed backend (referensi)

| Kolom | Nilai |
|---|---|
| `slug` | `frontend.franchisor.<module>` (view) / `svc-franchisor.<module>.manage` (action) |
| `application` | `frontend` / `svc-franchisor` |
| `service` | `frontend` / `svc-franchisor` |
| `module` | nama module |
| `action` | `view` (menu) / `manage` (action) |

Seed idempotent: `INSERT INTO permission ... ON CONFLICT (slug) DO NOTHING;`
Route-guard backend hanya melindungi action `manage` (tanpa `readonly`).
