# Frontend Franchisor — Laporan Outlet (Rekap + Detail Per-Outlet), Tab Report, & Dashboard Live Maps

**Date:** 2026-09-14
**Status:** Draft (menunggu review sebelum implementasi)
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend spec:** `franq/docs/feature/outlet-report-and-franchisor-live-map.md` (status: Implemented)

---

## Problem

1. Portal franchisor belum punya **rekap per-outlet** (baris = outlet) untuk mengawasi performa tiap gerai. Semua report existing berdimensi lain (per order, per menu, per kasir, per periode).
2. Butuh **halaman detail per-outlet** yang mengumpulkan semua report existing yang sudah support `outlet_id` dalam bentuk tab.
3. Dashboard franchisor belum punya **Live Maps** (posisi device kasir lintas outlet) — baru ada di portal outlet, gate `brand.type = 'mitra'`.
4. Backend sudah mengubah **kontrak `GET /dashboard`** (hapus `outlet_aktif`, `so_pipeline`, `po_pipeline`; rename `total_saldo_membership` → `transaction_saldo_membership`; tambah `pos_summary_mitra`/`pos_summary_outlet`), sehingga dashboard FE saat ini menampilkan **0/kosong** untuk field-field tersebut.

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Modul batch ini | **Laporan Outlet** (list + detail + tab), **Dashboard Live Maps**, **sinkron dashboard ke kontrak baru**. Laporan Sesi digabung sebagai tab, bukan modul/menu sendiri. |
| 2 | Bentuk Laporan Outlet | **Rekap per-outlet** — tabel `baris = outlet`, klik baris → halaman detail outlet. |
| 3 | Posisi menu | **Leaf** "Rekap Outlet" di grup **Report** (sejajar "Peta Outlet"), slug `frontend.franchisor.report.outlet`. |
| 4 | Isi halaman detail | Nama outlet (dari response report) + **summary cards** (di-scope `outlet_id`) + **tab**. |
| 5 | Isi tab | **8 report existing** (`product-sales`, `product-item`, `outstanding`, `cancelled-product-sales`, `cashier`, `settlement`, `saldo/log`, `outlet-maps`) + **Laporan Sesi** = 9 tab. |
| 6 | Halaman Cashier | Sempat dibuat sebagai tab **Kasir**, lalu **di-drop** setelah review (lihat bagian C) — file & endpoint-nya dihapus. |
| 7 | Gating tab | **Semua tab tampil** asalkan user punya akses Laporan Outlet (`MENU.reportOutlet`). Tidak pakai slug per-report. |
| 8 | Arsitektur tab | **Refactor halaman report existing jadi komponen reusable** (Page-less, terima `outletId` terkunci) — dipakai ulang di route lama **dan** di tab. Tidak meng-embed halaman lama apa adanya. |
| 9 | Filter periode di detail | **Per-tab** — tiap tab punya filter tanggal/outlet sendiri (mirip halaman report standalone). |
| 10 | Kolom tabel & summary | **Semua kolom** BE (9 kolom) + **6 summary card**. |
| 11 | Live Maps: library | **Mapbox** (konsisten dengan Report Outlet Maps), pakai `VITE_MAPBOX_TOKEN`. |
| 12 | Live Maps: gating | Tampil untuk **brand `mitra` + superuser** (`useIsMitraAccess()`); user outlet non-superuser tidak melihat section. |
| 13 | Live Maps: perilaku | Marker **per-kasir**, **GeoJSON cluster** bawaan Mapbox, **filter outlet**, **polling 30 detik**. |
| 14 | Live Maps: data kosong | FE **skip** marker dengan `last_latitude/last_longitude == 0` (operator belum pernah kirim device). |
| 15 | Dashboard sync | **Hapus** card "Outlet Aktif", "Sales Order Pipeline", "Pipeline Purchase Order"; **superuser** dapat split POS → **POS Mitra** + **POS Outlet** untuk **omset _dan_ outstanding**; label saldo → nilai transaksi periode. |
| 16 | Laporan Sesi | Bukan menu/route/menu-slug baru di FE — cukup tab. Slug backend `frontend.franchisor.report.session` tidak dipakai FE. |
| 17 | Filter **outlet** di Laporan Outlet | **Hanya superuser.** User brand tidak perlu filter outlet — datanya sudah ter-scope brand oleh session, jadi filternya cukup rentang tanggal. |
| 18 | Filter **franchisor** di Laporan Outlet | **Tambah dropdown Franchisor, khusus superuser** — nilainya dikirim sebagai param **`brand_id`** ke `GET /report/franchise/outlet`. Outlet opsional, dan daftar outlet-nya di-scope ke franchisor terpilih (`GET /outlet?franchisor_id=`). |
| 19 | Kolom **Brand** | Ditampilkan di tabel **hanya untuk superuser** (baris bisa lintas brand). |
| 20 | **Wording** report | Semua label diseragamkan ke **Indonesia umum** (menu sidebar + judul halaman + subtitle + label tab), prefix `Report`/`POS` yang berulang dibuang. `POS Report` → `Outlet`. Lihat bagian **J**. |

