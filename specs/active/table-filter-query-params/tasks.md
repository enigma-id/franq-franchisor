# Implementation Tasks: Table Filter Query Parameters

**Task ID:** table-filter-query-params
**Created:** 2026-07-09
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 24 |
| Estimated Effort | ~32 hours |
| Phases | 6 |

## Phase 1: Cleanup Extra Params

**Goal:** Remove params sent to API that aren't in the contract. Backend silently ignores them, so no functional impact — but must be done first to avoid re-adding in later phases.

### Task 1.1: Remove `fulfillment_status` from Sales Order Filter

**Description:** Remove the `fulfillment_status` RemoteSelect component, its state, and its reference in `applyFilters()` from `src/pages/sales/order/table/order.filter.tsx`. Also remove the `fulfillmentStatusOptions` import from `@/utils/options`.

**Acceptance Criteria:**
- [ ] `fulfillment_status` field removed from `applyFilters()` params object
- [ ] `fulfillmentStatus` state variable and its `useState` removed
- [ ] `fulfillmentStatusOptions` import removed
- [ ] RemoteSelect for fulfillment status removed from JSX
- [ ] No remaining references to `fulfillment_status` in the file

**Effort:** 1 hour
**Priority:** High
**Dependencies:** None

---

### Task 1.2: Remove `date` from Sales Return Filter

**Description:** Remove the `date` param from `src/pages/sales/return/table/return.filter.tsx`. Read the file to determine the exact mechanism (likely a DatePicker or hidden field).

**Acceptance Criteria:**
- [ ] `date` param no longer sent in `applyFilters()`
- [ ] Any unused imports (dayjs, DatePicker, etc.) removed if no longer needed
- [ ] Verify the filter file only sends params in the contract (`page`, `limit`, `search`)

**Effort:** 0.5 hour
**Priority:** High
**Dependencies:** None

---

## Phase 2: Add Missing Params to Existing Filters

**Goal:** Add contract-available params to existing filter components that currently lack them.

### Task 2.1: Add `outlet_id` + `warehouse_id` to Sales Order Filter

**Description:** Add RemoteSelect components for `outlet_id` (using `useOutlet`) and `warehouse_id` (using `useWarehouse`) to `src/pages/sales/order/table/order.filter.tsx`. Follow Pattern B (RemoteSelect from API). Both params are already in the contract but missing from the UI.

**Acceptance Criteria:**
- [ ] Outlet RemoteSelect added using `useOutlet` hook with preload + restore effects
- [ ] Warehouse RemoteSelect added using `useWarehouse` hook with preload + restore effects
- [ ] Both fields wired to `applyFilters()` on change and clear
- [ ] Initial filter values restored from `table.State.filter` on mount
- [ ] Both filters appear in the JSX layout

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 2.2: Add `outlet_id` to Production Plan Filter

**Description:** Add RemoteSelect for `outlet_id` (using `useOutlet`) to `src/pages/production/plan/table/plan.filter.tsx`.

**Acceptance Criteria:**
- [ ] Outlet RemoteSelect added following Pattern B
- [ ] Preload + restore effects implemented
- [ ] Wired to `applyFilters()` and cleared correctly

**Effort:** 1.5 hours
**Priority:** High
**Dependencies:** None

---

### Task 2.3: Add `type` + `category` to Inventory Item Filter

**Description:** Add RemoteSelect filters for `type` (static options: `raw_material`, `finished_goods`) and `category` (from API or static list) to `src/pages/inventory/item/table/item.filter.tsx`.

**Acceptance Criteria:**
- [ ] `type` filter added as RemoteSelect with static options `raw_material`, `finished_goods`
- [ ] `category` filter added (use static list if no API endpoint, or create inline options)
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] State restored from current filter on mount

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 2.4: Add `item_type` to Inventory Catalog Filter

**Description:** Add RemoteSelect for `item_type` with static options to `src/pages/inventory/catalog/table/catalog.filter.tsx`.

**Acceptance Criteria:**
- [ ] `item_type` filter added as RemoteSelect with static options
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] State restored from current filter on mount

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** None

---

## Phase 3: Replace Empty Placeholders

**Goal:** Replace filter files that exist but have no actual filter logic (empty placeholders or search-only) with full implementations.

### Task 3.1: Add `category_id` + `is_active` to POS Menu Filter

**Description:** Replace the placeholder filter logic in `src/pages/setting/pos/menu/table/menu.filter.tsx` with actual filters: `category_id` via RemoteSelect from `usePosCategory()` API, and `is_active` via static RemoteSelect.

**Acceptance Criteria:**
- [ ] `category_id` RemoteSelect using POS category API hook
- [ ] `is_active` RemoteSelect with static Active/Inactive options
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] State restored from current filter on mount
- [ ] Search functionality preserved (if separate from filter)

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 3.2: Add `is_active` to POS Category Filter

**Description:** Replace the empty placeholder in `src/pages/setting/pos/category/table/category.filter.tsx` with an `is_active` RemoteSelect.

