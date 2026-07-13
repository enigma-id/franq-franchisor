# Implementation Tasks: API Contract Remediation

**Task ID:** api-audit
**Created:** 2026-07-09
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 30 |
| Estimated Effort | ~9-11h |
| Phases | 5 |

## Dependency Map

```
Phase 1 (Fix Payloads) ──┬──► Phase 4 (Type Cleanup)
                          │
Phase 2 (Remove Extraneous) ──► Phase 3 (Add Missing Modules) ──► Phase 5 (Pages + Routes)
```

Phases 1+2 are independent of each other (can run in parallel). Phase 3 depends on Phase 1 (types need fixing first). Phase 5 depends on Phase 3.

---

## Phase 1: Fix Critical Payload Mismatches

**Goal:** Unblock functionality that's currently broken due to incorrect request payloads.

**Effort:** ~1h | **Priority:** Critical | **Dependencies:** None

### Task 1.1: Add `page_size` to PaginationMeta

**Description:** Add `page_size` field to `PaginationMeta` interface in `src/services/types/api.ts`. Keep existing `limit` field for backward compatibility.

**Acceptance Criteria:**
- [ ] `PaginationMeta` has both `limit` and `page_size` optional number fields
- [ ] Existing code using `limit` continues to work unchanged

**Effort:** 5m
**Priority:** High
**Dependencies:** None

---

### Task 1.2: Fix OutletCreateRequest.channels → `string[]`

**Description:** Change `OutletCreateRequest.channels` from `OutletChannel[]` to `string[]` per contract. Remove the `OutletChannel` interface from `src/services/types/outlet.ts`.

**Acceptance Criteria:**
- [ ] `OutletCreateRequest.channels` is typed as `string[]`
- [ ] `OutletChannel` interface is removed or marked deprecated
- [ ] All pages that use `OutletChannel` type are updated (audit usage first)

**Effort:** 10m
**Priority:** Critical
**Dependencies:** None

---

### Task 1.3: Fix OutletChannelsUpdateRequest.channels → `string[]`

**Description:** Change `OutletChannelsUpdateRequest.channels` from `OutletChannel[]` to `string[]` per contract.

**Acceptance Criteria:**
- [ ] `OutletChannelsUpdateRequest.channels` is typed as `string[]`
- [ ] No references to `OutletChannel` in outlet type file remain

**Effort:** 5m
**Priority:** Critical
**Dependencies:** Task 1.2

---

### Task 1.4: Fix Upload `contentType` → `content_type`

**Description:** Rename `contentType` to `content_type` in `src/services/upload/api.tsx` query parameter to match contract snake_case.

**Acceptance Criteria:**
- [ ] Upload API service sends `content_type` instead of `contentType`
- [ ] All callers of the upload hook pass `content_type` (or should be checked)

**Effort:** 5m
**Priority:** Critical
**Dependencies:** None

---

### Task 1.5: Fix TopupBonusBase field names

**Description:** Rename fields in `TopupBonusBase` in `src/services/types/pos.ts`:
- `name` → remove (not in contract)
- `amount` → `min_amount`
- `bonus` → `bonus_percentage`

**Acceptance Criteria:**
- [ ] `TopupBonusBase` has `min_amount: number` and `bonus_percentage: number`
- [ ] `name` field is removed
- [ ] All pages referencing old field names are updated

**Effort:** 10m
**Priority:** Critical
**Dependencies:** None

---

### Task 1.6: Fix SalesOrderItem request field names

**Description:** Split `SalesOrderItem` into request vs response types or rename fields:
- Request: `quantity` → `quantity_ordered`
- Request: Remove `unit_price` and `discount` (response-only)
- Keep response type (`SalesOrderItemDetail` or similar) with all fields intact

Create a dedicated `SalesOrderItemRequest` type for POST body.

**Acceptance Criteria:**
- [ ] `SalesOrderItemRequest` has `catalog_id: string` and `quantity_ordered: number` only
- [ ] `SalesOrderPOST` (or `SalesOrderRequest`) uses `SalesOrderItemRequest[]` for items
- [ ] Existing `SalesOrderItemDetail` response type preserves `unit_price`, `discount`, `quantity`
- [ ] All pages using the old item type for requests are updated

**Effort:** 15m
**Priority:** Critical
**Dependencies:** None

