# Technical Plan: API Contract Remediation

**Task ID:** api-audit
**Status:** Ready for Implementation
**Based on:** `specs/active/api-audit/research.md`, `specs/api-contract.md`

---

## 1. System Architecture

### Approach

Remediation follows **3 tracks** in parallel where possible:

| Track | Focus | Pattern |
|-------|-------|---------|
| **Fix** | Payload/type mismatches, extraneous endpoints | Edit existing types + services |
| **Add** | New API services for missing modules | RTK Query `builder.query` (GET) + `builder.mutation` (POST/PUT/DELETE) |
| **Align** | Global type alignment (pagination, enums) | Edit type definitions |

### Pattern Reference

**For GET list endpoints:**
- Already-covered list endpoints use **TableApi** (`src/services/table/api.tsx`) with dynamic URL + `useLazyGetTableDataQuery`
- New modules needing GET lists → use `useLazyGetQuery` pattern (consistent with existing modules like `withdrawal/api.tsx`)
- Dedicated GET detail endpoints → use `builder.query` with `useLazy*Query`

**For CRUD + workflow:**
- Follow existing `createCrudHook` pattern from `src/services/hooks/createCrudHook.ts`
- Standard CRUD: `get` → `useLazyGetQuery`, `show` → `useLazyShowQuery`, `create`/`update`/`remove` → mutations
- Custom operations (approve/reject/publish/paid/activate/deactivate) → `customOperations` config

### Verified: TableApi Coverage

All table config URLs cross-referenced against contract. **List endpoints already covered:**

| Table Config URL | Module | Contract Endpoint |
|---|---|---|
| `/sales/order` | Sales Order | GET /sales/order |
| `/sales/return` | Sales Return | GET /sales/return |
| `/outlet` | Outlet | GET /outlet |
| `/outlet/type` | Outlet Type | GET /outlet/type |
| `/pos/menu` | POS Menu | GET /pos/menu |
| `/pos/category` | POS Category | GET /pos/category |
| `/pos/channel` | POS Channel | GET /pos/channel |
| `/payment/method` | Payment Method | GET /payment/method |
| `/supplier` | Supplier | GET /supplier |
| `/inventory/item` | Inventory Item | GET /inventory/item |
| `/inventory/catalog` | Inventory Catalog | GET /inventory/catalog |
| `/purchase/order` | Purchase Order | GET /purchase/order |
| `/production/plan` | Production Plan | GET /production/plan |
| `/warehouse` | Warehouse | GET /warehouse |
| `/withdrawal-request` | Withdrawal | GET /withdrawal-request |
| `/demand/production` | Demand | GET /demand/production |
| `/demand/item` | Demand | GET /demand/item |
| `/report/*` (7 configs) | Reports | All 13 GET report endpoints |

**Sales Order list + Sales Return list**: Are NOT missing — implemented via TableApi. Research report correctly noted these as PARTIAL (functional but not dedicated RTK query). No action needed.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| API Client | RTK Query (`createApi`) | Existing project standard |
| Base Query | `fetchBaseQuery` + custom `baseQuery.tsx` | Auth injection, error handling |
| CRUD Abstraction | `createCrudHook` factory | Existing pattern for all CRUD modules |
| Dynamic Tables | TableApi (`tableApi`) | Existing pattern for list views |
| Types | TypeScript interfaces | Existing pattern in `src/services/types/` |

**No new dependencies required.**

---

## 3. Component Design

### 3.1 New API Services to Create

| Module | Service File | Hooks File | Type File | Endpoints |
|--------|-------------|-----------|-----------|-----------|
| Franchisor | `src/services/franchisor/api.tsx` | `src/services/franchisor/hooks.tsx` | Add to `src/services/types/franchisor.ts` | GET/PUT `/franchisor/me` |
| User | `src/services/user/api.tsx` | `src/services/user/hooks.tsx` | Add to `src/services/types/user.ts` | 7 CRUD + activate/deactivate |
| User Group | `src/services/user/usergroup/api.tsx` | `src/services/user/usergroup/hooks.tsx` | In same user types file | 5 CRUD |
| B2B Order | `src/services/b2b/api.tsx` | `src/services/b2b/hooks.tsx` | Add to `src/services/types/b2b.ts` | 9 endpoints incl. ship/receive/invoice/pay |
| Outlet Topup | `src/services/outlet-topup/api.tsx` | `src/services/outlet-topup/hooks.tsx` | Add to `src/services/types/outlet-topup.ts` | 4 endpoints (list/detail/approve/reject) |
| Production Item | Add to `src/services/production/api.tsx` | Add to existing `production/hooks.tsx` | Fix existing `ProductionItemUpdateRequest` | 2 endpoints (update + complete) |
| POS Menu Price | Add to `src/services/pos/api.tsx` | Add to existing `pos/hooks.tsx` | Reuse `POSMenuDetail` | 1 endpoint (GET) |

