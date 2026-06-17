# Implementation Tasks: Nine Master Data Creation Pages

**Task ID:** `create-pages`
**Created:** 2026-05-18
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 11 |
| Estimated Effort | 34 Hours |
| Phases | 5 |

---

## Phase 1: Route Registration & Compile Fixes

**Goal:** Register route paths for the 9 creation pages and fix strict-mode TypeScript compilation warnings in existing transaction creations.

### Task 1.1: Register Routes in AppRoutes
**Description:** Add router configurations in `src/routes/index.tsx` for the 9 new pages.
**Acceptance Criteria:**
- [ ] Route paths mapped cleanly to the correct import pages.
- [ ] Registered paths match the specifications:
  - `/setting/inventory/catalog/create`
  - `/setting/type/outlet/create`
  - `/setting/outlet/create`
  - `/setting/pos/category/create`
  - `/setting/pos/channel/create`
  - `/setting/pos/catalog/create`
  - `/setting/pos/payment/create`
  - `/setting/pos/topup-schema/create`
  - `/purchase/supplier/create`
- [ ] Route entries ordered properly above parameter routes (e.g. `/setting/outlet/:id`).

**Effort:** 2 Hours
**Priority:** High
**Dependencies:** None

### Task 1.2: Fix TypeScript Compile Issues in Existing Creators
**Description:** Fix strict compilation errors in `salesOrderCreate.tsx` and `purchaseOrderCreate.tsx` by adding proper type casting (`as any`) for `<RemoteSelect>` and responses where required.
**Acceptance Criteria:**
- [ ] `src/pages/sales/salesOrderCreate.tsx` successfully compiles with no strict type errors.
- [ ] `src/pages/purchase/purchaseOrderCreate.tsx` successfully compiles with no strict type errors.

**Effort:** 2 Hours
**Priority:** High
**Dependencies:** None

---

## Phase 2: Simple Master Data Setting Pages

**Goal:** Implement lightweight setting creation forms.

### Task 2.1: Implement OutletTypeCreate
**Description:** Implement `src/pages/setting/outletTypeCreate.tsx` using `useOutletType` CRUD hooks.
**Acceptance Criteria:**
- [ ] Name input validated for whitespace.
- [ ] Standard `<Page>` structure with title and back navigations.

**Effort:** 2 Hours
**Priority:** High
**Dependencies:** Task 1.1

### Task 2.2: Implement PosCategoryCreate & PosChannelCreate
**Description:** Implement `src/pages/setting/posCategoryCreate.tsx` and `src/pages/setting/posChannelCreate.tsx`.
**Acceptance Criteria:**
- [ ] POS Category includes name input and `is_topping` (0 | 1) checkbox.
- [ ] POS Channel includes name input and non-negative margin markup.

**Effort:** 3 Hours
**Priority:** Medium
**Dependencies:** Task 1.1

### Task 2.3: Implement PosPaymentCreate & PosTopupSchemaCreate
**Description:** Implement `src/pages/setting/posPaymentCreate.tsx` and `src/pages/setting/posTopupSchemaCreate.tsx`.
**Acceptance Criteria:**
- [ ] Payment Method includes `is_nfc` (0 | 1) selector.
- [ ] Top-up schema validates `min_nominal >= 0` and `0 <= bonus <= 100`.

**Effort:** 3 Hours
**Priority:** Medium
**Dependencies:** Task 1.1

---

## Phase 3: Supplier & Outlet Forms

**Goal:** Implement detailed forms for suppliers and store outlets including geographic cascading.

### Task 3.1: Implement PurchaseSupplierCreate
**Description:** Implement `src/pages/purchase/supplierCreate.tsx` with Supplier Info, Payment, and Contact Person sections.
**Acceptance Criteria:**
- [ ] Type options distributor/factory/store dropdown.
- [ ] Non-negative validations for TOP and lead time.
- [ ] Mapping `is_pkp` to 0 | 1 integer payload.

