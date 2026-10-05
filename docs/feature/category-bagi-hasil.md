# Bagi Hasil (`is_bagi_hasil`) — Franchisor

> **Revisi (2026-10-07):** BE membalik & me-rename flag kategori — `is_bagi_hasil` → **`is_non_bagi_hasil`**
> (true = BUKAN bagi hasil, mis. "Koperasi"), dan key summary `sales.subtotal_nett_non_bagi_hasil` →
> **`subtotal_nett_bagi_hasil`**. Flag brand tetap `is_bagi_hasil`. FE ikut disesuaikan.

## Ringkas

Flag bagi hasil (revenue share) dikelola di franchisor pada **dua level** dengan polaritas berbeda:

1. **Kategori menu POS** — `is_non_bagi_hasil` (true = kategori **BUKAN** bagi hasil, mis. "Koperasi").
2. **Brand / Franchise** — `is_bagi_hasil` (true = brand **melakukan** bagi hasil).

Dipakai BE untuk menghitung `subtotal_nett_bagi_hasil` di sales session summary (= Σ nett item
kategori bagi hasil); perhitungan hanya jalan untuk brand yang di-flag bagi hasil.

Scope dokumen: **franq-franchisor** (form + tabel). Backend tidak diubah.

## Definisi

| Level | Field | Arti `true` | Endpoint | Entity (franchisor) | Di-sync BE ke |
|---|---|---|---|---|---|
| Kategori | `is_non_bagi_hasil` | kategori BUKAN bagi hasil | `POST/PUT /pos/category` | `menu_category.is_non_bagi_hasil` | `category.is_non_bagi_hasil` |
| Brand | `is_bagi_hasil` | brand melakukan bagi hasil | `POST/PUT /franchisor` | `franchisor.is_bagi_hasil` | `brand.is_bagi_hasil` |

- POS: brand non-bagi-hasil → `sales.subtotal_nett_bagi_hasil` = **0**; kalau bagi hasil →
  Σ `category_solds[].total_nett` yang `is_non_bagi_hasil = false`.

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Form kategori | Dua-duanya: modal Settings + modal tab Franchise |
| 2 | Kontrol kategori | Checkbox "Non Bagi Hasil" (ikut BE apa adanya) |
| 3 | Tabel kategori | Kolom "Non Bagi Hasil": icon checklist / `-` |
| 4 | Form brand | Checkbox "Bagi Hasil" di drawer Tambah & Edit Franchise |
| 5 | Tabel brand | Kolom "Bagi Hasil": icon checklist / `-` |
| 6 | Subtotal detail sesi | Label "Subtotal Nett Sales" (key `subtotal_nett_bagi_hasil`) |

## Perubahan per Area

### Level Kategori

- **Form** (Settings & tab Franchise): checkbox `is_non_bagi_hasil`; ikut ter-prefill saat edit
  dan ter-reset saat modal ditutup.
- **Tabel**: kolom read-only "Non Bagi Hasil" — icon checklist bila true, `-` bila false.

### Level Brand / Franchise

- **Form** (`FranchiseForm`, drawer Tambah & Edit): checkbox "Bagi Hasil" (`is_bagi_hasil`);
  prefill dari `initialData` saat edit.
- **Tabel**: kolom read-only "Bagi Hasil" — icon checklist bila true, `-` bila false.

### Detail Sesi

- Kartu Sales Info menampilkan "Subtotal Nett Sales" dari `summary.sales.subtotal_nett_bagi_hasil`.

## File yang Berubah

| File | Perubahan |
|---|---|
| `src/services/types/pos.ts` | `is_non_bagi_hasil?` di `POSCategoryBase` |
| `src/pages/setting/pos/category/index.tsx` | field `is_non_bagi_hasil` + checkbox "Non Bagi Hasil" |
| `src/pages/franchise/components/FranchiseCategoryTab.tsx` | idem |
| `src/pages/setting/pos/category/table/category.config.tsx` | kolom "Non Bagi Hasil" |
| `src/services/types/franchisor.ts` | `is_bagi_hasil` di `FranchisorDetail` + Create + Update |
| `src/pages/franchise/components/FranchiseForm.tsx` | checkbox "Bagi Hasil" + payload |
| `src/pages/franchise/table/franchise.config.tsx` | kolom "Bagi Hasil" |
| `src/services/types/reports.ts` | `subtotal_nett_bagi_hasil` + `SessionCategorySold.is_non_bagi_hasil` |
| `src/pages/report/outlet/sessionDetail.tsx` | baris "Subtotal Nett Sales" (key `subtotal_nett_bagi_hasil`) |

## Verifikasi

1. `npm run lint` (file yang diubah) → 0 error.
2. **Kategori:** `/setting/pos/category` → Tambah Kategori → centang "Non Bagi Hasil"
   (mis. Koperasi) → Simpan → kolom "Non Bagi Hasil" menampilkan icon; edit → tetap tercentang.
   Ulangi di detail Franchise → tab Kategori (payload bawa `franchisor_id`).
3. **Brand:** buka Franchise → Tambah / Edit → centang "Bagi Hasil" → Simpan → kolom
   "Bagi Hasil" menampilkan icon.
4. **Detail sesi:** buka detail sesi outlet → cek baris "Subtotal Nett Sales"
   (`summary.sales.subtotal_nett_bagi_hasil`).
5. Pastikan payload kirim `is_non_bagi_hasil` (kategori) & `is_bagi_hasil` (brand) — cek Network tab.

## Catatan

- Polaritas berbeda antar level: kategori = flag **NON** bagi hasil, brand = flag bagi hasil.
- `total_sales`/`grand_total` dan konsumen report lama tidak berubah (field aditif).
- BE: rename via migrasi corrective `20261007000000_menu_category_non_bagi_hasil` &
  `20261007000000_non_bagi_hasil_rename`; flag brand tetap `is_bagi_hasil`.
