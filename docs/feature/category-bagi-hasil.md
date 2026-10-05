# Kategori Bagi Hasil (`is_bagi_hasil`) — Franchisor

## Ringkas

Kategori menu POS bisa ditandai sebagai **bagi hasil** (revenue share) lewat checkbox
`is_bagi_hasil` di form kategori. Flag dikirim ke BE lewat `POST /pos/category` dan
`PUT /pos/category/{id}`, lalu di-sync BE ke `category.is_bagi_hasil` (franchise/POS)
untuk memisahkan `subtotal_nett_non_bagi_hasil` di sales session summary.

Scope: **franq-franchisor** (form + tabel kategori). Backend tidak diubah.

## Definisi

- `is_bagi_hasil` (boolean, default `false`) — ditandai per kategori.
- Dikirim di payload create/update kategori; dibaca dari response `POSCategoryDetail`.

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Form | Dua-duanya: modal Settings + modal tab Franchise |
| 2 | Kontrol | Checkbox "Kategori Bagi Hasil" |
| 3 | Tabel | Kolom "Bagi Hasil": icon checklist / `-` |
| 4 | Subtotal Nett Sales | Tidak di franchisor (surface sesi ada di POS) |

## Perubahan per Area

### Form Kategori (Settings & tab Franchise)

Field `is_bagi_hasil` ditambahkan sebagai checkbox; ikut ter-prefill saat edit dan
ter-reset saat modal ditutup.

### Tabel Kategori

Kolom read-only "Bagi Hasil" menampilkan icon checklist bila true, `-` bila false.

## File yang Berubah

| File | Perubahan |
|---|---|
| `src/services/types/pos.ts` | tambah `is_bagi_hasil?` di `POSCategoryBase` |
| `src/pages/setting/pos/category/index.tsx` | state, prefill, reset, payload, checkbox |
| `src/pages/franchise/components/FranchiseCategoryTab.tsx` | state, prefill, reset, payload, checkbox |
| `src/pages/setting/pos/category/table/category.config.tsx` | kolom "Bagi Hasil" |

## Verifikasi

1. `npm run lint` → 0 error; `npm run build` sukses.
2. Buka `/setting/pos/category` → Tambah Kategori → centang "Kategori Bagi Hasil" → Simpan →
   kolom "Bagi Hasil" menampilkan icon checklist. Edit lagi → checkbox tetap tercentang.
3. Buka detail Franchise → tab Kategori → lakukan hal yang sama (payload bawa `franchisor_id`).
4. Pastikan `PUT /pos/category/{id}` mengirim `is_bagi_hasil` (cek Network tab).

## Catatan

- `total_sales`/`grand_total` dan konsumen report lama tidak berubah (field aditif).
- Perhitungan `subtotal_nett_non_bagi_hasil` & tampilan di POS di luar scope repo ini.
