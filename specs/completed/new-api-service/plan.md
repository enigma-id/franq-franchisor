# Technical Plan: New API Service Layer Migration

**Task ID:** new-api-service
**Status:** Ready for Implementation
**Based on:** spec.md, research.md

## 1. System Architecture

The service layer will follow the existing RTK Query architecture but with refreshed endpoint definitions and data structures aligned to the new Postman collection.

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                        UI Components                            │
│        (Pages use hooks from services/[domain]/hooks)          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      createCrudHook Factory                     │
│         (Standardized CRUD interface for UI components)        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RTK Query API Services                        │
│  authApi | outletApi | posApi | inventoryApi | purchaseApi     │
│  salesApi | productionApi | demandApi | warehouseApi | etc.   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       baseQuery                                 │
│    (Auth headers, interceptors, file downloads, 401 handling)  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API                                  │
│           (docs/Franchisor.postman_collection.json)            │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Migration Strategy | Clean Slate | Move old services to temp/, rebuild new to avoid hybrid state |
| State Management | RTK Query | Consistent with existing codebase, efficient caching |
| CRUD Pattern | createCrudHook | Minimizes boilerplate, provides standardized UI interface |
| File Organization | Domain-based | Scales well, makes it easy to find related logic |
| Tag Strategy | Semantic naming | E.g., "Outlet", "POSMenu" for cache invalidation |

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| State Management | Redux Toolkit / RTK Query | ^2.0 | Existing infrastructure |
| Language | TypeScript | ^5.0 | Existing codebase |
| Build Tool | Vite | ^5.0 | Existing project |
| Runtime | React | ^18.0 | Existing project |

### No New Dependencies
All required libraries already exist in the project:
- `@reduxjs/toolkit` - RTK Query
- `file-saver` - File downloads
- `react-redux` - React bindings

---

## 3. Component Design

### Core Services to Create

| Service | Reducer Path | Tag Types | Endpoints |
|---------|--------------|-----------|-----------|
| **AuthApi** | authApi | Auth | signup, login, getMe, updateMe |
| **OutletApi** | outletApi | Outlet, OutletType | CRUD + activate/deactivate/channels |
| **POSApi** | posApi | POSMenu, POSCategory, POSChannel | CRUD + activate/deactivate/types |
| **PaymentMethodApi** | paymentMethodApi | PaymentMethod | CRUD + activate/deactivate |
| **MemberTopupBonusApi** | memberTopupBonusApi | TopupBonus | CRUD + activate/deactivate |
| **InventoryApi** | inventoryApi | InventoryItem, InventoryCatalog | CRUD + activate/deactivate + types/outlet |
| **WarehouseApi** | warehouseApi | Warehouse | GET only |
| **SupplierApi** | supplierApi | Supplier | CRUD + activate/deactivate |
| **PurchaseApi** | purchaseApi | PurchaseOrder | CRUD + publish/paid |
| **SalesApi** | salesApi | SalesOrder | CRUD + publish/paid/cancel |
| **SalesReturnApi** | salesReturnApi | SalesReturn | GET + approve |
| **ProductionApi** | productionApi | ProductionPlan, ProductionItem | CRUD + publish/complete/items |
| **DemandApi** | demandApi | DemandData | GET production, GET item |

### File Structure
```
src/
├── services/
│   ├── baseQuery.tsx          [PRESERVED]
│   ├── hooks/
│   │   └── createCrudHook.ts  [PRESERVED]
│   ├── types/
│   │   ├── api.ts             [PRESERVED]
│   │   ├── auth.ts            [NEW]
│   │   ├── outlet.ts          [NEW]
│   │   ├── pos.ts             [NEW]
│   │   ├── inventory.ts       [NEW]
│   │   ├── purchase.ts        [NEW]
│   │   ├── sales.ts           [NEW]
│   │   ├── production.ts      [NEW]
│   │   ├── supplier.ts        [NEW]
│   │   └── region.ts          [EXISTING]
│   │
│   ├── auth/
│   │   ├── api.ts             [REBUILD - new endpoints]
│   │   └── slice.ts           [PRESERVE]
│   │
│   ├── outlet/
│   │   ├── api.ts             [REBUILD - new payload]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── pos/
│   │   ├── api.ts             [REBUILD - new endpoints]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── payment-method/
│   │   ├── api.ts             [NEW - split from POS]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── member/
│   │   ├── api.ts             [NEW - split from POS]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── inventory/
│   │   ├── api.ts             [REBUILD - new payload]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── warehouse/
│   │   ├── api.ts             [NEW]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── supplier/
│   │   ├── api.ts             [NEW]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── purchase/
│   │   ├── api.ts             [REBUILD - new endpoints]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── sales/
│   │   ├── api.ts             [REBUILD - new endpoints]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── production/
│   │   ├── api.ts             [NEW - new endpoints]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── demand/
│   │   ├── api.ts             [NEW - new endpoints]
│   │   └── hooks.ts           [NEW]
│   │
│   ├── reducer.tsx            [UPDATE - register new APIs]
│   └── store.tsx              [UPDATE - add to persist blacklist]
│
temp/
└── services/                  [MIGRATE - old services go here]
    ├── auth/
    ├── outlet/
    ├── pos/
    ├── inventory/
    ├── purchase/
    ├── sales/
    ├── user/
    ├── franchise/
    ├── catalog/
    ├── dashboard/
    ├── report/
    └── region/
```

