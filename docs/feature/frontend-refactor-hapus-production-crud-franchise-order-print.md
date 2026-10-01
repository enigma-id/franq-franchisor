# Frontend Franchisor Portal — Hapus Production, CRUD Franchise, Gate Superuser, Order + Print, Production Price

**Date:** 2026-09-07
**Status:** Planned
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)

---

## Problem

Beberapa perubahan frontend portal franchisor yang saling terkait, menyesuaikan backend `franq/backend/franchisor` yang sudah di-refactor:

1. **Halaman Production Demand & Production Plan masih ada** di frontend, padahal backend sudah menghapus total modul production & demand (commit refactor `09c959e` — "refactor franchisor: hapus retur & production plan"). Perlu dihapus (routes + menu + folder).
2. **Belum ada halaman kelola Franchise (CRUD brand/franchisor)** — backend sudah menyediakan endpoint `/franchisor` CRUD (create/update/delete/activate/deactivate) yang **khusus superuser** (guard `is_superuser`), dan create otomatis membuat outlet + user owner. Frontend belum punya UI-nya.
3. **Select Franchise di form Item & Catalog** — saat superuser membuat item/katalog baru, perlu memilih `franchisor_id` (data brand) karena backend create item/catalog menerima `franchisor_id` (superuser tidak terikat satu brand).
4. **Halaman "Schema Bonus Topup" & "Metode Pembayaran"** saat ini tampil untuk semua user yang punya permission; harusnya **hanya superuser** (`is_superuser`).
5. **Wording "Sales Order"** perlu diubah menjadi **"Order"** (termasuk route path) karena istilah lama tidak dipakai lagi di UI.
6. **Print global & per-item** yang tadinya ada di halaman Production Plan perlu **pindah ke halaman Order** (Sales Order) — tanpa mengubah konten komponen print (pindah "apa adanya").
7. **Form Catalog belum punya input `production_price`** (harga jual produksi), padahal backend catalog sudah punya kolom `production_price` (migration `20260904000000`).

---

## Keputusan (hasil klarifikasi)

| # | Keputusan |
|---|-----------|
| 1 | **Hapus total** halaman Production & Demand: routes, menu sidebar, folder `src/pages/production/`, service `production` & `demand`, constants permission (`MENU.demand`, `MENU.productionPlan`, `ACTION.production`). |
| 2 | **Feature Franchise = halaman CRUD brand/franchisor** memakai endpoint backend `/franchisor`. Route baru di bawah `/franchisor/list` (halaman `/franchisor` existing tetap = Profil Franchisor via `/franchisor/me`). **Superuser only.** |
| 3 | **Select Franchise** di form Item & Catalog: muncul **hanya saat create** & **hanya untuk `is_superuser`**; data dari `GET /franchisor`. Tidak muncul saat update (backend PUT tidak menerima `franchisor_id`). |
| 4 | Penentu superuser di frontend = **flag `is_superuser`** dari response user (`/profile/me`), bukan lagi `!usergroup_id`. |
| 5 | **Sales Order → "Order"**: label & title diganti, route `/sales/order` → `/order` (create/update/detail ikut), path lama di-redirect. Nama file/fungsi internal tidak wajib diubah. |
| 6 | **Print dipindah apa adanya**: komponen print production (`ProductionPlanThermalPrint`, label roti/batch) tidak diubah kontennya; di-render ulang dari halaman Order dgn data order yang dipetakan lewat adapter. |
| 7 | `production_price` ditambahkan **hanya di form Catalog** (bukan Item) + types + (opsional) kolom list/detail. |

---

## Perubahan per Area

