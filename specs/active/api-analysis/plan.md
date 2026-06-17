# Implementation Plan: Production Plan Filter Alignment

## Context
Align the production plan filter in `src/pages/production/plan/table/plan.filter.tsx` with the sales order filter pattern in `src/pages/sales/order/table/order.filter.tsx`. This includes using `RemoteSelect` for status, adding a `DatePicker` for date ranges, and updating project-wide options for consistent behavior.

## Proposed Changes

### 1. Update Utilities
- Add `productionPlanStatusOptions` in `src/utils/options.tsx`:
  - `Draft` -> `draft`
  - `Published` -> `published`
  - `Selesai` -> `completed`
  - `Dibatalkan` -> `cancelled`

### 2. Implement Changes in `plan.filter.tsx`
- Refactor the component to use `useState` for managing filter state derived from `table.State.filter`.
- Use `RemoteSelect` instead of `Select`.
- Include `DatePicker` (range mode).
- Apply styling using common `selectClassName` shared with sales orders.
- Sync filter state application to the table using the `table.filter` (or current `handleFilter` if that is what the table expects) hook pattern.

## Critical Files
- `src/pages/production/plan/table/plan.filter.tsx`
- `src/utils/options.tsx`

## Verification
1. Verify `productionPlanStatusOptions` are exported and usable.
2. Run the production plan table page and check if:
   - Status options correctly appear in `RemoteSelect`.
   - Date range correctly triggers table filtering.
   - UI styling remains consistent with sales order page.
