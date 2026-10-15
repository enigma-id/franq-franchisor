# Frontend Franchisor — Daftar Member: "Lihat Detail" + Tab Mutasi Saldo & Mutasi Point

**Date:** 2026-10-15
**Status:** Implemented
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend ref:** `franq/backend` — `franchisor/src/handler/rest/report/membership/handler.go` & `request_get.go`, `src/services/franchise.go` (`GetMembershipDetail`)
**Doc terkait:** `laporan-outlet-tab-mutasi-saldo-point.md` (tab Mutasi Saldo/Point di detail Laporan Outlet)

---

## Problem

1. Di halaman **Daftar Member** (`/report/membership`), kolom aksi hanya punya dropdown 2 item (**Mutasi Saldo** / **Mutasi Point**) yang masing-masing navigate ke halaman **standalone** (`/report/membership/saldo-log?membership_id=…` / `point-log?membership_id=…`). Tidak ada halaman **detail member**.
2. Belum ada tampilan "information membership" terpusat — info profil member + mutasi saldo & point dalam satu halaman.

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Aksi baris | Dropdown 2 item diganti **1 item "Lihat Detail"** → buka halaman detail member. **Baris tabel tidak diklik** (hanya lewat menu aksi). |
| 2 | Halaman detail | Route baru **`/report/membership/:membershipId`**; berisi **Information Member** + 2 tab: **Mutasi Saldo** & **Mutasi Point** (default Mutasi Saldo). |
| 3 | Sumber info member | Dari endpoint baru BE **`GET /report/membership/{id}`** (bukan dari baris tabel / navigation state). |
| 4 | Isi tab | **Reuse** komponen `SaldoLogReport` & `PointLogReport` dengan `membership_id` dari URL. |
| 5 | Urutan info member | Baris 1: **Nama / Saldo / Tanggal Daftar**; baris 2: **Reff Code / Poin / Transaksi Terakhir**; baris 3: **Card ID** (grid 3 kolom). |
| 6 | Wording | Kolom tabel **&** label detail **"Reff Code" → "Phone Number"**; subtitle aksi jadi **"Mutasi saldo & point"** (tanpa "member"). |
| 7 | Sidebar | Grup Report > **Member** diringkas jadi **satu item "Member"** (tanpa sub-menu). |
| 8 | Alur | Implement dulu, markdown menyusul. |

---

## Konteks (fakta yang diverifikasi dari backend `~/Workspaces/franq`)

- **`GET /report/membership/{id}`** (endpoint baru) → satu row `ReportMembership`:
  `membership_id, date, card_id, name, reff_code, saldo, point, last_transaction`.
- Pendaftaran route BE: `/{id}` **wajib didaftarkan setelah `/summary`** — router `gorilla/mux` first-match-wins, kalau `{id}` didaftarkan duluan maka `GET /summary` akan tertangkap sebagai `id = "summary"`.
- `GET /report/membership` (list) & `/summary` tidak berubah; list tetap membawa `membership_id` yang dipakai untuk drill-down.
- Saldo/Point log tetap seperti batch sebelumnya: `/report/saldo/log` (`status` kosong/completed = completed saja) & `/report/point/log` (tanpa `status`), keduanya menerima `periode`/`start_date`/`end_date`/`membership_id`.

---

## Perubahan per Area

### A. Service report — `services/report/api.tsx` & `hooks.tsx`

- `api.tsx`: endpoint baru `getMembershipDetail` → `GET /report/membership/${id}`; export `useLazyGetMembershipDetailQuery`.
- `hooks.tsx`: daftarkan `membershipDetail: useLazyGetMembershipDetailQuery` di `useMembershipReport` (otomatis menghasilkan `membershipDetail` + `membershipDetailResult`).

### B. Halaman detail member (baru) — `pages/report/membership/memberDetail.tsx`

- Route param `:membershipId`; `useEffect` fetch `membershipDetail(membershipId)`.
- **Page.Header**: title `Member — {name}` (fallback "Detail Member"), subtitle `Card ID: {card_id}`.
- **Information Member** (kartu putih): urutan sesuai keputusan #5, nilai kosong fallback `"-"`; Saldo & Poin pakai `currencyFormat` (mono), tanggal pakai `formatDate`/`formatDateTime`.
- **Bar tab** responsif (`flex flex-wrap`, gaya sama dengan detail Laporan Outlet); konten tab reuse `SaldoLogReport`/`PointLogReport` dengan `membershipId` (state tabel terpisah: `report_saldo_log_detail` / `report_point_log_detail`).

