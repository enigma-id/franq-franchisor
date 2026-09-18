# Frontend Franchisor — Point Kategori, Point Member, Mutasi Point & Membership Settlement

**Date:** 2026-09-17
**Status:** Draft (menunggu review sebelum implementasi)

> **Revisi (Settlement detail):** list tidak lagi redirect saat baris diklik — detail dibuka lewat item **"Lihat Detail"** di dropdown aksi; halaman detail pindah sumber data ke **`GET /report/membership-settlement/{id}`** (show) sehingga `location.state` + kompensasi tanggal dibuang dan tabel item dirender dari `items` response itu; section ringkasan di detail berubah dari kartu jadi section label–nilai; section Informasi Settlement jadi layout kanan-kiri grid 2 kolom. Detail per area ada di §D/§E/§G, catatan di §Catatan.
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend spec:** `franq/docs/feature/membership_point.md` (status di doc masih *Planned*, padahal kode BE-nya sudah ada — lihat Catatan)

---

## Problem

1. Rate point per kategori menu (`menu_category.point_percentage`) sudah bisa dikirim/dibaca lewat `POST`/`PUT`/`GET /pos/category`, tapi **form kategori di FE belum punya input-nya** — jadi rate-nya selalu 0.
2. Member sudah punya saldo point (`membership.point`) dan ledger `point_log`, tapi **Daftar Member belum menampilkan point** sama sekali.
3. Belum ada **laporan mutasi point** di FE (`GET /report/point/log` sudah siap di BE, tapi tidak ada halaman, menu, service, maupun tipe-nya).
4. Belum ada **laporan settlement HO ↔ outlet** di FE. BE sudah menyimpan `membership_settlement` (header per outlet+tanggal) + `membership_settlement_item`, lengkap dengan endpoint list/summary/items dan tiga aksi (`settle`/`unsettle`/`reconcile`) — tapi HO belum punya UI untuk melihat maupun menandai settled.

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Scope batch | Empat hal: **input point % di Category**, **info point di Daftar Member**, **Laporan Mutasi Point**, **Laporan Membership Settlement** (list + detail). |
| 2 | Posisi menu | **Semua** ditempatkan di grup sidebar **Report → Member** (Daftar Member, Mutasi Saldo, **Mutasi Point**, **Settlement**). Settlement tetap di grup Member walau slug BE-nya ber-namespace `report.pos.*`. |
| 3 | Label & route | Menu **"Settlement"** → `/report/membership/settlement` (+ `/report/membership/settlement/:id` untuk detail); menu **"Mutasi Point"** → `/report/membership/point-log`. |
| 4 | Point % di Category | Kena **kedua form** (modal di `/setting/pos/category` **dan** tab kategori di detail Franchise) **+ kolom "Point %"** di tabel daftar kategori. |
| 5 | Input point % | `type="number"`, label **"Point Belanja"**, `suffix="%"`, rentang **0–100** (boleh desimal 2 angka, BE `numeric(5,2)`). Error BE `point_percentage.invalid` di-wire ke state form (di modal Settings). |
| 6 | Info point di Daftar Member | Tambah **kolom "Poin"** (setelah Saldo) + **kartu ringkasan "Total Poin"** (kartu jadi 3: Total Member, Total Saldo, Total Poin). |
| 7 | Drill-down dari Daftar Member | **Kolom aksi berubah dari chevron jadi dropdown 2 opsi**: "Mutasi Saldo" (`/report/membership/saldo-log?membership_id=`) dan "Mutasi Point" (`/report/membership/point-log?membership_id=`). **Row-click tetap** ke Mutasi Saldo seperti sekarang. |
| 8 | Kedalaman Settlement | **List + halaman detail per baris**. Detail dibuka lewat item **"Lihat Detail"** di dropdown kolom aksi — **klik baris tidak lagi** navigasi. |
| 9 | Kolom list Settlement | **10 kolom inti**: Outlet, Tanggal, Topup Cash, Topup Transfer, Payment Saldo, Payment Point, Payment Total, Net, Arah, Status. Kolom audit (settled by/at, transfer reference, alasan unsettle) **tidak** di list — cukup di detail. |
| 10 | Isi detail Settlement | Header + item diambil dari **`GET /report/membership-settlement/{id}`** (show). Section **Ringkasan Settlement** (label–nilai) + section **Informasi Settlement** (label kiri / nilai kanan, grid 2 kolom) + tabel item dari array `items` di response show + tombol aksi. Baris pembanding Σ item vs Σ header sempat dibuat lalu **dihapus** setelah review. |
| 11 | Aksi settle/unsettle/reconcile | Dari **dropdown per baris** (`list`) **dan** tombol di **halaman detail**. `settle`/`unsettle` buka modal (form), `reconcile` pakai modal konfirmasi. |
| 12 | Gating aksi | Menu mengikuti slug `frontend.franchisor.report.pos.membership-settlement`; tombol aksi hanya muncul bila user **superuser** (`useIsSuperuser()`) **DAN** punya slug `.settle` — mirror aturan BE (route permission + `session.IsSuperuser`). |
| 13 | Kartu ringkasan Settlement | **6 kartu nilai + Total Data**: Topup Cash, Topup Transfer, Payment Saldo, Payment Point, Payment Total, Net, Total Data. Dipakai hanya di **list**; di **detail** nilai yang sama dirender sebagai **section label–nilai** (bukan kartu). |
| 14 | Kartu ringkasan Mutasi Point | **4 kartu tipe + Total Transaksi**: Total Earn, Total Redeem, Total Revert, Total Revert Earn, Total Count. |
| 15 | Filter Mutasi Point | **Outlet + Rentang Tanggal + Tipe + Search**. Filter **Kasir di-skip** karena FE belum punya sumber daftar kasir (lihat Catatan). Member terkunci saat drill-down. |
| 16 | Filter Settlement | Outlet + Rentang Tanggal + Status + Arah (sesuai param BE). Search tabel = nama outlet (BE `searchFields: outlet.name`). |
| 17 | Filter item di detail | **Tidak ada filter tipe/kind** — hanya search. (Sempat jadi syarat teknis baris pembanding; sekarang baris pembanding dihapus, filter tipe/kind tetap tidak dipasang karena belum dibutuhkan.) |