---

### Task 1.7: Fix SalesOrderBase region and shipping fields

**Description:** Fix `SalesOrderBase` in `src/services/types/sales.ts`:
- `recipient_region_id` → `region_id`
- Add `shipping_charges: number`

**Acceptance Criteria:**
- [ ] `SalesOrderBase` has `region_id: string` (not `recipient_region_id`)
- [ ] `SalesOrderBase` has `shipping_charges: number`
- [ ] All pages referencing `recipient_region_id` are updated

**Effort:** 10m
**Priority:** High
**Dependencies:** None

---

### Task 1.8: Fix ProductionPlanRequest items field name

**Description:** Rename `quantity_planned` → `quantity` in `ProductionPlanRequest.items[]` in `src/services/types/production.ts`.

**Acceptance Criteria:**
- [ ] `ProductionPlanRequest.items` uses `{ item_id: string; quantity: number }`
- [ ] Production plan create page passes `quantity` instead of `quantity_planned`
- [ ] `ProductionPlanItem` response type (if separate) keeps `quantity_planned` if backend returns it

**Effort:** 5m
**Priority:** Critical
**Dependencies:** None

---

## Phase 2: Remove Extraneous Endpoints

**Goal:** Remove API endpoints that exist in the codebase but are NOT defined in the API contract.

**Effort:** ~1h | **Priority:** High | **Dependencies:** None (parallel with Phase 1)

### Task 2.1: Remove rejectSalesReturn from API + hooks

**Description:** Remove `rejectSalesReturn` mutation from `src/services/sales/api.tsx` and `src/services/sales/hooks.tsx`.

**Acceptance Criteria:**
- [ ] `rejectSalesReturn` / `useRejectSalesReturnMutation` removed from sales API service
- [ ] `reject` operation removed from sales return CRUD hook config
- [ ] No TypeScript errors in affected files

**Effort:** 10m
**Priority:** High
**Dependencies:** None

---

### Task 2.2: Remove reject button from Sales Return detail page

**Description:** Remove reject button, reject confirmation dialog, and any reject-related handlers from `src/pages/sales/return/salesReturnDetail.tsx`.

**Acceptance Criteria:**
- [ ] No "Reject" button visible on Sales Return detail page
- [ ] No reject-related logic in the page component
- [ ] Guards no longer expose `canReject` (if applicable)

**Effort:** 15m
**Priority:** High
**Dependencies:** Task 2.1

---

### Task 2.3: Remove updatePlan from production API + hooks

**Description:** Remove `updatePlan` mutation from `src/services/production/api.tsx` and `src/services/production/hooks.tsx`.

**Acceptance Criteria:**
- [ ] `updatePlan` / `useUpdateProductionPlanMutation` removed from production API service
- [ ] `update` operation removed from production plan CRUD hook config
- [ ] No TypeScript errors in affected files

**Effort:** 10m
**Priority:** High
**Dependencies:** None

---

### Task 2.4: Remove cancelPlan from production API + hooks

**Description:** Remove `cancelPlan` mutation from `src/services/production/api.tsx` and `src/services/production/hooks.tsx`.

**Acceptance Criteria:**
- [ ] `cancelPlan` / `useCancelProductionPlanMutation` removed from production API service
- [ ] `cancel` operation removed from production plan CRUD hook config
- [ ] No TypeScript errors in affected files

**Effort:** 10m
**Priority:** High
**Dependencies:** None

---

### Task 2.5: Remove cancel button from Production Plan page

**Description:** Remove cancel button, cancel confirmation dialog, and cancel-related handlers from Production Plan detail page.

**Acceptance Criteria:**
- [ ] No "Cancel" button on Production Plan detail page
- [ ] No cancel-related logic in the production plan detail page component
- [ ] Guards no longer expose `canCancel` (if applicable)

**Effort:** 15m
**Priority:** High
**Dependencies:** Task 2.4

---

## Phase 3: Add Missing Modules — API Services + Types

**Goal:** Create new API services, types, and hooks for modules defined in the contract but missing from the codebase.

**Effort:** ~2.5h | **Priority:** Medium | **Dependencies:** Phase 1 (types need fixing first)

### Task 3.1: Create Franchisor type + API + hook