### 3.2 Files to Modify

| File | Change |
|------|--------|
| `src/services/types/api.ts` | PaginationMeta: add `page_size` field (keep `limit` for backward compat) |
| `src/services/types/outlet.ts` | `OutletCreateRequest.channels` → `string[]`; remove `OutletChannel` |
| `src/services/types/sales.ts` | `SalesOrderItem.quantity` → `quantity_ordered`; `recipient_region_id` → `region_id`; add `shipping_charges`; remove `unit_price`/`discount` from request type |
| `src/services/types/production.ts` | `ProductionPlanRequest.items[].quantity_planned` → `quantity`; fix `ProductionItemUpdateRequest.quantity_planned` → `quantity`, remove `note` |
| `src/services/types/pos.ts` | `TopupBonusBase`: `name` → remove, `amount` → `min_amount`, `bonus` → `bonus_percentage` |
| `src/services/upload/api.tsx` | `contentType` → `content_type` in query params |
| `src/services/sales/api.tsx` | Remove `rejectSalesReturn` mutation |
| `src/services/sales/hooks.tsx` | Remove `rejectSalesReturn` from custom operations |
| `src/services/production/api.tsx` | Remove `updatePlan`, `cancelPlan` mutations |
| `src/services/production/hooks.tsx` | Remove `updatePlan`, `cancelPlan` from custom operations |
| `src/pages/sales/return/*` | Remove reject button/flow from Sales Return detail page |
| `src/pages/production/plan/*` | Remove cancel button from Production Plan detail page |

### 3.3 Existing Modules Verified Correct

No changes needed:
- Auth + Profile
- Dashboard
- Inventory (Item + Catalog)
- Outlet Type
- POS Category, POS Channel
- Payment Method
- Supplier
- Purchase Order
- Warehouse
- Withdrawal Request
- Reports (all 13)
- Demand
- Region

---

## 4. Data Model Changes

### 4.1 PaginationMeta — Add `page_size`

```ts
// Current
export interface PaginationMeta {
  page?: number;
  limit?: number;     // maps to contract "page_size"
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}

// Target: add page_size, keep limit for backward compat
export interface PaginationMeta {
  page?: number;
  limit?: number;
  page_size?: number;  // ← ADD (contract field)
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}
```

### 4.2 Outlet Channels — String array

```ts
// Current
export interface OutletChannel { pos_channel_id: string; is_active: boolean; }
export interface OutletCreateRequest extends OutletBase {
  channels: OutletChannel[];
}

// Target
export interface OutletCreateRequest extends OutletBase {
  channels: string[];   // ← array of channel IDs
}
// Remove OutletChannel interface entirely
// Also fix OutletChannelsUpdateRequest
```

### 4.3 Sales Order Request — Field alignment

```ts
// Current SalesOrderItem (used in requests)
export interface SalesOrderItem {
  catalog_id: string;
  quantity: number;         // ← should be quantity_ordered
  unit_price: number;       // ← remove (response-only)
  discount: number;         // ← remove (response-only)
}

// Current SalesOrderBase
export interface SalesOrderBase {
  recipient_region_id: string;  // ← should be region_id
  // missing: shipping_charges
}

// Target: split request vs response types
// Request type:
export interface SalesOrderItemRequest {
  catalog_id: string;
  quantity_ordered: number;
}
export interface SalesOrderRequest {
  warehouse_id: string;
  ref_code: string;
  outlet_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  region_id: string;              // ← renamed
  note: string;
  shipping_date: string;
  self_pickup: boolean;
  shipping_charges: number;       // ← added
  items: SalesOrderItemRequest[];
}
// Keep SalesOrderItemDetail as-is (response type with all fields)
```

### 4.4 Production Plan Request — Field alignment

```ts
// Current
items: Array<{ item_id: string; quantity_planned: number }>;

// Target
items: Array<{ item_id: string; quantity: number }>;
```

### 4.5 Production Item Update — Field alignment

