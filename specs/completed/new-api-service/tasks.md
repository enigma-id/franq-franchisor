# Implementation Tasks: New API Service Layer Migration

**Task ID:** new-api-service
**Created:** 2026-06-05
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 45 |
| Estimated Effort | ~5-6 days |
| Phases | 8 |

---

## Phase 1: Preparation

**Goal:** Move existing services to temp/ and create new type files

### Task 1.1: Migrate Old Services to temp/

**Description:** Move all existing service directories from `src/services/` to `temp/services/` to preserve old implementations while building new ones.

**Acceptance Criteria:**
- [ ] `temp/services/` directory created
- [ ] Old `src/services/auth/` moved to `temp/services/auth/`
- [ ] Old `src/services/outlet/` moved to `temp/services/outlet/`
- [ ] Old `src/services/pos/` moved to `temp/services/pos/`
- [ ] Old `src/services/inventory/` moved to `temp/services/inventory/`
- [ ] Old `src/services/purchase/` moved to `temp/services/purchase/`
- [ ] Old `src/services/sales/` moved to `temp/services/sales/`
- [ ] Old `src/services/user/` moved to `temp/services/user/`
- [ ] Old `src/services/franchise/` moved to `temp/services/franchise/`
- [ ] Old `src/services/catalog/` moved to `temp/services/catalog/`
- [ ] Old `src/services/dashboard/` moved to `temp/services/dashboard/`
- [ ] Old `src/services/report/` moved to `temp/services/report/`
- [ ] Old `src/services/region/` moved to `temp/services/region/`
- [ ] `src/services/baseQuery.tsx` preserved (not moved)
- [ ] `src/services/hooks/createCrudHook.ts` preserved (not moved)
- [ ] `src/services/types/api.ts` preserved (not moved)

**Effort:** 2 hours
**Priority:** High
**Dependencies:** None

---

### Task 1.2: Create Auth Type Definitions

**Description:** Create `src/services/types/auth.ts` with signup, login, and profile update interfaces.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/auth.ts`
- [ ] `SignupRequest` interface defined with all required fields
- [ ] `LoginRequest` interface defined
- [ ] `ProfileUpdateRequest` interface defined
- [ ] `AuthResponse` flexible interface for API responses

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.3: Create Outlet Type Definitions

**Description:** Create `src/services/types/outlet.ts` with outlet and outlet type interfaces.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/outlet.ts`
- [ ] `OutletCreateRequest` interface with all payload fields
- [ ] `OutletChannelsUpdateRequest` interface
- [ ] `OutletTypeRequest` interface
- [ ] Flexible response interfaces

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.4: Create POS Type Definitions

**Description:** Create `src/services/types/pos.ts` with menu, category, channel, payment method, and member topup bonus interfaces.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/pos.ts`
- [ ] `POSMenuCreateRequest` with channel_prices, ingredients, addon_groups
- [ ] `POSCategoryRequest` interface
- [ ] `POSChannelRequest` interface
- [ ] `PaymentMethodRequest` interface
- [ ] `MemberTopupBonusRequest` interface
- [ ] `POSMenuTypesUpdateRequest` interface

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.5: Create Inventory Type Definitions

**Description:** Create `src/services/types/inventory.ts` with item and catalog interfaces including BOM support.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/inventory.ts`
- [ ] `InventoryItemType` type union defined
- [ ] `InventoryItemCreateRequest` for raw_material
- [ ] `InventoryItemCreateRequest` for finished_goods with BOMs
- [ ] `InventoryCatalogCreateRequest` with bundle support
- [ ] `InventoryCatalogTypesRequest` interface
- [ ] `InventoryCatalogOutletRequest` interface

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.6: Create Order Type Definitions