---

## Konteks (fakta yang diverifikasi dari backend)

### Endpoint yang sudah siap

| Endpoint | Params | Catatan |
|---|---|---|
| `GET /report/franchise/outlet` | `brand_id` (**khusus superuser**), `outlet_id`, `outlet_type_id`, `start_date`, `end_date`, `search`, `page`, `limit`, `order_by`, `downloadable` | Rekap per-outlet (XLSX saat `downloadable=true`). `brand_id` diabaikan bila session sudah punya brand. |
| `GET /report/franchise/outlet/summary` | idem tanpa paginasi | Agregat seluruh outlet yang match filter |
| `GET /outlet` (dipakai filter) | `franchisor_id` (khusus superuser), `search`, `status`, `page`, `limit` | Sumber dropdown outlet |
| `GET /report/franchise/session` | `outlet_id`, `outlet_type_id`, `cashier_id`, `status`, `start_date/end_date`, `start_at/end_at`, `page`, `limit`, `order_by`, `downloadable` | Tanpa `/summary` |
| `GET /report/franchise/cashier` | `outlet_id`, `outlet_type_id`, `start_date`, `end_date`, `role`, `search`, `page`, `limit`, `order_by`, `downloadable` | Ada `/summary` |
| `GET /report/franchise/product-sales`, `product-item`, `outstanding`, `cancelled-product-sales`, `settlement` | sudah support `outlet_id` | dipakai ulang untuk tab |
| `GET /report/saldo/log` | `outlet_id` didukung | tab "Saldo Log" |
| `GET /report/franchise/outlet-maps` | `outlet_id`, `franchisor_id` (superuser) | Response per outlet: `cashiers[]` (tiap kasir punya `historys[]` sendiri + `battery_health`/`total_charges`/`total_transactions` per titik) |
| `GET /dashboard/live-map` | `outlet_id`, `outlet_type_id` | Marker per-kasir lintas outlet |

### Field response

- `ReportOutlet`: `outlet_id` (outlet `ref_id`), `outlet_name`, `brand_name`, `brand_type`, `status` (`Online`/`Offline`), `total_sales`, `omzet`, `total_outstanding`, `outstanding_amount`, `total_session`, `aov`, `cancelled_count`.
- `ReportOutletSummary`: `total_outlet`, `active_outlet`, `total_sales`, `total_omzet`, `total_outstanding`, `outstanding_amount`, `total_session`, `cancelled_count`.
- `ReportSession`: `session_id`, `outlet_id`, `outlet_name`, `cashier_id`, `cashier_name`, `transaction_date`, `started_at`, `finished_at`, `status`, `cash_started`, `cash_finished`, `total_sales`, `total_discount`, `total_service`, `grand_total`, `outstanding_bill`.
- `ReportCashier`: `cashier_id`, `cashier_name`, `status`, `total_sales`, `omzet`, `total_outstanding`, `outstanding_amount`, `total_session`, `aov`, `cancelled_count`.
- `CashierLiveMapItem`: `cashier_id`, `cashier_name`, `outlet_id`, `outlet_name`, `status`, `last_activity_at`, `last_battery_health`, `last_latitude`, `last_longitude`.
- Dashboard (kontrak baru): `pos_summary_mitra`/`pos_summary_outlet` (khusus superuser) membawa `omset` **dan** `outstanding`, `transaction_saldo_membership`; **tanpa** `outlet_aktif`/`so_pipeline`/`po_pipeline`/`total_saldo_membership`.

