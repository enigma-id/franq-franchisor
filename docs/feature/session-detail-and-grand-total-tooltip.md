# Detail Sesi & Tooltip Grand Total — Franchisor

## Ringkas

Tab "Sesi" di Detail Rekap Outlet dapat dua hal:

1. Drill-down **detail per-sesi** (dari baris tabel) — session + outlet + cashier + summary + orders.
2. **Tooltip** di kolom "Grand Total" berisi breakdown `payment_methods`.

## Sumber Data (BE sudah ada)

- `GET /report/franchise/session/{id}` → session + `summary{sales,payment_methods,category_solds,topups,cash}` + `orders[]`.
- `GET /report/franchise/session` → tiap item tambah `payment_methods: [{id,name,total_paid}]`.
- Doc BE: `franq/docs/feature/franchisor-session-detail.md`.

## Keputusan

| # | Topik | Keputusan |
|---|---|---|
| 1 | Template halaman | Tiru `franq-franchisee/src/pages/sales/SessionDetail.tsx` |
| 2 | Rute detail | `/report/outlet/:outletId/session/:sessionId` |
| 3 | Trigger tooltip | Nilai Grand Total langsung — pakai komponen `PayTooltip` (gaya list session `franq-franchisee`), bukan komponen `Tooltip` generik |
| 4 | Baris order | Read-only (franchisor tanpa detail POS order) |

## Perubahan per Area

### Tabel Sesi

- Kolom "Grand Total" di-wrap `PayTooltip` (`payment_methods`) — panel gelap dengan header "Pembayaran" + breakdown metode & nominal, muncul saat hover. Komponen: `src/pages/report/outlet/components/PayTooltip.tsx`. Kolom aksi chevron → detail sesi.

### Halaman Detail Sesi (baru)

- 4 card: Session Info, Sales Info, Pembayaran, Kategori + tabel Transaksi.

## File yang Berubah / Dibuat

| File | Status | Perubahan |
|---|---|---|
| `src/services/types/reports.ts` | ubah | `payment_methods` di `ReportSessionRow` + tipe `ReportSessionDetail` dkk |
| `src/services/report/api.tsx` | ubah | `getSessionDetail` |
| `src/services/report/hooks.tsx` | ubah | wire `sessionDetail` |
| `src/pages/report/outlet/sessionDetail.tsx` | baru | halaman detail sesi |
| `src/pages/report/outlet/table/session.config.tsx` | ubah | `PayTooltip` di kolom GT + kolom aksi |
| `src/pages/report/outlet/components/PayTooltip.tsx` | baru | komponen tooltip breakdown pembayaran |
| `src/pages/report/outlet/tabs/SessionTab.tsx` | ubah | `onDetail` navigate |
| `src/routes/index.tsx` | ubah | route detail |

## Verifikasi

1. `npm run lint` (file yang diubah) → 0 error.
2. Tab Sesi → klik chevron baris → detail sesi tampil (info, sales, pembayaran, kategori, transaksi).
3. Hover angka Grand Total → tooltip muncul dengan breakdown metode + nominal; samakan dengan `GET /report/franchise/session`.
4. Back dari detail → balik ke `/report/outlet/:outletId`.
5. Akses sesi brand lain → 404 / "Sesi tidak ditemukan".

## Catatan

- `finished_at`/`paid_at` sesi `opened` = zero-time ("0001-...") → ditangani `isOngoing()`.
- Baris order transaksi read-only (franchisor belum punya detail POS order).