### A. Hapus halaman Production & Demand
- `src/routes/index.tsx`: hapus import & route `/production/plan*` + `/production/demand/*`.
- `src/components/app/route-layout/AuthorizedLayout.tsx`: hapus section menu "Production" (Demand parent + Production Plan).
- `src/utils/permissions.ts`: hapus `MENU.demand`, `MENU.productionPlan`, `ACTION.production`.
- Hapus folder `src/pages/production/`, service `src/services/production/` & `src/services/demand/`, hook guard `useProductionPlanGuards` (+ guard production lain yang tak terpakai), types production, dan registrasinya di `src/services/reducer.tsx`.
- Komponen print yang dipakai ulang di halaman Order **dipertahankan** (lihat F).

### B. Flag `is_superuser` di frontend
- `src/services/types/auth.ts`: tambah `is_superuser: boolean` pada interface `User`.
- `src/utils/permission.ts`: tambah hook `useIsSuperuser(): boolean`.
- `AuthorizedLayout.tsx`: definisi super admin diselaraskan → `!usergroup_id || user.is_superuser`.

### C. Halaman CRUD Franchise (superuser only)
- `src/services/franchisor/api.tsx`: tambah endpoint untuk `/franchisor` — list/show/create/update/delete/activate/deactivate (pisah dari `/franchisor/me` existing).
- `src/services/franchisor/hooks.tsx`: tambah hook CRUD (`useFranchisorList`); pertahankan `useFranchisor` (profil).
- `src/services/types/franchisor.ts`: tambah `FranchisorRow` (type outlet/mitra), `FranchisorCreateRequest` (type, name, address, phone, email + owner: username, name_user, password, confirm_password), `FranchisorUpdateRequest` (tanpa owner).
- Halaman baru di `src/pages/franchise/` — list (`useTable` url `/franchisor`) + Drawer form create/edit + konfirmasi delete + toggle activate/deactivate. Route `/franchisor/list` dengan guard superuser.
- Sidebar Settings: tambah menu **"Franchise"** (`superAdminOnly`, path `/franchisor/list`, icon Building2) — berdampingan dengan "Profil Franchisor".

### D. Gate Schema Bonus Topup & Metode Pembayaran (superuser only)
- Buat `src/components/app/guards/SuperuserGuard.tsx`: non-superuser → `<Navigate to="/dashboard" replace />`.
- `src/routes/index.tsx`: bungkus route `/setting/member/topup-bonus` & `/setting/pos/payment` dengan `SuperuserGuard`.
- Sidebar: tandai menu **Schema Bonus Topup** & **Payment** (POS) sbg superuser-only (dukungan `superAdminOnly` di `MenuChild`).

### E. Rename Sales Order → Order
- Route `/sales/order` → `/order` (+ create/update/detail) + redirect path lama `/sales/order*` → `/order*`.
- Sidebar label "Order"; title halaman & wording (list, detail, form, toast) diganti "Order".
- Path internal/API `/sales/order` di service tetap (backend tidak berubah).

### F. Pindah print ke halaman Order
- `src/pages/sales/order/salesOrderDetail.tsx`: tombol print global (`ProductionPlanThermalPrint`) di header + dropdown per-baris item order (Label Roti 80x50 / Label Batch 33x15) via `usePrintWindow` — pola sama seperti Production Plan detail.
- Adapter kecil memetakan data order item → bentuk yang dibaca komponen label (`item.name/weight/code`, `unit_price`, `repeatCount = quantity_ordered`, `code` & tanggal dari order).
- Komponen `src/components/app/print/production-plan.tsx` & `production-label*.tsx` dipertahankan & tidak diubah.

### G. `production_price` di Catalog
- `src/services/types/inventory.ts`: tambah `production_price: number` di `InventoryCatalogBase` & `InventoryCatalogDetailBase`.
- `src/pages/inventory/catalog/components/catalogForm.tsx`: input **"Harga Produksi"** (`type='currency'`) di mode singular & bundle + state init/reset (default 0).
- Opsional: tampilkan di `catalogDetail.tsx` (kartu Pricing) & kolom list `catalog.config.tsx`.

