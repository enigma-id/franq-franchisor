# Technical Plan: Nine Master Data Creation Pages

**Task ID:** `create-pages`
**Status:** Ready for Implementation
**Based on:** `specs/active/create-pages/spec.md` & `specs/active/create-pages/research.md`

---

## 1. System Architecture

Formulir pembuatan untuk ke-9 master data ini diimplementasikan sebagai halaman mandiri (*page components*) di bawah direktori `src/pages/setting/` dan `src/pages/purchase/`. Seluruh komponen menggunakan arsitektur **React 18 + TypeScript + Tailwind CSS** terintegrasi secara modular dengan sistem state global berbasis **Redux Toolkit Query (RTK Query)** untuk transaksi API.

Transient input formulir dikelola sepenuhnya melalui *structured component state* (`useState`) lokal untuk menjamin keakuratan modifikasi dinamis pada baris tabel (seperti bundle detail, dynamic channel pricing, dan add-on modifiers) sebelum data di-submit ke backend API.

### Architecture Decisions Table

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **Component Form State** | Structured Local `useState` | local state sangat cepat, mencegah lag rendering pengetikan pada input teks biasa saat tabel dinamis (POS & Inventory Catalog) memiliki banyak baris. |
| **State Synchronisation** | RTK Query Mutations via `createCrudHook` | Penyelarasan mutasi menggunakan hook standar di proyek (`useOutlet`, `usePOSCatalog`, dll.) guna menyatukan status loading (`isLoading`), success (`isSuccess`), dan pembersihan store (`reset`). |
| **Cascading Selectors** | Lazy Fetch Triggers (`useRegion()`) | Dropdown regional regional dipicu secara cascade secara sinkron. Memilih Provinsi akan mengosongkan ID regency, district, village dan memicu fetch regency baru hanya jika Provinsi valid. |
| **Reactive Computations** | React `useMemo` dengan dependensi minimal | Rumus hitungan matematika untuk DPP, markup margin, komisi, dan PPN (baik pada Inventory Catalog tunggal/paket maupun detail PO) didelegasikan ke caching `useMemo` agar kalkulasi berjalan real-time dan efisien. |
| **API Error Handling** | Dynamic Dot-Notation Mapper | Error dari backend dengan format dot-notation (`bundles.0.item_id`, `channels.1.unit_price`, `additionals.0.childs.0.catalog_id`) diterjemahkan secara dinamis agar pesan error merah tepat berada di bawah input field bermasalah. |

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | `^18.x` | Framework dasar proyek modern `franchisor-v2`. |
| **Styling & Icons** | Tailwind CSS & Lucide React | `^3.x` / `^0.x` | Rendering visual Enigma UI Design System yang konsisten, type-safe, dan responsive. |
| **State & Fetching** | Redux Toolkit Query (RTK Query) | `^1.9.x` | Caching API otomatis, pemisah mutasi, dan monitoring status request transaksi. |
| **Date Utility** | Dayjs | `^1.11.x` | Library manipulasi tanggal terstandarisasi untuk default date dan estimasi kedatangan (ETA). |
| **TypeScript Compiler** | TypeScript (Strict Mode) | `^5.x` / `^6.x` | Type-safety mutlak, larangan penggunaan keyword `any` pada form payload dan API response interface. |

### Dependencies (package.json fragment proposal)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.11.2",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.0.7",
    "dayjs": "^1.11.7",
    "lucide-react": "^0.244.0",
    "clsx": "^1.2.1"
  }
}
```

---

## 3. Component Design

Seluruh halaman kreasi menggunakan bungkus layout semantik Enigma UI:
```tsx
<Page className="h-full flex flex-col min-h-0 bg-slate-50">
  <Page.Header
    category="setting"
    title="..."
    subtitle="..."
    backTo={() => navigate(-1)}
    action={<Button onClick={handleSubmit}>Simpan</Button>}
  />
  <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
     {/* Card & Form Groups */}
  </Page.Body>
