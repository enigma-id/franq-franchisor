# Frontend Franchisor — Submenu Warehouse: Delivery Plan & Receiving Plan (gRPC Proxy ke Warehouse)

**Date:** 2026-09-14
**Status:** Draft (menunggu review sebelum implementasi)
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend spec:** `franq/docs/feature/delivery-receiving-plan-franchisor.md` (BE sudah implemented: handler `delivery/plan`, `delivery/fulfillment`, `receiving/plan`, `receiving/receive` + permission seed)

---

## Problem

1. Portal **franchisor** (brand/HO) belum punya halaman untuk **membaca** Delivery Plan & Receiving Plan. Datanya hanya ada di `db_warehouse` dan sudah diproxy backend franchisor via gRPC, tapi belum ada UI-nya.
2. Ada **aksi tulis** yang perlu dijalankan dari portal franchisor (BE sudah support): Delivery Plan `complete`/`delivered`, Receiving Plan `complete`.
3. Belum ada **submenu Warehouse** di sidebar.

Referensi UI: `franq-wms` (`platforms/app/screen/operation/screen/delivery`, `.../receiving-plan`) — tapi ada perbedaan data yang harus disesuaikan (lihat *Konteks*).

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Halaman | **Delivery Plan** + **Receiving Plan** (list + detail) — hanya 2 halaman. |
| 2 | Aksi tulis | Delivery Plan: **Fulfilled** (per-item qty) + **Complete** + **Sudah Diambil (delivered)**; Receiving Plan: **Complete**. |
| 3 | Bentuk menu | **Parent collapsible** "Warehouse" berisi 2 anak: Delivery Plan & Receiving Plan. |
| 4 | Sumber data | **Proxy backend franchisor** (bukan akses warehouse langsung). Tidak ada perubahan BE. |
| 5 | Service layer | **Extend `warehouseApi` existing** (`services/warehouse/`) — menghindari wiring reducer/store baru. |
| 6 | Gating aksi | Tombol aksi pakai `useCan(ACTION.delivery)` / `useCan(ACTION.receiving)`; menu/route pakai `MENU.deliveryPlan` / `MENU.receivingPlan`. |
| 7 | Publish | **Tidak ada** di franchisor (BE tidak expose `publish`) — jangan tampilkan tombol Publish. |
| 8 | Scope brand | Otomatis dari session (BE `ResolveFranchisorScope`); untuk superuser kirim `franchisor_id: plan.ref_id` di body aksi. |
| 9 | Section Fulfillment | **Tidak ditampilkan** di detail (di-drop) — fulfillment hanya berupa aksi tulis. |
| 10 | Aksi header | Mengikuti warehouse: **Complete** muncul saat `document_status` ∈ {process, published}; **Sudah Diambil** muncul saat `shipping_status=new` + `document_status=completed` + `self_pickup`. |

---

## Konteks (fakta yang diverifikasi dari backend)

### Endpoint yang sudah siap (prefix = `VITE_API_BASE_URL`)

Read = `s.Restricted()`; Write = `s.Restricted("svc-franchisor.delivery.manage")` / `svc-franchisor.receiving.manage`.

| Method | Path | Params / Body |
|---|---|---|
| GET | `/delivery/plan` | `franchisor_id, warehouse_id, outlet_id, document_status, fulfillment_status, shipping_status, type, shipping_date, month, ref_code, search, page, limit, order_by` |
| GET | `/delivery/plan/summary` | idem (tanpa `page/limit/order_by`) |
| GET | `/delivery/plan/{id}` | — |
| PUT | `/delivery/plan/{id}/complete` | body `{ photos?: string[], franchisor_id? }` |
| PUT | `/delivery/plan/{id}/delivered` | body `{ franchisor_id? }` |
| GET | `/delivery/fulfillment` | `plan_id` (**required**), `franchisor_id` — *tidak dipakai FE* |
| PUT | `/delivery/fulfillment/{id}/fulfilled` | body `{ items: [{ plan_item_id, quantity }], franchisor_id? }` — `{id}` = **plan id**, guard BE: `document_status = published`, tiap `quantity > 0` |
| GET | `/receiving/plan` | `franchisor_id, warehouse_id, outlet_id, document_status, receiving_status, plan_date, month, ref_code, search, page, limit, order_by` |
| GET | `/receiving/plan/summary` | idem (tanpa `page/limit/order_by`) |
| GET | `/receiving/plan/{id}` | — |
| PUT | `/receiving/plan/{id}/complete` | body `{ franchisor_id? }` |
| GET | `/receiving` | `plan_id, warehouse_id, outlet_id, search, page, limit, order_by` |
| GET | `/receiving/{id}` | — |

