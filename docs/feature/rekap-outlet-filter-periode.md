# Frontend Franchisor — Rekap Outlet: Filter "Rentang Tanggal" → "Periode"

**Date:** 2026-09-22
**Status:** Final — keputusan terkonfirmasi (menunggu go-ahead implementasi)
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend ref:** `franq/backend` (`franchisor/src/franchise/*/request_get.go`, `usecase/membership_settlement.go`) — periode ditambahkan ~Agu 2026

---

## Problem

1. Filter di **halaman list Rekap Outlet** (`/report/outlet`) masih memakai **rentang tanggal** (`DatePicker mode='range'` → `start_date`/`end_date`). Pengguna ingin **filter periode** supaya konsisten dengan Dashboard & tab Settlement.
2. Di **halaman detail Rekap Outlet** (`/report/outlet/:outletId`), sebagian tab masih memakai rentang tanggal:
   - **Sesi, Outstanding, Settlement Membership, Penjualan Produk, Penjualan Menu, Transaksi Dibatalkan** → rentang tanggal.
   - Hanya tab **Settlement** yang sudah periode (select tahun).
   Tab yang belum periode perlu diubah jadi periode juga.

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Granularitas periode | **Bulanan** — pakai komponen `MonthPicker` yang sudah dipakai **Dashboard**; nilai `periode = "YYYY-MM"` (mis. `2026-09`). |
| 2 | Payload ke API | **Kirim `periode` saja** (`periode=2026-09`). FE **tidak** menghitung/mengirim `start_date`/`end_date` turunan. Penyesuaian backend ada di ranah BE. |
| 3 | Cakupan perubahan | **Hanya konteks Rekap Outlet** — halaman list Rekap Outlet + tab di detail Rekap Outlet. Halaman report **standalone** (`/report/pos/*`, `/report/mitra/*`, `/report/b2b/*`, `/report/membership/settlement`) **TIDAK** berubah. |
| 4 | Tab Settlement | **Tidak diubah** — sudah periode (select tahun `periode=YYYY` + `periode_type=yearly`). Tab **Settlement Membership** adalah tab terpisah dan **tetap diubah** ke periode (lihat bagian D). |
| 5 | Default nilai periode | **Bulan berjalan** (`dayjs().format("YYYY-MM")`), konsisten dengan Dashboard. **Terkonfirmasi.** |
| 6 | Nilai lama `start_date`/`end_date` | Di-**clear eksplisit** (`""`) saat mode periode, karena state tabel di-persist di `localStorage` (slice `table` tidak di-blacklist) sehingga nilai lama bisa tertinggal dan ikut terkirim. |
| 7 | Komponen filter | `MonthPicker` di-inline per file filter (mengikuti konvensi repo yang memang menyalin filter per modul) — **tidak** membuat komponen abstraksi baru. |

---

## Konteks (fakta yang diverifikasi dari backend `~/Workspaces/franq`)

`periode` di endpoint ini **bulanan**, format **`YYYY-MM`** (BE men-`fmt.Sprintf("%s-01", periode)` lalu +1 bulan, WIB→UTC). **Tidak ada** param `periode_type` di endpoint non-settlement.

| Endpoint | Baca `periode`? | Catatan |
|---|---|---|
| `GET /report/franchise/outlet` | ❌ | tag typo `query:"peridoe"` (`request_get.go:21`) → `periode` diabaikan |
| `GET /report/franchise/outlet/summary` | ❌ | resolver tidak dipanggil |
| `GET /report/franchise/session` | ✅ | tanpa `/summary` |
| `GET /report/franchise/outstanding` | ✅ | summary **tidak** memanggil resolver |
| `GET /report/franchise/product-sales` | ✅ | summary **tidak** memanggil resolver |
| `GET /report/franchise/product-item` | ✅ | summary **tidak** memanggil resolver |
| `GET /report/franchise/cancelled-product-sales` | ✅ | summary **tidak** memanggil resolver |
| `GET /report/franchise/settlement` | ✅ | pakai `periode` + `periode_type` (yearly/monthly) |
| `GET /report/membership-settlement` (+`/summary`) | ✅ | kedua-duanya memanggil resolver |

