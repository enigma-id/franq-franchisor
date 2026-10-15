# Frontend Franchisor — Laporan Outlet: Tab "Mutasi Saldo" & "Mutasi Point"

**Date:** 2026-10-15
**Status:** Implemented
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend ref:** `franq/backend` (`franchisor/src/handler/rest/report/saldo_log/request_get.go`, `report/point_log/request_get.go`)

---

## Problem

Di **detail Laporan Outlet** (`/report/outlet/:outletId`) belum ada tab untuk melihat **Mutasi Saldo** dan **Mutasi Point** per outlet. Data ini sudah tersedia di halaman standalone **Mutasi Saldo** (`/report/membership/saldo-log`) dan **Mutasi Point** (`/report/membership/point-log`), tapi belum bisa dilihat dalam konteks satu outlet.

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Tab baru | Tambah 2 tab di detail Laporan Outlet: **"Mutasi Saldo"** & **"Mutasi Point"**. |
| 2 | Cakupan brand | **Hanya brand bertipe `outlet`** (masuk `TABS_OUTLET`) — **tidak** muncul untuk `mitra` (`TABS_MITRA`). |
| 3 | Posisi tab | **Paling akhir** (setelah "Transaksi Dibatalkan"): Sesi → Outstanding → Settlement → Settlement Membership → Penjualan Produk → Penjualan Menu → Transaksi Dibatalkan → **Mutasi Saldo** → **Mutasi Point**. |
| 4 | Sumber data | **Mutasi Saldo** → `GET /report/saldo/log`; **Mutasi Point** → `GET /report/point/log`. **Reuse** komponen reusable `SaldoLogReport` / `PointLogReport` yang sudah dipakai halaman standalone (bukan bikin komponen baru). |
| 5 | Filter tanggal | Saat dipakai sebagai tab (`lockOutlet`), filter jadi **Periode (`MonthPicker`, `periode=YYYY-MM`)** — konsisten dengan tab lain di detail. Halaman **standalone tetap "Rentang Tanggal"**. Default **bulan berjalan**. |
| 6 | Filter Status (Mutasi Saldo) | Select **Status tetap tampil** (default `Completed`) — **tidak** dikunci ke completed. User boleh ganti ke `Cancelled`. |
| 7 | Alur kerja | Implementasi dulu, markdown menyusul (batch ini). |

---

## Konteks (fakta yang diverifikasi dari backend `~/Workspaces/franq`)

Kedua endpoint menerima `periode` (**bulanan**, format `YYYY-MM`); BE me-resolve ke `start_date`/`end_date` (`resolvePeriodeToStartEndDate`). Resolver ini dipanggil di **list maupun summary** untuk kedua endpoint.

| Endpoint | Param relevan |
|---|---|
| `GET /report/saldo/log` (+ `/summary`) | `outlet_id, periode, start_date, end_date, page, limit, order_by, downloadable, search, reference_type, membership_id, cashier_id, franchisor_id`, **`status`** |
| `GET /report/point/log` (+ `/summary`) | `outlet_id, periode, start_date, end_date, page, limit, order_by, downloadable, search, reference_type, membership_id, cashier_id, franchisor_id` (tanpa `status`) |

Catatan `status` (saldo): komentar BE — *kosong / `completed` = completed saja, `cancelled` = dibatalkan*. Jadi default tanpa `status` sudah berarti "completed saja".

---

## Perubahan per Area

### A. Detail Laporan Outlet — `report/outlet/detail.tsx`

- `TABS_OUTLET` ditambah 2 entri: `{ key: "saldo-log", label: "Mutasi Saldo" }`, `{ key: "point-log", label: "Mutasi Point" }` (paling akhir). **`TABS_MITRA` tidak diubah.**
- Import `SaldoLogReport` & `PointLogReport`, lalu render saat tab aktif dengan `outletId` terkunci:
  - `{activeTab === "saldo-log" && <SaldoLogReport outletId={outletId} />}`
  - `{activeTab === "point-log" && <PointLogReport outletId={outletId} />}`

### B. `SaldoLogReport` — `report/membership/saldoLog.tsx`

- `SaldoLogReport` sudah menerima prop `outletId` sebelumnya (dipakai halaman standalone drill-down). Yang ditambah: saat `lockOutlet`, seed **default `periode`** (bulan berjalan) di `filter` table config:
  `filter: { outlet_id, periode: dayjs().format("YYYY-MM") }`, `lockedFilter: { outlet_id }`.
- Table key saat tab: `outlet_tab_saldo_log` (sudah ada).

### C. `PointLogReport` — `report/membership/pointLog.tsx`

- Tambah prop **`outletId`** + `lockOutlet = !!outletId` (sebelumnya hanya `membershipId`).
- `filter`: `{ outlet_id, periode: <bulan berjalan> }`; `lockedFilter`: `{ outlet_id }`.
- Table key baru saat tab: **`outlet_tab_point_log`** (`membershipId` → `report_point_log_detail`, default → `report_point_log`).
- Teruskan `lockOutlet` ke `TableFilter`.

