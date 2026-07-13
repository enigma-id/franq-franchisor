# Research: API Implementation Audit & Gap Analysis

**Task ID:** api-audit
**Date:** 2026-07-09
**Status:** Complete
**Source of Truth:** `specs/api-contract.md`

---

## Executive Summary

Audit of the franchisor-v2 frontend codebase against the API contract (`specs/api-contract.md`). The contract defines **~156 endpoints** across **29 modules**. The current codebase implements **~99 endpoints** across **19 API service modules**.

| Metric | Count |
|--------|-------|
| Total contract endpoints | ~156 |
| Implemented (match or partial) | ~99 |
| Missing (contract-defined, not in codebase) | ~57 |
| Incorrect implementations | 11 |
| Extraneous (codebase has, contract doesn't define) | 3 |
| Type/payload mismatches | 8 |
| Fully missing modules | 6 |

**Main Findings:**

1. **6 entire modules missing**: Franchisor, User, User Group, B2B Order, Outlet Topup Request, Production Item
2. **3 extraneous endpoints**: Sales Return reject, Production Plan update + cancel (not in contract)
3. **Pagination field mismatch**: Contract uses `page_size`, types use `limit`
4. **Outlet channels payload mismatch**: Contract sends `["id1","id2"]` (strings), types send `[{pos_channel_id, is_active}]` (objects)
5. **Upload field naming mismatch**: Contract uses `content_type` (snake_case), codebase uses `contentType` (camelCase)
6. **Member Topup Bonus fields mismatch**: Contract uses `min_amount`, `bonus_percentage`; types use `name`, `amount`, `bonus`
7. **B2B Order**: Only report pages exist — no order CRUD, no state machine
8. **Sales Return has reject endpoint**: Contract defines only approve, but codebase implements reject
9. **Sales Order list**: Uses dynamic TableApi pattern (not dedicated RTK query) — functional but inconsistent
10. **Outlet Topup Request**: Zero implementation — no API, hooks, pages, or routes

---

## 1. API Service Layer Audit

### Comparison Table

| Module | Contract Endpoints | Implemented Endpoints | Status |
|--------|-------------------|----------------------|--------|
| Auth + Profile | 4 | 4 | MATCH |
| Franchisor | 2 | 0 | MISSING |
| Dashboard | 1 | 1 | MATCH |
| Inventory Item | 8 | 8 | MATCH |
| Inventory Catalog | 8 | 8 | MATCH |
| Outlet | 8 | 8 | MATCH |
| Outlet Type | 7 | 7 | MATCH |
| POS Menu | 9 | 8 | PARTIAL |
| POS Category | 7 | 7 | MATCH |
| POS Channel | 7 | 7 | MATCH |
| Payment Method | 7 | 7 | MATCH |
| Supplier | 7 | 7 | MATCH |
| User | 7 | 0 | MISSING |
| User Group | 5 | 0 | MISSING |
| Member Topup Bonus | 7 | 7 | MATCH |
| Sales Order | 8 | 7 (+1 TableApi) | PARTIAL |
| Sales Return | 3 | 4 | INCORRECT |
| Purchase Order | 7 | 7 | MATCH |
| B2B Order | 9 | 0 | MISSING |
| Production Plan | 6 | 8 | INCORRECT |
| Production Item | 2 | 0 | MISSING |
| Upload | 1 | 1 | PARTIAL |
| Warehouse | 1 | 1 | MATCH |
| Withdrawal Request | 4 | 4 | MATCH |
| Outlet Topup Request | 4 | 0 | MISSING |
| Reports | 13 | 13 | MATCH |
| Demand | 2 | 2 | MATCH |
| Region | 1 | 1 | MATCH |
| Activation/Deactivation | 22 ops | 22 ops | MATCH |

---

## 2. Endpoint Coverage Analysis

### 2.1 Implemented APIs

**Auth + Profile** — `src/services/auth/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| POST | `/auth/signup` | signup | MATCH |
| POST | `/auth/login` | login | MATCH |
| GET | `/profile/me` | getMe | MATCH |
| PUT | `/profile/me` | updateMe | MATCH |

**Dashboard** — `src/services/dashboard/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/dashboard` | getDashboard | MATCH |

**Inventory Item** — `src/services/inventory/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/inventory/item` | getItems | MATCH |
| POST | `/inventory/item` | createItem | MATCH |
| GET | `/inventory/item/{id}` | getItem | MATCH |
| GET | `/inventory/item/{id}/fractions` | getItemFractions | MATCH |
| PUT | `/inventory/item/{id}` | updateItem | MATCH |
| DELETE | `/inventory/item/{id}` | deleteItem | MATCH |
| PUT | `/inventory/item/{id}/activate` | activateItem | MATCH |
| PUT | `/inventory/item/{id}/deactivate` | deactivateItem | MATCH |

**Inventory Catalog** — `src/services/inventory/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/inventory/catalog` | getCatalogs | MATCH |
| POST | `/inventory/catalog` | createCatalog | MATCH |
| GET | `/inventory/catalog/{id}` | getCatalog | MATCH |
| PUT | `/inventory/catalog/{id}` | updateCatalog | MATCH |
| PUT | `/inventory/catalog/{id}/types` | updateOutletCatalog | MATCH |
| DELETE | `/inventory/catalog/{id}` | deleteCatalog | MATCH |
| PUT | `/inventory/catalog/{id}/activate` | activateCatalog | MATCH |
| PUT | `/inventory/catalog/{id}/deactivate` | deactivateCatalog | MATCH |

**Outlet** — `src/services/outlet/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/outlet` | getOutlets | MATCH |
| POST | `/outlet` | createOutlet | PARTIAL* |
| GET | `/outlet/{id}` | getOutlet | MATCH |
| PUT | `/outlet/{id}` | updateOutlet | PARTIAL* |
| DELETE | `/outlet/{id}` | deleteOutlet | MATCH |
| PUT | `/outlet/{id}/activate` | activateOutlet | MATCH |
| PUT | `/outlet/{id}/deactivate` | deactivateOutlet | MATCH |
| PUT | `/outlet/{id}/channels` | updateChannelOutlet | PARTIAL* |

\* See Payload Audit for channel field mismatch

**Outlet Type** — `src/services/outlet/api.tsx`
All 7 endpoints (list, create, show, update, delete, activate, deactivate): **MATCH**

**POS Menu** — `src/services/pos/api.tsx`
All 8 of 9 contract endpoints implemented. **Missing:** `GET /pos/menu/price`

**POS Category** — `src/services/pos/api.tsx`
All 7 endpoints: **MATCH**

**POS Channel** — `src/services/pos/api.tsx`
All 7 endpoints: **MATCH**

**Payment Method** — `src/services/payment-method/api.tsx`
All 7 endpoints: **MATCH**

**Supplier** — `src/services/supplier/api.tsx`
All 7 endpoints: **MATCH**

**Member Topup Bonus** — `src/services/member/api.tsx`
All 7 endpoints implemented but with **field naming mismatch** (see Payload Audit)

**Sales Order** — `src/services/sales/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/sales/order` | — (uses TableApi) | PARTIAL |
| POST | `/sales/order` | createSalesOrder | MATCH |
| GET | `/sales/order/{id}` | getSalesOrder | MATCH |
| PUT | `/sales/order/{id}` | updateSalesOrder | MATCH |
| DELETE | `/sales/order/{id}` | deleteSalesOrder | MATCH |
| PUT | `/sales/order/{id}/publish` | publishSalesOrder | MATCH |
| PUT | `/sales/order/{id}/paid` | paidSalesOrder | MATCH |
| PUT | `/sales/order/{id}/cancel` | cancelSalesOrder | MATCH |

**Sales Return** — `src/services/sales/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/sales/return` | — (uses TableApi) | PARTIAL |
| GET | `/sales/return/{id}` | getSalesReturn | MATCH |
| PUT | `/sales/return/{id}/approve` | approveSalesReturn | MATCH |
| PUT | `/sales/return/{id}/reject` | rejectSalesReturn | **INCORRECT** (not in contract) |

**Purchase Order** — `src/services/purchase/api.tsx`
All 7 endpoints: **MATCH**

**Production Plan** — `src/services/production/api.tsx`
| Method | Path | Service Function | Status |
|--------|------|-----------------|--------|
| GET | `/production/plan` | getPlans | MATCH |
| POST | `/production/plan` | createPlan | MATCH |
| GET | `/production/plan/{id}` | getPlan | MATCH |
| PUT | `/production/plan/{id}` | updatePlan | **INCORRECT** (not in contract) |
| DELETE | `/production/plan/{id}` | deletePlan | MATCH |
| PUT | `/production/plan/{id}/publish` | publishPlan | MATCH |
| PUT | `/production/plan/{id}/cancel` | cancelPlan | **INCORRECT** (not in contract) |
| PUT | `/production/plan/{id}/complete` | completePlan | MATCH |

**Upload** — `src/services/upload/api.tsx`
| Method | Path | Status | Notes |
|--------|------|--------|-------|
| POST | `/upload` | PARTIAL | Field name mismatch: `contentType` vs `content_type` |

**Warehouse** — `src/services/warehouse/api.tsx`
Single GET endpoint: **MATCH**

**Withdrawal Request** — `src/services/withdrawal/api.tsx`
All 4 endpoints: **MATCH**

**Reports** — `src/services/report/api.tsx`
All 13 endpoints: **MATCH**

**Demand** — `src/services/demand/api.tsx`
Both endpoints: **MATCH**

**Region** — `src/services/region/api.tsx`
Single search endpoint: **MATCH**

### 2.2 Missing API Implementation

| Endpoint | Method | Module | Expected Usage | Status |
|----------|--------|--------|---------------|--------|
| `/franchisor/me` | GET | Franchisor | Fetch franchisor profile | MISSING |
| `/franchisor/me` | PUT | Franchisor | Update franchisor profile | MISSING |
| `/user` | GET | User | List users | MISSING |
| `/user` | POST | User | Create user | MISSING |
| `/user/{id}` | GET | User | Get user detail | MISSING |
| `/user/{id}` | PUT | User | Update user | MISSING |
| `/user/{id}` | DELETE | User | Delete user | MISSING |
| `/user/{id}/activate` | PUT | User | Activate user | MISSING |
| `/user/{id}/deactivate` | PUT | User | Deactivate user | MISSING |
| `/user/usergroup` | GET | User Group | List usergroups | MISSING |
| `/user/usergroup` | POST | User Group | Create usergroup | MISSING |
| `/user/usergroup/{id}` | GET | User Group | Get usergroup detail | MISSING |
| `/user/usergroup/{id}` | PUT | User Group | Update usergroup | MISSING |
| `/user/usergroup/{id}` | DELETE | User Group | Delete usergroup | MISSING |
| `/b2b/order` | GET | B2B Order | List B2B orders | MISSING |
| `/b2b/order` | POST | B2B Order | Create B2B order | MISSING |
| `/b2b/order/{id}` | GET | B2B Order | Get B2B order detail | MISSING |
| `/b2b/order/{id}` | PUT | B2B Order | Update B2B order | MISSING |
| `/b2b/order/{id}` | DELETE | B2B Order | Delete B2B order | MISSING |
| `/b2b/order/{id}/ship` | PUT | B2B Order | Ship B2B order | MISSING |
| `/b2b/order/{id}/receive` | PUT | B2B Order | Receive B2B order | MISSING |
| `/b2b/order/{id}/invoice` | PUT | B2B Order | Invoice B2B order | MISSING |
| `/b2b/order/{id}/pay` | PUT | B2B Order | Pay B2B order | MISSING |
| `/outlet-topup-request` | GET | Outlet Topup | List topup requests | MISSING |
| `/outlet-topup-request` | POST | Outlet Topup | Create topup request | MISSING |
| `/outlet-topup-request/{id}` | GET | Outlet Topup | Get detail | MISSING |
| `/outlet-topup-request/{id}/approve` | PUT | Outlet Topup | Approve | MISSING |
| `/outlet-topup-request/{id}/reject` | PUT | Outlet Topup | Reject | MISSING |
| `/production/item/{id}` | PUT | Production Item | Update production qty | MISSING |
| `/production/item/{id}/complete` | PUT | Production Item | Complete production item | MISSING |
| `/pos/menu/price` | GET | POS Menu | Menu items with channel pricing | MISSING |
| `/sales/return` (list) | GET | Sales Return | Paginated list | PARTIAL (TableApi) |
| `/sales/order` (list) | GET | Sales Order | Paginated list | PARTIAL (TableApi) |

### 2.3 Extraneous Implementations (in codebase, NOT in contract)

| Method | Path | Module | Reasoning |
|--------|------|--------|-----------|
| PUT | `/sales/return/{id}/reject` | Sales Return | Contract §17 defines only 3 endpoints: GET list, GET detail, PUT approve. No reject endpoint exists. |
| PUT | `/production/plan/{id}` | Production Plan | Contract §20 does NOT define a PUT update endpoint. Only POST, GET, DELETE, publish, complete. |
| PUT | `/production/plan/{id}/cancel` | Production Plan | Contract §20 state machine does NOT show a cancel transition. Only pending → published → completed. |

---

## 3. Request Payload Audit

### 3.1 Outlet POST/PUT — `channels` field mismatch

**Contract §6.2 (`POST /outlet`):**
```json
{
  "channels": ["pos_channel_id_1", "pos_channel_id_2"]
}
```
**Current type (`OutletCreateRequest`, `src/services/types/outlet.ts`):**
```ts
export interface OutletCreateRequest extends OutletBase {
  channels: OutletChannel[];
}
export interface OutletChannel {
  pos_channel_id: string;
  is_active: boolean;
}
```
**Difference:** Contract sends array of string IDs. Codebase sends array of objects `{pos_channel_id, is_active}`. The backend likely expects string IDs only. The `is_active` field may be silently ignored or cause rejection.

**Status: INCORRECT — Field structure mismatch**

### 3.2 Outlet `updateChannelOutlet` — same mismatch

**Contract §6.8 (`PUT /outlet/{id}/channels`):**
```json
{
  "channels": ["pos_channel_id_1"]
}
```
**Current (`OutletChannelsUpdateRequest`):**
```ts
export interface OutletChannelsUpdateRequest {
  channels: OutletChannel[];  // {pos_channel_id, is_active}[]
}
```
**Status: INCORRECT — Same structure mismatch as create**

### 3.3 Upload — field naming mismatch

**Contract §22.1 (`POST /upload`):**
```json
{
  "content_type": "string (required)",
  "filename": "string"
}
```
**Current (`src/services/upload/api.tsx:17`):**
```ts
query: (params: { filename: string; contentType: string }) => ({...})
```
**Difference:** Contract uses `content_type` (snake_case), codebase uses `contentType` (camelCase). The base query uses `fetchBaseQuery` which JSON-serializes, so the wire format will contain `contentType`. This will cause 400 errors if the backend expects `content_type`.

**Status: INCORRECT — Field name mismatch**

### 3.4 Member Topup Bonus — field naming mismatch

**Contract §15 (`POST /member/topup-bonus`):**
```json
{
  "min_amount": 0,
  "bonus_percentage": 0
}
```
**Current type (`TopupBonusBase`, `src/services/types/pos.ts`):**
```ts
export interface TopupBonusBase {
  name: string;
  amount: number;
  bonus: number;
}
```
**Difference:** Contract uses `min_amount`/`bonus_percentage`. Types use `name`/`amount`/`bonus`. The types do not match contract field names at all.

**Status: INCORRECT — Complete field naming mismatch**

### 3.5 Withdrawal Reject — payload field check

**Contract §24.4 (`PUT /withdrawal-request/{id}/reject`):**
```json
{
  "rejected_reason": "reason for rejection"
}
```
**Current (`src/services/withdrawal/hooks.tsx`):**
```ts
reject: createMutation(w => ({ id, ...payload }))  // payload: any
```
**Status: MATCH** (functionally — the payload is passed through, but no type enforcement on `rejected_reason`)

### 3.6 Production Plan POST — `quantity` vs `quantity_planned`

**Contract §20.2 (`POST /production/plan`):**
```json
{
  "items": [{ "item_id": "uuid", "quantity": 0 }]
}
```
**Current type (`ProductionPlanRequest`, `src/services/types/production.ts`):**
```ts
items: Array<{ item_id: string; quantity_planned: number }>;
```
**Difference:** Contract uses `quantity`, types use `quantity_planned`.

**Status: INCORRECT — Field name mismatch**

### 3.7 Production Item PUT — `quantity` vs `quantity_planned`

**Contract §21.1 (`PUT /production/item/{id}`):**
```json
{ "quantity": 0 }
```
**Current type (`ProductionItemUpdateRequest`):**
```ts
export interface ProductionItemUpdateRequest {
  quantity_planned: number;
  note?: string;
}
```
**Difference:** Contract uses `quantity`, types use `quantity_planned`. Also types include `note` which is not in contract.

**Status: INCORRECT — Field name mismatch (note: this endpoint doesn't exist in codebase, but if implemented would be wrong)**

### 3.8 Sales Order POST — `shipping_charges` field name

**Contract §16.2 (`POST /sales/order`):**
```json
{
  "shipping_charges": 0
}
```
**Current type (`SalesOrderBase`, `src/services/types/sales.ts`):**
```ts
export interface SalesOrderBase {
  shipping_date: string;
  // Note: no "shipping_charges" field in type
}
```
**Status: PARTIAL** — Type doesn't include `shipping_charges` but contract defines it. The runtime payload may still include it if the form passes it directly.

### 3.9 Sales Order POST — `region_id` vs `recipient_region_id`

**Contract §16.2:**
```json
{
  "region_id": "uuid"
}
```
**Current type:**
```ts
recipient_region_id: string;
```
**Difference:** Contract uses `region_id`, types use `recipient_region_id`.

**Status: INCORRECT — Field name mismatch**

### 3.10 Sales Order POST — `items` field structure

**Contract §16.2:**
```json
{
  "items": [{ "catalog_id": "uuid", "quantity_ordered": 0 }]
}
```
**Current type:**
```ts
export interface SalesOrderItem {
  catalog_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
}
```
**Difference:** Contract uses `quantity_ordered`, types use `quantity`. Types also include `unit_price` and `discount` which are not in contract POST body (they are server-calculated response fields).

**Status: INCORRECT — Field name mismatch + extraneous fields**

---

## 4. Query Parameter Audit

### 4.1 Sales Order GET list

| Param | Contract | Current (TableApi) | Status |
|-------|----------|-------------------|--------|
| `page` | ✅ | ✅ | MATCH |
| `limit` | ✅ | ✅ | MATCH |
| `search` | ✅ | ✅ | MATCH |
| `document_status` | ✅ | ✅ | MATCH |
| `payment_status` | ✅ | ✅ | MATCH |
| `outlet_id` | ✅ | ✅ | MATCH |
| `warehouse_id` | ✅ | ✅ | MATCH |
| `start_date` | ✅ | ? | CHECK |
| `end_date` | ✅ | ? | CHECK |

**Status: PARTIAL** — TableApi passes dynamic filter params so these should be supported. Needs verification that date filters are passed correctly.

### 4.2 Purchase Order GET list

| Param | Contract | Current | Status |
|-------|----------|---------|--------|
| `page` | ✅ | ✅ | MATCH |
| `limit` | ✅ | ✅ | MATCH |
| `search` | ✅ | ✅ | MATCH |
| `document_status` | ✅ | ✅ | MATCH |
| `outlet_id` | ✅ | ✅ | MATCH |
| `supplier_id` | ✅ | ✅ | MATCH |
| `start_date` | ✅ | ? | CHECK |
| `end_date` | ✅ | ? | CHECK |

### 4.3 Withdrawal Request GET list

| Param | Contract | Current | Status |
|-------|----------|---------|--------|
| `page` | ✅ | ✅ | MATCH |
| `limit` | ✅ | ✅ | MATCH |
| `search` | ✅ | ✅ | MATCH |
| `document_status` | ✅ | ✅ | MATCH |
| `outlet_id` | ✅ | ✅ | MATCH |

### 4.4 Reports — Additional `order_by` param

Contract reports define `order_by` as a query param. Current `TableApi` pattern supports `order_by`. **MATCH**

### 4.5 Outlet Topup Request — Missing entirely

Contract defines `page`, `limit`, `search`, `document_status`, `outlet_id` — all missing since module is not implemented.

---

## 5. Response Mapping Audit

### 5.1 PaginationMeta field mismatch

**Contract paginated envelope:**
```json
{
  "meta": {
    "page": 1,
    "page_size": 10,
    "total": 100,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```
**Current type (`PaginationMeta`, `src/services/types/api.ts`):**
```ts
export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}
```
**Difference:** Contract field `page_size` maps to type field `limit`.

**Status: PARTIAL** — Field name mismatch (`page_size` vs `limit`). If the backend returns `page_size`, the `limit` field will be `undefined`. If the backend actually returns `limit` (not `page_size`), then MATCH.

### 5.2 Sales Order Detail — extra response fields in types

**Contract response §16.3** shows standard order fields. **Current type `SalesOrderDetail`** includes many fields not demonstrated in contract:
- `fulfillment_status` (not in contract response example)
- `payment_expired_at` (not in contract)
- `void_note` (not in contract)
- `fulfilled_at` (not in contract)
- `order_type` (not in contract)

**Status: MINOR** — Types are more complete than contract examples. These may be valid backend fields not shown in truncated contract examples.

### 5.3 Dashboard — extended fields

**Contract §3.1** response shows a subset. **Current `DashboardData` type** includes:
- `withdrawal_pending_amount` (not in contract)
- `omset_retail`, `omset_b2b`, `omset_franchise`, `omset_bahan_baku` (not in contract)
- `total_service_charge`, `total_discount` (not in contract)
- `outstanding_total`, `outstanding_count` (not in contract)
- `total_withdrawal_bulan_ini` (not in contract)

**Status: MINOR** — Types document real backend fields not fully captured in contract.

### 5.4 Purchase Order Detail — extra fields

**Contract §18.3** response example is minimal. **Current types** include `receiving_status`, `warehouse_name`, `address`, `recipient_name/phone` which are not in contract examples.

**Status: MINOR** — Same as above, types more detailed than contract.

### 5.5 Sales Return list — page_size vs limit same issue

Same `page_size`/`limit` mismatch applies to all paginated responses.

---

## 6. State Machine / Lifecycle Audit

### 6.1 Sales Order

**Expected (Contract §16):**
```
pending ──publish──▶ published
  │                      │
  │ (unpaid)             │
  ├──cancel──▶ cancelled │
  │                      │
  └──edit/delete         │
                  paid──▶ (paid)
```

| Action | Condition | Result |
|--------|-----------|--------|
| POST | Always | pending, unpaid |
| PUT | pending | Update |
| DELETE | pending | Soft-delete |
| PUT publish | pending | published |
| PUT paid | unpaid | paid |
| PUT cancel | unpaid | cancelled |

**Current implementation:**
- Guards: `useSalesOrderGuards.ts` → `canPublish`, `canEdit`, `canDelete`, `canPay`, `canCancel`
- API: All 6 mutation endpoints exist
- Guards check: `soGuards.canPublishSo()`, `canEditSo()`, `canDeleteSo()`, `canPaySo()`, `canCancelSo()`

**Status: MATCH** — All state transitions correctly implemented

### 6.2 Purchase Order

**Expected (Contract §18):**
```
pending ──publish──▶ published
  │                      │
  └──edit/delete         │
                  paid──▶ (paid)
```

| Action | Condition | Result |
|--------|-----------|--------|
| POST | Always | pending, unpaid |
| PUT | pending | Update |
| DELETE | pending | Soft-delete |
| PUT publish | pending | published |
| PUT paid | unpaid | paid |

**Current implementation:**
- Guards: `usePurchaseOrderGuards.ts` → `canPublish`, `canEdit`, `canDelete`, `canPaid`
- API: All 5 mutation endpoints exist (no cancel — correct per contract)
- Note: PO state machine does NOT include cancel — codebase correctly omits it

**Status: MATCH**

### 6.3 B2B Order

**Expected (Contract §19):**
```
pending ──ship──▶ shipped ──receive──▶ received ──invoice──▶ invoiced
  │                                                               │
  └──delete (if pending)                                            │
                                                             pay──▶ paid
```

**Current implementation:**
- **No API service, no hooks, no guards, no pages**
- Only B2B report pages exist (settlement, product-sales)

**Status: MISSING** — Full module not implemented

### 6.4 Production Plan

**Expected (Contract §20):**
```
Plan: [pending] ──publish──▶ [published] ──complete──▶ [completed]
```
| Action | Condition | Result |
|--------|-----------|--------|
| POST | Always | plan.pending, items.new |
| PUT publish | plan.pending | published |
| PUT complete | All items completed | completed |

No **PUT update**, no **cancel**, no **DELETE** (DELETE exists but with no guard in contract).

**Current implementation:**
| Endpoint | Contract? | Codebase? | Match? |
|----------|-----------|-----------|--------|
| POST `/production/plan` | ✅ | ✅ | ✅ |
| PUT `/production/plan/{id}` | ❌ | ✅ updatePlan | ❌ Extraneous |
| DELETE `/production/plan/{id}` | ✅ | ✅ deletePlan | ✅ |
| PUT `/production/plan/{id}/publish` | ✅ | ✅ publishPlan | ✅ |
| PUT `/production/plan/{id}/complete` | ✅ | ✅ completePlan | ✅ |
| PUT `/production/plan/{id}/cancel` | ❌ | ✅ cancelPlan | ❌ Extraneous |
| GET | ✅ | ✅ | ✅ |

**Status: INCORRECT** — 2 extraneous endpoints (update, cancel) not in contract

### 6.5 Production Item

**Expected (Contract §21):**
```
[new] ──complete──▶ [completed]
```
| Action | Condition | Result |
|--------|-----------|--------|
| PUT `{id}` | — | Update quantity |
| PUT `{id}/complete` | item.new | completed |

**Current implementation:**
- No API service, no hooks
- `ProductionItemUpdateRequest` type exists but is unused

**Status: MISSING**

### 6.6 Withdrawal Request

**Expected (Contract §24):**
```
[pending] ──approve──▶ [approved]
     │
     └── reject ────▶ [rejected]
```
| Action | Guard | Body |
|--------|-------|------|
| PUT approve | pending | None |
| PUT reject | pending | `{rejected_reason}` |

**Current implementation:**
- Guards: None found (no `useWithdrawalGuards.ts` file)
- API: GET list, GET detail, PUT approve, PUT reject all exist
- Reject payload passes through from hook

**Status: MATCH** (no guard hook found but API endpoints exist)

### 6.7 Outlet Topup Request

**Expected (Contract §25):**
```
[pending] ──approve──▶ [approved]
     │
     └── reject ────▶ [rejected]
```

**Current implementation:**
- **Zero implementation** — no API, no hooks, no pages, no routes

**Status: MISSING**

### 6.8 Sales Return

**Expected (Contract §17):**
```
[pending] ──approve──▶ [approved]
```
| Action | Guard |
|--------|-------|
| PUT approve | pending |

**Contract explicitly does NOT include a reject endpoint.**

**Current implementation:**
- `approveSalesReturn`: ✅ MATCH
- `rejectSalesReturn`: ❌ **Not in contract**

**Status: INCORRECT** — reject endpoint is extraneous

---

## 7. API Usage Lifecycle Audit

| API | Page/Feature | Service | Hook | Usage Status |
|-----|-------------|---------|------|-------------|
| Auth/Login | SignIn | `auth/api.tsx` | `useAuth` | Fully Integrated |
| Auth/Signup | SignUp | `auth/api.tsx` | `useAuth` | Fully Integrated |
| Profile/me | Layout (avatar) | `auth/api.tsx` | `useAuth` | Fully Integrated |
| Dashboard | Dashboard | `dashboard/api.tsx` | `useDashboard` | Fully Integrated |
| Inventory Item | Items CRUD | `inventory/api.tsx` | `useInventoryItem` | Fully Integrated |
| Item Fractions | Item Detail | `inventory/api.tsx` | `useItemFractions` | Fully Integrated |
| Inventory Catalog | Catalogs CRUD | `inventory/api.tsx` | `useInventoryCatalog` | Fully Integrated |
| Supplier | Supplier CRUD | `supplier/api.tsx` | `useSupplier` | Fully Integrated |
| Outlet | Outlet CRUD | `outlet/api.tsx` | `useOutlet` | Fully Integrated |
| Outlet Type | Outlet Type CRUD | `outlet/api.tsx` | `useOutletType` | Fully Integrated |
| POS Menu | Menu CRUD | `pos/api.tsx` | `usePOSMenu` | Fully Integrated |
| POS Menu Price | — | — | — | **Not Used** (endpoint missing) |
| POS Category | Category CRUD | `pos/api.tsx` | `usePOSCategory` | Fully Integrated |
| POS Channel | Channel CRUD | `pos/api.tsx` | `usePOSChannel` | Fully Integrated |
| Payment Method | Payment CRUD | `payment-method/api.tsx` | `usePaymentMethod` | Fully Integrated |
| Member Topup | Topup CRUD | `member/api.tsx` | `useMemberTopupBonus` | Fully Integrated |
| Sales Order | Order CRUD + workflow | `sales/api.tsx` | `useSalesOrder` | Fully Integrated |
| Sales Return | Return list/detail | `sales/api.tsx` | `useSalesReturn` | Fully Integrated |
| Purchase Order | PO CRUD | `purchase/api.tsx` | `usePurchaseOrder` | Fully Integrated |
| Production Plan | PP CRUD | `production/api.tsx` | `useProductionPlan` | Fully Integrated |
| Withdrawal | Withdrawal list/detail | `withdrawal/api.tsx` | `useWithdrawal` | Fully Integrated |
| Warehouse | Warehouse list | `warehouse/api.tsx` | `useWarehouse` | Fully Integrated |
| Region | Region search | `region/api.tsx` | `useRegion` | Fully Integrated |
| Upload | File upload | `upload/api.tsx` | `useUpload` | Fully Integrated |
| Demand/Production | Demand production | `demand/api.tsx` | `useDemand` | Fully Integrated |
| Demand/Item | Demand item | `demand/api.tsx` | `useDemand` | Fully Integrated |
| Reports (13) | Various report pages | `report/api.tsx` | `useReport` | Fully Integrated |
| TableApi | Dynamic tables | `table/api.tsx` | `useTable` | Fully Integrated |

**Unused/Hanging APIs:**
- `rejectSalesReturn` — endpoint exists but should not (not in contract)
- `updatePlan` (production) — endpoint exists but should not
- `cancelPlan` (production) — endpoint exists but should not

---

## 8. Type Definition / Schema Audit

### 8.1 Pagination Field Mapping

| Contract Field | TypeScript Field | Match? |
|----------------|-----------------|--------|
| `page` | `page` | ✅ |
| `page_size` | `limit` | ❌ |
| `total` | `total` | ✅ |
| `total_pages` | `total_pages` | ✅ |
| `has_next` | `has_next` | ✅ |
| `has_prev` | `has_prev` | ✅ |

**Impact:** If backend returns `page_size`, frontend reads `limit` which will be `undefined`.

### 8.2 Sales Order Type vs Contract

| Field | Contract POST | Type (`SalesOrderRequest`) | Match? |
|-------|--------------|---------------------------|--------|
| `warehouse_id` | ✅ | ✅ | ✅ |
| `ref_code` | ✅ | ✅ | ✅ |
| `outlet_id` | ✅ | ✅ | ✅ |
| `recipient_name` | ✅ | ✅ | ✅ |
| `recipient_phone` | ✅ | ✅ | ✅ |
| `recipient_address` | ✅ | ✅ | ✅ |
| `region_id` | ✅ | ❌ (`recipient_region_id`) | ❌ |
| `note` | ✅ | ✅ | ✅ |
| `shipping_date` | ✅ | ✅ | ✅ |
| `self_pickup` | ✅ | ✅ | ✅ |
| `shipping_charges` | ✅ | ❌ (missing from type) | ❌ |
| `items[].catalog_id` | ✅ | ✅ | ✅ |
| `items[].quantity_ordered` | ✅ | ❌ (`quantity`) | ❌ |
| `items[].unit_price` | ❌ (server only) | ✅ (in type) | ❌ extraneous |
| `items[].discount` | ❌ (server only) | ✅ (in type) | ❌ extraneous |

### 8.3 Outlet Type vs Contract

| Field | Contract POST | Type (`OutletCreateRequest`) | Match? |
|-------|--------------|---------------------------|--------|
| `outlet_type_id` | ✅ | ✅ | ✅ |
| `name` | ✅ | ✅ | ✅ |
| `recipient_name` | ✅ | ✅ | ✅ |
| `phone` | ✅ | ✅ | ✅ |
| `address` | ✅ | ✅ | ✅ |
| `region_id` | ✅ | ✅ | ✅ |
| `service_charges` | ✅ | ✅ | ✅ |
| `channels` | ✅ string[] | ❌ `OutletChannel[]` | ❌ |
| `owner_username` | ✅ | ✅ | ✅ |
| `owner_name` | ✅ | ✅ | ✅ |
| `owner_password` | ✅ | ✅ | ✅ |

### 8.4 Member Topup Bonus Type vs Contract

| Contract Field | Type Field | Match? |
|----------------|-----------|--------|
| `min_amount` | `amount` | ❌ |
| `bonus_percentage` | `bonus` | ❌ |
| (none) | `name` | ❌ extraneous |

### 8.5 POS Menu Type vs Contract

**Contract §8.3 POST body:**
```json
{
  "category_id", "name", "base_price", "image?",
  "is_vatable", "is_additional",
  "channel_prices[]", "ingredients[]", "addon_groups[]"
}
```
**Type `POSMenuCreateRequest`:**
- `channel_prices: POSChannelPrice[]` — but `POSChannelPrice` has `id`, `menu_id`, `pos_channel_id`, `price`, `pos_channel` — POST should not include `id`/`menu_id`
- `ingredients: POSIngredient[]` — has `id`, `menu_id` which should not be in POST

**Status: PARTIAL** — Types include response-only fields in request interfaces

### 8.6 Contract Enum Values Not Enforced

| Field | Contract Values | TypeScript | Status |
|-------|----------------|------------|--------|
| `document_status` (SO) | `pending`, `published`, `cancelled` | `string` | Weak typing |
| `document_status` (PO) | `pending`, `published` | `string` | Weak typing |
| `document_status` (PP) | `pending`, `process`, `completed`, `cancelled` | `"pending" \| "process" \| "completed" \| "cancelled"` | ✅ Strong |
| `payment_status` | `unpaid`, `paid` | `string` | Weak typing |
| `item.document_status` (PP) | `new`, `completed` | `string` | Weak typing |
| `status` (Withdrawal) | `pending`, `approved`, `rejected` | `"pending" \| "approved" \| "rejected"` | ✅ Strong |
| `supplier.type` | `distributor`, `factory`, `store` | `SupplierType` | Partial (has `wholesaler`, `retailer` not in contract) |
| `payment.provider` | `cash`, `manual`, `qris`, `midtrans`, `other` | `string` | Weak typing |
| `payment.type` | `pos`, `franchise` | `string` | Weak typing |

### 8.7 Missing Types for Missing Modules

The following contract modules have NO corresponding types:
- Franchisor
- User / User Group
- B2B Order
- Outlet Topup Request
- Production Item (types exist but have field name issues — see §3.7)

---

## 9. Priority Recommendations

### Critical (Blocking Functionality)

| # | Issue | Module | Impact | Action |
|---|-------|--------|--------|--------|
| C1 | Outlet POST `channels` sends objects instead of string IDs | Outlet | Outlet creation fails when backend expects string array | Change `OutletCreateRequest.channels` to `string[]` and remove `OutletChannel` interface |
| C2 | Upload `contentType` (camelCase) vs `content_type` (snake_case) | Upload | File upload always fails | Rename to `content_type` in API service |
| C3 | Member Topup Bonus fields completely wrong | Member Topup | Create/update payloads rejected by backend | Rename fields to `min_amount`/`bonus_percentage` in types |
| C4 | Sales Order POST items `quantity` vs `quantity_ordered` | Sales Order | Order items quantity not sent correctly | Rename to `quantity_ordered` |
| C5 | Sales Order POST `recipient_region_id` vs `region_id` | Sales Order | Region not linked | Rename to `region_id` |
| C6 | Production Plan POST items `quantity_planned` vs `quantity` | Production Plan | Item quantities not sent correctly | Rename to `quantity` |

### High (Incorrect API Behavior)

| # | Issue | Module | Impact | Action |
|---|-------|--------|--------|--------|
| H1 | Sales Return reject endpoint exists but not in contract | Sales Return | May cause 404 if backend doesn't implement | Remove `rejectSalesReturn` from API and hooks |
| H2 | Production Plan update endpoint exists but not in contract | Production Plan | May cause 404 | Remove `updatePlan` from API and hooks |
| H3 | Production Plan cancel endpoint exists but not in contract | Production Plan | May cause 404 | Remove `cancelPlan` from API and hooks |
| H4 | PaginationMeta uses `limit` but contract returns `page_size` | Global | Pagination broken across all lists | Rename type field to `page_size` or map in response transformer |
| H5 | Outlet channel update sends objects instead of string IDs | Outlet | Channel assignment fails | Same as C1 fix |
| H6 | Sales Order POST missing `shipping_charges` field | Sales Order | Shipping charges not sent | Add to type |

### Medium (Incomplete Integration)

| # | Issue | Module | Impact | Action |
|---|-------|--------|--------|--------|
| M1 | B2B Order module completely missing | B2B Order | Cannot manage B2B orders | Create API service, types, hooks, pages |
| M2 | Outlet Topup Request module completely missing | Outlet Topup | Cannot manage topup requests | Create API service, types, hooks, pages |
| M3 | Franchisor module completely missing | Franchisor | Cannot view/edit franchisor profile | Create API service, types, hooks, pages |
| M4 | User module completely missing | User | Cannot manage users | Create API service, types, hooks, pages |
| M5 | User Group module completely missing | User Group | Cannot manage user groups | Create API service, types, hooks, pages |
| M6 | Production Item endpoints missing | Production Plan | Cannot update/complete production items | Create API service, types, hooks |
| M7 | POS Menu price endpoint missing | POS Menu | Cannot fetch menu pricing | Add `getMenuPrice` endpoint |

### Low (Code Improvement)

| # | Issue | Module | Impact | Action |
|---|-------|--------|--------|--------|
| L1 | Supplier type includes `wholesaler`/`retailer` not in contract | Supplier | May cause validation errors | Align with contract `distributor`/`factory`/`store` |
| L2 | Sales Order list uses TableApi instead of dedicated RTK query | Sales Order | Inconsistent with other modules | Add dedicated `getSalesOrderList` query |
| L3 | Sales Return list uses TableApi | Sales Return | Inconsistent | Add dedicated `getSalesReturnList` query |
| L4 | Weak enum typing on document_status/payment_status | Global | No compile-time safety | Add union type literals |
| L5 | POSMenuCreateRequest contains response-only fields | POS Menu | May send server-assigned fields | Create separate POST request type |

---

## Open Questions

1. Does the backend actually return `page_size` or `limit`? If `limit`, the PaginationMeta field name is correct. If `page_size`, it must be changed.
2. Does the Outlet POST channels field accept both string arrays and object arrays? If it accepts objects, the current code works. But contract says strings.
3. Does Sales Return reject endpoint actually exist on the backend? The contract says no, but it may not be documented.
4. Does Production Plan PUT update/cancel endpoints actually exist on the backend? Contract says no, but they may be undocumented.
5. What are the exact field names for the Franchisor module? Contract says `name, address, phone, email, logo_url`.

---

## Next Steps

1. **Fix Critical issues** (C1-C6) — blocking functionality
2. **Fix High issues** (H1-H6) — incorrect behavior
3. **Implement missing modules** (M1-M6) — full module creation
4. **Code cleanup** (L1-L5) — type alignment and consistency
5. **Validate with backend team** — confirm contract accuracy for open questions

---

*Research completed with SDD 2.0*