- List response: `{ data: [...], meta: { total, ... } }` (kompatibel `useTable`).
- Detail/action: `{ data: {...} }` / `{ message }`.

### Field response (hasil converter proto→entity)

- **DeliveryPlan** (yang benar-benar terisi): `id, ref_id, warehouse_id, outlet_id, code, ref_code, name, phone, address, type, shipping_date, document_status, fulfillment_status, shipping_status, self_pickup, picked_up_by, warehouse{}`, `items[]` = `{ id, item_id, item{name}, quantity_planned, quantity_fulfilled }`.
- **ReceivingPlan**: `id, ref_id, warehouse_id, outlet_id, code, ref_code, sender_name, plan_date, document_status, receiving_status, warehouse{}`, `items[]` = `{ id, item_id, item{name}, quantity_planned, quantity_received, quantity_defect }`.
- **Fulfillment**: `id, plan_item_id, quantity, quantity_used` — **tanpa nama item**.
- **Receiving**: `id, code, plan_id, warehouse_id, received_at, document_status, note, warehouse{}`, `items[]`.
- **Summary**: `{ total, process, completed }`.

### Catatan backend yang memengaruhi FE

- **`created_at` / `created_by` TIDAK terisi** oleh converter proxy untuk DeliveryPlan/ReceivingPlan (juga Fulfillment). Jadi kolom "Created/by" ala `franq-wms` **tidak bisa dipakai** → gunakan `shipping_date` / `plan_date`.
- **`publish` tidak di-expose** di franchisor. Delivery Plan hanya `complete` + `delivered`; Receiving Plan hanya `complete`.
- **Guard validasi BE**:
  - `complete` → error bila `document_status == "new"` ("data has not been processed") atau `== "completed"`.
  - `delivered` → error bila `shipping_status != "new"` atau `!self_pickup`.
- Nama item di **Fulfillment** tidak dikirim converter → FE join `plan_item_id` ke `plan.items[].id`.
- **Slug permission** (seed `backend/franchisor/src/permission.go`, wajib sama persis):
  - `frontend.franchisor.delivery.plan` ("Menu Delivery Plan")
  - `frontend.franchisor.receiving.plan` ("Menu Receiving Plan")
  - `svc-franchisor.delivery.manage` ("Manage Delivery Plan & Fulfillment")
  - `svc-franchisor.receiving.manage` ("Manage Receiving Plan & Receiving")
  - *(Slug `frontend.franchisor.delivery.fulfillment` & `frontend.franchisor.receiving.actual` ada di seed tapi belum dipakai FE di batch ini.)*
- Superuser = login tanpa brand → BE kirim `brand_ref_id` kosong (data semua brand). Untuk aksi by-id, FE mengirim `franchisor_id: plan.ref_id` agar ter-scope ke brand plan.

---

## Perubahan per Area

### A. Permission

- `src/utils/permissions.ts`:
  - `MENU.deliveryPlan = "frontend.franchisor.delivery.plan"`
  - `MENU.receivingPlan = "frontend.franchisor.receiving.plan"`
  - `ACTION.delivery = "svc-franchisor.delivery.manage"`
  - `ACTION.receiving = "svc-franchisor.receiving.manage"`
- `src/utils/permission.ts`: tambah 2 entri `ROUTE_BY_PERMISSION` (setelah `purchaseOrder`) → `/warehouse/delivery-plan`, `/warehouse/receiving-plan`.

### B. Menu & Route

- `src/components/app/route-layout/AuthorizedLayout.tsx`:
  - Import ikon `Warehouse` (`lucide-react`).
  - Tambah **parent collapsible** di section **Main Menu** (setelah Dashboard):
    ```tsx
    {
      label: "Warehouse",
      icon: <Warehouse size={18} />,
      children: [
        { label: "Delivery Plan",  path: "/warehouse/delivery-plan",  permission: MENU.deliveryPlan },
        { label: "Receiving Plan", path: "/warehouse/receiving-plan", permission: MENU.receivingPlan },
      ],
    }
    ```
    (Parent accordion = `MenuItem.children`, sudah didukung `isParentAllowed`.)