### H. Select Franchise di form Item & Catalog (create, superuser only)
- `catalogForm.tsx` & `itemForm.tsx`: tambah `franchisor_id` ke payload create; render `RemoteSelect` **"Franchise"** (data `GET /franchisor`) hanya saat create (`!initialData`/`!id`) & `useIsSuperuser()` true.
- Types: `InventoryItemCreateRequest` & `InventoryCatalogRequest` tambah `franchisor_id?: string`.
- Non-superuser: create item/catalog tetap berjalan — verifikasi backend memakai `session.FranchisorID` saat `franchisor_id` tidak dikirim (kalau tidak, isi dari `session.user.franchisor_id`).

---

## File yang Berubah / Dibuat

### Diubah
- `src/routes/index.tsx`
- `src/components/app/route-layout/AuthorizedLayout.tsx`
- `src/utils/permissions.ts`
- `src/utils/permission.ts`
- `src/services/reducer.tsx`
- `src/services/types/auth.ts`
- `src/services/types/inventory.ts`
- `src/services/types/franchisor.ts`
- `src/services/franchisor/api.tsx`
- `src/services/franchisor/hooks.tsx`
- `src/pages/inventory/catalog/components/catalogForm.tsx`
- `src/pages/inventory/catalog/catalogDetail.tsx`
- `src/pages/inventory/catalog/table/catalog.config.tsx`
- `src/pages/inventory/item/components/itemForm.tsx`
- `src/pages/sales/order/index.tsx`
- `src/pages/sales/order/salesOrderDetail.tsx`
- `src/pages/sales/order/salesOrderCreate.tsx`
- `src/pages/sales/order/salesOrderUpdate.tsx`
- `src/pages/sales/order/components/orderForm.tsx` (wording)
- `src/pages/sales/order/table/order.config.tsx` (wording)
- `src/hooks/useDocumentMeta.ts` (wording)

### Dibuat
- `src/pages/franchise/` (list page + components/FranchiseForm + table/franchise.config.tsx)
- `src/components/app/guards/SuperuserGuard.tsx`
- Dokumen ini: `docs/feature/frontend-refactor-hapus-production-crud-franchise-order-print.md`

### Dihapus
- `src/pages/production/` (folder)
- `src/services/production/`, `src/services/demand/`
- `src/hooks/useProductionPlanGuards.ts` (+ guard production lain yang tak terpakai)
- `MENU.demand`, `MENU.productionPlan`, `ACTION.production` dari constants

---

## Verifikasi

- `npm run build` / `tsc --noEmit` bersih (tidak ada import error dari file yang dihapus / path berubah).
- Sidebar: section Production hilang; menu "Order" ada; menu Franchise / Schema Bonus Topup / Payment hanya utk superuser.
- Superuser (`is_superuser=true`): bisa akses halaman Franchise (tambah/edit/activate/delete brand), form Item/Catalog create menampilkan select Franchise, halaman Topup Bonus & Payment tampil.
- Non-superuser: menu & halaman tersebut tersembunyi / akses langsung di-redirect ke `/dashboard`.
- Catalog: input "Harga Produksi" tersimpan & tampil di detail.
- Order: `/order` jalan, `/sales/order` lama redirect; print global & per-item (label roti/batch) muncul dari detail order.
- Route lama `/production/plan*` & `/production/demand/*` → fallback redirect (hilang).

---

## Catatan / Risiko

- **Perubahan route path** (`/sales/order` → `/order`) berpotensi memutus bookmark lama → wajib redirect.
- **`superAdminOnly` saat ini** memakai `!usergroup_id`; setelah ada `is_superuser`, samakan definisinya agar konsisten (user superuser yang punya usergroup pun tetap dianggap superuser).
- **Create item/catalog utk non-superuser**: pastikan tetap mengirim `franchisor_id` yang benar (dari session) — backend create request menandai `franchisor_id` sebagai required di DTO.
- Komponen print production yang dipindah tetap butuh field production-plan (`plan.code`, tanggal, `item.weight`) — dipetakan dari data order via adapter; jangan ubah konten komponen.
