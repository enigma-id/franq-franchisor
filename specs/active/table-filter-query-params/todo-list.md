# Todo List: Table Filter Query Parameters

**Task ID:** table-filter-query-params
**Created:** 2026-07-09
**Status:** In Progress

## Progress Log

| Date | Phase | Completed | Notes |
|------|-------|-----------|-------|
| 2026-07-09 | 1-3 | 10/10 | Phases 1-3 complete |
| 2026-07-09 | 4 | 6/6 | Phase 4 complete — created 5 simple filters + 1 skipped |
| 2026-07-09 | 5-6 | 8/8 | Phases 5-6 complete — 4 full filters + 4 report filter updates |

---

## Phase 1: Cleanup Extra Params

- [x] **Task 1.1**: Remove `fulfillment_status` from sales/order filter
- [x] **Task 1.2**: Remove `date` from sales/return filter

## Phase 2: Add Missing Params to Existing Filters

- [x] **Task 2.1**: Add `outlet_id` + `warehouse_id` to sales/order filter *(dep: 1.1)*
- [x] **Task 2.2**: Add `outlet_id` to production/plan filter
- [x] **Task 2.3**: Add `type` + `category` to inventory/item filter
- [x] **Task 2.4**: Add `item_type` to inventory/catalog filter

## Phase 3: Replace Empty Placeholders

- [x] **Task 3.1**: Add `category_id` + `is_active` to pos/menu filter
- [x] **Task 3.2**: Add `is_active` to pos/category filter
- [x] **Task 3.3**: Add `is_active` to payment/method filter
- [x] **Task 3.4**: Add full filter to purchase/order

## Phase 4: New Filter Components — Simple

- [x] **Task 4.1**: Create outlet filter
- [x] **Task 4.2**: Create outlet/type filter
- [x] **Task 4.3**: Create pos/channel filter
- [x] **Task 4.4**: Create supplier filter
- [x] **Task 4.5**: Create user filter
- [x] **Task 4.6**: Create member/topup-bonus filter *(no page exists — skipped)*

## Phase 5: New Filter Components — Full

- [x] **Task 5.1**: Create withdrawal-request filter
- [x] **Task 5.2**: Create outlet-topup-request filter
- [x] **Task 5.3**: Create b2b/order filter
- [x] **Task 5.4**: Create warehouse-stock report filter

## Phase 6: Update Report Filters

- [x] **Task 6.1**: Add `outlet_id` to pos-outstanding report
- [x] **Task 6.2**: Add `outlet_id` to product-sales report
- [x] **Task 6.3**: Add `periode` + `periode_type` to pos-settlement report
- [x] **Task 6.4**: Add `outlet_id` to demand/production filter