**Description:** Create `src/services/types/purchase.ts` and `src/services/types/sales.ts` with order interfaces.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/purchase.ts`
- [ ] `PurchaseOrderCreateRequest` with shipping details
- [ ] `PurchaseOrderItem` interface
- [ ] File created at `src/services/types/sales.ts`
- [ ] `SalesOrderCreateRequest` with shipping details
- [ ] `SalesOrderCancelRequest` interface
- [ ] `SalesReturnResponse` flexible interface

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.7: Create Production & Demand Type Definitions

**Description:** Create `src/services/types/production.ts` with production plan and demand interfaces.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/production.ts`
- [ ] `ProductionPlanCreateRequest` interface
- [ ] `ProductionPlanItem` interface
- [ ] `ProductionItemUpdateRequest` interface
- [ ] `DemandQueryParams` interface

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.8: Create Supplier Type Definitions

**Description:** Create `src/services/types/supplier.ts` with supplier interfaces.

**Acceptance Criteria:**
- [ ] File created at `src/services/types/supplier.ts`
- [ ] `SupplierCreateRequest` interface
- [ ] `SupplierUpdateRequest` interface
- [ ] Flexible response interfaces

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 1.1

---

## Phase 2: Auth & Outlet Services

**Goal:** Rebuild auth API with new endpoints and outlet API with new payload structure

### Task 2.1: Rebuild Auth API

**Description:** Rebuild `src/services/auth/api.ts` with new endpoints: signup, login, getMe, updateMe.

**Acceptance Criteria:**
- [ ] `authApi` created with `createApi`
- [ ] `signup` mutation endpoint (POST /auth/signup)
- [ ] `login` mutation endpoint (POST /auth/login)
- [ ] `getMe` query endpoint (GET /profile/me)
- [ ] `updateMe` mutation endpoint (PUT /profile/me)
- [ ] Tag type: "Auth" defined
- [ ] Proper TypeScript types from types/auth.ts

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 1.2

---

### Task 2.2: Preserve Auth Slice

**Description:** Copy existing auth slice to new location and verify it works with new API.

**Acceptance Criteria:**
- [ ] `src/services/auth/slice.ts` in place (from temp or preserved)
- [ ] `signout` action preserved
- [ ] `authReducer` exported correctly
- [ ] Integration with baseQuery signout dispatch

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 2.1

---

### Task 2.3: Rebuild Outlet API

**Description:** Rebuild `src/services/outlet/api.ts` with new payload structure and all endpoints.

**Acceptance Criteria:**
- [ ] `outletApi` created with `createApi`
- [ ] CRUD endpoints: getOutlets, getOutlet, createOutlet, updateOutlet, deleteOutlet
- [ ] Workflow endpoints: activateOutlet, deactivateOutlet
- [ ] `updateOutletChannels` mutation (PUT /outlet/:id/channels)
- [ ] Outlet Type CRUD endpoints
- [ ] Outlet Type activate/deactivate endpoints
- [ ] Tag types: "Outlet", "OutletType" defined
- [ ] Proper invalidation patterns

**Effort:** 3 hours
**Priority:** High
**Dependencies:** Task 1.3

---

### Task 2.4: Create Outlet Hooks

**Description:** Create `src/services/outlet/hooks.ts` using createCrudHook factory.

**Acceptance Criteria:**
- [ ] `useOutlet` hook exported
- [ ] `useOutletType` hook exported
- [ ] Hooks wrap lazy queries and mutations
- [ ] Standardized CRUD interface for UI components

**Effort:** 1.5 hours
**Priority:** High
**Dependencies:** Task 2.3

---

### Task 2.5: Create Region API (Preserve from temp)

**Description:** Move region API from temp back to src/services/region/ with minimal changes.

**Acceptance Criteria:**
- [ ] `src/services/region/api.ts` created from temp copy
- [ ] Endpoints preserved: getRegions, getRegion
- [ ] Tag type: "Region" defined

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 1.1

---

### Task 2.6: Update Reducer for Auth & Outlet

**Description:** Update `src/services/reducer.tsx` to register authApi and outletApi.

**Acceptance Criteria:**
- [ ] Import authApi and outletApi from new locations
- [ ] Add to `apiMiddlewares` array
- [ ] Add reducers to `combineReducers`
- [ ] Update imports from temp for preserved APIs

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 2.1, Task 2.3

---

## Phase 3: POS Services

**Goal:** Implement POS Menu, Category, Channel, Payment Method, and Member Topup Bonus APIs

### Task 3.1: Rebuild POS API (Menu & Category)

