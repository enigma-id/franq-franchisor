# Technical Plan: Page-API Alignment

**Task ID:** page-api-alignment
**Status:** Ready for Implementation
**Based on:** spec.md, research.md
**Date:** 2026-06-06

---

## 1. System Architecture

### 1.1 Overview

Sistem menggunakan arsitektur **Modular Monolith Frontend** dengan RTK Query sebagai API layer. Setiap domain bisnis (Operations, Supply Chain, Sales, POS, Settings) dikelompokkan dalam module yang terpisah di `src/pages/`.

```
┌─────────────────────────────────────────────────────────────┐
│                        React Router                          │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│ Operations  │Supply Chain │   Sales     │       POS         │
│             │             │             │                   │
│ Production  │ Purchase    │ Sales Order │ Menu              │
│ Demand      │ Supplier    │ Sales Return│ Category          │
│             │ Inventory   │             │ Channel           │
│             │             │             │ Payment Method    │
│             │             │             │ Topup Bonus       │
├─────────────┴─────────────┴─────────────┴───────────────────┤
│                     RTK Query API Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Redux Store  │  createCrudHook  │  Form Slice  │ Table Slice│
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | Flat routes (e.g., `/purchase`, `/production`) | Lebih sederhana, tidak perlu nested layout yang kompleks |
| State Management | Redux + RTK Query | Sudah menjadi standard project, caching & invalidation built-in |
| CRUD Pattern | `createCrudHook` factory | Konsistensi, reusable, error handling terstandarisasi |
| Form Pattern | Controlled state + manual validation | Mengikuti pattern existing untuk konsistensi |
| Type Safety | Strict TypeScript interfaces | Hindari `any`, gunakan types dari `src/services/types/` |
| Legacy Pages | Keep in `temp/pages/` | Referensi kode lama, jangan hapus |

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React | 18.x | Existing stack |
| Language | TypeScript | 5.x | Type safety |
| State | Redux Toolkit + RTK Query | 2.x | Data fetching & caching |
| Routing | React Router | 6.x | SPA navigation |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Date | dayjs | 1.x | Lightweight date manipulation |
| UI Components | Custom (EnigmaUI) | Internal | Consistent design system |

---

## 3. Component Design

### 3.1 Operations Module

#### Production Plan
- **Purpose:** Manajemen rencana produksi harian
- **Responsibilities:** CRUD production plan, publish, complete, manage items
- **Interfaces:**
  - `ProductionPlanList` - Table dengan status badge (draft/published/completed)
  - `ProductionPlanCreate` - Form: outlet_id, production_date, items list
  - `ProductionPlanDetail` - View + action buttons (Publish, Complete, Cancel)
- **Dependencies:** `productionApi`, `outletApi`, `inventoryApi`

#### Demand
- **Purpose:** Melihat kebutuhan produksi dan item
- **Responsibilities:** Display demand data dengan filter
- **Interfaces:**
  - `ProductionDemand` - Filter by date & outlet, tabel demand per catalog
  - `ItemDemand` - Aggregated demand per item
- **Dependencies:** `demandApi`, `outletApi`

### 3.2 Supply Chain Module

#### Purchase Order (Rebuild)
- **Purpose:** Transaksi pembelian ke supplier
- **Responsibilities:** Create, read, update PO dengan payload yang aligned
- **Interfaces:**
  - `PurchaseOrderList` - Table PO dengan status
  - `PurchaseOrderCreate/Update` - Form baru dengan field: supplier_id (string), number, date, discount, tax, shipping_fee, items (catalog_id, quantity, unit_price)
- **Dependencies:** `purchaseApi`, `supplierApi`, `inventoryApi`

#### Supplier
- **Purpose:** Master data supplier
- **Responsibilities:** CRUD supplier
- **Interfaces:**
  - `SupplierList` - Table supplier
  - `SupplierCreate/Update` - Form: name, phone, email, address
- **Dependencies:** `supplierApi`

#### Inventory
- **Purpose:** Master data item & catalog
- **Responsibilities:** CRUD inventory item & catalog
- **Interfaces:**
  - `InventoryItemList` - Table item dengan type badge
  - `InventoryItemCreate/Update` - Form: type, category, barcode, name, variant, packaging, size, is_batch_tracking, picking_strategy, base_price, weight, fractions, boms
  - `InventoryCatalogList` - Table catalog
  - `InventoryCatalogCreate/Update` - Form: name, is_bundle, unit_price, measurement, unit, items (for bundle)
- **Dependencies:** `inventoryApi`

### 3.3 Sales Module

#### Sales Order
- **Purpose:** Transaksi penjualan
- **Responsibilities:** Create, read sales order dengan field yang aligned
- **Interfaces:**
  - `SalesOrderList` - Table orders
  - `SalesOrderCreate` - Form: outlet_id, customer_name, customer_phone, transaction_date, note, discount, tax, service_charge, items, payment_method_id, pos_channel_id
  - `SalesOrderDetail` - View order dengan status tracking
- **Dependencies:** `salesApi`, `outletApi`, `paymentMethodApi`, `posApi`

#### Sales Return
- **Purpose:** Retur penjualan
- **Responsibilities:** View returns, approve return
- **Interfaces:**
  - `SalesReturnList` - Table returns
  - `SalesReturnDetail` - View detail + Approve button
- **Dependencies:** `salesApi`

### 3.4 POS Module

#### POS Menu
- **Purpose:** Manajemen menu POS
- **Responsibilities:** CRUD menu dengan channel prices, ingredients, addons
- **Interfaces:**
  - `POSMenuList` - Table menu
  - `POSMenuCreate/Update` - Form: category_id, name, base_price, image, is_vatable, is_additional, channel_prices[], ingredients[], addon_groups[]
- **Dependencies:** `posApi`

#### POS Category
- **Purpose:** Kategori menu POS
- **Responsibilities:** CRUD category
- **Dependencies:** `posApi`

#### POS Channel
- **Purpose:** Channel penjualan POS
- **Responsibilities:** CRUD channel
- **Dependencies:** `posApi`

#### Payment Method
- **Purpose:** Metode pembayaran
- **Responsibilities:** CRUD + activate/deactivate
- **Interfaces:**
  - `PaymentMethodList` - Table dengan toggle active status
  - `PaymentMethodCreate/Update` - Form: name, provider, type
- **Dependencies:** `paymentMethodApi`

#### Topup Bonus
- **Purpose:** Bonus topup member
- **Responsibilities:** CRUD + activate/deactivate
- **Interfaces:**
  - `TopupBonusList` - Table dengan toggle active status
  - `TopupBonusCreate/Update` - Form: name, amount, bonus
- **Dependencies:** `memberApi`

---

## 4. Data Model

### 4.1 Key Entities (from API Types)

```typescript
// Purchase Order (v2 aligned)
interface PurchaseOrderRequest {
  supplier_id: string;      // was number
  number: string;
  date: string;
  note?: string;
  discount: number;
  tax: number;
  shipping_fee: number;      // was shipping_charge
  items: {
    catalog_id: string;      // was item_id
    quantity: number;
    unit_price: number;      // was unit_nett
  }[];
}