```ts
// Current
export interface ProductionItemUpdateRequest {
  quantity_planned: number;
  note?: string;
}

// Target
export interface ProductionItemUpdateRequest {
  quantity: number;
}
```

### 4.6 Member Topup Bonus — Field alignment

```ts
// Current
export interface TopupBonusBase {
  name: string;
  amount: number;
  bonus: number;
}

// Target
export interface TopupBonusBase {
  min_amount: number;
  bonus_percentage: number;
}
```

### 4.7 Upload — Field alignment

```ts
// Current
query: (params: { filename: string; contentType: string }) => ({

// Target
query: (params: { filename: string; content_type: string }) => ({
```

### 4.8 New Types: Franchisor

```ts
// src/services/types/franchisor.ts
export interface FranchisorBase {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
}

export interface FranchisorDetail extends FranchisorBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type FranchisorUpdateRequest = FranchisorBase;
```

### 4.9 New Types: User & User Group

```ts
// src/services/types/user.ts
export interface UserBase {
  usergroup_id: string;
  username: string;
  name: string;
}

export interface UserCreateRequest extends UserBase {
  password: string;
  confirm_password: string;
}

export interface UserUpdateRequest {
  usergroup_id?: string;
  name?: string;
  password?: string;
  confirm_password?: string;
}

export interface UserDetail extends UserBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User Group
export interface UserGroupBase {
  name: string;
  permissions: Record<string, unknown>;
}

export interface UserGroupDetail extends UserGroupBase {
  id: string;
  created_at: string;
  updated_at: string;
}
```

### 4.10 New Types: B2B Order

```ts
// src/services/types/b2b.ts
export type B2BDocumentStatus = "pending" | "shipped" | "received" | "invoiced";
export type B2BPaymentStatus = "unpaid" | "paid";

export interface B2BOrderItem {
  menu_id: string;
  menu_name: string;
  quantity: number;
}

export interface B2BOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note?: string;
  discount_percentage?: number;
  discount_value?: number;
  service_charge?: number;
  shipping_date: string;
  items: B2BOrderItem[];
}

export interface B2BOrderDetail {
  id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string | null;
  document_status: B2BDocumentStatus;
  payment_status: B2BPaymentStatus;
  discount_percentage: number;
  discount_value: number;
  service_charge: number;
  shipping_date: string;
  total_charges: number;
  items: (B2BOrderItem & { id: string; unit_price: number })[];
  created_at: string;
  updated_at: string;
}
```

### 4.11 New Types: Outlet Topup Request

```ts
// src/services/types/outlet-topup.ts
export type OutletTopupStatus = "pending" | "approved" | "rejected";

export interface OutletTopupRequestDetail {
  id: string;
  outlet_id: string;
  amount: number;
  status: OutletTopupStatus;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
  outlet?: { id: string; name: string };
}

export interface OutletTopupRejectRequest {
  rejected_reason: string;
}
```

---

## 5. API Contracts for New Modules

### 5.1 Franchisor Service

| Method | Path | Hook | Operation |
|--------|------|------|-----------|
| GET | `/franchisor/me` | `useLazyGetFranchisorQuery` | Fetch profile |
| PUT | `/franchisor/me` | `useUpdateFranchisorMutation` | Update profile |

Pattern: Simple 2-endpoint service, no CRUD hook wrapper needed.

### 5.2 User Service

| Method | Path | Hook | Operation |
|--------|------|------|-----------|
| GET | `/user` | `useLazyGetUsersQuery` | List (can also use TableApi) |
| POST | `/user` | `useCreateUserMutation` | Create |
| GET | `/user/{id}` | `useLazyGetUserQuery` | Detail |
| PUT | `/user/{id}` | `useUpdateUserMutation` | Update |
| DELETE | `/user/{id}` | `useDeleteUserMutation` | Delete |
| PUT | `/user/{id}/activate` | `useActivateUserMutation` | Activate |
| PUT | `/user/{id}/deactivate` | `useDeactivateUserMutation` | Deactivate |

Pattern: Full CRUD + activate/deactivate via `createCrudHook`.

### 5.3 User Group Service

| Method | Path | Hook | Operation |
|--------|------|------|-----------|
| GET | `/user/usergroup` | `useLazyGetUserGroupsQuery` | List |
| POST | `/user/usergroup` | `useCreateUserGroupMutation` | Create |
| GET | `/user/usergroup/{id}` | `useLazyGetUserGroupQuery` | Detail |
| PUT | `/user/usergroup/{id}` | `useUpdateUserGroupMutation` | Update |
| DELETE | `/user/usergroup/{id}` | `useDeleteUserGroupMutation` | Delete |