**Description:** Rebuild `src/services/pos/api.ts` with menu and category endpoints.

**Acceptance Criteria:**
- [ ] `posApi` created with `createApi`
- [ ] Menu CRUD: getMenus, getMenu, createMenu, updateMenu, deleteMenu
- [ ] Menu workflow: activateMenu, deactivateMenu
- [ ] `updateMenuTypes` mutation (PUT /pos/menu/:id/types)
- [ ] Category CRUD endpoints
- [ ] Category workflow: activateCategory, deactivateCategory
- [ ] Tag types: "POSMenu", "POSCategory" defined

**Effort:** 3 hours
**Priority:** High
**Dependencies:** Task 1.4, Task 2.6

---

### Task 3.2: Add POS Channel Endpoints

**Description:** Add POS channel endpoints to posApi.

**Acceptance Criteria:**
- [ ] Channel CRUD: getChannels, createChannel, updateChannel, deleteChannel
- [ ] Channel workflow: activateChannel, deactivateChannel
- [ ] Tag type: "POSChannel" defined

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 3.1

---

### Task 3.3: Create POS Hooks

**Description:** Create `src/services/pos/hooks.ts` using createCrudHook factory.

**Acceptance Criteria:**
- [ ] `usePOSMenu` hook exported
- [ ] `usePOSCategory` hook exported
- [ ] `usePOSChannel` hook exported
- [ ] Standardized CRUD interface

**Effort:** 1.5 hours
**Priority:** High
**Dependencies:** Task 3.2

---

### Task 3.4: Create Payment Method API

**Description:** Create `src/services/payment-method/api.ts` as separate service.

**Acceptance Criteria:**
- [ ] `paymentMethodApi` created with `createApi`
- [ ] CRUD: getPaymentMethods, getPaymentMethod, createPaymentMethod, updatePaymentMethod, deletePaymentMethod
- [ ] Workflow: activatePaymentMethod, deactivatePaymentMethod
- [ ] Tag type: "PaymentMethod" defined

**Effort:** 1.5 hours
**Priority:** High
**Dependencies:** Task 1.4

---

### Task 3.5: Create Payment Method Hooks