// Production Plan
interface ProductionPlanRequest {
  outlet_id: string;
  production_date: string;   // YYYY-MM-DD
  note?: string;
  items: {
    catalog_id: string;
    quantity: number;
    note?: string;
  }[];
}

// Sales Order (aligned)
interface SalesOrderRequest {
  outlet_id: string;
  customer_name?: string;
  customer_phone?: string;
  transaction_date: string;
  note?: string;
  discount: number;
  tax: number;
  service_charge: number;
  items: {
    catalog_id: string;
    quantity: number;
    unit_price: number;
    discount: number;
  }[];
  payment_method_id: string;
  pos_channel_id: string;
}

// Inventory Item (v2 aligned)
interface InventoryItemCreateRequest {
  type: "raw_material" | "finished_goods";
  category: string;
  barcode: string;
  name: string;
  variant: string;
  packaging: string;
  size: string;
  is_batch_tracking: boolean;
  picking_strategy: string;
  base_price: number;
  weight: number;
  fractions: InventoryFraction[];
  boms?: InventoryBOM[];
}
```

---

## 5. API Contracts

### 5.1 New API Endpoints (need UI)

| Method | Path | Purpose | Module |
|--------|------|---------|--------|
| GET | /production/plan | List production plans | Operations |
| POST | /production/plan | Create production plan | Operations |
| PUT | /production/plan/:id | Update production plan | Operations |
| PUT | /production/plan/:id/publish | Publish plan | Operations |
| PUT | /production/plan/:id/complete | Complete plan | Operations |
| DELETE | /production/plan/:id | Delete plan | Operations |
| GET | /demand/production | Production demand | Operations |
| GET | /demand/item | Item demand | Operations |
| GET | /sales/return | List sales returns | Sales |
| GET | /sales/return/:id | Sales return detail | Sales |
| PUT | /sales/return/:id/approve | Approve return | Sales |
| GET | /payment/method | List payment methods | POS |
| POST | /payment/method | Create payment method | POS |
| PUT | /payment/method/:id | Update payment method | POS |
| PUT | /payment/method/:id/activate | Activate | POS |
| PUT | /payment/method/:id/deactivate | Deactivate | POS |
| GET | /member/topup-bonus | List topup bonuses | POS |
| POST | /member/topup-bonus | Create topup bonus | POS |
| PUT | /member/topup-bonus/:id | Update topup bonus | POS |

### 5.2 Updated Payload Contracts (existing API, new form)

| Endpoint | Old Payload Field | New Payload Field | Change Type |
|----------|------------------|-------------------|-------------|
| POST /purchase/order | supplier_id: number | supplier_id: string | Type change |
| POST /purchase/order | items[].item_id | items[].catalog_id | Field rename |
| POST /purchase/order | items[].unit_nett | items[].unit_price | Field rename |
| POST /purchase/order | shipping_charge | shipping_fee | Field rename |
| POST /purchase/order | - | number, date, discount, tax | New fields |
| POST /sales/order | - | payment_method_id, pos_channel_id | New fields |
| POST /inventory/item | - | packaging, size, is_batch_tracking, picking_strategy | New fields |
| POST /inventory/catalog | - | is_bundle, items[] | New fields |
| POST /pos/menu | - | channel_prices[], ingredients[], addon_groups[] | New fields |

---

## 6. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Type Safety | Gunakan TypeScript interfaces dari `src/services/types/`, dilarang menggunakan `any` pada payload |
| Input Validation | Validasi di level form sebelum submit, tunggu response error dari backend |
| Auth | Semua API membutuhkan auth token (sudah ditangani oleh `baseQuery`) |
| Sensitive Data | Untuk form Outlet dengan `owner_password`, gunakan input type password |

---

## 7. Performance Strategy

| Strategy | Implementation |
|----------|---------------|
| Caching | RTK Query automatic caching dengan tag invalidation |
| Table Config | `useMemo` untuk table config agar tidak re-render |
| Pagination | Server-side pagination untuk semua list (`page`, `limit`) |
| Select Lookup | Gunakan `RemoteSelect` dengan lazy loading untuk dropdown data besar |
| Lazy Loading | Gunakan lazy query (`useLazy*` hooks) untuk detail/modal |

---

## 8. Implementation Phases

### Phase 1: Core Operations (Week 1)
- [ ] Create Production Plan pages (List, Create, Detail)
- [ ] Create Demand pages (Production Demand, Item Demand)
- [ ] Add menu navigation for Operations
- [ ] Test Production & Demand API integration

### Phase 2: Supply Chain Rebuild (Week 1-2)
- [ ] Rebuild Purchase Order form dengan payload yang aligned
- [ ] Update Purchase Order list, create, detail, update pages
- [ ] Rebuild/Update Supplier pages
- [ ] Update Inventory Item form (packaging, size, batch tracking, picking strategy)
- [ ] Update Inventory Catalog form (bundle support)
- [ ] Move Supplier dari Purchase ke module standalone atau grouping yang sesuai

### Phase 3: Sales & Returns (Week 2)
- [ ] Update Sales Order form (tambahkan payment_method_id, pos_channel_id)
- [ ] Create Sales Return pages (List, Detail dengan Approve)
- [ ] Test Sales Order & Return API integration

### Phase 4: POS Updates & New Pages (Week 2-3)
- [ ] Update POS Menu form (channel_prices, ingredients, addon_groups)
- [ ] Update POS Category form
- [ ] Update POS Channel form
- [ ] Create Payment Method pages (CRUD + toggle activate/deactivate)
- [ ] Create Topup Bonus pages (CRUD + toggle activate/deactivate)

### Phase 5: Testing & Verification (Week 3)
- [ ] End-to-end testing setiap module
- [ ] Verifikasi payload yang dikirim sesuai dengan API types
- [ ] TypeScript linting: 0 `any` usage di folder `src/pages`
- [ ] Periksa menu navigation & routing
- [ ] Pastikan `temp/pages/` tidak terhapus

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Payload mismatch masih terjadi | High | Medium | Verifikasi setiap field form dengan API type sebelum implementasi |
| Breaking changes pada route | Medium | Low | Gunakan flat routes, test routing setelah setiap perubahan |
| API response shape berbeda | High | Medium | Test API call dengan console.log, pastikan unwrap berhasil |
| Data migration issue | Medium | Low | Vendor & PO existing tetap bisa dibaca (read dari API lama/compatible) |
| Scope creep (tambah fitur) | Medium | Medium | Patuhi spec, tambahan fitur masuk ke backlog |

---

## 10. Open Questions

1. Apakah Warehouse tetap sebagai utility API (seperti Region) tanpa halaman UI?
   - **Answer:** Warehouse adalah utility API, tidak perlu halaman UI.
2. Apakah file di `temp/pages/` akan dihapus nantinya atau dipertahankan permanen?
   - **Answer:** Dipertahankan sebagai referensi, jangan hapus.
3. Bagaimana handle existing data PO/Sales yang menggunakan field lama?
   - API sudah handle backward compatibility di backend.

---

## Next Steps

1. Review plan ini
2. Jalankan `/tasks page-api-alignment` untuk task breakdown per phase
3. Atau langsung jalankan `/implement page-api-alignment` untuk mulai coding

---

*Technical Plan created with SDD 4.0*