</Page>
```

### Ke-9 Komponen Baru yang Dibuat:

#### 1. `InventoryCatalogCreate` (`src/pages/setting/inventoryCatalogCreate.tsx`)
*   **Purpose:** Form pembuatan katalog produk tunggal (`singular`) maupun paket (`bundle`).
*   **Responsibilities:**
    *   Toggles mode dinamis antara katalog singular & bundle yang mereset data berlawanan secara instan.
    *   Mengintegrasikan `<RemoteSelect>` dengan filter active `useInventoryItem` dan `useInventoryCatalog` (untuk items).
    *   Menampilkan dynamic table bundle item dengan baris tambah/hapus.
    *   Melakukan hitungan otomatis Selling Price berbasis formula:
        *   Tunggal: `dpp = basePrice + (basePrice * commission) / 100`. Jika vatable (`is_vatable === 1`), `unit_price = dpp * 1.1`.
        *   Bundle: Sum dari total unit bundle dengan komisi dan margin tersendiri.
*   **Dependencies:** `useInventoryCatalog`, `useInventoryItem`, `<RemoteSelect>`, `<Input>`, `<Page>`, `useMemo`.

#### 2. `OutletTypeCreate` (`src/pages/setting/outletTypeCreate.tsx`)
*   **Purpose:** Formulir sederhana klasifikasi klasifikasi outlet.
*   **Responsibilities:**
    *   Validasi required nama outlet type (trimming spasi kosong).
    *   Submit data payload `{ name: string }` via `useOutletType` mutation.
*   **Dependencies:** `useOutletType`, `<Input>`, `<Page>`, `useNavigate`.

#### 3. `StoreOutletCreate` (`src/pages/setting/storeOutletCreate.tsx`)
*   **Purpose:** Form pendaftaran outlet komprehensif (operational parameters, PIC, Regional Cascading, Owner credentials).
*   **Responsibilities:**
    *   Validasi password owner (PIN numerik tepat 6 angka `/^\d{6}$/`).
    *   Limitasi counter alamat fisik maks 130 huruf.
    *   Integrasi selector daerah cascade menggunakan lazy fetches `useRegion()`:
        *   Provinsi -> Regency -> District -> Village.
*   **Dependencies:** `useOutlet`, `useOutletType`, `useRegion`, `<RemoteSelect>`, `<Input>`, `<DatePicker>`.

#### 4. `PosCategoryCreate` (`src/pages/setting/posCategoryCreate.tsx`)
*   **Purpose:** Form menu kategori kasir POS.
*   **Responsibilities:**
    *   Input nama kategori (required) dan checkbox/toggle `is_topping` (`0` atau `1`).
*   **Dependencies:** `usePOSCategory`, `<Input>`, `<Checkbox>`.

#### 5. `PosChannelCreate` (`src/pages/setting/posChannelCreate.tsx`)
*   **Purpose:** Pembuatan sales channel penjualan beserta margin tambahannya.
*   **Responsibilities:**
    *   Validasi angka margin non-negatif (`margin >= 0`).
*   **Dependencies:** `usePOSChannel`, `<Input>`.

#### 6. `PosCatalogCreate` (`src/pages/setting/posCatalogCreate.tsx`)
*   **Purpose:** Pembuatan katalog POS kasir komprehensif (SKU barcode, PPN, channel pricing table, base64 image upload, dynamic Add-on Group).
*   **Responsibilities:**
    *   Mount fetch seluruh active channel (`usePOSChannel`) untuk ditaruh ke array `form.channels` dengan initial state `is_active: 0` dan `unit_price: 0`.
    *   Penyediaan dynamic Add-on groups dengan tambah/hapus group, dan tambah/hapus child addon.
    *   `<RemoteSelect>` pada input child terfilter `is_additional === 1`.
    *   Validasi frontend menolak duplikasi menu catalog additional terpilih dalam satu group.
*   **Dependencies:** `usePOSCatalog`, `usePOSCategory`, `usePOSChannel`, `<RemoteSelect>`, `<Input>`, `useMemo`.

#### 7. `PosPaymentMethodCreate` (`src/pages/setting/posPaymentCreate.tsx`)
*   **Purpose:** Menambah metode pembayaran kasir.
*   **Responsibilities:**
    *   Input `name` (required) dan checkbox `is_nfc` (`0` | `1`).
*   **Dependencies:** `usePOSPaymentMethod`, `<Input>`, `<Checkbox>`.

#### 8. `PosTopupSchemaCreate` (`src/pages/setting/posTopupSchemaCreate.tsx`)
*   **Purpose:** Skema bonus top-up nominal saldo franchise.
*   **Responsibilities:**
    *   Input `min_nominal` dan `bonus` (%) dengan validasi non-negatif, serta batas bonus maksimal `100%`.
*   **Dependencies:** `usePOSTopupSchema`, `<Input>`.

#### 9. `PurchaseSupplierCreate` (`src/pages/purchase/supplierCreate.tsx`)
*   **Purpose:** Profil lengkap supplier baru (Supplier Info, Payment Details, CP).
*   **Responsibilities:**
    *   Pilihan dropdown `type` (`'distributor' | 'factory' | 'store'`).
    *   Validasi TOP (hari) dan lead time (hari) sebagai integer non-negatif.
    *   Mapping status PKP perpajakan sebagai numerik `0` atau `1` ke backend.
*   **Dependencies:** `useSupplier`, `<Input>`, `<Page>`.

---

## 4. Data Model

### TypeScript Form State Interfaces

```typescript
// Page 1: Inventory Catalog
export interface InventoryCatalogBundleItemInput {
  item_id: number;
  fraction_id: number;
  quantity: number;
  margin: number;
  totalBase: number;
  selling_price: number;
  itemSelected: any | null;
  fractionSelected: any | null;
}

