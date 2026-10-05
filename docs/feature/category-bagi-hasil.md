# Bagi Hasil (`is_bagi_hasil`) — Franchisor

## Ringkas

Flag **bagi hasil** (revenue share) `is_bagi_hasil` dikelola di franchisor pada **dua level**:

1. **Kategori menu POS** — kategori ditandai bagi hasil.
2. **Brand / Franchise** — brand ditandai bagi hasil.

Keduanya dipakai BE untuk memisahkan `subtotal_nett_non_bagi_hasil` di sales session summary:
perhitungan hanya jalan untuk brand yang di-flag bagi hasil, dan kategori bagi hasil
dikeluarkan dari subtotal.

Scope dokumen: **franq-franchisor** (form + tabel). Backend tidak diubah.

## Definisi

- `is_bagi_hasil` (boolean, default `false`).

| Level | Endpoint | Entity (franchisor) | Di-sync BE ke |
|---|---|---|---|
| Kategori | `POST/PUT /pos/category` | `menu_category.is_bagi_hasil` | `category.is_bagi_hasil` (franchise/POS) |
| Brand | `POST/PUT /franchisor` | `franchisor.is_bagi_hasil` | `brand.is_bagi_hasil` (franchise/POS) |

- POS memakai `brand.is_bagi_hasil` untuk menggating perhitungan `subtotal_nett_non_bagi_hasil`
  (brand non-bagi-hasil → 0), dan `category.is_bagi_hasil` untuk memilih item yang dikeluarkan.

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Form kategori | Dua-duanya: modal Settings + modal tab Franchise |
| 2 | Kontrol kategori | Checkbox "Kategori Bagi Hasil" |
| 3 | Tabel kategori | Kolom "Bagi Hasil": icon checklist / `-` |
| 4 | Subtotal Nett Sales | Tidak di franchisor (surface sesi ada di POS) |
| 5 | Form brand | Checkbox "Bagi Hasil" di drawer Tambah & Edit Franchise |
| 6 | Tabel brand | Kolom "Bagi Hasil": icon checklist / `-` |

## Perubahan per Area

### Level Kategori

- **Form** (Settings & tab Franchise): field `is_bagi_hasil` sebagai checkbox; ikut
  ter-prefill saat edit dan ter-reset saat modal ditutup.
- **Tabel**: kolom read-only "Bagi Hasil" — icon checklist bila true, `-` bila false.

### Level Brand / Franchise

- **Form** (`FranchiseForm`, dipakai drawer Tambah & Edit Franchise): checkbox "Bagi Hasil";
  prefill dari `initialData` saat edit; dikirim di payload create & update.
- **Tabel**: kolom read-only "Bagi Hasil" — icon checklist bila true, `-` bila false.

## File yang Berubah

| File | Perubahan |
|---|---|
| `src/services/types/pos.ts` | tambah `is_bagi_hasil?` di `POSCategoryBase` |
| `src/pages/setting/pos/category/index.tsx` | state, prefill, reset, payload, checkbox |
| `src/pages/franchise/components/FranchiseCategoryTab.tsx` | state, prefill, reset, payload, checkbox |
| `src/pages/setting/pos/category/table/category.config.tsx` | kolom "Bagi Hasil" |
| `src/services/types/franchisor.ts` | `is_bagi_hasil` di `FranchisorDetail` + Create + Update |
| `src/pages/franchise/components/FranchiseForm.tsx` | state, prefill, payload, checkbox |
| `src/pages/franchise/table/franchise.config.tsx` | kolom "Bagi Hasil" |

## Verifikasi

1. `npm run lint` (file yang diubah) → 0 error.
2. **Kategori:** `/setting/pos/category` → Tambah Kategori → centang "Kategori Bagi Hasil" →
   Simpan → kolom menampilkan icon checklist; edit → tetap tercentang. Ulangi di
   detail Franchise → tab Kategori (payload bawa `franchisor_id`).
3. **Brand:** buka Franchise → Tambah / Edit Franchise → centang "Bagi Hasil" → Simpan →
   tabel daftar menampilkan icon checklist; edit lagi → checkbox tetap tercentang.
4. Pastikan `PUT /pos/category/{id}` dan `PUT /franchisor/{id}` mengirim `is_bagi_hasil`
   (cek Network tab).

## Catatan

- `total_sales`/`grand_total` dan konsumen report lama tidak berubah (field aditif).
- Perhitungan `subtotal_nett_non_bagi_hasil` & tampilan di POS di luar scope repo ini.
- BE: migrasi `menu_category_bagi_hasil` + `franchisor_bagi_hasil` (franchisor) dan
  `category_bagi_hasil` (franchise) — backend urusan BE.