- `src/routes/index.tsx`: import 4 page + 4 route (list & detail), dibungkus `PermissionGuard`:
  - `/warehouse/delivery-plan`, `/warehouse/delivery-plan/:id` → `MENU.deliveryPlan`
  - `/warehouse/receiving-plan`, `/warehouse/receiving-plan/:id` → `MENU.receivingPlan`

### C. Service & Types

`src/services/warehouse/api.tsx` — extend `warehouseApi` (tagTypes + `"DeliveryPlan"`, `"ReceivingPlan"`):

| Endpoint | HTTP |
|---|---|
| `getDeliveryPlans` | `GET /delivery/plan` |
| `getDeliveryPlan` | `GET /delivery/plan/{id}` |
| `getDeliveryPlanSummary` | `GET /delivery/plan/summary` |
| `completeDeliveryPlan` | `PUT /delivery/plan/{id}/complete` |
| `deliverDeliveryPlan` | `PUT /delivery/plan/{id}/delivered` |
| `fulfilledDeliveryPlan` | `PUT /delivery/fulfillment/{id}/fulfilled` |
| `getReceivingPlans` | `GET /receiving/plan` |
| `getReceivingPlan` | `GET /receiving/plan/{id}` |
| `getReceivingPlanSummary` | `GET /receiving/plan/summary` |
| `completeReceivingPlan` | `PUT /receiving/plan/{id}/complete` |
| `getReceivings` | `GET /receiving` |

`src/services/warehouse/hooks.tsx` — tambah 2 hook via `createCrudHook` (pola existing; `useWarehouse` tidak diubah):
- `useDeliveryPlan` → `customOperations: { fulfilled, complete, delivered }`, `additionalQueries: { summary }`.
- `useReceivingPlan` → `customOperations: { complete }`, `additionalQueries: { summary, receivings }`.

`src/services/types/deliveryPlan.ts` & `src/services/types/receivingPlan.ts` (baru) + re-export di `src/services/types/index.ts`.

**Tidak ada** perubahan `services/reducer.tsx` / `services/store.tsx` (reuse `warehouseApi`).

### D. Halaman Delivery Plan

- `src/pages/warehouse/delivery-plan/index.tsx` — list: `Page.Header` (category "Warehouse") + (opsional) stat card total/process/completed dari `summaryResult` + `Table.Tools` (filter) + `Table.Render` + `Table.Pagination`. `useTable("delivery_plan", …)`.
- `table/delivery-plan.config.tsx` — kolom: `code` (+ `ref_code`), `name` (outlet + `phone`), `type` (`typeBadge`), `shipping_date`, `document_status`, `fulfillment_status`, `shipping_status` (`statusBadge`), `action` (Dropdown → Lihat Detail). `url: "/delivery/plan"`.
- `table/delivery-plan.filter.tsx` — `DatePicker` Shipping Date + `RemoteSelect` Type/Status/Fulfillment Status/Gudang (`useWarehouse`).
- `deliveryPlanDetail.tsx` — `show({ id })`; info card + tabel `items[]`.
  - **Fulfilled** (aksi di bawah tabel item): tampil saat `document_status = published` + `fulfillment_status = new` + `canManage`. Tiap baris item punya stepper qty (prefill `quantity_planned`); submit `PUT /delivery/fulfillment/{planId}/fulfilled` dengan `items: [{ plan_item_id, quantity }]`. FE menolak submit bila ada `quantity <= 0`.
  - **Complete** (header): tampil saat `document_status` ∈ {process, published}.
  - **Sudah Diambil / delivered** (header): tampil saat `shipping_status = new` + `document_status = completed` + `self_pickup`.
  - Body aksi selalu menyertakan `franchisor_id: data.ref_id`.
  - Section **Fulfillment di-drop** (tidak ada tabel fulfillment di detail).

### E. Halaman Receiving Plan

- `src/pages/warehouse/receiving-plan/index.tsx` — list, `useTable("receiving_plan", …)`.
- `table/receiving-plan.config.tsx` — kolom: `code` (+ `ref_code`), `sender_name`, `plan_date`, `document_status`, `receiving_status`, `action`. `url: "/receiving/plan"`.
- `table/receiving-plan.filter.tsx` — Status, Receiving Status, Plan Date, Gudang.
- `receivingPlanDetail.tsx` — info card (Sender/Ref, Warehouse, Area/Location, Plan Date, statuses) + tabel `items[]` (Planned/Received/Defect/Sisa) + section Receiving (dari `receivings({ plan_id })`).
  - Tombol **Complete** (`document_status` bukan `new`/`completed`).