### Catatan backend yang memengaruhi FE

- **Superuser** = login tanpa `franchisor_id` → BE kirim `brand_ref_id` kosong → data **semua brand**. User brand ter-scope otomatis dari session. Untuk superuser yang ingin mempersempit ke satu brand, FE mengirim `brand_id` (endpoint outlet report & live-map pakai konvensi berbeda — cek tabel di atas).
- Anchor tanggal: penjualan/omset → `ss.finished_at`; outstanding → `ss.finished_at`; cancel → `so.cancelled_at`; jumlah session → tanggal WIB `(ss.started_at + 7h)::date`.
- Sesi `opened` menyimpan `finished_at` zero-time → **tidak muncul** bila ada filter tanggal (perilaku sengaja).
- `outlet_id` yang dipakai = **`outlet.ref_id`**, bukan PK internal.

---

## Perubahan per Area

### A. Service & Types

- `src/services/report/api.tsx`: tambah endpoint
  - `getOutletReport` → `GET /report/franchise/outlet`
  - `getOutletReportSummary` → `GET /report/franchise/outlet/summary`
  - `getSessionReport` → `GET /report/franchise/session`
- `src/services/report/hooks.tsx`: daftarkan query baru di `useReport()` (`outletReport`, `outletReportSummary`, `sessionReport`).
- `src/services/dashboard/api.tsx`: tambah `getLiveMap` → `GET /dashboard/live-map`.
- `src/services/dashboard/hooks.tsx`: expose `liveMap`.
- `src/services/types/reports.ts`: tambah `ReportOutletRow`, `ReportOutletSummary`, `ReportSessionRow`, `CashierLiveMapItem`, dan update `OutletMapHistory` (lihat bagian I).
- `src/services/types/dashboard.ts`: hapus `outlet_aktif`/`so_pipeline`/`po_pipeline`/`total_saldo_membership`; tambah `transaction_saldo_membership`, `pos_summary_mitra?`, `pos_summary_outlet?`, `total_outlet`.

### B. Laporan Outlet — halaman list

- Folder baru `src/pages/report/outlet/`:
  - `index.tsx` — list page: `Page.Header` + 6 `SummaryCard` + `Table.Tools` (filter + download) + `Table.Render` + `Table.Pagination`.
  - `table/outlet.config.tsx` — kolom: Outlet, **Brand (superuser)**, Total Sales, Omzet, Total Outstanding, Outstanding Amount, Total Session, AOV, Cancelled; `onRowClick` → detail. (Kolom **Status** tidak ditampilkan.)
  - `table/outlet.filter.tsx` — **rentang tanggal selalu**; **Franchisor + Outlet hanya untuk superuser** (outlet di-scope ke franchisor terpilih; nilai franchisor dikirim sebagai `brand_id`). Search outlet via kolom pencarian tabel.
- Route `/report/outlet` (guard `MENU.reportOutlet`).
- Klik baris → `/report/outlet/:outletId` (`outletId` = `outlet.ref_id`).
- Summary cards: Total Outlet, Active Outlet, Total Omzet, Total Sales, Outstanding Amount, Total Session.

### C. Laporan Outlet — halaman detail

- `src/pages/report/outlet/detail.tsx` — route `/report/outlet/:outletId`:
  - `Page.Header` (judul nama outlet + `backTo`).
  - Summary cards dari `GET /report/franchise/outlet/summary?outlet_id=:id`.
  - Tab bar mengikuti **tipe brand outlet-nya** (`outletRow.brand_type`):
    - brand **`outlet`** → `Sesi · Outstanding · Settlement · Penjualan Produk · Penjualan Menu · Transaksi Dibatalkan`
    - brand **`mitra`** → `Sesi · Settlement · Penjualan Produk · Penjualan Menu · Peta Outlet`
  - Komponen tab: `SessionTab` (baru), `OutstandingReport`, `SettlementReport`, `ProductSalesReport`, `ProductItemReport`, `CancelledProductSalesReport`, `OutletMapReport` — semuanya reusable (dipakai juga oleh halaman standalone-nya).
  - Tab `Peta Outlet` (device/GPS) hanya ada di set `mitra` — tidak relevan untuk brand `outlet`, termasuk saat login superuser.
  - Tab **Kasir** (per-kasir) di-drop dari detail; file `tabs/CashierTab.tsx` + `table/cashier.config.tsx` **dihapus**, plus endpoint `cashierReport`/`cashierReportSummary` di `report/api.tsx` + `report/hooks.tsx`.
  - Header nama outlet diambil dari response summary/list (`outlet_name`).

