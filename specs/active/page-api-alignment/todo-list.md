# Todo List: Page-API Alignment

**Task ID:** page-api-alignment
**Created:** 2026-06-06
**Status:** In Progress

---

## Phase 1: Core Operations (Production & Demand)

- [x] 1.1 Create Production Plan directory structure (`src/pages/production/`)
- [x] 1.2 Create Production Plan list page (`productionPlan.tsx`)
- [x] 1.3 Create Production Plan table config (`table/productionPlan.config.tsx`)
- [x] 1.4 Create Production Plan routes (`routes.tsx`)
- [x] 1.5 Create Production Plan create page (`productionPlanCreate.tsx`)
- [x] 1.6 Create Production Plan form component (`components/productionPlanForm.tsx`)
- [x] 1.7 Create Production Plan detail page (`productionPlanDetail.tsx`)
- [x] 1.8 Add Production navigation to menu
- [x] 1.9 Create Demand directory structure (`src/pages/demand/`)
- [x] 1.10 Create Production Demand page (`productionDemand.tsx`)
- [x] 1.11 Create Item Demand page (`itemDemand.tsx`)
- [x] 1.12 Create Demand routes
- [x] 1.13 Add Demand navigation to menu

## Phase 2: Supply Chain Rebuild

- [x] 2.1 Move existing Purchase pages to `temp/pages/purchase/`
- [x] 2.2 Rebuild Purchase Order form with aligned payload (`components/purchaseOrderForm.tsx`)
- [x] 2.3 Update Purchase Order list page
- [x] 2.4 Update Purchase Order detail page
- [x] 2.5 Update Supplier form with aligned payload
- [x] 2.6 Update Inventory Item form (add packaging, size, batch tracking, picking strategy)
- [x] 2.7 Update Inventory Catalog form (add bundle support)

## Phase 3: Sales & Returns

- [x] 3.1 Update Sales Order form (add payment_method_id, pos_channel_id)
- [x] 3.2 Create Sales Return list page (`salesReturn.tsx`)
- [x] 3.3 Create Sales Return detail page (`salesReturnDetail.tsx`)
- [x] 3.4 Add Sales Return routes and navigation

## Phase 4: POS & Settings

- [x] 4.1 Update POS Menu form (add channel_prices, ingredients, addon_groups)
- [x] 4.2 Create Payment Method pages (`src/pages/setting/pos/posPayment.tsx`)
- [x] 4.3 Create Payment Method form (integrated in page)
- [x] 4.4 Create Topup Bonus pages (`src/pages/setting/pos/posTopupSchema.tsx`)
- [x] 4.5 Create Topup Bonus form (integrated in page)

## Phase 5: Testing & Verification

- [ ] 5.1 Test Production Plan CRUD flow
- [ ] 5.2 Test Purchase Order payload alignment
- [ ] 5.3 Test Sales Order & Return flow
- [ ] 5.4 Test Payment Method & Topup Bonus toggle
- [ ] 5.5 Verify no `any` types in new pages

---

## Progress Log

| Time | Task | Status | Notes |
|------|------|--------|-------|
| 2026-06-06 | Started implementation | In Progress | Phase 1 begin |

---

*Todo List created with SDD 4.0*