---

## Konteks (fakta yang diverifikasi dari backend)

Diverifikasi langsung dari `~/Workspaces/franq/backend/...` (bukan asumsi).

### A. Category `point_percentage`

- Entity `MenuCategory` (`backend/franchisor/entity/menu_category.go`): `id`, `franchisor_id`, `name`, `point_percentage` (`numeric(5,2)`, default 0), `is_active`, `created_at`, `updated_at`.
- `POST /pos/category` body `{ name, franchisor_id?, point_percentage }`; `PUT /pos/category/{id}` body `{ name, point_percentage }`.
- Validasi BE: `point_percentage < 0 || > 100` → error key **`point_percentage.invalid`** ("point_percentage must be between 0 and 100").
- `GET /pos/category` sudah mengembalikan `point_percentage`. **Tidak ada** endpoint detail yang dipakai FE (tidak ada `useLazyShowQuery` untuk kategori).
- Rate ini di-sync ke `category.point_percentage` di POS lewat event yang sudah ada (bukan urusan FE).

### B. Daftar Member (`GET /report/membership`)

- Params: `start_date`, `end_date`, `page`, `limit`, `order_by`, `downloadable`, `search`. **Tanpa** `outlet_id`/`franchisor_id`.
- Row (`ReportMembership`): `membership_id`, `date`, `card_id`, `name`, `reff_code`, `saldo`, **`point`**, `last_transaction`.
- Summary (`ReportMembershipSummary`): `total_member`, `total_saldo`, **`total_point`**.
- Download XLSX sudah otomatis termasuk kolom `point` (BE `download()`), jadi FE tidak perlu ubah apa pun untuk export.

### C. Mutasi Point (`GET /report/point/log`)

- Params: `outlet_id`, `start_date`, `end_date`, `reference_type` (`earn` | `redeem` | `revert` | `revert_earn`), `membership_id`, `cashier_id`, `franchisor_id`, `search` (reference_code / nama member / card_id), `page`, `limit`, `order_by`, `downloadable`.
- Row (`ReportPointLog`): `date`, `reference_type`, `reference_code`, `nominal`, `membership`, `card_id`, `outlet`, `cashier_name`.
- Summary (`ReportPointLogSummary`): `total_earn`, `total_redeem`, `total_revert`, `total_revert_earn`, `total_count`.
- `nominal` **bertanda**: `earn` & `revert` positif, `redeem` & `revert_earn` negatif. Karena itu summary dipecah per type, bukan satu total.
- `GET /report/point/log/summary`; `downloadable=true` → XLSX.

### D. Membership Settlement

**List / summary**