### 5.4 B2B Order Service

| Method | Path | Hook | Operation |
|--------|------|------|-----------|
| GET | `/b2b/order` | `useLazyGetB2BOrdersQuery` | List (can also use TableApi) |
| POST | `/b2b/order` | `useCreateB2BOrderMutation` | Create |
| GET | `/b2b/order/{id}` | `useLazyGetB2BOrderQuery` | Detail |
| PUT | `/b2b/order/{id}` | `useUpdateB2BOrderMutation` | Update |
| DELETE | `/b2b/order/{id}` | `useDeleteB2BOrderMutation` | Delete |
| PUT | `/b2b/order/{id}/ship` | `useShipB2BOrderMutation` | Ship |
| PUT | `/b2b/order/{id}/receive` | `useReceiveB2BOrderMutation` | Receive |
| PUT | `/b2b/order/{id}/invoice` | `useInvoiceB2BOrderMutation` | Invoice |
| PUT | `/b2b/order/{id}/pay` | `usePayB2BOrderMutation` | Pay |

### 5.5 Outlet Topup Service

| Method | Path | Hook | Operation |
|--------|------|------|-----------|
| GET | `/outlet-topup-request` | TableApi | List |
| GET | `/outlet-topup-request/{id}` | `useLazyGetOutletTopupQuery` | Detail |
| PUT | `/outlet-topup-request/{id}/approve` | `useApproveOutletTopupMutation` | Approve |
| PUT | `/outlet-topup-request/{id}/reject` | `useRejectOutletTopupMutation` | Reject |

Pattern: Similar to withdrawal module.

### 5.6 Production Item (Add to existing production service)

| Method | Path | Hook |
|--------|------|------|
| PUT | `/production/item/{id}` | `useUpdateProductionItemMutation` |
| PUT | `/production/item/{id}/complete` | `useCompleteProductionItemMutation` |

### 5.7 POS Menu Price (Add to existing pos service)

| Method | Path | Hook |
|--------|------|------|
| GET | `/pos/menu/price` | `useLazyGetMenuPricesQuery` |

---

## 6. Implementation Phases

### Phase 1: Fix Critical Payload Mismatches (C1-C6)

**Goal:** Unblock functionality that's currently broken.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1.1 | Fix `PaginationMeta` — add `page_size` field | `src/services/types/api.ts` | 5m |
| 1.2 | Fix `OutletCreateRequest.channels` → `string[]` | `src/services/types/outlet.ts` | 10m |
| 1.3 | Fix `OutletChannelsUpdateRequest.channels` → `string[]` | `src/services/types/outlet.ts` | 5m |
| 1.4 | Fix Upload `contentType` → `content_type` | `src/services/upload/api.tsx` | 5m |
| 1.5 | Fix `TopupBonusBase` — rename fields | `src/services/types/pos.ts` | 10m |
| 1.6 | Fix `SalesOrderItem` — `quantity` → `quantity_ordered`, remove `unit_price`/`discount` from request | `src/services/types/sales.ts` | 15m |
| 1.7 | Fix `SalesOrderBase` — `recipient_region_id` → `region_id`, add `shipping_charges` | `src/services/types/sales.ts` | 10m |
| 1.8 | Fix `ProductionPlanRequest.items` — `quantity_planned` → `quantity` | `src/services/types/production.ts` | 5m |

### Phase 2: Remove Extraneous Endpoints (H1-H3)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 2.1 | Remove `rejectSalesReturn` from sales API + hooks | `src/services/sales/api.tsx`, `hooks.tsx` | 10m |
| 2.2 | Remove reject button/flow from Sales Return detail page | `src/pages/sales/return/salesReturnDetail.tsx` | 15m |
| 2.3 | Remove `updatePlan` from production API + hooks | `src/services/production/api.tsx`, `hooks.tsx` | 10m |
| 2.4 | Remove `cancelPlan` from production API + hooks | `src/services/production/api.tsx`, `hooks.tsx` | 10m |
| 2.5 | Remove cancel button from Production Plan page | `src/pages/production/plan/` | 15m |