### D. Refactor report existing jadi reusable

- Tiap halaman report yang dipakai sebagai tab dipecah: komponen **body** (tanpa `<Page>`/`<Page.Header>`) + **page wrapper**:
  - Contoh: `pos/productSales.tsx` → export `ProductSalesReport({ outletId?, outletTypeId? })` (tabel + summary + filter), default export page → `<Page>…<ProductSalesReport/></Page>`.
- Komponen body menerima `outletId` opsional; saat diisi, `outlet_id` masuk `lockedFilter` dan **select outlet di filter disembunyikan** (ditambah prop `lockOutlet`/`hideOutlet` pada komponen filter).
- Report yang di-refactor: `pos/productSales`, `pos/productItem`, `pos/outstanding`, `pos/cancelledProductSales`, `pos/settlement`, `membership/saldoLog`, `franchisor/outletMap`, `membership/membership`, `mitra/outletSaldo`, `franchisor/warehouseStock` + **Sesi baru**.
- Route & halaman standalone lama tetap berfungsi (perubahan internal saja).

### E. Tab — daftar & komponen

| Tab | Sumber data | Komponen |
|---|---|---|
| Sesi | `/report/franchise/session?outlet_id=` | `SessionTab` (baru) |
| Product Sales | `/report/franchise/product-sales?outlet_id=` | reuse `ProductSalesReport` |
| Product Item | `/report/franchise/product-item?outlet_id=` | reuse `ProductItemReport` |
| Outstanding | `/report/franchise/outstanding?outlet_id=` | reuse `OutstandingReport` |
| Cancelled | `/report/franchise/cancelled-product-sales?outlet_id=` | reuse `CancelledReport` |
| Settlement | `/report/franchise/settlement?outlet_id=` | reuse `SettlementReport` |
| Saldo Log | `/report/saldo/log?outlet_id=` | reuse `SaldoLogReport` |
| Outlet Maps | `/report/franchise/outlet-maps?outlet_id=` | reuse `OutletMapReport` |

- Tiap tab punya filter periode sendiri (per-tab), `outlet_id` terkunci.

### F. Dashboard — sinkron kontrak baru

- `src/pages/dashboard/index.tsx`:
  - Hapus card **Outlet Aktif** dan card **Sales Order Pipeline** & **Pipeline Purchase Order** (beserta `PipelineCard`).
  - Label saldo → **"Transaksi Saldo Membership"** pakai `transaction_saldo_membership`.
  - Superuser: **Omset POS** → **POS Mitra** (`pos_summary_mitra.omset`) + **POS Outlet** (`pos_summary_outlet.omset`), dan **Outstanding POS** → **Outstanding POS Mitra** (`pos_summary_mitra.outstanding`) + **Outstanding POS Outlet** (`pos_summary_outlet.outstanding`); user normal tetap satu card `pos_summary`.
  - Card **Total Outlet** (`total_outlet`) tetap.
- `src/services/types/dashboard.ts` disesuaikan (lihat A).
- Grid di-reflow setelah penghapusan card.

### G. Dashboard — Live Maps

Pola mengikuti **`franq-franchisee`** (`src/components/app/CashierLiveMap.tsx`) yang sudah dipakai di portal franchisee.

- **Komponen peta bersama**: `src/components/app/CashierLiveMap.tsx` (dipakai dashboard **dan** Peta Outlet).
  - Marker **per titik**: titik terkini berwarna sesuai **status device** (dari `status` BE / log terakhir); titik sebelumnya tetap **biru** (`HISTORY_COLOR`) dan sedikit lebih transparan.
  - **Label nama kasir** hanya di titik terkini (symbol layer) → satu label per operator, tidak menumpuk.
  - **Jejak (garis)** biru putus-putus digambar hanya untuk operator terpilih.
  - **Legenda** (online/stale/offline + "Titik sebelumnya") di kiri bawah; overlay "Belum ada posisi device" saat kosong.
  - Popup: nama kasir, outlet, titik ke-`n` (`terkini` untuk titik terakhir), waktu, battery, transaksi & omset di titik itu, koordinat — **tanpa label status** (Online/Stale/Offline hanya muncul di legenda).
  - Refit bounds hanya saat sebaran titik berubah (signature), bukan tiap render.