- `GET /report/membership-settlement` — params `outlet_id`, `start_date`, `end_date`, `status` (`pending` | `settled`), `transfer_direction` (`ho_to_outlet` | `outlet_to_ho`), `franchisor_id`, `page`, `limit`, `order_by`, `search`.
  - **Filter tanggal butuh `start_date` DAN `end_date` dua-duanya terisi** (kalau salah satu kosong, filter tanggal tidak diterapkan).
  - `order_by` default `-membership_settlement:date,outlet:name`; `searchFields = outlet.name`; relasi **`Outlet` + `Franchisor` di-preload**.
  - **`GET /report/membership-settlement/{id}`** (show) mengembalikan header satu row **+ `outlet`/`franchisor` + array `items`** (`entity.MembershipSettlement.Items`, `bun:"rel:has-many"`). Di router gorilla/mux `{id}` **wajib** didaftarkan setelah `/summary` (first-match-wins), kalau tidak `GET /summary` tertangkap sebagai `id = "summary"`.
- Header row (`MembershipSettlement`): `id`, `franchisor_id`, `outlet_id`, `date`, `topup_cash`, `topup_transfer`, `payment_saldo`, `payment_point`, `payment_total`, `net_amount`, `transfer_direction` (bisa **null**), `status`, `settled_by`, `settled_at`, `transfer_reference`, `transfer_note`, `unsettled_reason`, `created_at`, `updated_at`, `outlet?`, `franchisor?`.
- `GET /report/membership-settlement/summary` — `topup_cash`, `topup_transfer`, `payment_saldo`, `payment_point`, `payment_total`, `net_amount`, `total_data`.

**Item**

- `GET /report/membership-settlement/items` — params `settlement_id`, `outlet_id`, `type` (`topup_cash` | `topup_transfer` | `payment_saldo` | `payment_point`), `kind` (`normal` | `reversal`), `franchisor_id`, `page`, `limit`, `order_by`, `search` (`searchFields = reference_code`), preload relasi `Settlement`.
- Item row: `id`, `settlement_id`, `franchisor_id`, `outlet_id`, `date`, `type`, `kind`, `amount`, `reference_id`, `reference_code`, `created_at`, `settlement?`.
- `GET /report/membership-settlement/items/summary` — `topup_cash`, `topup_transfer`, `payment_saldo`, `payment_point`, `total_data` (untuk pembanding Σ item vs Σ header).

**Aksi** (tiga path terpisah, `{id}` = id header, bukan field di body)

| Method | Path | Body | Validasi BE |
|---|---|---|---|
| `POST` | `/report/membership-settlement/{id}/settle` | `{ transfer_reference` **(wajib)**`, transfer_note? }` | superuser; belum settled; **tanggal < hari ini** |
| `POST` | `/report/membership-settlement/{id}/unsettle` | `{ reason` **(wajib)** `}` | superuser; status **== settled** |
| `POST` | `/report/membership-settlement/{id}/reconcile` | — (tanpa body) | superuser; **belum** settled |

- Response `settle`/`unsettle`: **message saja** (`rest.NewResponseMessage`), tanpa data.
- Response `reconcile`: **row `MembershipSettlement` hasil perbaikan** (dengan `outlet`/`franchisor` ter-preload) — dipakai FE untuk me-refresh header setelah reconcile.

### E. Permission (seed BE `backend/franchisor/src/permission.go`)

| Slug | Jenis | Kegunaan |
|---|---|---|
| `frontend.franchisor.report.pos.membership-settlement` | menu | akses halaman Settlement |
| `frontend.franchisor.report.pos.membership-settlement.settle` | aksi | **ketiga** aksi (settle/unsettle/reconcile) — tidak ada slug terpisah |
| `frontend.franchisor.report.membership-point-log` | menu | akses halaman Mutasi Point |

Catatan penting: ketiga aksi tetap **hanya untuk superuser** (`session.IsSuperuser`) meski user punya slug `.settle` — jadi di FE tombol wajib dicek dua-duanya.

---

## Perubahan per Area

### A. Kategori — input point percentage

- `src/services/types/pos.ts`: `POSCategoryBase` tambah `point_percentage?: number` (mengalir ke Create/Update/Detail).
- `src/pages/setting/pos/category/index.tsx` (modal utama):
  - state form tambah `point_percentage`;
  - prefill saat edit dari `row?.point_percentage ?? 0`;
  - reset saat tutup modal;
  - payload `create`/`update` ikut mengirim `point_percentage: Number(...)`;
  - JSX: `<Input type='number' label='Point (%)' suffix='%' min={0} max={100} step='any' ... error={FormState?.errors?.point_percentage} />`.
