# Frontend Franchisor — Menu Finance/Mitra, Detail Franchise + Outlet, Hapus Page POS Channel & Tipe Outlet, Sales Order Superuser

**Date:** 2026-09-07
**Status:** Done
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)

---

## Problem

Rangkaian penyesuaian navigasi & akses portal franchisor setelah restrukturisasi brand/outlet/mitra:

1. Withdrawal & Topup (saldo outlet) butuh tempat menu sendiri + hanya relevan utk user mitra.
2. Outlet sebaiknya bisa dikelola per-brand dari halaman Franchise (khusus superuser), bukan hanya lewat halaman global.
3. Halaman POS Channel & Tipe Outlet tidak lagi dipakai di frontend (service-nya masih dipakai).
4. Sales Order: create/update hanya utk superuser (order outlet dibuat dari sisi lain), dan superuser perlu memilih franchise→outlet.
5. Sales Order perlu menampilkan brand/franchisor pemilik (di bawah nama outlet).

## Keputusan (hasil klarifikasi)

| # | Keputusan |
|---|-----------|
| 1 | Menu **Withdrawal & Topup** pindah dari Sales ke section **Finance**. |
| 2 | Page Withdrawal & Topup hanya tampil utk **user mitra** (`session.franchisor.type === 'mitra'`) **atau superuser**; non-mitra → redirect `/dashboard`. |
| 3 | Outlet **ditambahkan di dalam detail Franchise** (`/franchise/:id`, superuser only); halaman outlet global `/setting/outlet` tetap ada. Create outlet dari detail franchise membawa `franchisor_id` ter-set. |
| 4 | **Hapus page POS Channel** (`/setting/pos/channel`) & **hapus page Tipe Outlet** (`/setting/type/outlet`) — route/menu/constants page dihapus; service `/pos/channel` & `/outlet/type` tetap (dipakai modal assign & form). |
| 5 | Menu Sales dipecah: **Sales** = Sales Order saja; **B2B** = Customer + B2B Order. |
| 6 | Sales Order **create/update hanya utk superuser** (route + tombol). Form create/update: **pilih Franchise dulu → Outlet** (outlet di-scope by franchisor). |
| 7 | Nama franchisor tampil **di bawah nama outlet** di list & detail Sales Order (data `franchisor` di-embed backend). |

---

## Perubahan

### A. Menu & akses Finance (Mitra)
- Sidebar: section **Finance** (Withdrawal + Topup, `mitraOnly: true`); item Sales tinggal Sales Order.
- Properti baru `mitraOnly` pada menu item; filter `isItemAllowed`/`isParentAllowed` menerima `isMitraAccess`.
- Hook baru di `src/utils/permission.ts`: `useIsSuperuser`, `useFranchisorType`, `useIsMitraAccess` (mitra ATAU superuser).
- Guard baru `MitraAccessGuard` membungkus route `/withdrawal` & `/outlet-topup`.

### B. Detail Franchise + Outlet per brand
- Halaman baru `src/pages/franchise/franchiseDetail.tsx` (route `/franchise/:id`, SuperuserGuard): info brand + tabel outlet (`useTable` filter `franchisor_id`), tombol "Tambah Outlet" → `/setting/outlet/create?franchisor_id=...`, aksi edit/delete/toggle/channel/user outlet.
- `franchise.config.tsx`: aksi **"Kelola Outlet"** (→ detail).
- `outletCreate.tsx`: baca query `franchisor_id`, redirect balik ke detail franchise setelah create.
- `outletForm.tsx`: terima `defaultFranchisorId`, sertakan `franchisor_id` di payload.
- Types: `OutletCreateRequest.franchisor_id?`.

### C. Hapus page POS Channel & Tipe Outlet
- Hapus folder `src/pages/setting/pos/channel/` & `src/pages/setting/type/`.
- Hapus route, menu sidebar, `MENU.posChannel`/`MENU.outletType` & `ACTION.*`, `ROUTE_BY_PERMISSION`, meta map.
- Service & hook POS Channel / Outlet Type **tetap** (dipakai modal assign & form).
- Sidebar Settings: "Outlet" jadi item **Outlet List**; POS tinggal Category/Menu/Payment.

### D. Sales Order — superuser create/update + Franchise→Outlet
- Route `/sales/order/create` & `/sales/order/update/:id` dibungkus **SuperuserGuard** (file create/update/orderForm dipertahankan).
- List: tombol "Tambah Order" & aksi Edit hanya utk superuser.
- Detail: tombol Edit hanya utk superuser.
- `orderForm.tsx`: tambah **RemoteSelect Franchise** (data `/franchisor`) di baris pertama, lalu **Outlet** (fetch outlet difilter `franchisor_id`, disabled sampai franchise dipilih, reset saat franchise ganti); payload bawa `franchisor_id`.

### E. Tampilkan franchisor di Sales Order
- Types `SalesOrderDetail.franchisor?` (objek brand yang di-embed backend pd list & detail).
- List: nama franchisor tampil sebagai baris kecil **di bawah nama outlet**.
- Detail: nama franchisor tampil **di bawah Nama Outlet** pada kartu Informasi Outlet.

---

## File terkait (ringkas)

- `src/components/app/route-layout/AuthorizedLayout.tsx` (section Finance/B2B/Sales, mitraOnly)
- `src/components/app/guards/MitraAccessGuard.tsx` (baru)
- `src/utils/permission.ts`, `src/utils/permissions.ts`
- `src/routes/index.tsx`
- `src/pages/franchise/` (`franchiseDetail.tsx` baru, config, index)
- `src/pages/setting/outlet/` (create, form, config) — pos channel & type dihapus
- `src/pages/sales/order/` (create/update/form, list, detail, config)
- `src/services/types/` (`outlet.ts`, `sales.ts`, `auth.ts`)
- `src/hooks/useDocumentMeta.ts`

## Catatan

- Backend `GET /outlet` & `POST /outlet` sudah mendukung `franchisor_id` (verifikasi kode `outlet.go` & `request_create.go`).
- Backend list/show sales order meng-embed relasi `franchisor` (preload `Franchisor` di `sales_order.go` repo).
- Halaman outlet global tetap ada; detail franchise adalah tambahan akses per brand.