- **Util status device**: `src/utils/deviceStatus.ts` (`DEVICE_STATUS_COLOR/LABEL`, `deviceStatusColor/Label`, `deviceStatusFromTime`) — port dari franchisee.
- **Pembungkus dashboard**: `src/pages/dashboard/components/LiveMap.tsx` — card putih + dropdown filter outlet (RemoteSelect) + **chip per kasir** (dot warna recency, klik untuk lihat jejak) + `<Suspense><CashierLiveMap/></Suspense>` tinggi `520px`.
- **Jejak di dashboard**: `GET /dashboard/live-map` sudah mengirim **`historys[]` per operator** (jejak device dari sesi `opened`, termasuk omset/transaksi per titik), jadi dashboard **tidak** lagi memanggil `/report/franchise/outlet-maps` — cukup dari live-map (polling 30 detik). Default operator terpilih = yang jejaknya terbanyak.
- **Tab dashboard: `Maps` & `Ringkasan`** (hanya tampil bila `useIsMitraAccess()` — user brand `outlet` tanpa peta tetap satu tampilan):
  - **`Maps`** (default) → hanya card Live Maps.
  - **`Ringkasan`** → Sales Chart, omset, outstanding, top list, komposisi (semua selain peta).
  - Pindah tab = komponen peta di-unmount → polling 30 detik ke `/dashboard/live-map` ikut berhenti (dan chunk `mapbox-gl` tidak dimuat kalau tab Maps tidak pernah dibuka).
- Gating **`useIsMitraAccess()`** (superuser / brand mitra); polling **30 detik**; dibersihkan saat unmount.
- **Lazy-load**: `CashierLiveMap` di-`lazy()` karena memuat `mapbox-gl` → chunk terpisah (`CashierLiveMap-*.js`), bundle utama turun ~3.1 MB → ~1.3 MB.
- Fallback bila `VITE_MAPBOX_TOKEN` kosong.
- **Layout:** `Page.Body` = `flex flex-col overflow-y-auto`, jadi tiap section dashboard wajib `shrink-0`. Root card LiveMap punya `overflow-hidden` tanpa tinggi eksplisit → automatic minimum size-nya `0`, sehingga sebelumnya ia dikempeskan flex sampai tak terlihat (fetch tetap jalan). Fix: `shrink-0 w-full` di root LiveMap + `shrink-0` di semua wrapper section dashboard agar `Page.Body` benar-benar scroll.

### H. Menu & Permission

- `src/utils/permissions.ts`: tambah `MENU.reportOutlet = "frontend.franchisor.report.outlet"`.
- `src/components/app/route-layout/AuthorizedLayout.tsx`: tambah leaf item **"Rekap Outlet"** di grup Report (ikon `Store`) — **diletakkan paling atas** di section Report (sebelum grup Outlet/Mitra/B2B/Member/Gudang & Penjualan).
- Section **`B2B`** (Customer, B2B Order) dibatasi **`superAdminOnly`** — cuma tampil untuk super admin (tanpa usergroup ATAU flag `is_superuser`), sama seperti menu Central Kitchen/Purchase/Franchise.
- **Flag menu baru `mitraHidden`** (analog `superuserHidden`): item disembunyikan bila brand bertipe `mitra` (`useFranchisorType() === "mitra"`; **superuser tidak termasuk**). Dipasang di grup Report **`Outlet`** dan **`Member`** — untuk brand mitra keduanya hilang, grup parent juga otomatis hilang kalau semua child-nya tersembunyi (`isParentAllowed` sekarang mengecek parent-nya sendiri dulu).
- `src/routes/index.tsx`: import + route `/report/outlet` dan `/report/outlet/:outletId` dengan `PermissionGuard permission={MENU.reportOutlet}`.

### I. Report Outlet Maps — trail per kasir, sesi, & filter franchisor

Response BE kini **per outlet** dengan kasir dikelompokkan:

```jsonc
{
  "outlet": "<ref_id>", "outlet_name": "Mitra", "total_charges": 0,
  "cashiers": [
    { "cashier_id": "...", "cashier_name": "Jajang",
      "historys": [ { "latitude": .., "longitude": .., "created_at": "YYYY-MM-DD HH:MM:SS",
                      "battery_health": "60", "total_charges": 0, "total_transactions": 0 } ] }
  ]
}
```

- **Types** (`src/services/types/reports.ts`): `OutletMapHistory` (+ `total_charges`/`total_transactions`), `OutletMapCashier`, `OutletMapRow.cashiers[]`. `buildCashierItems` memetakan `cashiers[]` → `CashierMapItem[]` (langsung, tanpa group-by di FE).
- **Daftar outlet** (panel kiri, halaman standalone) dari **`GET /outlet`** (tanpa input search), **tanpa baris omset**. Tiap baris: **nama outlet** + **nama brand di bawahnya**. **Filter franchisor** (RemoteSelect, `GET /franchisor`) tampil **hanya superuser** → `GET /outlet?franchisor_id=`; ganti franchisor melepas pilihan outlet.
  - Nama brand diambil dari relasi `outlet.franchisor.name` **kalau BE meng-embed**; kalau belum, fallback FE: peta `franchisor_id → name` dari daftar franchisor (superuser) + `session.user.franchisor` (user brand). **Catatan BE:** entity `Outlet` (`backend/franchisor/entity/outlet.go`) belum punya field relasi `Franchisor *Franchisor` (beda dengan `sales_order`/`customer`/`item`/`user`/`withdrawal_request` yang sudah) dan query list belum `Relation("Franchisor")` — begitu ditambah, FE otomatis pakai nilai dari BE.
- **Peta per kasir** via komponen bersama **`CashierLiveMap`**: marker per titik (warna recency), label nama kasir di titik terkini, jejak untuk kasir terpilih, legenda status, chip per kasir (nama + jumlah titik).
- **Select sesi** (sumber `GET /report/franchise/session?outlet_id=`) di header peta. Label nilai terpilih = **`cashier_name • started_at – finished_at`** (`Sekarang` bila sesi masih `opened`); daftar opsinya menampilkan nama+tanggal, rentang waktu, dan status. Memilih sesi → peta hanya menggambar kasir + titik pada rentang `started_at`–`finished_at` sesi tersebut (filter di FE, karena titik `historys[]` belum membawa `session_id`); memilih chip kasir melepas pilihan sesi.
- **Default kasir terpilih = titik terbanyak** supaya jejaknya langsung kelihatan (grup pertama belum tentu punya banyak titik).
- Popup titik: kasir, titik ke-`n`, waktu, battery, **transaksi & omset di titik itu** (kalau ada), koordinat.
- `CashierLiveMap` di-`lazy()` (mapbox-gl) — bundle utama tidak ikut membesar.

### J. Penyeragaman wording report (Indonesia umum)

Semua label report diseragamkan: menu sidebar, judul halaman (`Page.Header.title`), subtitle, dan label tab di detail. Prefix `Report`/`POS` yang berulang dibuang; header section tetap **"Report"**.

| Lokasi | Sebelum | Sesudah |
|---|---|---|
| Grup sidebar (POS) | POS Report | **Outlet** |
| Grup sidebar | Mitra Report | **Mitra** |
| Grup sidebar | B2B Report | **B2B** |
| Grup sidebar | Member Report | **Member** |
| Grup sidebar | Inventory & Sales | **Gudang & Penjualan** |
| Leaf sidebar | Report Outlet | **Rekap Outlet** |
| Leaf sidebar | Report Outlet Maps | **Peta Outlet** |
| POS | Report Outstanding / POS Outstanding | **Outstanding** |
| POS | Report Settlement / POS Settlement | **Settlement** |
| POS | Report Product Sales / POS Product Sales | **Penjualan Produk** |
| POS | Report Menu / POS Menu | **Penjualan Menu** |
| POS | Report Transaction Cancel | **Transaksi Dibatalkan** |
| Mitra | Report Settlement / Mitra Settlement | **Settlement** |
| Mitra | Report Product Sales / Mitra Product Sales | **Penjualan Produk** |
| Mitra | Report Menu / Mitra Menu | **Penjualan Menu** |
| Mitra | Report Outlet Saldo / Mitra Saldo | **Saldo Outlet** |
| B2B | Settlement / Product Sales / Menu | **Settlement / Penjualan Produk / Penjualan Menu** |
| Member | Report Membership | **Daftar Member** |
| Member | Report Saldo Membership | **Mutasi Saldo** |
| Gudang | Report Product Sales | **Penjualan Produk** |
| Gudang | Report Warehouse Stock | **Stok Gudang** |
| Tab detail | Product Sales / Product Item / Outstanding / Cancel / Settlement / Saldo Log / Outlet Maps | **Penjualan Produk / Penjualan Menu / Outstanding / Dibatalkan / Settlement / Mutasi Saldo / Peta Outlet** |