**Effort:** 4 Hours
**Priority:** High
**Dependencies:** Task 1.1

### Task 3.2: Implement StoreOutletCreate with Cascading Regions
**Description:** Implement `src/pages/setting/storeOutletCreate.tsx` with `useRegion()` cascade trigger hook.
**Acceptance Criteria:**
- [ ] Validation of owner password strictly for a 6-digit PIN.
- [ ] Full address text validated for a maximum length of 130 characters.
- [ ] Cascade resets: Changing Province clears and disables Regency, District, and Village.

**Effort:** 6 Hours
**Priority:** High
**Dependencies:** Task 1.1

---

## Phase 4: Advanced Catalog Pages

**Goal:** Implement complex pricing formulas and nested dynamic structures.

### Task 4.1: Implement InventoryCatalogCreate with Auto-Markup Formulas
**Description:** Implement `src/pages/setting/inventoryCatalogCreate.tsx` supporting Singular vs Bundle modes.
**Acceptance Criteria:**
- [ ] Singular auto-calculates Selling Price based on base price, commission markup, and VAT (if `is_vatable === 1`).
- [ ] Bundle dynamically renders rows of selected items, quantities, margins, and computes real-time pricing using reactive `useMemo`.
- [ ] Switching between Singular & Bundle resets states and clears bundle array.

**Effort:** 6 Hours
**Priority:** High
**Dependencies:** Task 1.1

### Task 4.2: Implement PosCatalogCreate with Double-Nested Add-ons
**Description:** Implement `src/pages/setting/posCatalogCreate.tsx` with active channel list rendering and nested dynamic add-on groups.
**Acceptance Criteria:**
- [ ] Fetches active POS channels on mount and initializes pricing state.
- [ ] Add-on child options selected via `<RemoteSelect>` filtered by `is_additional === 1`.
- [ ] Frontend validation strictly blocks duplicate add-on item definitions in a single group.

**Effort:** 6 Hours
**Priority:** High
**Dependencies:** Task 1.1

---

## Phase 5: Verification & Navigation Links

**Goal:** Integrate navigation entry points and run strict codebase validation.

### Task 5.1: Add "Tambah" Action Links to All Listing Headers
**Description:** Find listing header action panels of the 9 master data views and link their CTA "Tambah" buttons to navigate to `/create`.
**Acceptance Criteria:**
- [ ] All 9 master listing views feature a fully functional button directing user to their respective creation page.

**Effort:** 2 Hours
**Priority:** High
**Dependencies:** All Tasks

### Task 5.2: Execute Absolute Compile Verification
**Description:** Validate the complete project build in strict compilation mode.
**Acceptance Criteria:**
- [ ] Command `npx tsc --noEmit` runs with 0 compile errors.

**Effort:** 2 Hours
**Priority:** High
**Dependencies:** All Tasks

---

## Quick Reference Checklist

- [ ] Task 1.1: Register Routes in AppRoutes
- [ ] Task 1.2: Fix TypeScript Compile Issues in Existing Creators
- [ ] Task 2.1: Implement OutletTypeCreate
- [ ] Task 2.2: Implement PosCategoryCreate & PosChannelCreate
- [ ] Task 2.3: Implement PosPaymentCreate & PosTopupSchemaCreate
- [ ] Task 3.1: Implement PurchaseSupplierCreate
- [ ] Task 3.2: Implement StoreOutletCreate with Cascading Regions
- [ ] Task 4.1: Implement InventoryCatalogCreate with Auto-Markup Formulas
- [ ] Task 4.2: Implement PosCatalogCreate with Double-Nested Add-ons
- [ ] Task 5.1: Add "Tambah" Action Links to All Listing Headers
- [ ] Task 5.2: Execute Absolute Compile Verification

---

## Next Steps

1. Review the task list.
2. Initialize implementation tracking on the `todo-list.md`.
3. Proceed with Phase 1 route registration.

---

*Tasks created with SDD 4.0*