**Acceptance Criteria:**
- [ ] `is_active` RemoteSelect with Active/Inactive static options
- [ ] Wired to `applyFilters()` and cleared correctly

**Effort:** 0.5 hour
**Priority:** Medium
**Dependencies:** None

---

### Task 3.3: Add `is_active` to Payment Method Filter

**Description:** Replace the search-only filter in `src/pages/setting/pos/payment/table/payment.filter.tsx` by adding an `is_active` RemoteSelect.

**Acceptance Criteria:**
- [ ] `is_active` RemoteSelect with Active/Inactive static options
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Search functionality preserved (if separate from filter)

**Effort:** 0.5 hour
**Priority:** Medium
**Dependencies:** None

---

### Task 3.4: Add Full Filter to Purchase Order

**Description:** Replace the empty placeholder in `src/pages/purchase/order/table/order.filter.tsx` with full filter UI: `document_status` (static: `pending`, `published`), `outlet_id` (RemoteSelect via `useOutlet`), `supplier_id` (RemoteSelect via `useSupplier`), and date range (DatePicker for `start_date`/`end_date`).

**Acceptance Criteria:**
- [ ] `document_status` RemoteSelect with pending/published options
- [ ] `outlet_id` RemoteSelect via `useOutlet`
- [ ] `supplier_id` RemoteSelect via `useSupplier`
- [ ] DatePicker with range mode for `start_date`/`end_date`
- [ ] All wired to `applyFilters()` and cleared correctly
- [ ] State restored from current filter on mount
- [ ] Config file (`order.config.tsx`) registers the filter component

**Effort:** 3 hours
**Priority:** High
**Dependencies:** None

---

## Phase 4: New Filter Components — Simple

**Goal:** Create new filter component files for modules that currently have zero filter UI, limited to simple params like `is_active` toggle.

### Task 4.1: Create Outlet Filter

**Description:** Create `src/pages/setting/outlet/table/outlet.filter.tsx` with `outlet_type_id` (RemoteSelect from `GET /outlet/type` API) and `is_active` (static Active/Inactive). Register in the config file.

**Acceptance Criteria:**
- [ ] Filter component created with `TableFilterProps` interface
- [ ] `outlet_type_id` RemoteSelect using outlet type API hook (create or verify existing)
- [ ] `is_active` RemoteSelect with static options
- [ ] `applyFilters()` function calling `table.filter()`
- [ ] State restored from `table.State.filter` on mount
- [ ] Config file imports and registers the filter

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 4.2: Create Outlet/Type Filter

**Description:** Create filter component for `src/pages/setting/outlet/type/table/` with `is_active` RemoteSelect.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `is_active` RemoteSelect with static options
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 0.5 hour
**Priority:** Medium
**Dependencies:** None

---

### Task 4.3: Create POS Channel Filter

**Description:** Create filter component for `src/pages/setting/pos/channel/table/` with `is_active` RemoteSelect.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `is_active` RemoteSelect with static options
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 0.5 hour
**Priority:** Medium
**Dependencies:** None

---

### Task 4.4: Create Supplier Filter

**Description:** Create filter component at `src/pages/supplier/table/supplier.filter.tsx` with `is_active` (static Active/Inactive) and `type` (static: `distributor`, `factory`, `store`). Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `is_active` RemoteSelect with static options
- [ ] `type` RemoteSelect with `distributor`, `factory`, `store` options
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 4.5: Create User Filter

**Description:** Create filter component at `src/pages/user/table/user.filter.tsx` with `usergroup_id` (RemoteSelect from `GET /user/usergroup` API) and `is_active` (static). Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `usergroup_id` RemoteSelect using usergroup API hook
- [ ] `is_active` RemoteSelect with static options
- [ ] Preload + restore effects for usergroup
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 4.6: Create Member Topup Bonus Filter

**Description:** Create filter component at `src/pages/member/topup-bonus/table/topup-bonus.filter.tsx` with `is_active` RemoteSelect. Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `is_active` RemoteSelect with static options
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 0.5 hour
**Priority:** Low
**Dependencies:** None

---

## Phase 5: New Filter Components — Full

**Goal:** Create new filter components with multiple param types (status select + RemoteSelect + date range).

### Task 5.1: Create Withdrawal Request Filter

**Description:** Create filter at `src/pages/withdrawal/request/table/request.filter.tsx` with `document_status` (static: `pending`, `approved`, `rejected`) and `outlet_id` (RemoteSelect via `useOutlet`). Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `document_status` RemoteSelect with pending/approved/rejected options
- [ ] `outlet_id` RemoteSelect via `useOutlet`
- [ ] Preload + restore effects
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 5.2: Create Outlet Topup Request Filter

**Description:** Create filter at `src/pages/outlet/topup/table/topup.filter.tsx` with `document_status` (static: `pending`, `approved`, `rejected`) and `outlet_id` (RemoteSelect via `useOutlet`). Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `document_status` RemoteSelect with pending/approved/rejected options
- [ ] `outlet_id` RemoteSelect via `useOutlet`
- [ ] Preload + restore effects
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 5.3: Create B2B Order Filter