### D. Filter Saldo — `report/membership/table/saldo-log.filter.tsx`

- Tambah mode **Periode** saat `lockOutlet`:
  - Render `MonthPicker` (label "Periode") menggantikan `DatePicker` rentang; state `periode` default bulan berjalan.
  - `buildFilters()` saat `lockOutlet` → `{ reference_type, status, periode, start_date: "", end_date: "" }` (clear `start_date`/`end_date` lama).
  - `isDirty` / `anyActive` / `handleClear` ikut pakai `periode` (mengikuti pola `settlement.filter.tsx`).
- Select **Status** & **Tipe** tetap tampil; select **Outlet** tetap disembunyikan saat `lockOutlet`.

### E. Filter Point — `report/membership/table/point-log.filter.tsx`

- Sama seperti D, **tanpa** select Status (endpoint point tidak punya `status`).
- Saat `lockOutlet` → `{ reference_type, periode, start_date: "", end_date: "" }`.

### F. Yang tidak berubah

- **Halaman standalone** `/report/membership/saldo-log` & `/report/membership/point-log` → tetap **Rentang Tanggal** (percabangan lewat `lockOutlet`).
- Tab **mitra** (`TABS_MITRA`) tidak dapat 2 tab baru ini.
- Endpoint lain, service/API/route/permission, dan `saldo-log.config` / `point-log.config` (columns) tidak berubah.

---

## File yang Diubah

| File | Perubahan |
|---|---|
| `src/pages/report/outlet/detail.tsx` | Tambah 2 tab (Mutasi Saldo, Mutasi Point) di `TABS_OUTLET` + render `SaldoLogReport`/`PointLogReport` |
| `src/pages/report/membership/saldoLog.tsx` | Seed `periode` (bulan berjalan) saat `lockOutlet` |
| `src/pages/report/membership/pointLog.tsx` | Tambah prop `outletId` + `lockOutlet`; filter/lockedFilter `outlet_id`+`periode`; table key `outlet_tab_point_log` |
| `src/pages/report/membership/table/saldo-log.filter.tsx` | Mode Periode (`MonthPicker`) saat `lockOutlet` |
| `src/pages/report/membership/table/point-log.filter.tsx` | Mode Periode (`MonthPicker`) saat `lockOutlet` |

**Dibuat:** `docs/feature/laporan-outlet-tab-mutasi-saldo-point.md` (dokumen ini).
**Dihapus:** tidak ada.

---

## Verifikasi

1. `npx tsc -b` bersih; `npx eslint` file berubah **0 error** (hanya warning `exhaustive-deps` yang sudah ada sebelumnya di filter ini).
2. **Detail Laporan Outlet (brand `outlet`)**: bar tab menampilkan **Mutasi Saldo** & **Mutasi Point** di paling akhir.
   - Tab **Mutasi Saldo** → request `GET /report/saldo/log?outlet_id=<id>&periode=YYYY-MM`; summary ikut `periode`; select **Status** default Completed; filter tanggal = **Periode**.
   - Tab **Mutasi Point** → request `GET /report/point/log?outlet_id=<id>&periode=YYYY-MM`; filter tanggal = **Periode**.
   - Kedua tab **tidak** mengirim `start_date`/`end_date` (di-clear di mode periode).
3. **Brand `mitra`**: 2 tab baru **tidak** muncul.
4. **Regresi halaman standalone** `/report/membership/saldo-log` & `/report/membership/point-log` → **masih Rentang Tanggal**.

---

## Catatan / Risiko

1. **Periode selalu terisi.** `MonthPicker` tanpa opsi "semua" — reset kembali ke bulan berjalan. Tab tidak menampilkan data all-time (sama seperti tab Laporan Outlet lain sejak batch filter-periode).
2. **Seed default menimpa pilihan tersimpan saat remount.** Default `periode` di-seed lewat `config.filter`; `useTable.boot()` menimpa `filter` dari config, jadi saat tab di-remount periode kembali ke bulan berjalan — pola yang sudah lazim di modul ini.
3. **State tabel di-persist (`localStorage`).** Nilai `start_date`/`end_date` lama bisa nyangkut → di-clear eksplisit di mode periode (butuh dicek saat verifikasi manual).
4. **Ringkasan (summary) mengikuti filter.** `saldoLogSummary`/`pointLogSummary` dikirim `outlet_id` + `periode` (BE sudah me-resolve `periode` di summary) — jadi kartu ringkasan ter-scope ke outlet + bulan terpilih.
5. **Duplikasi `MonthPicker` inline** di 2 file filter (mengikuti konvensi repo yang menyalin filter per modul) — bukan komponen abstraksi baru.
6. **Table key baru** `outlet_tab_point_log` — state tabel tab ini terpisah dari `report_point_log` (standalone) maupun `report_point_log_detail` (drill-down member).