**Description:** Create `src/services/payment-method/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `usePaymentMethod` hook exported
- [ ] Standardized CRUD interface

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 3.4

---

### Task 3.6: Create Member Topup Bonus API

**Description:** Create `src/services/member/api.ts` for member topup bonus.

**Acceptance Criteria:**
- [ ] `memberTopupBonusApi` created with `createApi`
- [ ] CRUD: getTopupBonuses, getTopupBonus, createTopupBonus, updateTopupBonus, deleteTopupBonus
- [ ] Workflow: activateTopupBonus, deactivateTopupBonus
- [ ] Tag type: "TopupBonus" defined

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** Task 1.4

---

### Task 3.7: Create Member Topup Bonus Hooks

**Description:** Create `src/services/member/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useMemberTopupBonus` hook exported
- [ ] Standardized CRUD interface

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 3.6

---

### Task 3.8: Update Reducer for POS Services

**Description:** Update `src/services/reducer.tsx` to register all POS-related APIs.

**Acceptance Criteria:**
- [ ] Import posApi, paymentMethodApi, memberTopupBonusApi
- [ ] Add to `apiMiddlewares` array
- [ ] Add reducers to `combineReducers`

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 3.1, Task 3.4, Task 3.6

---

## Phase 4: Inventory Services

**Goal:** Rebuild inventory API with BOM support and new payload structure

### Task 4.1: Rebuild Inventory API (Items)

**Description:** Rebuild `src/services/inventory/api.ts` with item endpoints including raw_material and finished_goods.

**Acceptance Criteria:**
- [ ] `inventoryApi` created with `createApi`
- [ ] Item CRUD: getItems, getItem, createItem, updateItem, deleteItem
- [ ] Query param support for `type` filter
- [ ] Workflow: activateItem, deactivateItem
- [ ] Tag type: "InventoryItem" defined

**Effort:** 2.5 hours
**Priority:** High
**Dependencies:** Task 1.5, Task 2.6

---

### Task 4.2: Add Inventory Catalog Endpoints

**Description:** Add catalog endpoints to inventoryApi.

**Acceptance Criteria:**
- [ ] Catalog CRUD: getCatalogs, getCatalog, createCatalog, updateCatalog, deleteCatalog
- [ ] Workflow: activateCatalog, deactivateCatalog
- [ ] `updateCatalogTypes` mutation (PUT /inventory/catalog/:id/types)
- [ ] `updateCatalogOutlet` mutation (PUT /inventory/catalog/:id/outlet)
- [ ] Tag type: "InventoryCatalog" defined

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 4.1

---

### Task 4.3: Create Inventory Hooks

**Description:** Create `src/services/inventory/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useInventoryItem` hook exported
- [ ] `useInventoryCatalog` hook exported
- [ ] Standardized CRUD interface

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 4.2

---

### Task 4.4: Update Reducer for Inventory

**Description:** Update `src/services/reducer.tsx` to register inventoryApi.

**Acceptance Criteria:**
- [ ] Import inventoryApi from new location
- [ ] Add to `apiMiddlewares` array
- [ ] Add reducer to `combineReducers`

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 4.1

---

## Phase 5: Order Services

**Goal:** Rebuild purchase and sales APIs with workflow actions

### Task 5.1: Rebuild Purchase Order API

**Description:** Rebuild `src/services/purchase/api.ts` with new endpoints.

**Acceptance Criteria:**
- [ ] `purchaseApi` created with `createApi`
- [ ] CRUD: getPurchaseOrders, getPurchaseOrder, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder
- [ ] Workflow: publishPurchaseOrder (PUT /purchase/order/:id/publish)
- [ ] Workflow: paidPurchaseOrder (PUT /purchase/order/:id/paid)
- [ ] Tag type: "PurchaseOrder" defined

**Effort:** 2.5 hours
**Priority:** High
**Dependencies:** Task 1.6, Task 4.4

---

### Task 5.2: Create Purchase Order Hooks

**Description:** Create `src/services/purchase/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `usePurchaseOrder` hook exported
- [ ] Standardized CRUD interface with workflow actions

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 5.1

---

### Task 5.3: Rebuild Sales Order API

**Description:** Rebuild `src/services/sales/api.ts` with new endpoints.

**Acceptance Criteria:**
- [ ] `salesApi` created with `createApi`
- [ ] CRUD: getSalesOrders, getSalesOrder, createSalesOrder, updateSalesOrder, deleteSalesOrder
- [ ] Workflow: publishSalesOrder (PUT /sales/order/:id/publish)
- [ ] Workflow: paidSalesOrder (PUT /sales/order/:id/paid)
- [ ] Workflow: cancelSalesOrder (PUT /sales/order/:id/cancel)
- [ ] Tag type: "SalesOrder" defined

**Effort:** 2.5 hours
**Priority:** High
**Dependencies:** Task 1.6, Task 4.4

---

### Task 5.4: Create Sales Order Hooks

**Description:** Create `src/services/sales/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useSalesOrder` hook exported
- [ ] Standardized CRUD interface with workflow actions

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 5.3

---

### Task 5.5: Create Sales Return API

**Description:** Create `src/services/sales-return/api.ts` for sales return management.

**Acceptance Criteria:**
- [ ] `salesReturnApi` created with `createApi`
- [ ] GET: getSalesReturns, getSalesReturn
- [ ] Workflow: approveSalesReturn (PUT /sales/return/:id/approve)
- [ ] Tag type: "SalesReturn" defined

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** Task 1.6

---

### Task 5.6: Create Sales Return Hooks

**Description:** Create `src/services/sales-return/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useSalesReturn` hook exported
- [ ] Standardized interface with approve action

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 5.5

---

### Task 5.7: Update Reducer for Order Services

**Description:** Update `src/services/reducer.tsx` to register purchase, sales, and sales return APIs.

**Acceptance Criteria:**
- [ ] Import purchaseApi, salesApi, salesReturnApi
- [ ] Add to `apiMiddlewares` array
- [ ] Add reducers to `combineReducers`

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 5.1, Task 5.3, Task 5.5

---

## Phase 6: Production & Demand Services

