# Specification: Page-API Alignment

**Task ID:** page-api-alignment
**Created:** 2026-06-06
**Status:** Ready for Planning
**Version:** 1.0

## 1. Problem Statement
- **The Problem:** UI saat ini masih menggunakan struktur data lama (legacy) yang tidak sesuai dengan API service layer baru (RTK Query). Hal ini menyebabkan request gagal, data tidak tersimpan dengan benar, dan inkonsistensi antara apa yang dikirim oleh form dan apa yang diharapkan oleh backend. Selain itu, terdapat modul-modul baru di API yang belum memiliki antarmuka di frontend.
- **Current Situation:**
    - Form Purchase Order mengirim `item_id` (number) sedangkan API mengharapkan `catalog_id` (string).
    - Modul Production, Demand, dan Sales Return hanya ada di level service API.
    - Penempatan modul tidak sesuai (Demand terselip di dalam Purchase).
    - Tipe data TypeScript di UI seringkali menggunakan `any` atau interface lama.
- **Desired Outcome:** Seluruh halaman UI tersinkronisasi 100% dengan API layer baru, memiliki validasi payload yang benar, dan organisasi modul yang lebih logis sesuai domain bisnis (Operations, Supply Chain, Sales, Settings).

## 2. User Personas
### Primary User: Operational Admin
- **Who:** Staf kantor pusat atau gudang yang mengelola transaksi harian.
- **Goals:** Mencatat pembelian, mengelola produksi, memproses pesanan penjualan, dan melihat laporan secara akurat.
- **Pain points:** Error saat simpan data karena mismatch field, tidak bisa mengakses fitur baru (Produksi/Retur) karena halaman tidak ada.

## 3. Functional Requirements

### FR-1: Rebuild Purchase Order Form
**Description:** Memperbarui form Purchase Order agar sesuai dengan `PurchaseOrderRequest`.

**User Story:**
> Sebagai Admin, saya ingin membuat Purchase Order dengan field yang benar agar transaksi tersimpan valid di sistem.

**Acceptance Criteria:**
- [ ] Field `supplier_id` dikirim sebagai `string`.
- [ ] Item baris menggunakan `catalog_id` (bukan `item_id`).
- [ ] Field `shipping_charge` diubah menjadi `shipping_fee`.
- [ ] Menambahkan field `date` (format YYYY-MM-DD), `discount`, dan `tax` di level header.
- [ ] Menambahkan pemilihan `warehouse_id` (opsional jika API mendukung).

**Priority:** Must Have

### FR-2: New Production Module
**Description:** Membuat halaman CRUD untuk Manajemen Produksi.

**User Story:**
> Sebagai Manajer Produksi, saya ingin membuat rencana produksi (Production Plan) dan memantau status penyelesaian tiap item.

**Acceptance Criteria:**
- [ ] Halaman List: Menampilkan daftar Production Plan dengan status (Draft, Published, Completed).
- [ ] Halaman Create: Form untuk input `outlet_id`, `production_date`, dan list items (`catalog_id`, `quantity`).
- [ ] Halaman Detail: Menampilkan detail plan dan tombol aksi (Publish, Complete, Delete).
- [ ] Update Item: Kemampuan untuk menandai item produksi tertentu sebagai 'Complete'.

**Priority:** Must Have

### FR-3: Standalone Demand Module
**Description:** Memindahkan dan mengembangkan modul Demand.

**User Story:**
> Sebagai Staf Gudang, saya ingin melihat ringkasan kebutuhan barang berdasarkan rencana produksi dan stok saat ini.

**Acceptance Criteria:**
- [ ] Menu Demand dipindahkan dari navigasi Purchase ke navigasi Operations.
- [ ] Halaman Production Demand: Filter berdasarkan `production_date` dan `outlet_id`.
- [ ] Halaman Item Demand: Menampilkan kebutuhan item secara keseluruhan.

**Priority:** Must Have

### FR-4: Sales Order & Return Alignment
**Description:** Update Sales Order dan tambahkan UI Sales Return.

**User Story:**
> Sebagai Admin Sales, saya ingin memproses pesanan penjualan dan menangani retur barang jika terjadi kerusakan.

**Acceptance Criteria:**
- [ ] Update Sales Order form agar menyertakan `payment_method_id` dan `pos_channel_id`.
- [ ] Halaman Sales Return List: Menampilkan histori retur.
- [ ] Halaman Sales Return Detail: Menampilkan detail retur dan tombol Approve.

**Priority:** Must Have

### FR-5: Inventory & POS Payload Alignment
**Description:** Sinkronisasi payload untuk Item, Katalog, dan Menu POS.

**Acceptance Criteria:**
- [ ] Inventory Item: Support field `packaging`, `size`, `is_batch_tracking`, `picking_strategy`.
- [ ] Inventory Catalog: Support bundle items (`is_bundle`).
- [ ] POS Menu: Support `channel_prices`, `ingredients` (BOM), dan `addon_groups`.

**Priority:** Should Have

### FR-6: New Settings Pages (Payment & Member)
**Description:** Implementasi UI untuk Payment Method dan Topup Bonus.

**Acceptance Criteria:**
- [ ] Halaman Payment Method: CRUD dan toggle Activate/Deactivate.
- [ ] Halaman Topup Bonus: CRUD dan toggle Activate/Deactivate.

**Priority:** Medium

## 4. Non-Functional Requirements
- **Type Safety:** Wajib menggunakan interface dari `src/services/types/` (Dilarang menggunakan `any`).
- **Consistency:** Mengikuti pattern `createCrudHook` untuk semua data fetching.
- **UI/UX:** Menggunakan komponen `RemoteSelect` untuk lookup data dan `Page` layout standar.
- **Performance:** Menggunakan `useMemo` untuk table config dan filter agar tidak re-render berlebihan.

## 5. Out of Scope
- ❌ **Mobile App:** Penyesuaian API pada aplikasi mobile/tablet POS.
- ❌ **Legacy Cleanup:** Menghapus file di folder `temp/pages/` (folder tersebut tetap dipertahankan sebagai referensi kode lama).

## 6. Edge Cases & Error Handling
| Scenario | Expected Behavior |
|----------|-------------------|
| Submit form dengan field kosong yang wajib | Menampilkan error validation dari backend melalui state `form.errors`. |
| Akses Detail ID yang tidak ada | Redirect ke halaman list dengan pesan error toast. |
| Katalog bundle tanpa item | Mencegah submit form katalog jika `is_bundle` true tapi item list kosong. |
| Produksi di tanggal lampau | Memberikan peringatan/warning pada DatePicker. |

## 7. Success Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| API Coverage | 100% Endpoints | Membandingkan Postman collection dengan UI Pages. |
| Error Rate | < 1% Payload Mismatch | Monitoring log error saat pengujian CRUD di staging. |
| Type Coverage | 0 'any' in new components | Linting check pada folder `src/pages`. |

## 8. Open Questions
- [ ] Apakah modul Warehouse memerlukan fitur CRUD atau hanya Read-only (list)? (Riset menyarankan Read-only untuk saat ini).
    Answer: keep the warehous is like region, api utilities so we dont need to add a warehouse page
- [ ] Apakah filter laporan di UI baru harus mendukung multi-select untuk outlet?

## 9. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-06 | Initial specification |

---

*Specification created with SDD 4.0*