**Description:** Create filter at `src/pages/b2b/order/table/order.filter.tsx` with `document_status` (static: `pending`, `shipped`, `received`, `invoiced`) and date range (DatePicker for `start_date`/`end_date`). Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `document_status` RemoteSelect with pending/shipped/received/invoiced options
- [ ] DatePicker with range mode for `start_date`/`end_date`
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] State restored from current filter on mount
- [ ] Registered in config file

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 5.4: Create Warehouse Stock Report Filter

**Description:** Create filter at `src/pages/report/warehouse-stock/table/stock.filter.tsx` with `warehouse_id` (RemoteSelect via `useWarehouse`) and `item_id` (RemoteSelect via `useItem`). Register in config.

**Acceptance Criteria:**
- [ ] Filter component created with standard structure
- [ ] `warehouse_id` RemoteSelect via `useWarehouse`
- [ ] `item_id` RemoteSelect via `useItem` (or appropriate inventory item hook)
- [ ] Preload + restore effects for both
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] Registered in config file

**Effort:** 2 hours
**Priority:** Low
**Dependencies:** None

---

## Phase 6: Update Report Filters

**Goal:** Add missing params to existing report filter components.

### Task 6.1: Add `outlet_id` to POS Outstanding Report

**Description:** Add `outlet_id` RemoteSelect (via `useOutlet`) to `src/pages/report/table/pos-outstanding.filter.tsx`.

**Acceptance Criteria:**
- [ ] `outlet_id` RemoteSelect added following Pattern B
- [ ] Preload + restore effects implemented
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Existing date range filter preserved and working

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 6.2: Add `outlet_id` to Product Sales Report

**Description:** Add `outlet_id` RemoteSelect (via `useOutlet`) to `src/pages/report/table/product-sales.filter.tsx`.

**Acceptance Criteria:**
- [ ] `outlet_id` RemoteSelect added following Pattern B
- [ ] Preload + restore effects implemented
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Existing date range filter preserved and working

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 6.3: Add `periode` + `periode_type` to POS Settlement Report

**Description:** Add `periode` (text/date input for period) and `periode_type` (static: `daily`, `monthly`, `yearly`) to `src/pages/report/table/settlement.filter.tsx`.

**Acceptance Criteria:**
- [ ] `periode_type` RemoteSelect with daily/monthly/yearly options
- [ ] `periode` input added (text input or date picker depending on format)
- [ ] Both wired to `applyFilters()` and cleared correctly
- [ ] Existing `outlet_id` filter preserved and working

**Effort:** 1.5 hours
**Priority:** Low
**Dependencies:** None

---

### Task 6.4: Add `outlet_id` to Demand Production Filter

**Description:** Add `outlet_id` RemoteSelect (via `useOutlet`) to `src/pages/production/demand/table/production.filter.tsx`.

**Acceptance Criteria:**
- [ ] `outlet_id` RemoteSelect added following Pattern B
- [ ] Preload + restore effects implemented
- [ ] Wired to `applyFilters()` and cleared correctly
- [ ] Existing `production_date` filter preserved and working

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** None

---

## Quick Reference Checklist

### Phase 1: Cleanup
- [ ] Task 1.1: Remove `fulfillment_status` from sales/order
- [ ] Task 1.2: Remove `date` from sales/return

### Phase 2: Missing Params
- [ ] Task 2.1: Add `outlet_id` + `warehouse_id` to sales/order
- [ ] Task 2.2: Add `outlet_id` to production/plan
- [ ] Task 2.3: Add `type` + `category` to inventory/item
- [ ] Task 2.4: Add `item_type` to inventory/catalog

### Phase 3: Replace Placeholders
- [ ] Task 3.1: Add `category_id` + `is_active` to pos/menu
- [ ] Task 3.2: Add `is_active` to pos/category
- [ ] Task 3.3: Add `is_active` to payment/method
- [ ] Task 3.4: Add full filter to purchase/order

### Phase 4: New Simple Filters
- [ ] Task 4.1: Create outlet filter
- [ ] Task 4.2: Create outlet/type filter
- [ ] Task 4.3: Create pos/channel filter
- [ ] Task 4.4: Create supplier filter
- [ ] Task 4.5: Create user filter
- [ ] Task 4.6: Create member/topup-bonus filter

### Phase 5: New Full Filters
- [ ] Task 5.1: Create withdrawal-request filter
- [ ] Task 5.2: Create outlet-topup-request filter
- [ ] Task 5.3: Create b2b/order filter
- [ ] Task 5.4: Create warehouse-stock report filter

### Phase 6: Report Filters
- [ ] Task 6.1: Add `outlet_id` to pos-outstanding
- [ ] Task 6.2: Add `outlet_id` to product-sales
- [ ] Task 6.3: Add `periode` + `periode_type` to pos-settlement
- [ ] Task 6.4: Add `outlet_id` to demand/production

---

## Next Steps

1. Review task breakdown
2. Run `/implement table-filter-query-params` to start execution

---

*Tasks created with SDD 4.0*