**Implikasi FE:** mengirim `periode` saja sudah benar untuk endpoint list; namun summary `outlet`/`outstanding`/`product-sales`/`product-item`/`cancelled` **belum** menerapkan periode, jadi summary card bisa tampil all-time sampai BE diperbaiki. Endpoint `outlet` juga perlu perbaikan typo. Ini **di luar scope FE** (keputusan #2).

---

## Perubahan per Area

### A. List Rekap Outlet — `table/outlet.filter.tsx`

- Ganti `DatePicker label='Rentang Tanggal' mode='range'` → **`MonthPicker`** (label **"Periode"**).
- State: `periode: string` (`YYYY-MM`), default bulan berjalan (keputusan #5).
- **Seed default**: `outlet/index.tsx` mengirim `filter: { periode: <bulan berjalan> }` ke `createTableConfig` supaya fetch pertama (tabel + summary) sudah ter-scope bulan berjalan.
- `buildFilters()` → `{ periode, start_date: "", end_date: "" }` + (superuser) `brand_id`, `outlet_id`.
- `isDirty` / `anyActive` / `handleClear` mengikuti pola `settlement.filter.tsx` (pakai `periode`).
- Filter **Franchisor + Outlet (superuser)** tetap seperti sekarang.

### B. Tab Sesi — `tabs/OutletTabFilter.tsx`

- File ini **hanya** dipakai `SessionTab`, dan `SessionTab` **hanya** dipakai di detail Rekap Outlet → aman diubah langsung (tanpa percabangan).
- Ganti rentang tanggal → **`MonthPicker`**; pertahankan filter **Status** (`opened`/`closed`).
- `buildFilters()` → `{ periode, start_date: "", end_date: "", status }`.
- **Seed default**: `tabs/SessionTab.tsx` menambah `periode: <bulan berjalan>` di `filter` table config.

### C. Tab Outstanding / Penjualan Produk / Penjualan Menu / Transaksi Dibatalkan

File filter ini **shared** dengan halaman standalone. Karena pembeda "konteks detail Rekap Outlet" sudah ada yaitu prop **`lockOutlet`** (= `!!outletId`, dan halaman standalone selalu pakai `outletTypeId`), maka:

- `pos/table/outstanding.filter.tsx`
- `pos/table/product-sales.filter.tsx`
- `pos/table/product-item.filter.tsx`
- `pos/table/cancelled-product-sales.filter.tsx`

Perubahan di tiap file:
- `lockOutlet === true` → render **`MonthPicker`** (label "Periode") + `buildFilters()` emits `periode` (dan clear `start_date`/`end_date`).
- `lockOutlet === false` → **tetap** `DatePicker` rentang tanggal (perilaku lama, tidak berubah).
- Select Outlet tetap disembunyikan saat `lockOutlet` (seperti sekarang).
- **Seed default**: tiap body (`pos/outstanding.tsx`, `pos/productSales.tsx`, `pos/productItem.tsx`, `pos/cancelledProductSales.tsx`) menambah `periode: <bulan berjalan>` di `filter` table config saat `lockOutlet`.

### D. Tab Settlement Membership — `membership/settlement/table/settlement.filter.tsx`

- Sama seperti C: `lockOutlet === true` → **`MonthPicker`** (`periode`); `lockOutlet === false` → tetap rentang tanggal.
- Status & Arah (`transfer_direction`) tetap.
- **Seed default**: `membership/settlement/index.tsx` menambah `periode: <bulan berjalan>` di `filter` table config saat `lockOutlet`.

### E. Komponen bersama — `MonthPicker`

- Tambah prop opsional **`label`** di `src/components/ui/month-picker/MonthPicker.tsx` (markup label mengikuti `Input`/`DatePicker`) supaya konsisten dengan filter lain; label dirender di atas trigger.
- **Trigger disamakan dengan field filter lain**: class custom (`bg-white border border-gray-200 rounded-lg` + tinggi tetap 36px) diganti **`input input-md input-primary w-full cursor-pointer`** — set kelas yang sama dengan `Input` (`DatePicker`/`RemoteSelect`) sehingga tinggi (40px), border, dan radius identik. Karena `Input` sudah full-width, filter **tidak perlu** lagi mengirim `inputClassName='w-full'`.
- `className` (sebelumnya tidak terpakai) kini dipakai di wrapper.
- Efek samping: `MonthPicker` di **Dashboard** (komponen yang sama) ikut memakai gaya input ini.

### F. Yang tidak berubah

- Tab **Settlement** (`pos/table/settlement.filter.tsx`) — sudah periode (tahun).
- Halaman standalone: `/report/pos/outstanding`, `/report/pos/product-sales`, `/report/pos/product-item`, `/report/pos/cancelled-product-sales`, `/report/mitra/*`, `/report/b2b/*`, `/report/membership/settlement` — tetap rentang tanggal.
- Tab Peta Outlet (tanpa filter tanggal).
- Tidak ada perubahan service/API/route/permission.

---

## File yang Diubah

| File | Perubahan |
|---|---|
| `src/components/ui/month-picker/MonthPicker.tsx` | Tambah prop opsional `label` (+ pakai `className` di wrapper) |
| `src/pages/report/outlet/index.tsx` | Seed `filter: { periode: bulan berjalan }` |
| `src/pages/report/outlet/table/outlet.filter.tsx` | List Rekap Outlet: rentang tanggal → `MonthPicker` periode |
| `src/pages/report/outlet/tabs/SessionTab.tsx` | Seed `periode` di filter table config |
| `src/pages/report/outlet/tabs/OutletTabFilter.tsx` | Tab Sesi: rentang tanggal → `MonthPicker` periode (status tetap) |
| `src/pages/report/pos/outstanding.tsx` | Seed `periode` di filter table config saat `lockOutlet` |
| `src/pages/report/pos/productSales.tsx` | idem |
| `src/pages/report/pos/productItem.tsx` | idem |
| `src/pages/report/pos/cancelledProductSales.tsx` | idem |
| `src/pages/report/pos/table/outstanding.filter.tsx` | Mode periode saat `lockOutlet` (standalone tetap rentang) |
| `src/pages/report/pos/table/product-sales.filter.tsx` | idem |
| `src/pages/report/pos/table/product-item.filter.tsx` | idem |
| `src/pages/report/pos/table/cancelled-product-sales.filter.tsx` | idem |
| `src/pages/report/membership/settlement/index.tsx` | Seed `periode` di filter table config saat `lockOutlet` |
| `src/pages/report/membership/settlement/table/settlement.filter.tsx` | Mode periode saat `lockOutlet` (standalone tetap rentang) |

**Dibuat:** tidak ada (komponen `MonthPicker` sudah ada di `@/components/ui`).
**Dihapus:** tidak ada.

---

## Verifikasi

1. `npm run lint` bersih; `tsc -b` tidak menambah error baru.
2. **List Rekap Outlet**: filter menampilkan "Periode" (MonthPicker); request `GET /report/franchise/outlet?periode=2026-09` (+ `brand_id`/`outlet_id` untuk superuser); summary ikut `periode`.
3. **Detail Rekap Outlet**:
   - Tab **Sesi** → Periode (bulan) + Status.
   - Tab **Outstanding / Penjualan Produk / Penjualan Menu / Transaksi Dibatalkan / Settlement Membership** → Periode (bulan); `outlet_id` tetap terkunci; **tidak ada** `start_date`/`end_date` di query.
   - Tab **Settlement** → tetap Periode (tahun), tidak berubah.
4. **Regresi halaman standalone**: `/report/pos/outstanding`, `product-sales`, `product-item`, `cancelled-product-sales`, dan `/report/membership/settlement` **masih** memakai rentang tanggal.
5. Nilai `start_date`/`end_date` lama yang tersimpan di `localStorage` **tidak** ikut terkirim saat mode periode.

---

## Catatan / Risiko

1. **Periode selalu terisi (keputusan #5, terkonfirmasi).** `MonthPicker` tidak punya opsi "semua/tanpa filter" — reset-nya kembali ke bulan berjalan. Jadi halaman **tidak lagi bisa** menampilkan data all-time (perilaku lama saat rentang tanggal dikosongkan). Disepakati: default bulan berjalan.
2. **Celah backend (di luar scope FE, keputusan #2).** Summary `outlet`/`outstanding`/`product-sales`/`product-item`/`cancelled` belum menerapkan `periode` (resolver tidak dipanggil), dan endpoint `outlet` salah tag (`peridoe`). Dampak: summary card bisa tampil all-time sampai BE diperbaiki.
3. **State tabel di-persist.** Slice `table` ada di `localStorage` (`store.tsx` tidak mem-blacklist `table`), sehingga `start_date`/`end_date` lama berpotensi nyangkut → di-clear eksplisit di mode periode (keputusan #6). Perlu dicek saat verifikasi #5.
4. **Duplikasi `MonthPicker` inline** di ~6 file (mengikuti konvensi filter repo yang menyalin per modul). Bila nanti mau, bisa dipertimbangkan komponen `PeriodeFilter` bersama — tapi di luar scope batch ini.
5. **Seed default menimpa pilihan tersimpan saat remount.** Default periode di-seed lewat `config.filter` (pola sama seperti tab Settlement tahunan), dan `useTable.boot()` selalu menimpa `filter` dari config → saat halaman/tab di-remount, periode kembali ke bulan berjalan (bukan pilihan terakhir user). Ini perilaku yang sudah lazim di modul Settlement.