- `src/pages/franchise/components/FranchiseCategoryTab.tsx` (modal di detail Franchise): penyesuaian identik (state, `openEdit`, reset, payload, JSX). *(Taste: jangan revert editan tangan user di file ini — baca ulang sebelum edit.)*
- `src/pages/setting/pos/category/table/category.config.tsx`: tambah kolom `point_percentage` — judul **"Point %"**, tampil `${row?.point_percentage ?? 0}%`, diletakkan setelah kolom `name`.
- File `src/pages/setting/pos/category/components/categoryForm.tsx` **tidak diubah** (dead code, tidak di-import mana pun).

### B. Daftar Member — info point

- `src/services/types/reports.ts`: `MembershipReportRow` tambah `point: number`; `MembershipReportSummary` tambah `total_point: number`.
- `src/pages/report/membership/table/membership.config.tsx`:
  - tambah kolom `point` (judul **"Poin"**, `align: "right"`, `class: "text-right font-mono font-semibold"`, nilai `currencyFormat(row?.point ?? 0)` — mengikuti konvensi 1 point = Rp 1) **setelah** kolom `saldo`;
  - kolom `action` berubah dari `<ChevronRight>` menjadi `<Dropdown>` berisi 2 item: "Mutasi Saldo" dan "Mutasi Point" (perlu prop `onNavigate` baru dari page).
- `src/pages/report/membership/membership.tsx`:
  - `OverviewCards` tambah kartu **"Total Poin"** (`data.total_point`) → grid jadi 3 kolom;
  - `onRowClick` **tetap** ke `/report/membership/saldo-log?membership_id=`; dropdown item "Mutasi Point" → `/report/membership/point-log?membership_id=`.

### C. Mutasi Point — halaman baru

Folder baru `src/pages/report/membership/pointLog.tsx` + `table/point-log.config.tsx` + `table/point-log.filter.tsx`:

- Pola persis `saldoLog.tsx`: export **body reusable** `PointLogReport({ membershipId })` + default export page.
  - `membershipId` → masuk `filter` **dan** `lockedFilter` (supaya tidak hilang saat Clear), kolom Member disembunyikan (prop `hideMembership`), judul halaman jadi "Mutasi Point — Detail" + `backTo`; memakai nama tabel `report_point_log_detail`; tanpa member → `report_point_log`.
- Kartu ringkasan: Total Earn, Total Redeem, Total Revert, Total Revert Earn, Total Transaksi (dari `/report/point/log/summary`).
- Kolom tabel: Tanggal, Member (+ card_id), Outlet, Tipe, Reference Code, Nominal (bertanda, warna merah/hijau seperti kolom `nominal` saldo log), Kasir.
- Filter: Outlet (RemoteSelect `GET /outlet`), Rentang Tanggal (`DatePicker mode='range'`), Tipe (`earn`/`redeem`/`revert`/`revert_earn`), Search dari `Table.Tools`.
- `Table.Tools downloadable` → XLSX dari BE.

### D. Membership Settlement — halaman list

Folder baru `src/pages/report/membership/settlement/`:

- `index.tsx` — `Page.Header` (title "Settlement", subtitle "Rekap settlement HO ↔ outlet (topup & pemakaian saldo/point).") + 7 kartu ringkasan + `Table.Tools` (filter + download) + `Table.Render` + `Table.Pagination`.
- `table/settlement.config.tsx` — `url: "/report/membership-settlement"`, kolom (10 + aksi):
  Outlet (`row.outlet?.name`), Tanggal (`formatDate(date)`), Topup Cash, Topup Transfer, Payment Saldo, Payment Point, Payment Total, Net, Arah, Status, `action`.
  - Nilai uang pakai `currencyFormat`, rata kanan, font mono.
  - **Arah**: `ho_to_outlet` → "HO → Outlet", `outlet_to_ho` → "Outlet → HO", null/kosong → `-`. Ditampilkan sebagai **teks biasa** (bukan `Badge`).
  - **Status**: `Badge` — `pending` / `settled` (pakai `getStatusVariant`).
  - `action`: `Dropdown` (`MoreVertical`) — **selalu tampil** (tidak lagi kosong untuk non-superuser), item:
    - **Lihat Detail** — selalu ada (cuma navigasi, tidak digate aksi) → `/report/membership/settlement/:id`;
    - **Settle** — muncul bila `canSettle` **&&** `status !== "settled"` **&&** tanggal < hari ini;
    - **Unsettle** — muncul bila `canSettle` **&&** `status === "settled"`;
    - **Reconcile** — muncul bila `canSettle` **&&** `status !== "settled"`.
    - Tombol `Settle` untuk tanggal >= hari ini **tidak ditampilkan** (BE menolaknya) — diganti teks kecil "Belum bisa settle".
