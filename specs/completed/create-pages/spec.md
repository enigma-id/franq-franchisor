# Specification: Nine Master Data Creation Pages

**Task ID:** `create-pages`
**Created:** 2026-05-18
**Status:** Ready for Planning
**Version:** 2.0

---

## 1. Problem Statement
- **The Problem:** Administrator sistem operasional Franchisor di `franchisor-v2` tidak memiliki antarmuka (UI) terintegrasi untuk mendaftarkan dan membuat entitas data master baru. Mereka terpaksa beralih kembali ke aplikasi Vue lama (`suka-bread/clients/web/franchisor`) atau memanipulasi database secara manual hanya untuk menambahkan katalog baru, outlet baru, kategori POS, supplier, dan konfigurasi lainnya.
- **Current Situation:** Halaman daftar (list view) untuk masing-masing modul master data ini sudah di-porting ke modern React Client, tetapi tombol "Tambah" dan halaman pembuatan (create view) masing-masing modul masih belum ada atau kosong.
- **Desired Outcome:** Terwujudnya sembilan (9) halaman pembuatan data master yang fungsional, responsif, type-safe, dan memiliki keselarasan UI/UX yang tinggi dengan Enigma UI Design System. Seluruh form terintegrasi dengan query/mutasi RTK Query dari API service yang sesuai, mengimplementasikan validasi frontend yang kokoh, serta reaktivitas kalkulasi markup/pajak yang akurat.

---

## 2. User Personas
### Primary User 1: Operations Administrator (Ops Admin)
- **Who:** Staf administrasi kantor pusat waralaba yang bertanggung jawab atas pengelolaan outlet, tipe outlet, katalog inventori, dan harga jual produk.
- **Goals:** Menambah outlet baru dengan cepat beserta regional mapping yang akurat, mengatur katalog produk tunggal maupun paket (bundle) dengan harga jual otomatis berbasis komisi dan PPN, serta memperbarui skema POS.
- **Pain points:** Pengisian form panjang yang tidak terstruktur, kegagalan memilih kelurahan/kecamatan yang tepat karena dropdown regional tidak terfilter secara cascade, dan kebingungan menghitung markup komisi secara manual.

### Primary User 2: Procurement Manager
- **Who:** Kepala divisi pengadaan barang yang mengatur hubungan dagang dengan pemasok eksternal (supplier).
- **Goals:** Mendaftarkan supplier baru dengan informasi perpajakan (PKP/Non-PKP) yang valid, Term of Payment (TOP), dan shipping lead time yang presisi untuk meminimalisasi keterlambatan suplai.
- **Pain points:** Masalah koordinasi jika data rekening bank supplier atau kontak sales person tidak terdokumentasi dengan rapi.

---

## 3. Functional Requirements

### FR-1: Inventory Catalog Creation (`setting/inventory/catalog/create`)
- **Description:** Formulir dinamis untuk mendaftarkan katalog produk inventori baru. Form dapat berganti mode antara katalog tunggal (`singular`) atau paket (`bundle`).
- **Fields:**
  - `type` (String): `'singular' | 'bundle'`. Default `'singular'`.
  - `item_id` (Number): ID dari master inventory item (khusus tipe `singular`). Dipilih via `<RemoteSelect>`.
  - `fraction_id` (Number): ID fraction satuan item (khusus tipe `singular`). Terfilter dinamis berdasarkan `item_id`.
  - `name` (String): Pre-populated dari nama item terpilih (tipe `singular`) atau diinput manual (tipe `bundle`).
  - `commission` (Number): Persentase komisi/markup. Default `0`.
  - `image` (String): base64 string dari komponen upload gambar.
  - `is_bundle` (Number): `0` atau `1` (Otomatis `1` jika `type` adalah `'bundle'`).
  - `description` (String): Deskripsi produk.
  - `unit_price` (Number): Harga jual akhir.
  - `bundles` (Array of Objects, khusus tipe `bundle`):
    - `item_id` (Number), `fraction_id` (Number), `quantity` (Number), `margin` (Number), `totalBase` (Number), `selling_price` (Number).
- **Reactive Logic:**
  - **Base Price:**
    - Tipe `singular`: `itemSelected.base_price * fractionSelected.quantity`.
    - Tipe `bundle`: Sum dari `totalBase` semua baris bundle item (`base_price * unit`).
  - **Harga Jual (Unit Price) Auto-markup:**
    - Tipe `singular`: `dpp = basePrice + (basePrice * commission) / 100`. Jika `itemSelected.is_vatable === 1`, maka `sp = dpp * 1.1`.
    - Tipe `bundle`: `sp = sum(spp_i)`. Di mana untuk setiap baris: `unit = quantity * fractionSelected.quantity`. `totalBase = itemSelected.base_price * unit`. `selling_price = (base_price + (base_price * margin) / 100) * unit`. `dpp_i = selling_price + (selling_price * commission) / 100`. Jika item bundle kena pajak (`is_vatable === 1`), `spp_i = dpp_i * 1.1`, jika tidak `spp_i = dpp_i`. Nilai total `sp` di-autofill ke `unit_price` secara real-time.
