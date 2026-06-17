# Implementation Tasks: V1 Standard Alignment for Franchisor-V2

**Task ID:** v1-pages-analysis
**Created:** 2026-06-09
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 11 |
| Estimated Effort | ~14 days |
| Phases | 3 |

## Phase 1: Core Purchase Module Alignment

**Goal:** Align the Purchase module (Suppliers and Orders) with V1 UI/UX and logic standards.

### Task 1.1: Supplier Module Alignment
**Description:** Refactor Supplier list, create, and update pages. Ensure `SupplierForm` matches V1 fields, validation, and layout. Update table configs and filters.
**Acceptance Criteria:**
- [ ] Supplier list uses `useTable` and V1 config pattern.
- [ ] `SupplierForm` includes all V1 fields (bank details, TOP, lead time).
- [ ] API integration uses RTK Query hooks aligned with V1 contracts.
**Effort:** 2 days
**Priority:** High
**Dependencies:** None

### Task 1.2: Purchase Order Module Alignment
**Description:** Refactor Purchase Order (PO) workflows. Align PO list, detail, and creation/update pages. Replicate V1 `PurchaseOrderForm` complexity (fractions, tax calculations).
**Acceptance Criteria:**
- [ ] PO List filters (status, date range) match V1.
- [ ] PO Creation logic handles multiple units/fractions and subtotal/tax/nett calculations correctly.
- [ ] Approval and Payment workflows follow V1 status transitions.
**Effort:** 4 days
**Priority:** High
**Dependencies:** Task 1.1

---

## Phase 2: Core Sales Module Alignment

**Goal:** Align the Sales module (Orders and Returns) with V1 standards.

### Task 2.1: Sales Order Module Alignment
**Description:** Refactor Sales Order list and detail pages. Ensure status badges and action buttons (Publish) match V1 behavior.
**Acceptance Criteria:**
- [ ] Sales Order list implements V1 filtering and pagination.
- [ ] Detail page displays item breakdown and order timeline consistent with V1.
- [ ] "Publish" action triggers correct API flow.
**Effort:** 2 days
**Priority:** Medium
**Dependencies:** Phase 1

### Task 2.2: Sales Return Module Alignment
**Description:** Implement or align Sales Return pages following the V1 structure.
**Acceptance Criteria:**
- [ ] Return list and detail pages are functional and match V1 layout.
- [ ] Integration with inventory/stock updates (via API) is verified.
**Effort:** 1.5 days
**Priority:** Medium
**Dependencies:** Task 2.1

---

## Phase 3: Settings Module Alignment

**Goal:** Align all settings-related sub-modules to the V1 standard.

### Task 3.1: Inventory Settings Alignment
**Description:** Align Inventory Catalog and Inventory Item management. Refactor forms, modals, and tables.
**Acceptance Criteria:**
- [ ] Catalog and Item forms match V1 fields and validation.
- [ ] "Assign Outlet" and "Stock Adjustment" patterns (if applicable) match V1.
**Effort:** 1.5 days
**Priority:** Medium
**Dependencies:** None

### Task 3.2: Outlet Settings Alignment
**Description:** Align Outlet and Outlet Type management.
**Acceptance Criteria:**
- [ ] Outlet forms include V1 fields (address, type, active status).
- [ ] Table configurations match V1 standards.
**Effort:** 1 day
**Priority:** Low
**Dependencies:** None

### Task 3.3: POS Settings Alignment
**Description:** Align POS Catalog, Category, Channel, Payment, and Topup Schema settings.
**Acceptance Criteria:**
- [ ] All 5 sub-modules implemented with V1 table/form patterns.
- [ ] Multi-select or RemoteSelect usage matches V1 behavior.
**Effort:** 1.5 days
**Priority:** Low
**Dependencies:** None

### Task 3.4: User & Profile Alignment
**Description:** Align User Management and Profile pages.
**Acceptance Criteria:**
- [ ] User creation/update form matches V1 fields and roles.
- [ ] Profile page allows password update and info edit consistent with V1.
**Effort:** 0.5 days
**Priority:** Low
**Dependencies:** None

---

## Quick Reference Checklist

- [ ] Task 1.1: Supplier Module Alignment
- [ ] Task 1.2: Purchase Order Module Alignment
- [ ] Task 2.1: Sales Order Module Alignment
- [ ] Task 2.2: Sales Return Module Alignment
- [ ] Task 3.1: Inventory Settings Alignment
- [ ] Task 3.2: Outlet Settings Alignment
- [ ] Task 3.3: POS Settings Alignment
- [ ] Task 3.4: User & Profile Alignment

## Next Steps

1. Review task breakdown
2. Run `/implement v1-pages-analysis` to start execution

---

*Tasks created with SDD 4.0*