**Description:** Create `src/services/types/franchisor.ts`, `src/services/franchisor/api.tsx`, and `src/services/franchisor/hooks.tsx` for GET/PUT `/franchisor/me`.

**Acceptance Criteria:**
- [ ] `FranchisorBase`, `FranchisorDetail`, `FranchisorUpdateRequest` types created
- [ ] API service with `getFranchisor` (GET) and `updateFranchisor` (PUT) endpoints
- [ ] Hook with `useLazyGetFranchisorQuery` and `useUpdateFranchisorMutation`
- [ ] No TypeScript errors

**Effort:** 20m
**Priority:** Medium
**Dependencies:** None

---

### Task 3.2: Create User types

**Description:** Create `src/services/types/user.ts` with `UserBase`, `UserCreateRequest`, `UserUpdateRequest`, `UserDetail`, `UserGroupBase`, `UserGroupDetail`.

**Acceptance Criteria:**
- [ ] All user types match contract field names
- [ ] `UserCreateRequest` includes `password` and `confirm_password`
- [ ] `UserUpdateRequest` has all optional fields
- [ ] User Group types match contract definition

**Effort:** 15m
**Priority:** Medium
**Dependencies:** None

---

### Task 3.3: Create User API + hook

**Description:** Create `src/services/user/api.tsx` and `src/services/user/hooks.tsx` with full CRUD + activate/deactivate. Use `createCrudHook` pattern.

**Acceptance Criteria:**
- [ ] 7 endpoints: GET list, POST create, GET detail, PUT update, DELETE, PUT activate, PUT deactivate
- [ ] Uses `createCrudHook` factory with `customOperations` for activate/deactivate
- [ ] Standard `useUser()` hook exported with all operations
- [ ] No TypeScript errors

**Effort:** 25m
**Priority:** Medium
**Dependencies:** Task 3.2

---

### Task 3.4: Create User Group API + hook

**Description:** Create `src/services/user/usergroup/api.tsx` and `src/services/user/usergroup/hooks.tsx` with standard CRUD.

**Acceptance Criteria:**
- [ ] 5 endpoints: GET list, POST create, GET detail, PUT update, DELETE
- [ ] Uses `createCrudHook` factory
- [ ] `useUserGroup()` hook exported
- [ ] No TypeScript errors

**Effort:** 20m
**Priority:** Medium
**Dependencies:** Task 3.2

---

### Task 3.5: Create B2B Order types + API + hook

**Description:** Create `src/services/types/b2b.ts`, `src/services/b2b/api.tsx`, and `src/services/b2b/hooks.tsx` with 9 endpoints including workflow actions (ship, receive, invoice, pay).

**Acceptance Criteria:**
- [ ] Types: `B2BOrderRequest`, `B2BOrderDetail`, `B2BOrderItem`, status unions
- [ ] 9 endpoints: GET list, POST create, GET detail, PUT update, DELETE, PUT ship, PUT receive, PUT invoice, PUT pay
- [ ] Uses `createCrudHook` with `customOperations` for workflow actions
- [ ] `useB2BOrder()` hook exported
- [ ] No TypeScript errors

**Effort:** 40m
**Priority:** Medium
**Dependencies:** None

---

### Task 3.6: Create Outlet Topup types + API + hook

**Description:** Create `src/services/types/outlet-topup.ts`, `src/services/outlet-topup/api.tsx`, and `src/services/outlet-topup/hooks.tsx` with list, detail, approve, reject.

**Acceptance Criteria:**
- [ ] Types: `OutletTopupStatus`, `OutletTopupRequestDetail`, `OutletTopupRejectRequest`
- [ ] GET list via TableApi (add table config)
- [ ] GET detail via `useLazyGetOutletTopupQuery`
- [ ] PUT approve/reject mutations
- [ ] No TypeScript errors

**Effort:** 25m
**Priority:** Medium
**Dependencies:** None

---

### Task 3.7: Add Production Item endpoints

**Description:** Add `updateProductionItem` (PUT `/production/item/{id}`) and `completeProductionItem` (PUT `/production/item/{id}/complete`) to existing `src/services/production/api.tsx` and `hooks.tsx`.

**Acceptance Criteria:**
- [ ] `updateProductionItem` mutation added to production API
- [ ] `completeProductionItem` mutation added to production API
- [ ] Exposed via production hooks
- [ ] No TypeScript errors