- **User Story:**
  > As an **Ops Admin**, I want to **toggle between singular and bundle catalog creation and have the selling price calculated automatically based on commission and tax**, so that **catalog pricing remains accurate and margin-safe**.
- **Acceptance Criteria:**
  - [ ] Menyediakan switch/dropdown pemilihan tipe singular/bundle yang mereset field spesifik masing-masing tipe.
  - [ ] Item bundle diinput dalam tabel dinamis dengan aksi tambah/hapus baris yang reaktif.
  - [ ] Perubahan margin, kuantitas, komisi secara otomatis memperbarui Unit Price dan Base Price melalui `useMemo`.

---

### FR-2: Outlet Type Creation (`setting/outlet/outlet_type/create`)
- **Description:** Formulir sederhana untuk membuat tipe klasifikasi outlet baru.
- **Fields:**
  - `name` (String): Nama klasifikasi outlet (misal: "Express", "Premium", "Booth").
- **User Story:**
  > As an **Ops Admin**, I want to **define a new outlet classification type**, so that **we can group stores according to their business model**.
- **Acceptance Criteria:**
  - [ ] Validasi frontend menolak input string kosong atau spasi saja.
  - [ ] Sukses submit mengarahkan kembali ke `/setting/type/outlet`.

---

### FR-3: Store Outlet Creation (`setting/outlet/outlet/create`)
- **Description:** Form komprehensif yang dibagi menjadi blok info outlet, PIC penerima, Akun Owner, dan data regional.
- **Fields:**
  - `name` (String): Nama outlet.
  - `type_id` (Number): Klasifikasi tipe outlet via `<RemoteSelect>`.
  - `recipient_name` (String): Nama PIC penerima di outlet.
  - `phone` (String): No HP PIC penerima.
  - `service_charge` (Number): Biaya layanan dalam persen (`%`).
  - `address` (String): Alamat lengkap pengiriman (max 130 karakter).
  - `province_id` (Number), `regency_id` (Number), `district_id` (Number), `village_id` (Number): Cascading daerah.
  - `shipping_time` (String): Window pengiriman (`'morning' | 'afternoon' | 'evening' | 'night' | 'unselected'`).
  - `owner_user` (Object):
    - `name` (String): Nama lengkap pemilik.
    - `username` (String): Username unik untuk login.
    - `password` (String): PIN numeric 6 digit (`/^\d{6}$/`).
- **Cascading Regional Selector:**
  - Perubahan `province_id` mereset regency, district, dan village ke `0` / `null`.
  - Perubahan `regency_id` mereset district dan village.
  - Perubahan `district_id` mereset village.
- **User Story:**
  > As an **Ops Admin**, I want to **create an outlet complete with operational parameters, regional cascading locations, and its primary owner credentials**, so that **the store is ready to place orders and log into the system**.
- **Acceptance Criteria:**
  - [ ] Implementasi cascade select regional yang memanggil API parameter region (`useRegion()` / lazy fetcher) secara tersinkronisasi.
  - [ ] Input password owner memvalidasi ketentuan PIN numerik tepat 6 angka.
  - [ ] Alamat lengkap memiliki counter karakter max 130 huruf.

---

### FR-4: POS Category Creation (`setting/pos/category/create`)
- **Description:** Pembuatan kategori menu kasir POS.
- **Fields:**
  - `name` (String): Nama kategori (misal: "Roti Manis", "Minuman Dingin").
  - `is_topping` (Number): `0` atau `1` (Default `0`). Menandakan apakah ini kategori menu tambahan/topping.
- **User Story:**
  > As an **Ops Admin**, I want to **create a POS category with optional topping flag**, so that **cashiers can navigate menu options and modifiers smoothly**.
- **Acceptance Criteria:**
  - [ ] Memiliki toggle checkbox untuk `is_topping`.
  - [ ] Input nama kategori required.

---

### FR-5: POS Channel Creation (`setting/pos/channel/create`)
- **Description:** Pembuatan sales channel penjualan POS baru beserta mark-up margin-nya.
- **Fields:**
  - `name` (String): Nama channel (misal: "GoFood", "GrabFood", "Dine In").
  - `margin` (Number): Persentase margin tambahan untuk channel ini (`%`).
- **User Story:**
  > As an **Ops Admin**, I want to **create a POS sales channel with custom margin markup**, so that **selling prices dynamically adapt to specific delivery platforms**.