Status option arrays (`document_status`, `fulfillment_status`, `receiving_status`, `type`) didefinisikan lokal di masing-masing `*.filter.tsx`.

---

## File yang Dibuat / Diubah

### Dibuat

| File | Isi |
|---|---|
| `src/services/types/deliveryPlan.ts` | Types Delivery Plan |
| `src/services/types/receivingPlan.ts` | Types Receiving Plan + Fulfillment + Receiving |
| `src/pages/warehouse/delivery-plan/index.tsx` | List Delivery Plan |
| `src/pages/warehouse/delivery-plan/deliveryPlanDetail.tsx` | Detail Delivery Plan + aksi |
| `src/pages/warehouse/delivery-plan/table/delivery-plan.config.tsx` | Kolom tabel |
| `src/pages/warehouse/delivery-plan/table/delivery-plan.filter.tsx` | Filter |
| `src/pages/warehouse/receiving-plan/index.tsx` | List Receiving Plan |
| `src/pages/warehouse/receiving-plan/receivingPlanDetail.tsx` | Detail Receiving Plan + aksi |
| `src/pages/warehouse/receiving-plan/table/receiving-plan.config.tsx` | Kolom tabel |
| `src/pages/warehouse/receiving-plan/table/receiving-plan.filter.tsx` | Filter |

### Diubah

| File | Perubahan |
|---|---|
| `src/utils/permissions.ts` | +2 `MENU`, +2 `ACTION` slug |
| `src/utils/permission.ts` | +2 entri `ROUTE_BY_PERMISSION` |
| `src/components/app/route-layout/AuthorizedLayout.tsx` | +ikon `Warehouse`, +parent collapsible di Main Menu |
| `src/routes/index.tsx` | +import 4 page, +4 route |
| `src/services/warehouse/api.tsx` | +11 endpoint |
| `src/services/warehouse/hooks.tsx` | +`useDeliveryPlan`, `useReceivingPlan` |
| `src/services/types/index.ts` | +re-export |

---

## Verifikasi

1. `npm run build` (tsc + vite) dan `npm run lint` bersih.
2. **Permission seed** ada di DB: `frontend.franchisor.delivery.plan`, `frontend.franchisor.receiving.plan`, `svc-franchisor.delivery.manage`, `svc-franchisor.receiving.manage`. User non-superuser diberi slug via usergroup.
3. **Sidebar & guard** — superuser melihat group "Warehouse" (2 anak); user tanpa slug tidak melihat menu & route redirect `/dashboard`.
4. **List** `/warehouse/delivery-plan` & `/warehouse/receiving-plan` memuat dari `/delivery/plan` & `/receiving/plan`; paginasi (`meta.total`), search, filter (gudang/type/status/tanggal) berfungsi.
5. **Detail** — klik "Lihat Detail" → detail tampil (items + info); tidak ada tabel fulfillment.
6. **Aksi** — Fulfilled (stepper qty, hanya saat published & fulfillment new), Complete (process/published), Sudah Diambil (self-pickup + completed): toast sukses + status berubah. Guard: Fulfilled tidak muncul saat belum published; Sudah Diambil tidak muncul saat belum completed / non-self-pickup; qty <= 0 ditolak di FE.
7. **Regresi** — halaman lain & filter `useWarehouse` (stok gudang, purchase) tetap normal.

---

## Catatan / Risiko

- **Payload list tidak lengkap** dari proxy (`created_at`, `created_by`, `brand_id`, `area_id`, `fraction`, `total_weight`) → UI hanya memakai field yang benar-benar terisi.
- **Nama item** hanya tersedia di `items[]` (`item.name`); endpoint fulfillment tidak dikirim/dipakai FE.
- **Fulfilled butuh qty > 0 untuk semua item** (guard BE) — stepper di-prefill `quantity_planned`, FE menolak submit bila ada 0.
- **Slug mismatch** → menu/route tidak muncul walau BE mengizinkan. Samakan persis dengan `permission.go`.
- **`publish` tidak tersedia** di franchisor — jangan tampilkan tombol Publish (beda dengan `franq-wms`).
- **Aksi superuser** — sertakan `franchisor_id: plan.ref_id` agar aksi ter-scope ke brand plan (bukan lintas brand).
- Opsional: update `docs/RBAC.md` (catatan "Warehouse view-only") agar konsisten dengan menu baru.
