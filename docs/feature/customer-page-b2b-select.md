# Page Customer (Master Data) + Select Customer di B2B Order

**Date:** 2026-09-07
**Status:** Done
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)

---

## Problem

1. **Belum ada halaman kelola Customer** di frontend, padahal backend `franchisor` sudah punya modul `customer` lengkap (tabel `customer`, CRUD `/customer`, activate/deactivate).
2. **Form B2B Order masih memakai 3 input bebas** (`customer_name/phone/address`) tanpa bisa memilih dari master customer, padahal backend create B2B sudah menerima `customer_id` (FK) dan otomatis snapshot data master.

---

## Backend (referensi)

- Tabel `customer`: `id, franchisor_id, name, phone, address, email, note, is_active, is_deleted, created_by/at, updated_by/at`.
- REST: `GET/POST /customer`, `GET/PUT/DELETE /customer/{id}`, `PUT /customer/{id}/activate|deactivate` — write gate `svc-franchisor.b2b.manage`.
- `b2b_order` punya `customer_id` FK opsional + relasi `customer` + kolom snapshot `customer_name/phone/address`.
- Create B2B order DTO menerima `customer_id`; jika diisi → backend **menimpa** snapshot dari master customer.
- Update B2B order DTO **tidak** menerima `customer_id`.

## Keputusan (hasil klarifikasi)

| # | Keputusan |
|---|-----------|
| 1 | Halaman Customer: **List + halaman terpisah** (create `/customer/create`, update `/customer/update/:id`), pola Supplier. |
| 2 | Menu **Customer di section Sales**; gate halaman pakai `MENU.b2bOrder`, aksi pakai `ACTION.b2b` (sesuai gate backend, tak ada slug customer khusus). |
| 3 | **Create B2B**: `RemoteSelect` Customer → field nama/telepon/alamat terisi dari master (read-only saat customer terpilih); payload kirim `customer_id` + snapshot → order ter-link. |
| 4 | **Update B2B**: select Customer tampil juga (prefill), tapi payload update tetap tanpa `customer_id` (backend tolak). |

---

## Perubahan

### Service
- `src/services/types/customer.ts` (baru): `CustomerRequest`, `CustomerDetail`.
- `src/services/customer/api.tsx` (baru): `customerApi` — CRUD + activate/deactivate `/customer`.
- `src/services/customer/hooks.tsx` (baru): `useCustomer = createCrudHook<CustomerDetail>`.
- Registrasi di `src/services/reducer.tsx` & `src/services/store.tsx` (blacklist).
- Re-export types di `src/services/types/index.ts`.

### Halaman Customer (baru, pola Supplier)
- `src/pages/customer/index.tsx` — list (`useTable` url `/customer`) + toggle active + modal delete.
- `src/pages/customer/customerCreate.tsx`, `customerUpdate.tsx`.
- `src/pages/customer/components/customerForm.tsx` — form `name/phone/email/address/note`.
- `src/pages/customer/table/customer.config.tsx` + `customer.filter.tsx`.

### Route & menu
- Route `/customer`, `/customer/create`, `/customer/update/:id` (PermissionGuard `MENU.b2bOrder`).
- Sidebar Sales: menu **Customer** (icon `Contact`, permission `MENU.b2bOrder`).

### Form B2B Order
- `src/services/types/b2b.ts`: `B2BOrderRequest.customer_id?`, `B2BOrderDetail.customer_id?/customer?`.
- `b2bOrderForm.tsx`: tambah `RemoteSelect` Customer (search dari `/customer`, filter `is_active=true`); saat pilih → isi snapshot + `customer_id`, 3 input customer jadi `disabled`; saat clear → kosongkan; submit create kirim `customer_id`, submit update hapus `customer_id`.

---

## Verifikasi

- `npx tsc --noEmit -p tsconfig.app.json` & `npm run build` bersih.
- `npx eslint` file baru/berubah bersih (warning pre-existing pola lama diabaikan).
- Manual: menu Customer muncul; CRUD customer jalan; create B2B order pilih customer → snapshot terisi & disabled → order ter-link; update B2B tetap snapshot tanpa ganti relasi.