- **Acceptance Criteria:**
  - [ ] Input margin memvalidasi angka positif.
  - [ ] Sukses submit mengarahkan kembali ke `/setting/pos` atau list channel.

---

### FR-6: POS Catalog Creation (`setting/pos/catalog/create`)
- **Description:** Halaman pembuatan katalog menu kasir POS yang sangat komprehensif, mencakup barcode SKU, checkbox PPN, tabel harga jual per channel penjualan, image upload, dan dynamic Add-on Group.
- **Fields:**
  - `category_id` (Number): Dipilih via POS Category `<RemoteSelect>`.
  - `code` (String): Barcode/Item SKU.
  - `name` (String): Nama item kasir.
  - `base_price` (Number): Harga dasar produksi.
  - `is_vatable` (Number): `0` | `1`. Jika `1`, menampilkan teks peringatan "Harga Jual sudah termasuk pajak".
  - `is_additional` (Number): `0` | `1`. Tipe tambahan/topping.
  - `image` (String): base64 image data.
  - `channels` (Array of Objects, di-load otomatis pada `beforeMount`/`useEffect` dari list channel aktif):
    - `name` (String, Readonly), `channel_id` (Number), `is_active` (Number: `0` | `1`), `unit_price` (Number, di-input manual jika `is_active === 1`).
  - `additionals` (Array of Objects, hanya muncul jika `is_additional === 0`):
    - `name` (String): Nama addon group (misal: "Pilih Topping").
    - `type` (String): `'options' | 'checkbox' | 'quantity'`.
    - `childs` (Array of Objects):
      - `catalogSelected` (Object | null): Pencarian katalog kasir terfilter `is_additional === 1`.
      - `catalog_id` (Number).
- **User Story:**
  > As an **Ops Admin**, I want to **create a POS catalog item with SKU details, channel-specific pricing rows, and dynamic add-on group lists**, so that **cashier menus are fully enriched with precise modifiers and channel costs**.
- **Acceptance Criteria:**
  - [ ] Pada saat mount, fetch seluruh POS Channel aktif dan masukkan ke state array `form.channels` dengan default `is_active: 0` dan `unit_price: 0`.
  - [ ] Menampilkan dynamic group addon dengan aksi tambah/hapus group, dan tambah/hapus baris pilihan katalog additional di dalamnya.
  - [ ] Menggunakan `<RemoteSelect>` katalog POS terfilter `is_additional === 1` pada input child addon.

---

### FR-7: POS Payment Method Creation (`setting/pos/payment_method/create`)
- **Description:** Menambahkan metode pembayaran kasir baru.
- **Fields:**
  - `name` (String): Nama payment method (misal: "QRIS", "Debit BCA", "Cash").
  - `is_nfc` (Number): `0` | `1`. Menandakan penggunaan NFC chip.
- **User Story:**
  > As an **Ops Admin**, I want to **add a new POS payment method with optional NFC identifier**, so that **stores can accept modern contactless payments**.
- **Acceptance Criteria:**
  - [ ] Checkbox/Toggle untuk `is_nfc` (`0` atau `1`).
  - [ ] Submit mengarahkan kembali ke `/setting/pos/payment`.

---

### FR-8: Topup Schema Creation (`setting/pos/topup_schema/create`)
- **Description:** Pembuatan tiers skema bonus nominal top-up saldo franchise.
- **Fields:**
  - `min_nominal` (Number): Minimum isi saldo (Rupiah).
  - `bonus` (Number): Persentase bonus saldo yang diberikan (`%`).
- **User Story:**
  > As an **Ops Admin**, I want to **define a topup bonus schema tier**, so that **franchisees are incentivized to top up larger balances**.
- **Acceptance Criteria:**
  - [ ] Validasi input `min_nominal` dan `bonus` tidak boleh negatif.
  - [ ] `bonus` tidak boleh melebihi 100%.

---

### FR-9: Purchase Supplier Creation (`purchase/supplier/create`)
- **Description:** Form pengisian data supplier baru yang terbagi atas Supplier Info, Payment Details, dan Contact Person.
- **Fields:**
  - **Supplier Info:**
    - `type` (String): `'distributor' | 'factory' | 'store'`.
    - `name` (String): Nama badan usaha supplier.
    - `address` (String): Alamat fisik (max 130 karakter).
    - `phone` (String): Nomor telp kantor.
    - `is_pkp` (Number): `0` (Non-PKP) | `1` (PKP).
    - `top` (Number): Term of Payment (dalam hari, misal `30` hari).
    - `lead_time` (Number): Waktu pengiriman barang (dalam hari).
  - **Payment Details:**
    - `bank_name` (String): Nama Bank tujuan transfer.
    - `bank_number` (String): No rekening bank.
    - `bank_account` (String): Nama pemilik rekening bank.
  - **Contact Person:**
    - `sales_person` (String): Nama sales representative.
    - `sales_person_phone` (String): No HP sales person.
    - `note` (String): Catatan opsional (max 130 karakter).