**Goal:** Implement production planning and demand forecasting APIs

### Task 6.1: Create Production API

**Description:** Create `src/services/production/api.ts` with production plan endpoints.

**Acceptance Criteria:**
- [ ] `productionApi` created with `createApi`
- [ ] Plan CRUD: getProductionPlans, getProductionPlan, createProductionPlan, deleteProductionPlan
- [ ] Workflow: publishProductionPlan (PUT /production/plan/:id/publish)
- [ ] Workflow: completeProductionPlan (PUT /production/plan/:id/complete)
- [ ] Tag types: "ProductionPlan", "ProductionItem" defined

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** Task 1.7, Task 4.4

---

### Task 6.2: Add Production Item Endpoints

**Description:** Add production item endpoints to productionApi.

**Acceptance Criteria:**
- [ ] `updateProductionItem` mutation (PUT /production/item/:id)
- [ ] `completeProductionItem` mutation (PUT /production/item/:id/complete)
- [ ] Proper invalidation of "ProductionPlan" tags

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** Task 6.1

---

### Task 6.3: Create Production Hooks

**Description:** Create `src/services/production/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useProductionPlan` hook exported
- [ ] `useProductionItem` hook exported
- [ ] Standardized interface with workflow actions

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** Task 6.2

---

### Task 6.4: Create Demand API

**Description:** Create `src/services/demand/api.ts` for demand forecasting.

**Acceptance Criteria:**
- [ ] `demandApi` created with `createApi`
- [ ] `getDemandProduction` query with production_date param
- [ ] `getDemandItem` query
- [ ] Tag type: "DemandData" defined

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** Task 1.7

---

### Task 6.5: Create Demand Hooks

**Description:** Create `src/services/demand/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useDemand` hook exported
- [ ] Query interface for production and item demand

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 6.4

---

### Task 6.6: Update Reducer for Production & Demand

**Description:** Update `src/services/reducer.tsx` to register production and demand APIs.

**Acceptance Criteria:**
- [ ] Import productionApi, demandApi
- [ ] Add to `apiMiddlewares` array
- [ ] Add reducers to `combineReducers`

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 6.1, Task 6.4

---

## Phase 7: Supporting Services

**Goal:** Implement warehouse and supplier APIs

### Task 7.1: Create Warehouse API

**Description:** Create `src/services/warehouse/api.ts` with GET-only endpoints.

**Acceptance Criteria:**
- [ ] `warehouseApi` created with `createApi`
- [ ] `getWarehouses` query endpoint (GET /warehouse)
- [ ] Tag type: "Warehouse" defined

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** Task 2.6

---

### Task 7.2: Create Warehouse Hooks

**Description:** Create `src/services/warehouse/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useWarehouse` hook exported
- [ ] Query-only interface

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 7.1

---

### Task 7.3: Create Supplier API

**Description:** Create `src/services/supplier/api.ts` with full CRUD.

**Acceptance Criteria:**
- [ ] `supplierApi` created with `createApi`
- [ ] CRUD: getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier
- [ ] Workflow: activateSupplier, deactivateSupplier
- [ ] Tag type: "Supplier" defined

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** Task 1.8

---

### Task 7.4: Create Supplier Hooks

**Description:** Create `src/services/supplier/hooks.ts` using createCrudHook.

**Acceptance Criteria:**
- [ ] `useSupplier` hook exported
- [ ] Standardized CRUD interface

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 7.3

---

### Task 7.5: Update Reducer for Supporting Services

**Description:** Update `src/services/reducer.tsx` to register warehouse and supplier APIs.

**Acceptance Criteria:**
- [ ] Import warehouseApi, supplierApi
- [ ] Add to `apiMiddlewares` array
- [ ] Add reducers to `combineReducers`

**Effort:** 0.5 hours
**Priority:** Medium
**Dependencies:** Task 7.1, Task 7.3

---

## Phase 8: Integration & Verification

**Goal:** Final integration and verification of all services

### Task 8.1: Update Store Persistence Blacklist

**Description:** Update `src/services/store.tsx` to add all new API reducers to persist blacklist.