**Effort:** 15m
**Priority:** Medium
**Dependencies:** Task 1.8

---

### Task 3.8: Fix ProductionItemUpdateRequest type

**Description:** Fix `ProductionItemUpdateRequest` in `src/services/types/production.ts` per contract: rename `quantity_planned` → `quantity`, remove `note`.

**Acceptance Criteria:**
- [ ] `ProductionItemUpdateRequest.quantity_planned` → `quantity: number`
- [ ] `note` field removed
- [ ] No TypeScript errors

**Effort:** 5m
**Priority:** Medium
**Dependencies:** None

---

### Task 3.9: Add POS Menu Price endpoint

**Description:** Add `getMenuPrices` (GET `/pos/menu/price`) to existing `src/services/pos/api.tsx` and expose via hooks.

**Acceptance Criteria:**
- [ ] `getMenuPrices` / `useLazyGetMenuPricesQuery` added to POS API service
- [ ] Exposed via POS hooks
- [ ] No TypeScript errors

**Effort:** 10m
**Priority:** Medium
**Dependencies:** None

---

## Phase 4: Type Cleanup + Enum Alignment

**Goal:** Align types with contract enum values and clean up response-only fields from request types.

**Effort:** ~35m | **Priority:** Low | **Dependencies:** Phase 1

### Task 4.1: Align SupplierType with contract values

**Description:** Update `SupplierType` in `src/services/types/supplier.ts`: remove `wholesaler`/`retailer`, ensure `distributor`/`factory`/`store` are present per contract.

**Acceptance Criteria:**
- [ ] `SupplierType` includes `distributor`, `factory`, `store`
- [ ] `wholesaler` and `retailer` removed (or deprecated)
- [ ] All pages using removed enum values are updated

**Effort:** 5m
**Priority:** Low
**Dependencies:** None

---

### Task 4.2: Add document_status/payment_status union types

**Description:** Add typed union literals for `document_status` and `payment_status` across Sales Order, Purchase Order, B2B Order, and Production Plan types.

**Acceptance Criteria:**
- [ ] `SalesDocumentStatus`, `PurchaseDocumentStatus`, `B2BDocumentStatus`, `ProductionDocumentStatus` union types created
- [ ] `PaymentStatus` union type (`"unpaid" | "paid"`) created and reused
- [ ] Existing `string` status fields replaced with union types where applicable
- [ ] No TypeScript errors from existing code

**Effort:** 15m
**Priority:** Low
**Dependencies:** None

---

### Task 4.3: Split POSMenuCreateRequest — remove response-only fields

**Description:** Audit `POSMenuCreateRequest` in `src/services/types/pos.ts` for fields that are server-assigned (id, menu_id, timestamps) and create a clean request type.

**Acceptance Criteria:**
- [ ] Separate `POSMenuCreateRequest` type without `id`, `menu_id`, or server-generated fields
- [ ] Response type (e.g., `POSMenuDetail`) retains all response fields
- [ ] Create page uses the clean request type
- [ ] No TypeScript errors

**Effort:** 15m
**Priority:** Low
**Dependencies:** None

---

## Phase 5: Pages + Routes for New Modules

**Goal:** Wire up new API services with pages and route entries.

**Effort:** ~4-6h | **Priority:** Medium | **Dependencies:** Phase 3

### Task 5.1: Add routes for new modules

**Description:** Add route entries in `src/routes/index.tsx` for: Franchisor, User, User Group, B2B Order, Outlet Topup, Production Item (reuse production routes).

**Acceptance Criteria:**
- [ ] Route paths added for each new module
- [ ] Routes use lazy-loaded page components
- [ ] Protected by `ProtectedRoute` (inside AuthorizedLayout)
- [ ] No duplicate routes

**Effort:** 10m
**Priority:** Medium
**Dependencies:** Phase 3 complete

---

### Task 5.2: Create B2B Order pages (list, detail)

**Description:** Create B2B Order list page (with TableApi config) and detail page with state machine workflow (ship/receive/invoice/pay buttons driven by guards).

**Acceptance Criteria:**
- [ ] B2B Order list page with table config (`url: "/b2b/order"`)
- [ ] B2B Order detail page showing order info and items
- [ ] Workflow buttons (ship/receive/invoice/pay) visible based on document_status
- [ ] Guard hooks for state transitions
- [ ] Proper navigation between list → detail