export interface InventoryCatalogFormState {
  type: "singular" | "bundle";
  item_id: number;
  fraction_id: number;
  name: string;
  commission: number;
  image: string;
  is_bundle: number; // 0 | 1
  description: string;
  unit_price: number;
  bundles: InventoryCatalogBundleItemInput[];
}

// Page 3: Store Outlet
export interface StoreOutletFormState {
  name: string;
  type_id: number;
  recipient_name: string;
  phone: string;
  service_charge: number;
  address: string;
  province_id: number;
  regency_id: number;
  district_id: number;
  village_id: number;
  shipping_time: "morning" | "afternoon" | "evening" | "night" | "unselected";
  owner_user: {
    name: string;
    username: string;
    password: string; // 6-digit PIN
  };
}

// Page 6: POS Catalog
export interface POSCatalogChannelInput {
  channel_id: number;
  name: string;
  is_active: number; // 0 | 1
  unit_price: number;
}

export interface POSCatalogAddonChildInput {
  catalog_id: number;
  catalogSelected: any | null;
}

export interface POSCatalogAddonGroupInput {
  name: string;
  type: "options" | "checkbox" | "quantity";
  childs: POSCatalogAddonChildInput[];
}

export interface POSCatalogFormState {
  category_id: number;
  code: string;
  name: string;
  base_price: number;
  is_vatable: number; // 0 | 1
  is_additional: number; // 0 | 1
  image: string;
  channels: POSCatalogChannelInput[];
  additionals: POSCatalogAddonGroupInput[];
}