Subtitle ikut disesuaikan ke pola `Rekap ...` (mis. "Laporan penyelesaian pembayaran." → "Rekap penyelesaian pembayaran."). Catatan: judul halaman **Settlement/Penjualan Produk/Penjualan Menu** sama antar-channel (channel dibedakan dari menu/tab yang membuka), sedangkan halaman harian pakai pola `Settlement Harian — {periode}`.

---

## File yang Dibuat / Diubah

### Dibuat

| File | Isi |
|---|---|
| `src/pages/report/outlet/index.tsx` | List Laporan Outlet |
| `src/pages/report/outlet/detail.tsx` | Detail outlet + tab bar (9 tab, reuse komponen report) |
| `src/pages/report/outlet/components/OutletSummaryCards.tsx` | 6 summary card (dipakai list & detail) |
| `src/pages/report/outlet/table/outlet.config.tsx` | Kolom tabel Laporan Outlet |
| `src/pages/report/outlet/table/outlet.filter.tsx` | Filter list (outlet + rentang tanggal) |
| `src/pages/report/outlet/table/session.config.tsx` | Kolom tabel Sesi |
| `src/pages/report/outlet/tabs/SessionTab.tsx` | Tab Sesi (baru) |
| `src/pages/report/outlet/tabs/OutletTabFilter.tsx` | Filter generik tab (rentang tanggal + status opsional) |
| `src/pages/dashboard/components/LiveMap.tsx` | Card Live Maps dashboard (chip kasir + filter outlet, polling 30s) |
| `src/components/app/CashierLiveMap.tsx` | Komponen peta kasir bersama (marker recency, label nama, trail terpilih, legenda) — port dari `franq-franchisee` |
| `src/utils/deviceStatus.ts` | Util status recency device (online/stale/offline) |

### Diubah

| File | Perubahan |
|---|---|
| `src/services/report/api.tsx` | 5 endpoint baru |
| `src/services/report/hooks.tsx` | Register query baru |
| `src/services/dashboard/api.tsx` | `getLiveMap` |
| `src/services/dashboard/hooks.tsx` | expose `liveMap` |
| `src/services/types/reports.ts` | Types report baru + `OutletMapHistory` (kasir & battery) |
| `src/services/types/dashboard.ts` | Kontrak dashboard baru |
| `src/pages/dashboard/index.tsx` | Sinkron kontrak + mount LiveMap |
| `src/pages/report/pos/productSales.tsx` | Refactor reusable (`ProductSalesReport`) + page wrapper |
| `src/pages/report/pos/productItem.tsx` | Refactor reusable (`ProductItemReport`) |
| `src/pages/report/pos/outstanding.tsx` | Refactor reusable (`OutstandingReport`) |
| `src/pages/report/pos/cancelledProductSales.tsx` | Refactor reusable (`CancelledProductSalesReport`) |
| `src/pages/report/pos/settlement.tsx` | Refactor reusable (`SettlementReport`) |
| `src/pages/report/membership/saldoLog.tsx` | Refactor reusable (`SaldoLogReport`) |
| `src/pages/report/franchisor/outletMap.tsx` | Refactor reusable (`OutletMapReport`) + popup titik tampilkan kasir & battery |
| `src/pages/report/pos/table/*.config.tsx` + `settlement.config.tsx` | Terima `lockedFilter` (outlet terkunci) |
| `src/pages/report/pos/table/*.filter.tsx` + `membership/table/saldo-log.filter.tsx` | Prop `lockOutlet` (sembunyikan select outlet) |
| `src/utils/permissions.ts` | `MENU.reportOutlet` |
| `src/components/app/route-layout/AuthorizedLayout.tsx` | Menu leaf |
| `src/routes/index.tsx` | 2 route baru |