### Phase 3: Add Missing Modules — API Services + Types (M1-M6)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 3.1 | Create Franchisor type + API + hook | `types/franchisor.ts`, `franchisor/api.tsx`, `franchisor/hooks.tsx` | 20m |
| 3.2 | Create User types | `types/user.ts` | 15m |
| 3.3 | Create User API + hook (CRUD + activate/deactivate) | `user/api.tsx`, `user/hooks.tsx` | 25m |
| 3.4 | Create User Group API + hook (CRUD) | `user/usergroup/api.tsx`, `user/usergroup/hooks.tsx` | 20m |
| 3.5 | Create B2B Order types + API + hook (9 endpoints) | `types/b2b.ts`, `b2b/api.tsx`, `b2b/hooks.tsx` | 40m |
| 3.6 | Create Outlet Topup types + API + hook (4 endpoints) | `types/outlet-topup.ts`, `outlet-topup/api.tsx`, `outlet-topup/hooks.tsx` | 25m |
| 3.7 | Add Production Item endpoints to existing production service | `production/api.tsx`, `production/hooks.tsx` | 15m |
| 3.8 | Fix `ProductionItemUpdateRequest` type | `types/production.ts` | 5m |
| 3.9 | Add POS Menu Price endpoint | `pos/api.tsx`, `pos/hooks.tsx` | 10m |

### Phase 4: Type Cleanup + Enum Alignment (L1, L4, L5)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 4.1 | Align `SupplierType` with contract values | `types/supplier.ts` | 5m |
| 4.2 | Add document_status/payment_status union types | `types/sales.ts`, `types/purchase.ts` | 15m |
| 4.3 | Split `POSMenuCreateRequest` → separate request type (remove response-only fields) | `types/pos.ts` | 15m |

### Phase 5: Pages + Routes for New Modules (optional, depends on priority)

| # | Task | Effort |
|---|------|--------|
| 5.1 | Add routes for new modules in `src/routes/index.tsx` | 10m |
| 5.2 | Create placeholder pages for B2B Order (list, detail) | 1-2h |
| 5.3 | Create placeholder pages for Outlet Topup (list, detail) | 1h |
| 5.4 | Create placeholder pages for User management | 1-2h |
| 5.5 | Create placeholder page for Franchisor profile | 30m |

---

## 7. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Field changes break existing forms/pages | High | Medium | Audit all usages of changed fields before renaming. Update page code that references old field names. |
| Backend actually expects different format than contract | High | Low | Spot-check with actual API calls before/after fixes |
| Removing `rejectSalesReturn` causes regression if backend DOES support it | Medium | Low | Verify with backend team first, or comment out instead of delete |
| Removing `updatePlan`/`cancelPlan` causes regression | Medium | Low | Backend state machine likely enforces these — verify |

---

## 8. Open Questions

1. **Pagination**: Does the backend return `page_size` or `limit`? Current type has `limit` which suggests the backend actually returns `limit`. Need confirmation before adding `page_size` field. Answer: up to you, if this will cause a disaster better not, if you think it will getting better and not causing the chaos then do it.
2. **Outlet channels**: Does the backend accept both `string[]` and object array format? Need to check. Answer: check the api needed.
3. **Sales Return reject**: Does the backend actually support `PUT /sales/return/{id}/reject`? Contract says no, but it may be undocumented. Answer: if theres not in the contract then no.
4. **Production Plan update**: Does the backend support `PUT /production/plan/{id}`? Contract says no. Answer: if theres not in the contract then no.
5. **Production Plan cancel**: Does the backend support `PUT /production/plan/{id}/cancel`? Contract state machine says no. Answer: if theres not in the contract then no.
6. **B2B Order priority**: Is B2B Order CRUD needed now or is it a future feature? Answer: now.
7. **Outlet Topup priority**: Is Outlet Topup management needed now? Answer: now.

---

## 9. Effort Summary

| Phase | Tasks | Est. Effort |
|-------|-------|-------------|
| Phase 1: Fix Critical Payload Issues | 8 | ~1h |
| Phase 2: Remove Extraneous Endpoints | 5 | ~1h |
| Phase 3: Add Missing Modules | 9 | ~2.5h |
| Phase 4: Type Cleanup | 3 | ~35m |
| Phase 5: Pages + Routes | 5 | ~4-6h |
| **Total** | **30** | **~9-11h** |

---

## Next Steps

1. Review plan and prioritize phases
2. Run `/tasks api-audit` to break into individual tasks
3. Run `/implement api-audit` to start execution

---

*Plan created with SDD 2.0*