// Page 9: Purchase Supplier
export interface PurchaseSupplierFormState {
  type: "distributor" | "factory" | "store";
  name: string;
  address: string;
  phone: string;
  is_pkp: number; // 0 | 1
  top: number;
  lead_time: number;
  bank_name: string;
  bank_number: string;
  bank_account: string;
  sales_person: string;
  sales_person_phone: string;
  note: string;
}
```

---

## 5. API Contracts

### Endpoints Table

| Method | Path | Payload | Success Response (201) |
| :--- | :--- | :--- | :--- |
| **POST** | `/inventory/catalog` | `InventoryCatalogFormState` (visual fields stripped) | `{ "code": 201, "status": "Created", "data": { "id": 1 } }` |
| **POST** | `/outlet/outlet_type` | `{ name: string }` | `{ "code": 201, "status": "Created", "data": { "id": 2 } }` |
| **POST** | `/outlet/outlet` | `StoreOutletFormState` | `{ "code": 201, "status": "Created", "data": { "id": 3 } }` |
| **POST** | `/pos/category` | `{ name: string, is_topping: number }` | `{ "code": 201, "status": "Created", "data": { "id": 4 } }` |
| **POST** | `/pos/channel` | `{ name: string, margin: number }` | `{ "code": 201, "status": "Created", "data": { "id": 5 } }` |
| **POST** | `/pos/catalog` | `POSCatalogFormState` (visual fields stripped) | `{ "code": 201, "status": "Created", "data": { "id": 6 } }` |
| **POST** | `/pos/payment_method` | `{ name: string, is_nfc: number }` | `{ "code": 201, "status": "Created", "data": { "id": 7 } }` |
| **POST** | `/pos/topup_schema` | `{ min_nominal: number, bonus: number }` | `{ "code": 201, "status": "Created", "data": { "id": 8 } }` |
| **POST** | `/purchase/supplier` | `PurchaseSupplierFormState` | `{ "code": 201, "status": "Created", "data": { "id": 9 } }` |

---

## 6. Security Considerations

- **PIN Security & Regex Enforcement:** Password owner pada outlet wajib divalidasi tepat 6 digit numerik. Karakter non-numerik langsung ditolak di input dan form simpan dinonaktifkan.
- **Strict Payload Stripping:** Seluruh data model yang menampung model selection (seperti `catalogSelected`, `itemSelected`, `fractionSelected`) harus dihapus menggunakan parser utilitas sebelum dikirim ke API server demi menghindari penolakan payload.
- **Sanitasi Angka Negatif:** Semua input numerik (harga, nominal, margin, komisi, kuantitas) dicegah di tingkat frontend dari input bertanda minus (`-`) dengan pemaksaan batas minimal `0` atau `1` pada input type number.

---

## 7. Performance Strategy

- **Optimasi Dynamic Render List:** Perubahan margin/kuantitas pada baris dinamis (tabel bundle atau channel pricing) dikelola lewat salinan dalam array lokal dan diakses via key index unik untuk mencegah lag keyboard saat input teks biasa.
- **Lazy Load dropdown Satuan:** Dropdown satuan fraction pada katalog/supplier dipanggil hanya saat bahan baku/item dipilih. Detail fractions diletakkan di cache index lokal.
- **Frictionless UI typing:** Seluruh hitungan matematika subtotal dan PPN menggunakan `useMemo` dengan dependensi minimal.

---

## 8. Implementation Phases

- [ ] **Phase 1: Route Registration**
  - Daftarkan ke-9 route create baru di `src/routes/index.tsx`.
- [ ] **Phase 2: TypeScript Compilation Fixes**
  - Perbaiki error Strict-mode compilation di `src/pages/sales/salesOrderCreate.tsx` dan `src/pages/purchase/purchaseOrderCreate.tsx` dengan memberikan type casting `as any` pada props component `<RemoteSelect>` hook dan `responseData`.
- [ ] **Phase 3: Core Setting Creation Pages (Page 2, 4, 5, 7, 8)**
  - Implementasikan `OutletTypeCreate`, `PosCategoryCreate`, `PosChannelCreate`, `PosPaymentCreate`, dan `PosTopupSchemaCreate`.
- [ ] **Phase 4: Store Outlet Creation (Page 3)**
  - Implementasikan `StoreOutletCreate` lengkap dengan cascading region select dari `useRegion()` dan validasi PIN 6 digit.
- [ ] **Phase 5: Purchase Supplier Creation (Page 9)**
  - Implementasikan `PurchaseSupplierCreate` dengan pembagian layout grid info, payment bank, dan sales contact.
- [ ] **Phase 6: Advanced Catalog Creation (Page 1 & 6)**
  - Implementasikan `InventoryCatalogCreate` (Singular vs Bundle reactive calculations) dan `PosCatalogCreate` (Dynamic Channel list, Addon double nested arrays, anti-duplicate validators).
- [ ] **Phase 7: Navigation & Verification**
  - Pasang tombol "Tambah" di list view master data lama agar terhubung ke halaman pembuatannya. Jalankan strict compile `tsc --noEmit`.

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
| :--- | :---: | :---: | :--- |
| **Penyalahgunaan Key `any`** | High | Low | Hindari penggunaan key `any` pada payload state internal. Wajib gunakan explicit typescript interface untuk dynamic nested form. |
| **Visual State Leak ke API** | High | Medium | Lakukan mapping payload bersih (`formData.map` / `JSON.parse(JSON.stringify)`) sebelum trigger create mutation. |
| **Dropdown Cascade Region Loop** | Medium | Medium | Reset regency, district, village ke `0` secara eksplisit setiap kali `province_id` berubah sebelum lazy fetchRegencies berjalan. |

---

## 10. Open Questions
*Tidak ada.* Logika kalkulasi, constraints form, dan endpoint API telah dianalisis lengkap dari spek baru dan diselaraskan secara penuh dengan sistem RTK Query modern di `franchisor-v2`.

---

## Next Steps
- Tinjau plan yang komprehensif ini.
- Jalankan `/tasks create-pages` untuk menyusun detail list implementasi di file `tasks.md`.

*Technical Plan created with SDD 4.0*