- `table/settlement.filter.tsx` — Outlet (RemoteSelect), Rentang Tanggal (BE hanya menerapkan filter bila `start_date` & `end_date` dua-duanya terisi), Status (`pending`/`settled`), Arah (`ho_to_outlet`/`outlet_to_ho`).
- **Klik baris tidak lagi navigasi** — `onRowClick` dilepas dari config; `onDetail` (item dropdown) yang membawa ke halaman detail, tanpa `location.state`.

### E. Membership Settlement — halaman detail

`src/pages/report/membership/settlement/detail.tsx` — route `/report/membership/settlement/:id`:

- **Satu-satunya sumber data: `GET /report/membership-settlement/{id}`** (show), dipanggil dengan `id` dari `useParams`. **Tidak ada** `location.state`, jadi refresh langsung di URL detail tetap menampilkan data.
- Selama `isLoading` tampil spinner; kalau response kosong (`!detail`) tampil pesan "Data settlement tidak ditemukan".
- **Dua section ditaruh bersebelahan** dalam satu grid (`grid-cols-1 lg:grid-cols-2 gap-6 items-start`): **Informasi Settlement di kiri**, **Ringkasan Settlement di kanan**.
- **Section "Ringkasan Settlement"** (bukan kartu lagi, tapi bergaya section yang sama dengan Informasi Settlement): Topup Cash, Topup Transfer, Payment Saldo, Payment Point, Payment Total, Net (bertanda, merah/hijau), dan **Total Item** (`items.length` — `total_data` tidak ada di response show).
- **Section "Informasi Settlement"** — `Badge` status di header section; arah transfer jadi **baris berlabel "Aksi"** (teks biasa `HO → Outlet` / `Outlet → HO`, `-` kalau kosong — **tanpa badge**) tepat di sebelah baris "Settled By". Isinya **layout kanan-kiri**: label di kiri, nilai di kanan, disusun **grid 2 kolom** (`grid-cols-1 md:grid-cols-2 gap-x-8`, baris `InfoRow` lokal). Field: Settled By, Aksi, Settled At, Transfer Reference, Transfer Note, Alasan Unsettle.
- **Tabel item dirender langsung dari array `items`** di response show (makanya `items` ditambahkan ke tipe `MembershipSettlementRow`). Tidak ada paginasi, search, maupun tombol download XLSX di tabel item lagi. Kolom: Tanggal, Tipe, Jenis (normal/reversal), Reference Code, Nominal.
- Tombol aksi di header halaman: Settle / Unsettle / Reconcile (kondisional & gated sama seperti list). Setelah aksi sukses (`onSuccess`) **detail di-refetch** dari `/{id}` — tidak ada lagi merge patch lokal maupun kompensasi tanggal.

### F. Modal aksi

- `Settle` — form: **Transfer Reference** (`required`) + **Transfer Note** (opsional, textarea). Submit → `POST /report/membership-settlement/{id}/settle`.
- `Unsettle` — form: **Alasan** (`required`, textarea). Submit → `POST /report/membership-settlement/{id}/unsettle`.
- `Reconcile` — modal konfirmasi (tanpa input) dengan penjelasan bahwa item akan disesuaikan ke ledger; submit → `POST /report/membership-settlement/{id}/reconcile`.
- Semua sukses → refetch tabel + summary; tampilkan toast/message dari response.

### G. Service, Types & Hooks

- `src/services/report/api.tsx` — endpoint baru:
  - `getPointLog` → `GET /report/point/log`; `getPointLogSummary` → `GET /report/point/log/summary`
  - `getMembershipSettlement` → `GET /report/membership-settlement`
  - `getMembershipSettlementSummary` → `GET /report/membership-settlement/summary`
  - `getMembershipSettlementDetail` → `GET /report/membership-settlement/{id}` (show — header + `items`)
  - `getMembershipSettlementItems` → `GET /report/membership-settlement/items`
  - `getMembershipSettlementItemsSummary` → `GET /report/membership-settlement/items/summary`
  - `settleMembershipSettlement` → `POST /report/membership-settlement/{id}/settle`
  - `unsettleMembershipSettlement` → `POST /report/membership-settlement/{id}/unsettle`
  - `reconcileMembershipSettlement` → `POST /report/membership-settlement/{id}/reconcile`