### C. Kolom aksi Daftar Member — `table/membership.config.tsx`

- Ganti prop `onNavigate(row, "saldo" | "point")` → **`onDetail(row)`**.
- Dropdown diisi **1 item "Lihat Detail"** (ikon `Eye`, subtitle "Mutasi saldo & point"); ikon `Wallet`/`Gift` yang lama dibuang.
- Kolom `reff_code`: title **"Reff Code" → "Phone Number"** (nilai tetap dari `reff_code`).

### D. Report body — `pages/report/membership/membership.tsx`

- `onDetail` → `navigate(\`/report/membership/${row.membership_id}\`)` (sebelumnya pecah ke `/saldo-log` / `/point-log` + query `membership_id`).

### E. Route — `routes/index.tsx`

- Import `MemberDetailPage`; route baru `/report/membership/:membershipId` (guard `MENU.reportMembership`), **didaftarkan setelah** route statis `saldo-log`/`point-log`/`settlement`(/:id) supaya segment statis tetap menang.

### F. Sidebar — `components/app/route-layout/AuthorizedLayout.tsx`

- Grup Report > **Member** (children: Daftar Member, Mutasi Saldo, Mutasi Point, Settlement) → **item tunggal "Member"** ke `/report/membership`, `mitraHidden` tetap.

### G. Wording lain

- Halaman detail: label **"Reff Code" → "Phone Number"**.

---

## File yang Diubah / Dibuat / Dihapus

| File | Perubahan |
|---|---|
| `src/services/report/api.tsx` | Endpoint `getMembershipDetail` (`GET /report/membership/{id}`) + export |
| `src/services/report/hooks.tsx` | `membershipDetail` di `useMembershipReport` |
| `src/pages/report/membership/memberDetail.tsx` | **Baru** — halaman detail member (info + 2 tab) |
| `src/pages/report/membership/table/membership.config.tsx` | Aksi → "Lihat Detail" (`onDetail`); `reff_code` title → "Phone Number" |
| `src/pages/report/membership/membership.tsx` | `onDetail` → navigate ke `/report/membership/:membershipId` |
| `src/routes/index.tsx` | Route `/report/membership/:membershipId` + import |
| `src/components/app/route-layout/AuthorizedLayout.tsx` | Report > Member jadi item tunggal |

**Dibuat:** `src/pages/report/membership/memberDetail.tsx`, `docs/feature/daftar-member-detail-mutasi-saldo-point.md` (dokumen ini).
**Dihapus:** tidak ada (route lama `/saldo-log`, `/point-log`, `/settlement` tetap ada).

---

## Verifikasi

1. `npx tsc -b` bersih; `npx eslint` file berubah **0 error**.
2. **Daftar Member**: kolom aksi berisi 1 item **"Lihat Detail"** → membuka `/report/membership/:membershipId`. Kolom **"Phone Number"** tampil (nilai `reff_code`).
3. **Detail Member**: kartu **Information Member** terisi dari `GET /report/membership/{id}` dengan urutan: Nama/Saldo/Tanggal Daftar → Reff Code/Poin/Transaksi Terakhir → Card ID. Dua tab (Mutasi Saldo default, Mutasi Point) jalan; request log memakai `membership_id` dari URL.
4. **Refresh langsung** di URL detail tetap jalan (info di-fetch dari endpoint, bukan dari state).
5. **Sidebar**: Report > Member jadi satu item; sub-menu lama hilang.
6. Route standalone `/report/membership/saldo-log`, `/point-log`, `/settlement` masih bisa diakses via URL.

---

## Catatan / Risiko

1. **Endpoint detail ditambahkan manual di BE.** FE mengandalkan `GET /report/membership/{id}`; kalau BE belum ter-deploy, kartu Information Member gagal terisi.
2. **Urutan route.** `:membershipId` harus tetap didaftarkan setelah route statis (FE React Router v6 memang memprioritaskan segment statis, tapi urutan eksplisit menjaga konsistensi dengan catatan BE).
3. **Sub-menu Member hilang dari sidebar.** Mutasi Saldo/Point standalone & Settlement tidak punya entri menu lagi (akses via URL / dari halaman terkait) — sesuai keputusan #7.
4. **Filter di tab** memakai perilaku drill-down yang sudah ada (select Outlet + Tipe/Status + Rentang Tanggal) karena memakai `membershipId` (bukan lock outlet).
5. **Label "Poin"/"Transaksi Terakhir"** dipertahankan (bukan "Point"/"Tanggal Last Transaksi") agar konsisten dengan kolom tabel Daftar Member.