---

## 4. Data Model

### Key Type Interfaces

**Auth Types** (`types/auth.ts`):
```typescript
interface SignupRequest {
  company_name: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface ProfileUpdateRequest {
  name?: string;
  password?: string;
  confirm_password?: string;
}
```

**Outlet Types** (`types/outlet.ts`):
```typescript
interface OutletCreateRequest {
  outlet_type_id: string;
  name: string;
  recipient_name: string;
  phone: string;
  address: string;
  region_id: string;
  service_charges: number;
  channels: Array<{ pos_channel_id: string; is_active: boolean }>;
  owner_name: string;
  owner_username: string;
  owner_password: string;
}

interface OutletChannelsUpdateRequest {
  channels: Array<{ pos_channel_id: string; is_active: boolean }>;
}
```

**POS Menu Types** (`types/pos.ts`):
```typescript
interface POSMenuCreateRequest {
  category_id: string;
  name: string;
  base_price: number;
  image?: string;
  is_vatable: boolean;
  is_additional: boolean;
  channel_prices: Array<{ pos_channel_id: string; price: number }>;
  ingredients: Array<{ catalog_id: string;orsi: number }>;
  addon_groups?: Array<{
    name: string;
    type: "options" | "multiple";
    items: Array<{ addon_menu_id: string }>;
  }>;
}
```

**Inventory Item Types** (`types/inventory.ts`):
```typescript
type InventoryItemType = "raw_material" | "finished_goods";

interface InventoryItemCreateRequest {
  type: InventoryItemType;
  category: string;
  barcode?: string;
  name: string;
  variant?: string;
  packaging: string;
  size: string;
  is_batch_tracking: boolean;
  picking_strategy?: string;
  base_price: number;
  weight: number;
  fractions: Array<{ name: string; quantity: number }>;
  boms?: Array<{ material_id: string; quantity: number; measurement: string }>;
}
```

**Purchase Order Types** (`types/purchase.ts`):
```typescript
interface PurchaseOrderCreateRequest {
  warehouse_id: string;
  ref_code?: string;
  supplier_id?: string;
  outlet_id?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_region_id?: string;
  recipient_address?: string;
  note?: string;
  shipping_date?: string;
  requires_shipping: boolean;
  shipping_charges: number;
  items: Array<{
    id?: string;
    catalog_id: string;
    quantity_ordered: number;
  }>;
}
```

**Sales Order Types** (`types/sales.ts`):
```typescript
interface SalesOrderCreateRequest {
  warehouse_id: string;
  ref_code?: string;
  outlet_id: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_region_id?: string;
  recipient_address?: string;
  note?: string;
  shipping_date?: string;
  requires_shipping: boolean;
  shipping_charges: number;
  items: Array<{
    id?: string;
    catalog_id: string;
    quantity_ordered: number;
  }>;
}

interface SalesOrderCancelRequest {
  note: string;
}
```

---

## 5. API Contracts

### Complete Endpoint Mapping