### Dihapus

| Item | Alasan |
|---|---|
| Card "Outlet Aktif" di dashboard | Field `outlet_aktif` dihapus backend |
| Card "Sales Order Pipeline" & "Pipeline Purchase Order" + `PipelineCard` | Field `so_pipeline`/`po_pipeline` dihapus backend |
| `src/pages/report/outlet/tabs/CashierTab.tsx` + `table/cashier.config.tsx` | Tab Kasir di-drop dari detail Rekap Outlet |
| `getCashierReport`/`getCashierReportSummary` (+ hook-nya) di `report/api.tsx` + `report/hooks.tsx` | Hanya dipakai `CashierTab` yang sudah dihapus |

---

## Verifikasi

1. `npm run build` (tsc + vite) dan `npm run lint` bersih.
2. **Laporan Outlet list** — baris = outlet; cek `?brand_id` (superuser), `?outlet_id`, `?start_date/end_date`, paginasi, `downloadable=true` (XLSX kolom sama dengan tabel). User brand: filter hanya rentang tanggal (tanpa Franchisor/Outlet). Superuser: dropdown Franchisor + Outlet (outlet ter-scope franchisor) + kolom Brand tampil.
3. **Summary** konsisten dengan list untuk filter yang sama.
4. **Klik baris** → detail outlet; summary card ter-scope `outlet_id`; semua 9 tab render & load tanpa error.
5. Tiap tab: `outlet_id` terkunci (select outlet tidak muncul), filter tanggal berfungsi, download jalan.
6. **Session tab**: sesi `opened` tidak muncul saat ada filter tanggal (sesuai anchor `finished_at`).
7. **Dashboard** login **superuser**: `transaction_saldo_membership` terisi; `pos_summary_mitra`/`pos_summary_outlet` tampil untuk **omset & outstanding** (Outstanding POS pecah jadi Mitra + Outlet); tidak ada card Outlet Aktif/SO/PO Pipeline; Live Maps tampil.
8. **Dashboard** login **brand outlet** (non-superuser): POS tunggal; **Live Maps tidak tampil**; saldo = nilai transaksi periode.
9. **Dashboard** login **brand mitra**: Live Maps tampil, marker ter-cluster, filter outlet jalan, refresh ~30s, marker `0,0` tidak muncul.
10. **Report Outlet Maps**: popup tiap titik menampilkan **nama kasir + battery**; titik terakhir tetap ditandai; response cashier-maps tidak berubah.
11. Regresi: halaman report lama (POS/Mitra/B2B/Membership) tetap tampil seperti sebelumnya.

---

## Catatan / Risiko

- **Breaking change dashboard** — penghapusan/rename field backend membuat dashboard lama salah tampil; sinkronisasi ini **wajib** bersamaan, bukan opsional.
- **Live Maps untuk superuser bisa ribuan marker** (semua operator semua brand) → cluster wajib; pertimbangkan filter outlet default agar payload & render tetap ringan.
- **Tab Outlet Maps** adalah peta Mapbox penuh di dalam tab → pertimbangkan tinggi minimum & lazy-mount (jangan render peta kecuali tab aktif).
- **Refactor report existing** menyentuh banyak file; halaman standalone harus diverifikasi tidak berubah perilakunya.
- **`outlet_id` = `outlet.ref_id`** — jangan kirim PK internal.
- **Tab gating** memakai satu slug (`report.outlet`); user yang punya akses Laporan Outlet tapi tidak punya akses report tertentu tetap melihat semua tab (konsekuensi keputusan #7).
- **Laporan Sesi tanpa `/summary`** — tab Sesi tidak punya summary card.
- **Outlet Maps `historys[]`** — `cashier_id`/`cashier_name`/`battery_health` di BE `omitempty`; jawab aman kalau `OutletMapHistory` dibuat opsional (halaman lama & jalur cashier-maps tetap jalan).
- **Mapbox token** bergantung `VITE_MAPBOX_TOKEN` di `.env`; sediakan fallback.