**Acceptance Criteria:**
- [ ] All API reducer paths added to `persistConfig.blacklist`
- [ ] Prevents API cache from being persisted to localStorage
- [ ] Existing persist configuration preserved

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** All previous phases

---

### Task 8.2: TypeScript Compilation Verification

**Description:** Run TypeScript compilation to verify no type errors.

**Acceptance Criteria:**
- [ ] `npm run build` or `tsc --noEmit` passes without errors
- [ ] All type imports resolve correctly
- [ ] No implicit `any` types in new code

**Effort:** 1 hour
**Priority:** High
**Dependencies:** Task 8.1

---

### Task 8.3: Endpoint Coverage Audit

**Description:** Manually audit all endpoints against Postman collection to ensure 100% coverage.

**Acceptance Criteria:**
- [ ] All endpoints from spec.md implemented
- [ ] All workflow actions (activate, deactivate, publish, paid, cancel, approve, complete) implemented
- [ ] No missing endpoints
- [ ] Create audit checklist documenting coverage

**Effort:** 1.5 hours
**Priority:** High
**Dependencies:** Task 8.2

---

## Quick Reference Checklist

### Phase 1: Preparation
- [ ] 1.1: Migrate Old Services to temp/
- [ ] 1.2: Create Auth Type Definitions
- [ ] 1.3: Create Outlet Type Definitions
- [ ] 1.4: Create POS Type Definitions
- [ ] 1.5: Create Inventory Type Definitions
- [ ] 1.6: Create Order Type Definitions
- [ ] 1.7: Create Production & Demand Type Definitions
- [ ] 1.8: Create Supplier Type Definitions

### Phase 2: Auth & Outlet Services
- [ ] 2.1: Rebuild Auth API
- [ ] 2.2: Preserve Auth Slice
- [ ] 2.3: Rebuild Outlet API
- [ ] 2.4: Create Outlet Hooks
- [ ] 2.5: Create Region API (Preserve from temp)
- [ ] 2.6: Update Reducer for Auth & Outlet

### Phase 3: POS Services
- [ ] 3.1: Rebuild POS API (Menu & Category)
- [ ] 3.2: Add POS Channel Endpoints
- [ ] 3.3: Create POS Hooks
- [ ] 3.4: Create Payment Method API
- [ ] 3.5: Create Payment Method Hooks
- [ ] 3.6: Create Member Topup Bonus API
- [ ] 3.7: Create Member Topup Bonus Hooks
- [ ] 3.8: Update Reducer for POS Services

### Phase 4: Inventory Services
- [ ] 4.1: Rebuild Inventory API (Items)
- [ ] 4.2: Add Inventory Catalog Endpoints
- [ ] 4.3: Create Inventory Hooks
- [ ] 4.4: Update Reducer for Inventory

### Phase 5: Order Services
- [ ] 5.1: Rebuild Purchase Order API
- [ ] 5.2: Create Purchase Order Hooks
- [ ] 5.3: Rebuild Sales Order API
- [ ] 5.4: Create Sales Order Hooks
- [ ] 5.5: Create Sales Return API
- [ ] 5.6: Create Sales Return Hooks
- [ ] 5.7: Update Reducer for Order Services

### Phase 6: Production & Demand Services
- [ ] 6.1: Create Production API
- [ ] 6.2: Add Production Item Endpoints
- [ ] 6.3: Create Production Hooks
- [ ] 6.4: Create Demand API
- [ ] 6.5: Create Demand Hooks
- [ ] 6.6: Update Reducer for Production & Demand

### Phase 7: Supporting Services
- [ ] 7.1: Create Warehouse API
- [ ] 7.2: Create Warehouse Hooks
- [ ] 7.3: Create Supplier API
- [ ] 7.4: Create Supplier Hooks
- [ ] 7.5: Update Reducer for Supporting Services

### Phase 8: Integration & Verification
- [ ] 8.1: Update Store Persistence Blacklist
- [ ] 8.2: TypeScript Compilation Verification
- [ ] 8.3: Endpoint Coverage Audit

---

## Next Steps

1. Review task breakdown
2. Run `/implement new-api-service` to start execution

---

*Tasks created with SDD 4.0*
