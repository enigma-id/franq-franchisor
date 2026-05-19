# Todo List: Nine Master Data Creation Pages

**Task ID:** `create-pages`
**Created:** 2026-05-18
**Status:** In Progress

## Progress Log

| Date | Phase | Description | Status |
|------|-------|-------------|--------|
| 2026-05-18 | Phase 1 | Route registration and TypeScript strict compilation fixes | In Progress |
| 2026-05-18 | Phase 2 | Core setting creation pages (Page 2, 4, 5, 7, 8) | Pending |
| 2026-05-18 | Phase 3 | Store Outlet & Purchase Supplier (Page 3, 9) | Pending |
| 2026-05-18 | Phase 4 | Advanced Catalog pages (Page 1, 6) | Pending |
| 2026-05-18 | Phase 5 | Header integration & absolute verification | Pending |

---

## Phase 1: Route Registration & Compile Fixes

- [ ] **Task 1.1:** Daftarkan ke-9 route baru di `src/routes/index.tsx` di atas route detail parameter (:id).
- [ ] **Task 1.2:** Perbaiki strict-mode compilation errors di `salesOrderCreate.tsx` dan `purchaseOrderCreate.tsx` dengan memberikan type casting `as any` pada props dan response `<RemoteSelect>`.

## Phase 2: Core Setting Creation Pages

- [ ] **Task 2.1:** Implementasikan `OutletTypeCreate` (`src/pages/setting/outletTypeCreate.tsx`).
- [ ] **Task 2.2:** Implementasikan `PosCategoryCreate` (`src/pages/setting/posCategoryCreate.tsx`).
- [ ] **Task 2.3:** Implementasikan `PosChannelCreate` (`src/pages/setting/posChannelCreate.tsx`).
- [ ] **Task 2.4:** Implementasikan `PosPaymentCreate` (`src/pages/setting/posPaymentCreate.tsx`).
- [ ] **Task 2.5:** Implementasikan `PosTopupSchemaCreate` (`src/pages/setting/posTopupSchemaCreate.tsx`).

## Phase 3: Store Outlet & Purchase Supplier Creation Pages

- [ ] **Task 3.1:** Implementasikan `PurchaseSupplierCreate` (`src/pages/purchase/supplierCreate.tsx`) lengkap dengan Supplier Info, Payment, dan CP.
- [ ] **Task 3.2:** Implementasikan `StoreOutletCreate` (`src/pages/setting/storeOutletCreate.tsx`) lengkap dengan lazy regional cascading (`useRegion()`), max 130 chars address, dan 6-digit password PIN owner.

## Phase 4: Advanced Catalog Creation Pages

- [ ] **Task 4.1:** Implementasikan `InventoryCatalogCreate` (`src/pages/setting/inventoryCatalogCreate.tsx`) dengan toggling Singular vs Bundle, reactive subtotal dan selling price auto-markup.
- [ ] **Task 4.2:** Implementasikan `PosCatalogCreate` (`src/pages/setting/posCatalogCreate.tsx`) dengan auto-fetch active channel, double nested add-on groups, dan anti-duplicate validations.

## Phase 5: Header Integration & Absolute Verification

- [ ] **Task 5.1:** Pasang tombol "Tambah" di list view ke-9 master data lama agar terhubung ke halaman pembuatannya.
- [ ] **Task 5.2:** Jalankan strict compile `npx tsc --noEmit` dan pastikan compile berhasil 100% tanpa error.

---
*Todo list created with SDD 4.0*