| Domain | Method | Path | Payload | Notes |
|--------|--------|------|---------|-------|
| **Auth** | POST | /auth/signup | Full signup payload | NEW |
| **Auth** | POST | /auth/login | username, password | |
| **Auth** | GET | /profile/me | - | |
| **Auth** | PUT | /profile/me | name, password, confirm_password | |
| **Outlet** | GET | /outlet | query params | |
| **Outlet** | POST | /outlet | Full outlet payload | |
| **Outlet** | GET | /outlet/:id | - | |
| **Outlet** | PUT | /outlet/:id | Full outlet payload | |
| **Outlet** | DELETE | /outlet/:id | - | |
| **Outlet** | PUT | /outlet/:id/activate | - | |
| **Outlet** | PUT | /outlet/:id/deactivate | - | |
| **Outlet** | PUT | /outlet/:id/channels | channels array | |
| **Outlet** | GET | /outlet/type | - | |
| **Outlet** | POST | /outlet/type | name | |
| **Outlet** | PUT | /outlet/type/:id | name | |
| **Outlet** | DELETE | /outlet/type/:id | - | |
| **Outlet** | PUT | /outlet/type/:id/activate | - | |
| **Outlet** | PUT | /outlet/type/:id/deactivate | - | |
| **POS Menu** | GET | /pos/menu | - | |
| **POS Menu** | POST | /pos/menu | Full menu payload | |
| **POS Menu** | GET | /pos/menu/:id | - | |
| **POS Menu** | PUT | /pos/menu/:id | Full menu payload | |
| **POS Menu** | DELETE | /pos/menu/:id | - | |
| **POS Menu** | PUT | /pos/menu/:id/activate | - | |
| **POS Menu** | PUT | /pos/menu/:id/deactivate | - | |
| **POS Menu** | PUT | /pos/menu/:id/types | outlet_type_ids array | |
| **POS Category** | GET | /pos/category | - | |
| **POS Category** | POST | /pos/category | name, image | |
| **POS Category** | PUT | /pos/category/:id | name, image | |
| **POS Category** | DELETE | /pos/category/:id | - | |
| **POS Category** | PUT | /pos/category/:id/activate | - | |
| **POS Category** | PUT | /pos/category/:id/deactivate | - | |
| **POS Channel** | GET | /pos/channel | - | |
| **POS Channel** | POST | /pos/channel | name | |
| **POS Channel** | PUT | /pos/channel/:id | name | |
| **POS Channel** | DELETE | /pos/channel/:id | - | |
| **POS Channel** | PUT | /pos/channel/:id/activate | - | |
| **POS Channel** | PUT | /pos/channel/:id/deactivate | - | |
| **Payment** | GET | /payment/method | - | |
| **Payment** | POST | /payment/method | name, provider, type | |
| **Payment** | PUT | /payment/method/:id | name, provider, type | |
| **Payment** | DELETE | /payment/method/:id | - | |
| **Payment** | PUT | /payment/method/:id/activate | - | |
| **Payment** | PUT | /payment/method/:id/deactivate | - | |
| **Member** | GET | /member/topup-bonus | - | |
| **Member** | POST | /member/topup-bonus | name, amount, bonus | |
| **Member** | GET | /member/topup-bonus/:id | - | |
| **Member** | PUT | /member/topup-bonus/:id | name, amount, bonus | |
| **Member** | DELETE | /member/topup-bonus/:id | - | |
| **Member** | PUT | /member/topup-bonus/:id/activate | - | |
| **Member** | PUT | /member/topup-bonus/:id/deactivate | - | |
| **Inventory** | GET | /inventory/item | type query param | |
| **Inventory** | POST | /inventory/item | Full item payload | |
| **Inventory** | GET | /inventory/item/:id | - | |
| **Inventory** | PUT | /inventory/item/:id | Full item payload | |
| **Inventory** | DELETE | /inventory/item/:id | - | |
| **Inventory** | PUT | /inventory/item/:id/activate | - | |
| **Inventory** | PUT | /inventory/item/:id/deactivate | - | |
| **Inventory** | GET | /inventory/catalog | - | |
| **Inventory** | POST | /inventory/catalog | Full catalog payload | |
| **Inventory** | GET | /inventory/catalog/:id | - | |
| **Inventory** | PUT | /inventory/catalog/:id | Full catalog payload | |
| **Inventory** | DELETE | /inventory/catalog/:id | - | |
| **Inventory** | PUT | /inventory/catalog/:id/activate | - | |
| **Inventory** | PUT | /inventory/catalog/:id/deactivate | - | |
| **Inventory** | PUT | /inventory/catalog/:id/types | outlet_type_ids array | |
| **Inventory** | PUT | /inventory/catalog/:id/outlet | outlet_ids array | |
| **Warehouse** | GET | /warehouse | - | |
| **Supplier** | GET | /supplier | - | |
| **Supplier** | POST | /supplier | name, phone, email, address | |
| **Supplier** | GET | /supplier/:id | - | |
| **Supplier** | PUT | /supplier/:id | name, phone, email, address | |
| **Supplier** | DELETE | /supplier/:id | - | |
| **Supplier** | PUT | /supplier/:id/activate | - | |
| **Supplier** | PUT | /supplier/:id/deactivate | - | |
| **Purchase** | GET | /purchase/order | - | |
| **Purchase** | POST | /purchase/order | Full order payload | |
| **Purchase** | GET | /purchase/order/:id | - | |
| **Purchase** | PUT | /purchase/order/:id | Full order payload | |
| **Purchase** | DELETE | /purchase/order/:id | - | |
| **Purchase** | PUT | /purchase/order/:id/publish | - | |
| **Purchase** | PUT | /purchase/order/:id/paid | - | |
| **Sales** | GET | /sales/order | - | |
| **Sales** | POST | /sales/order | Full order payload | |
| **Sales** | GET | /sales/order/:id | - | |
| **Sales** | PUT | /sales/order/:id | Full order payload | |
| **Sales** | DELETE | /sales/order/:id | - | |
| **Sales** | PUT | /sales/order/:id/publish | - | |
| **Sales** | PUT | /sales/order/:id/paid | - | |
| **Sales** | PUT | /sales/order/:id/cancel | note | |
| **Sales Return** | GET | /sales/return | - | |
| **Sales Return** | GET | /sales/return/:id | - | |
| **Sales Return** | PUT | /sales/return/:id/approve | - | |
| **Production** | GET | /production/plan | - | |
| **Production** | GET | /production/plan/:id | - | |
| **Production** | POST | /production/plan | Full plan payload | |
| **Production** | PUT | /production/plan/:id/publish | - | |
| **Production** | PUT | /production/plan/:id/complete | - | |
| **Production** | DELETE | /production/plan/:id | - | |
| **Production Item** | PUT | /production/item/:id | quantity, note | |
| **Production Item** | PUT | /production/item/:id/complete | - | |
| **Demand** | GET | /demand/production | production_date param | |
| **Demand** | GET | /demand/item | - | |