- **User Story:**
  > As a **Procurement Manager**, I want to **create a new supplier profile detailing tax PKP status, terms of payment, banking information, and sales contact details**, so that **our purchase order pipeline has full commercial and logistical clarity**.
- **Acceptance Criteria:**
  - [ ] Pilihan `type` berupa dropdown select yang intuitif.
  - [ ] Field `top` (Term of Payment) dan `lead_time` divalidasi sebagai integer non-negatif.
  - [ ] Notifikasi/Checkbox perpajakan `is_pkp` dikirimkan sebagai numerik `0` atau `1` ke API.

---

## 4. Non-Functional Requirements
- **Strict TypeScript & Type-Safety:** Penggunaan keyword `any` pada form state dilarang keras. Seluruh dynamic model, event handler, payload request, dan response mapping wajib dideklarasikan menggunakan TypeScript `interface` or `type` secara eksplisit.
- **Dynamic Nested Error Mapping:** Validasi dot-notation dari API backend (seperti `bundles.0.item_id`, `channels.1.unit_price`, atau `additionals.0.childs.0.catalog_id`) wajib diterjemahkan oleh helper lokal agar pesan error warna merah muncul tepat di bawah input field komponen baris dinamis yang bersangkutan.
- **React Rendering Performance:** Pembaruan item array dinamis (terutama pada form POS Catalog dan Inventory Catalog) tidak boleh menyebabkan lag render pengetikan input teks biasa. Semua fungsi total perhitungan didelegasikan ke `useMemo` dengan dependensi minimal.
- **Unified Layout:** Seluruh halaman menggunakan komponen `<Page>`, `<Page.Header>` dengan properti back-button `backTo`, dan bungkus `<Page.Body>` yang seragam dengan visual scrollbar yang halus.

---

## 5. Out of Scope
- Halaman/Modul edit (update view) untuk ke-9 master data ini (hanya terfokus pada creation page).
- Fitur import master data masal menggunakan berkas XLS/CSV langsung dari UI form creation.

---

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Mengubah tipe catalog (FR-1) setelah mengisi item bundle | Tipe dropdown berganti, system secara otomatis menghapus array bundles lama dan mereset total Base Price & Unit Price ke `0` untuk menghindari sisa data usang. |
| Perubahan Provinsi pada Outlet (FR-3) | Dropdown Regency, District, dan Village langsung di-disable dan di-reset ke `null`/`0`, serta trigger fetching baru dipicu hanya jika Provinsi terpilih valid. |
| Duplikasi Catalog ID pada Add-on Child POS (FR-6) | Menampilkan pesan error validasi frontend: *"Item addon ini sudah ditambahkan di group ini"* untuk mencegah duplikasi masukan. |
| Pengisian PIN Password Owner (FR-3) bukan angka atau kurang/lebih dari 6 digit | Form langsung menampilkan error di bawah input PIN: *"PIN harus berupa 6 digit angka"* dan mendisdisable tombol simpan. |
| Menginput harga jual channel (FR-6) tetapi channel-nya tidak di-checklist aktif | Validasi frontend secara otomatis mengabaikan unit_price tersebut atau mereset harganya ke `0` sebelum dikirim sebagai payload. |
| Status PKP Supplier (FR-9) | Payload `is_pkp` wajib dikirimkan sebagai integer `0` atau `1` bukan boolean `false` atau `true` agar selaras dengan skema database backend. |

---

## 7. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Keakuratan Auto-Markup Harga Jual | 100% Cocok dengan Logika Legacy Vue | Membandingkan nilai kalkulasi frontend SO/PO dan POS Catalog dengan rumus orisinal legacy pada pengujian unit. |
| Ketiadaan Error Type TS | 0 Error pada Build Kompilasi | Menjalankan compile strict-mode `tsc` pada seluruh halaman baru tanpa memicu kegagalan build. |
| Ketepatan Cascade Reset | 100% Berhasil mereset anak state | Simulasi perubahan parent regional pada Outlet dan item pada PO item detail, lalu cek state console. |

---

## 8. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-05-18 | Overhauled specification targeting the nine missing master data creation pages |

---

## Next Steps
1. Tinjau dokumen spesifikasi `/specify` baru ini.
2. Jalankan `/plan create-pages` untuk menyusun Technical Plan arsitektur halaman, state, dan routing ke-9 form master data ini.

*Specification created with SDD 4.0*