- `src/services/report/hooks.tsx` — daftarkan di `useMembershipReport()` lewat `additionalQueries` (`pointLog`, `pointLogSummary`, `settlement`, `settlementSummary`, `settlementDetail`, `settlementItems`, `settlementItemsSummary`) dan `customOperations` (`settle`, `unsettle`, `reconcile`).
- `src/services/types/reports.ts` — tambah:
  - `PointLogReportRow`, `PointLogReportSummary`
  - `MembershipSettlementRow` (+ `items?: MembershipSettlementItemRow[]`, hanya terisi dari endpoint show), `MembershipSettlementSummary`
  - `MembershipSettlementItemRow`, `MembershipSettlementItemSummary`
  - update `MembershipReportRow.point` + `MembershipReportSummary.total_point`
- Nilai point (`nominal`, `point`, `total_point`) ditampilkan dengan `currencyFormat` (1 point = Rp 1 per keputusan BE #1); tidak ada formatter angka-polos di `src/utils`.

### H. Menu, Permission & Route

- `src/utils/permissions.ts`:
  - `MENU.reportMembershipPointLog = "frontend.franchisor.report.membership-point-log"`
  - `MENU.reportMembershipSettlement = "frontend.franchisor.report.pos.membership-settlement"`
  - `ACTION.membershipSettlementSettle = "frontend.franchisor.report.pos.membership-settlement.settle"` — **satu-satunya slug aksi ber-namespace `frontend.*`** yang di-seed BE (slug aksi lain ber-namespace `svc-franchisor.*`); ditulis dengan komentar penjelas.
- `src/components/app/route-layout/AuthorizedLayout.tsx` — grup **Member** dapat 2 child baru (setelah "Mutasi Saldo"): **"Mutasi Point"** (`/report/membership/point-log`) dan **"Settlement"** (`/report/membership/settlement`), masing-masing dengan `permission`-nya. Grup Member sudah `mitraHidden: true`, jadi brand mitra otomatis tidak melihat keduanya.
- `src/routes/index.tsx`:
  - `/report/membership/point-log` → guard `[MENU.reportMembershipPointLog, MENU.reportMembership]` (OR, mengikuti pola `saldo-log` supaya drill-down dari Daftar Member tetap bisa dibuka user yang cuma punya slug Daftar Member);
  - `/report/membership/settlement` dan `/report/membership/settlement/:id` → guard `MENU.reportMembershipSettlement`.
- `src/utils/permission.ts` — tambah 3 entri di `ROUTE_BY_PERMISSION`.

---

## Konsumen endpoint yang perlu disesuaikan

| Konsumen | Endpoint | Perubahan |
|---|---|---|
| `membership.config.tsx` + `membership.tsx` | `GET /report/membership` | Tambah kolom Poin, kartu Total Poin, dropdown aksi 2 opsi |
| `MembershipReport({ outletId })` | `GET /report/membership` | BE **sudah tidak memakai** param `outlet_id` (keputusan BE #47 — report global). Param & `lockedFilter` lama **dibiarkan apa adanya** (tidak ada konsumen yang mengisi `outletId` saat ini; halaman Daftar Member standalone memanggil tanpa `outletId`). Dicatat sebagai hutang, bukan diubah di batch ini. |
| `table/pos/category/*` + kedua modal kategori | `GET`/`POST`/`PUT /pos/category` | Field baru `point_percentage` |
| `saldo-log.*` | `GET /report/saldo/log` | **Tidak berubah** (tetap jadi target row-click Daftar Member) |
| `settlement/detail.tsx` | `GET /report/membership-settlement/summary` + `GET /report/membership-settlement/items` | **Ditinggalkan** — detail pindah ke `GET /report/membership-settlement/{id}` (show), jadi `settlementSummary` sekarang cuma dipakai list & `settlementItems` tidak dipakai FE lagi |
| `pos/settlement.*` (Settlement POS) | `/report/franchise/settlement` | **Tidak berubah** — ini report berbeda, tidak digabung |

---

## File yang Dibuat / Diubah

### Dibuat

| File | Isi |
|---|---|
| `src/pages/report/membership/pointLog.tsx` | Halaman Mutasi Point (body reusable + page) |
| `src/pages/report/membership/table/point-log.config.tsx` | Kolom tabel Mutasi Point |
| `src/pages/report/membership/table/point-log.filter.tsx` | Filter Mutasi Point (outlet, tanggal, tipe) |
| `src/pages/report/membership/settlement/index.tsx` | Halaman list Settlement |
| `src/pages/report/membership/settlement/detail.tsx` | Halaman detail Settlement (fetch `/{id}`, section ringkasan + info, tabel item dari `items`, aksi) |
| `src/pages/report/membership/settlement/components/SettlementSummaryCards.tsx` | 7 kartu ringkasan header settlement — **dipakai list saja** (detail pakai section) |
| `src/pages/report/membership/settlement/components/SettlementActionModals.tsx` | Modal settle / unsettle / reconcile |
| `src/pages/report/membership/settlement/table/settlement.config.tsx` | Kolom tabel list Settlement |
| `src/pages/report/membership/settlement/table/settlement.filter.tsx` | Filter list Settlement |
| `src/pages/report/membership/settlement/table/settlement-item.config.tsx` | **Dead code** — kolom tabel item untuk tabel paginasi `/items` yang sudah tidak dipakai (item sekarang dari response show) |

### Diubah

| File | Perubahan |
|---|---|
| `src/services/types/pos.ts` | `POSCategoryBase.point_percentage` |
| `src/services/types/reports.ts` | Types point/settlement baru + `point`/`total_point` di tipe membership |
| `src/services/report/api.tsx` | 10 endpoint baru (`getMembershipSettlementDetail` ikut) |
| `src/services/report/hooks.tsx` | Register query + custom operation di `useMembershipReport` |
| `src/pages/setting/pos/category/index.tsx` | Input point % |
| `src/pages/setting/pos/category/table/category.config.tsx` | Kolom "Point %" |
| `src/pages/franchise/components/FranchiseCategoryTab.tsx` | Input point % |
| `src/pages/report/membership/membership.tsx` | kartu Total Poin + dropdown aksi |
| `src/pages/report/membership/table/membership.config.tsx` | Kolom Poin + kolom aksi dropdown |
| `src/utils/permissions.ts` | 2 slug menu + 1 slug aksi |
| `src/utils/permission.ts` | `ROUTE_BY_PERMISSION` |
| `src/components/app/route-layout/AuthorizedLayout.tsx` | 2 child menu di grup Member |
| `src/routes/index.tsx` | 3 route baru |

### Dihapus

Tidak ada.

---

## Verifikasi

1. `npm run build` (tsc + vite) dan `npm run lint` bersih.
2. **Category**: create & update kategori mengirim `point_percentage`; nilai 0–100 tersimpan dan tampil kembali saat edit; input di luar rentang memunculkan error `point_percentage.invalid`; kolom "Point %" tampil di tabel; modal di halaman Settings **dan** tab kategori Franchise dua-duanya berfungsi.
3. **Daftar Member**: kolom "Poin" terisi sesuai `point`; kartu "Total Poin" = `total_point`; dropdown baris membuka Mutasi Saldo **dan** Mutasi Point terfilter 1 member; row-click masih ke Mutasi Saldo; download XLSX tetap jalan.
4. **Mutasi Point**: list + ringkasan konsisten untuk filter yang sama; filter outlet/tanggal/tipe & search jalan; `nominal` bertanda tampil dengan warna benar; drill-down per member menyembunyikan kolom Member dan menampilkan `backTo`.
5. **Settlement list**: filter outlet/status/arah jalan (uji juga filter tanggal dengan hanya salah satu dari start/end → memang tidak terfilter, sesuai BE); kolom Arah tampil benar untuk kedua arah dan `-` saat null; search menyaring nama outlet; **klik baris tidak membuka apa pun**, detail dibuka dari item **"Lihat Detail"** di dropdown (dropdown tetap muncul meski user tidak punya aksi settle). **Catatan:** filter tanggal sedang off-by-one di BE (lihat Catatan) — verifikasi apakah hasilnya bergeser sehari.
6. **Settlement detail**: header + item dari `GET /report/membership-settlement/{id}`; **refresh langsung di URL detail menampilkan data** (tidak lagi "buka dari daftar"); section **Informasi Settlement** (kiri) & **Ringkasan Settlement** (kanan) tampil **berdampingan** sebagai section label–nilai (bukan kartu), label kiri / nilai kanan, grid 2 kolom saat lebar cukup — di layar sempit keduanya menumpuk vertikal; tabel item hanya berisi item milik settlement itu, tanpa paginasi/search/download. Section **Perbandingan Item vs Header sudah tidak ada**.
7. **Aksi**: `settle` (form) berhasil → status jadi `settled`, tombol berubah jadi Unsettle; `settle` untuk tanggal hari ini **tidak tersedia**; `unsettle` (alasan wajib) mengembalikan ke `pending`; `reconcile` mengubah item + header sesuai ledger — semuanya dengan **refetch `/{id}`** (bukan patch lokal), jadi nilai header & daftar item selalu dari BE.
8. **Gating**: login superuser + punya slug `.settle` → tombol muncul; login non-superuser yang punya slug `.settle` → tombol **tidak muncul**; tanpa slug `.settle` → tidak muncul.
9. **Menu**: grup Member menampilkan 4 item; brand bertipe `mitra` tidak melihat grup Member sama sekali; non-superuser tanpa slug terkait tidak melihat menu & tidak bisa membuka route langsung (`PermissionGuard`).
10. **Regresi**: Mutasi Saldo, Settlement POS/Mitra/B2B, dan seluruh report lain tidak berubah perilakunya.

---

## Catatan / Risiko

- **Endpoint show akhirnya tersedia** — halaman detail sekarang sepenuhnya dari `GET /report/membership-settlement/{id}`; `location.state` dan kompensasi tanggal sudah dibuang, sehingga refresh langsung di URL detail tetap menampilkan data. Batasannya: response show **tidak** membawa `total_data` (cuma header + `items`), jadi di section ringkasan detail labelnya **"Total Item"** dan nilainya `items.length`.
- **🐞 Filter tanggal `/report/membership-settlement` off-by-one (temuan BE).** Kolom `date` bertipe `date` (bukan timestamp), tapi handler menggeser WIB→UTC dan membandingkan dengan format `YYYY-MM-DD`: `date >= (start_date − 7 jam)` dan `date < (end_date + 1 hari − 7 jam)`. Rentang efektifnya jadi **`[start_date − 1 hari, end_date)`** — mis. `start_date = end_date = 2026-09-15` mengembalikan baris **2026-09-14**, bukan 2026-09-15. Kode: `usecase/membership_settlement.go:276-282` (`Get`) dan `:333-339` (`GetSummary`). Ini masih memengaruhi **filter tanggal di list** (data bergeser sehari). FE mengirim `YYYY-MM-DD` apa adanya (sesuai kontrak) — jadi **kolom `date` sebaiknya dibandingkan sebagai tanggal tanpa pergeseran**. Halaman detail sudah tidak terpengaruh karena tidak lagi memakai `/summary`.
- **`SettlementActionModals` masih mengirim `patch` ke `onSuccess`** (status + kolom audit untuk `settle`/`unsettle`, row hasil reconcile). Setelah detail pindah ke refetch `/{id}`, **kedua caller tidak lagi memakai patch itu** (list `Table.boot()`, detail refetch) — mekanisme patch-nya jadi tidak berguna dan bisa disederhanakan kalau mau.
- **Filter `cashier_id` belum dipakai** di Mutasi Point karena FE belum punya sumber daftar kasir. Kalau filter kasir diinginkan, perlu sumber data kasir dulu (endpoint list kasir belum ada di FE).
- **`GET /report/membership-settlement/items` dan `/items/summary` tidak dipakai FE lagi** — tabel item yang dulu memaginasi `/items` kini dirender dari array `items` milik response show, dan section pembanding sudah dihapus. Binding-nya (`getMembershipSettlementItems`/`getMembershipSettlementItemsSummary` di `report/api.tsx` + `settlementItems`/`settlementItemsSummary` di `report/hooks.tsx`) sengaja ditinggal; `table/settlement-item.config.tsx` juga sudah jadi dead code. Semuanya bisa dihapus kalau memang tidak akan dipakai.
- **`net_amount` di BE** = `payment_saldo + payment_point − topup_cash` (**`topup_transfer` tidak dikurangkan**, sesuai keputusan BE #15: transfer langsung ke HO). FE hanya menampilkan nilai apa adanya, tidak menghitung ulang.
- **`transfer_direction` bisa null** saat `net_amount = 0` (keputusan BE #32) — kolom Arah harus tahan nilai kosong.
- **Slug aksi menyimpang dari konvensi** (`frontend.*` alih-alih `svc-franchisor.*.manage`) karena seed BE memang begitu; jangan "diperbaiki" di FE tanpa mengubah BE.
- **Time zone**: filter tanggal settlement dikonversi BE dari WIB ke UTC; FE cukup mengirim `YYYY-MM-DD` seperti report lain.
- **Doc BE menyebut endpoint `GET /report/membership-settlement/reconciliation`** yang **tidak ada** di kode, dan status doc `membership_point.md` masih *Planned* padahal kodenya sudah ada — doc BE lag, bukan acuan kontrak.
- **`categoryForm.tsx`** masih dead code (tidak di-import). Tidak disentuh di batch ini.
- **Grup Member saat ini `mitraHidden: true`** — keputusan menaruh kedua report baru di grup Member berarti brand `mitra` juga tidak akan melihatnya. Kalau HO ingin report ini tetap terlihat oleh brand mitra, flag itu perlu ditinjau ulang.