---

## 6. Security Considerations

### Authentication
- All endpoints (except `/auth/login`, `/auth/signup`) require `Authorization: Bearer <token>` header
- baseQuery already handles token injection from Redux state
- 401/403 errors trigger automatic signout via `signout()` dispatch

### Error Handling
- Invalid payload submissions → Backend validation errors displayed to user
- Network failures → Toast notification, no app crash
- Unauthorized access → Automatic redirect to login

---

## 7. Performance Strategy

### Caching
- RTK Query's default caching with tag-based invalidation
- Each API defines its own tagTypes for precise cache management

### Optimization
- Lazy queries for list operations (pagination support)
- Optimistic updates for activate/deactivate operations
- Response body logging via logger utility

---

## 8. Implementation Phases

### Phase 1: Preparation
- [ ] Move existing `src/services/[domain]` directories to `temp/services/`
- [ ] Create new type files in `src/services/types/`
- [ ] Create new service directories

### Phase 2: Auth & Outlet (Foundation)
- [ ] Update `types/auth.ts` with signup interface
- [ ] Rebuild `auth/api.ts` with new endpoints
- [ ] Rebuild `outlet/api.ts` with new payload structure
- [ ] Create outlet hooks
- [ ] Update `reducer.tsx` and `store.tsx`

### Phase 3: POS Services
- [ ] Update `types/pos.ts` with full payload interfaces
- [ ] Rebuild `pos/api.ts` with channel prices, ingredients, addon_groups
- [ ] Create separate payment-method service
- [ ] Create separate member-topup-bonus service
- [ ] Create hooks for all POS services

### Phase 4: Inventory Services
- [ ] Update `types/inventory.ts` with raw_material/finished_goods
- [ ] Rebuild `inventory/api.ts` with BOM support
- [ ] Add catalog types/outlets endpoints
- [ ] Create hooks

### Phase 5: Order Services
- [ ] Create `types/purchase.ts` and `types/sales.ts`
- [ ] Rebuild purchase API with publish/paid actions
- [ ] Rebuild sales API with publish/paid/cancel actions
- [ ] Create sales return API
- [ ] Create hooks

### Phase 6: Production & Demand
- [ ] Create production types and API
- [ ] Create demand API
- [ ] Create hooks

### Phase 7: Supporting Services
- [ ] Create warehouse service (GET only)
- [ ] Create supplier service
- [ ] Verify region API alignment

### Phase 8: Integration & Verification
- [ ] Update reducer.tsx with all new APIs
- [ ] Update store.tsx persist blacklist
- [ ] Verify TypeScript compilation
- [ ] Audit endpoint coverage against Postman collection

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Response shapes differ from expectations | High | Medium | Use flexible interfaces, refine after user provides responses |
| UI breaks due to changed payload keys | High | Medium | Keep hook signatures compatible via createCrudHook |
| Missing endpoints discovered late | Medium | Low | Manual audit against Postman collection in Phase 8 |
| Type errors during compilation | Medium | Low | Progressive type definition, use `any` where needed initially |

---

## 10. Open Questions

- [ ] **Response Shapes**: User will provide exact response structures later. Types designed as flexible interfaces.
- [ ] **Deprecated Pages**: Some existing pages may use endpoints not in new collection - to be identified during implementation if any.
- [ ] **Stock Operations**: Current API has `/inventory/stock-in` and `/inventory/stock-out` - not in spec. Should these be preserved or removed?

---

## Next Steps

1. Review plan with stakeholders
2. Run `/tasks new-api-service` to generate implementation tasks
3. Begin Phase 1: Preparation

---

*Technical plan generated with SDD 4.0*