**Effort:** 1-2h
**Priority:** Medium
**Dependencies:** Task 3.5, Task 5.1

---

### Task 5.3: Create Outlet Topup pages (list, detail)

**Description:** Create Outlet Topup list page (with TableApi config) and detail page with approve/reject workflow.

**Acceptance Criteria:**
- [ ] Outlet Topup list page with table config (`url: "/outlet-topup-request"`)
- [ ] Outlet Topup detail page showing request info
- [ ] Approve/Reject buttons driven by status
- [ ] Reject dialog includes `rejected_reason` field

**Effort:** 1h
**Priority:** Medium
**Dependencies:** Task 3.6, Task 5.1

---

### Task 5.4: Create User management pages (list, create, detail, update)

**Description:** Create User list page (TableApi with `url: "/user"`), create/edit forms, and detail page with activate/deactivate.

**Acceptance Criteria:**
- [ ] User list page with table config
- [ ] User create page with form matching `UserCreateRequest`
- [ ] User detail page showing all fields
- [ ] User update page with partial-update form
- [ ] Activate/Deactivate toggle on detail page

**Effort:** 1-2h
**Priority:** Medium
**Dependencies:** Task 3.3, Task 5.1

---

### Task 5.5: Create Franchisor profile page

**Description:** Create a simple form page for viewing/editing Franchisor profile using GET/PUT `/franchisor/me`.

**Acceptance Criteria:**
- [ ] Profile page loads current franchisor data via `useLazyGetFranchisorQuery`
- [ ] Edit form with all `FranchisorBase` fields
- [ ] Save triggers `updateFranchisor` mutation
- [ ] Success notification on save

**Effort:** 30m
**Priority:** Medium
**Dependencies:** Task 3.1, Task 5.1

---

## Quick Reference Checklist

### Phase 1: Fix Payload Mismatches
- [ ] 1.1: Add `page_size` to PaginationMeta
- [ ] 1.2: Fix Outlet channels → string[]
- [ ] 1.3: Fix OutletChannelsUpdateRequest → string[]
- [ ] 1.4: Fix Upload contentType → content_type
- [ ] 1.5: Fix TopupBonusBase fields
- [ ] 1.6: Fix SalesOrderItem quantity_ordered
- [ ] 1.7: Fix SalesOrderBase region_id + shipping_charges
- [ ] 1.8: Fix ProductionPlanRequest quantity

### Phase 2: Remove Extraneous Endpoints
- [ ] 2.1: Remove rejectSalesReturn
- [ ] 2.2: Remove reject button from Sales Return page
- [ ] 2.3: Remove updatePlan
- [ ] 2.4: Remove cancelPlan
- [ ] 2.5: Remove cancel button from Production Plan page

### Phase 3: Add Missing Modules
- [ ] 3.1: Create Franchisor types + API + hook
- [ ] 3.2: Create User types
- [ ] 3.3: Create User API + hook
- [ ] 3.4: Create User Group API + hook
- [ ] 3.5: Create B2B Order types + API + hook
- [ ] 3.6: Create Outlet Topup types + API + hook
- [ ] 3.7: Add Production Item endpoints
- [ ] 3.8: Fix ProductionItemUpdateRequest
- [ ] 3.9: Add POS Menu Price endpoint

### Phase 4: Type Cleanup
- [ ] 4.1: Align SupplierType
- [ ] 4.2: Add document_status/payment_status union types
- [ ] 4.3: Split POSMenuCreateRequest

### Phase 5: Pages + Routes
- [ ] 5.1: Add routes for new modules
- [ ] 5.2: Create B2B Order pages
- [ ] 5.3: Create Outlet Topup pages
- [ ] 5.4: Create User management pages
- [ ] 5.5: Create Franchisor profile page

---

## Risk Notes

| Risk | Mitigation |
|------|-----------|
| Field renames break forms/pages | Always `grep` for old field names before renaming. Update all references. |
| Backend expects `limit` not `page_size` | Keep `limit` field, add `page_size` as optional — backward compatible |
| Removing reject/cancel endpoints while pages still reference them | Remove API first, THEN page code — or use grep to find all references first |

---

## Next Steps

1. Review task breakdown
2. Run `/implement api-audit` to start execution

---

*Tasks created with SDD 4.0*
