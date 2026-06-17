# Research: Page-API Alignment

**Task ID:** page-api-alignment
**Date:** 2026-06-06
**Status:** Complete (Updated)
**Version:** 2.0

---

## 1. Executive Summary

The project has migrated to a new RTK Query-based API service layer based on the Postman collection. However, significant gaps exist between the API layer and UI implementation:

1. **Payload Mismatch**: Existing forms use outdated field structures that don't align with new API types
2. **Missing Pages**: Several API modules (Production, Demand, Payment Method, Member, Warehouse) have no corresponding UI pages
3. **Wrong Module Placement**: Some features exist in incorrect modules (Demand is under Purchase instead of standalone)
4. **Incomplete Implementations**: Sales Return API exists but has no UI

This research provides a comprehensive audit and migration strategy to align all pages with the new API layer.

---

## 2. Existing Page Patterns Analysis

### 2.1 Standard Page Structure

```
src/pages/[module]/
├── index.tsx              # Module entry point
├── routes.tsx             # Route definitions
├── [entity].tsx           # List page (e.g., purchaseOrder.tsx)
├── [entity]Create.tsx     # Create page
├── [entity]Update.tsx     # Update page
├── [entity]Detail.tsx     # Detail/view page
├── components/
│   └── [entity]Form.tsx   # Form component
└── table/
    ├── [entity].config.tsx   # Table column definitions
    └── [entity].filter.tsx   # Filter components
```

### 2.2 List Page Pattern

```tsx
// Standard list page structure
export function PurchaseOrder() {
  const navigate = useNavigate();
  const tableConfig = useMemo(() => createTableConfig({
    onRowClick: (row) => navigate(`/purchase/order/${row.id}`),
  }), [navigate]);

  const Table = useTable("purchase_order", tableConfig);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Purchase Order"
        subtitle="Description..."
        action={<Button onClick={() => navigate("/path/create")}>Add</Button>}
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render emptyTitle="..." emptyDescription="..." />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
```

### 2.3 CRUD Hook Pattern

The project uses `createCrudHook` factory for standardized CRUD operations:

```tsx
// src/services/[module]/hooks.tsx
export const usePurchaseOrder = createCrudHook<PurchaseOrderDetail>({
  entityName: "purchaseOrder",
  useLazyGetQuery: useLazyGetPurchaseOrdersQuery,
  useLazyShowQuery: useLazyGetPurchaseOrderQuery,
  useCreateMutation: useCreatePurchaseOrderMutation,
  useUpdateMutation: useUpdatePurchaseOrderMutation,
  useRemoveMutation: useDeletePurchaseOrderMutation,
  customOperations: {
    approve: useApprovePurchaseOrderMutation,
    pay: usePaymentPurchaseOrderMutation,
  },
});
```

**Key Hook Methods:**
- `get(params)` - Fetch list with pagination
- `show({ id })` - Fetch single entity
- `create(payload)` - Create entity
- `update({ id, payload })` - Update entity
- `remove({ id })` - Delete entity
- Custom operations (approve, pay, cancel, etc.)

### 2.4 Form Pattern

Forms use controlled state with manual validation:

```tsx
// Form structure
export function EntityForm({ id, initialData, onSubmit }) {
  const FormState = useAppSelector((s) => s.form);
  const { showToast } = useEnigmaUI();
  const { get, getResult } = useEntity();

  const [formData, setFormData] = useState({ ... });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ... }; // Transform formData to API payload
    onSubmit(payload);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      {/* Form sections with cards */}
    </form>
  );
}
```

---

## 3. Detailed Payload Mismatch Analysis

### 3.1 Purchase Order Mismatch

**Current Form (`purchaseOrderForm.tsx`) sends:**
```json
{
  "supplier_id": "number",
  "reff_code": "string",
  "eta_at": "string (YYYY-MM-DD)",
  "address": "string",
  "recipient_name": "string",
  "recipient_phone": "string",
  "note": "string",
  "shipping_charge": "number",
  "items": [{
    "item_id": "number",
    "fraction_id": "number",
    "quantity": "number",
    "unit_nett": "number",
    "unit_tax": "number"
  }]
}
```

**API Types (`types/purchase.ts`) expects:**
```json
{
  "supplier_id": "string",
  "number": "string",
  "date": "string",
  "note": "string?",
  "discount": "number",
  "tax": "number",
  "shipping_fee": "number",
  "items": [{
    "catalog_id": "string",
    "quantity": "number",
    "unit_price": "number"
  }]
}
```

**Critical Differences:**
| Field | Form | API Type | Issue |
|-------|------|----------|-------|
| `supplier_id` | `number` | `string` | Type mismatch |
| `items[].item_id` | `number` | - | Should be `catalog_id` |
| `items[].fraction_id` | `number` | - | Not in API type |
| `items[].unit_nett` | `number` | `unit_price` | Different naming |
| `shipping_charge` | `number` | `shipping_fee` | Different naming |
| `eta_at` | `string` | - | Not in API type |
| - | - | `number`, `date`, `discount`, `tax` | Missing in form |

### 3.2 Sales Order Status

**API Types (`types/sales.ts`) defines:**
```typescript
interface SalesOrderRequest {
  outlet_id: string;
  customer_name?: string;
  customer_phone?: string;
  transaction_date: string;
  note?: string;
  discount: number;
  tax: number;
  service_charge: number;
  items: SalesOrderItem[];
  payment_method_id: string;
  pos_channel_id: string;
}
```

**Sales Detail Response includes:**
- `warehouse_id`, `ref_code`, `outlet_id`
- `shipping_date`, `requires_shipping`, `shipping_charges`
- `order_status`, `payment_status`, `delivery_status`

**Need to verify:** Current form implementation alignment

---

## 4. Page-API Coverage Matrix

### 4.1 Services with Pages (Need Update)

| Service | Path | Page Exists | Alignment Status | Action Required |
|---------|------|-------------|------------------|-----------------|
| `authApi` | `src/services/auth` | Signin only | OK | Profile page needed |
| `outletApi` | `src/services/outlet` | Yes | Partial | Update payloads |
| `posApi` | `src/services/pos` | Yes | Partial | Update payloads |
| `inventoryApi` | `src/services/inventory` | Yes | Partial | Update payloads |
| `purchaseApi` | `src/services/purchase` | Yes | **Mismatch** | Rebuild forms |
| `salesApi` | `src/services/sales` | Yes | Partial | Add Sales Return UI |
| `supplierApi` | `src/services/supplier` | Yes (under Purchase) | Partial | Move to Supply Chain |
| `regionApi` | `src/services/region` | No (used in forms) | OK | Keep as utility |

### 4.2 Services Without Pages (Need Creation)

| Service | Path | Domain | Priority | Pages to Create |
|---------|------|--------|----------|-----------------|
| `productionApi` | `src/services/production` | Operations | **High** | Plan list, Plan detail, Item management |
| `demandApi` | `src/services/demand` | Operations | High | Production demand, Item demand |
| `paymentMethodApi` | `src/services/payment-method` | POS Settings | Medium | Payment method list |
| `memberApi` | `src/services/member` | POS Settings | Medium | Topup bonus list |
| `warehouseApi` | `src/services/warehouse` | Supply Chain | Medium | Warehouse list (read-only) |
| `salesReturnApi` | `src/services/sales` (partial) | Sales | High | Return list, Return detail |

### 4.3 Current Page Inventory

```
src/pages/
├── dashboard/
│   └── index.tsx                    # Landing page
├── purchase/                        # NEEDS REBUILD
│   ├── demand.tsx                   # WRONG MODULE - move to /demand
│   ├── purchaseOrder.tsx            # List - rebuild
│   ├── purchaseOrderCreate.tsx      # Create - rebuild
│   ├── purchaseOrderDetail.tsx      # Detail - rebuild
│   ├── purchaseOrderUpdate.tsx      # Update - rebuild
│   ├── supplier.tsx                 # List - rebuild
│   ├── supplierCreate.tsx           # Create - rebuild
│   └── supplierUpdate.tsx           # Update - rebuild
├── sales/                           # NEEDS UPDATE
│   ├── salesOrder.tsx               # List - update
│   ├── salesOrderCreate.tsx         # Create - update
│   └── salesOrderDetail.tsx         # Detail - update
│   └── [MISSING] salesReturn.tsx    # NEW - create
├── report/                          # LEGACY - needs full rewrite
│   └── *.tsx                        # All reports need rebuild
├── setting/
│   ├── business/                    # OK
│   ├── inventory/                   # NEEDS UPDATE
│   │   ├── inventoryItem.tsx        # Update payloads
│   │   ├── inventoryCatalog.tsx     # Update payloads
│   │   └── ...
│   ├── outlet/                      # NEEDS UPDATE
│   │   ├── outlet.tsx               # Update payloads
│   │   └── outletType.tsx           # Update payloads
│   ├── pos/                         # NEEDS UPDATE + NEW PAGES
│   │   ├── posCatalog.tsx           # Update payloads
│   │   ├── posCategory.tsx          # Update payloads
│   │   ├── posChannel.tsx           # Update payloads
│   │   ├── posPayment.tsx           # NEW - use payment-method API
│   │   └── posTopupSchema.tsx       # NEW - use member API
│   └── user/                        # OK
└── signin/
    └── index.tsx                    # OK
```

---

## 5. API Endpoints Reference

### 5.1 Production API

```typescript
// src/services/production/api.tsx
endpoints: {
  // Plan Management
  getProductionPlans: GET /production/plan
  getProductionPlan: GET /production/plan/:id
  createProductionPlan: POST /production/plan
  publishProductionPlan: PUT /production/plan/:id/publish
  completeProductionPlan: PUT /production/plan/:id/complete
  deleteProductionPlan: DELETE /production/plan/:id

  // Item Management
  updateProductionItem: PUT /production/item/:id
  completeProductionItem: PUT /production/item/:id/complete
}
```

### 5.2 Demand API

```typescript
// src/services/demand/api.tsx
endpoints: {
  getProductionDemand: GET /demand/production?production_date=YYYY-MM-DD
  getItemDemand: GET /demand/item
}
```

### 5.3 Payment Method API

```typescript
// src/services/payment-method/api.tsx
endpoints: {
  getPaymentMethods: GET /payment/method
  createPaymentMethod: POST /payment/method
  updatePaymentMethod: PUT /payment/method/:id
  deletePaymentMethod: DELETE /payment/method/:id
  activatePaymentMethod: PUT /payment/method/:id/activate
  deactivatePaymentMethod: PUT /payment/method/:id/deactivate
}
```

### 5.4 Member Topup Bonus API

```typescript
// src/services/member/api.tsx
endpoints: {
  getTopupBonuses: GET /member/topup-bonus
  getTopupBonus: GET /member/topup-bonus/:id
  createTopupBonus: POST /member/topup-bonus
  updateTopupBonus: PUT /member/topup-bonus/:id
  deleteTopupBonus: DELETE /member/topup-bonus/:id
  activateTopupBonus: PUT /member/topup-bonus/:id/activate
  deactivateTopupBonus: PUT /member/topup-bonus/:id/deactivate
}
```

### 5.5 Warehouse API

```typescript
// src/services/warehouse/api.tsx
endpoints: {
  getWarehouses: GET /warehouse  // Read-only
}
```

### 5.6 Sales Return API

```typescript
// Already in src/services/sales/api.tsx
endpoints: {
  getSalesReturns: GET /sales/return
  getSalesReturn: GET /sales/return/:id
  approveSalesReturn: PUT /sales/return/:id/approve
}
```

---

## 6. Migration Strategy

### 6.1 Guiding Principles

1. **Preserve, Don't Delete**: Move existing pages to `temp/pages/` for reference
2. **Clean Slate**: Build new pages from scratch using new API types
3. **Pattern Consistency**: Follow existing page patterns (structure, hooks, forms)
4. **Type Safety**: Use TypeScript interfaces from `src/services/types/`
5. **Incremental Migration**: One module at a time, test thoroughly

### 6.2 Migration Workflow

```
For each module:
1. Move existing pages to temp/pages/[module]/
2. Create new pages using pattern:
   - [entity].tsx (list)
   - [entity]Create.tsx
   - [entity]Detail.tsx
   - components/[entity]Form.tsx
   - table/[entity].config.tsx
   - table/[entity].filter.tsx
3. Use createCrudHook for data operations
4. Use types from src/services/types/
5. Test all CRUD operations
6. Verify payload matches API expectations
```

### 6.3 Directory Structure After Migration

```
src/pages/
├── dashboard/
│   └── index.tsx
├── operations/                      # NEW
│   ├── production/                  # NEW
│   │   ├── routes.tsx
│   │   ├── productionPlan.tsx
│   │   ├── productionPlanCreate.tsx
│   │   ├── productionPlanDetail.tsx
│   │   └── table/
│   └── demand/                      # NEW (moved from purchase)
│       ├── routes.tsx
│       ├── productionDemand.tsx
│       ├── itemDemand.tsx
│       └── table/
├── supply-chain/                    # NEW
│   ├── purchase/                    # MOVED & REBUILT
│   │   ├── routes.tsx
│   │   ├── purchaseOrder.tsx
│   │   ├── purchaseOrderCreate.tsx
│   │   ├── purchaseOrderDetail.tsx
│   │   └── components/
│   ├── sales/                       # MOVED & REBUILT
│   │   ├── routes.tsx
│   │   ├── salesOrder.tsx
│   │   ├── salesOrderCreate.tsx
│   │   ├── salesOrderDetail.tsx
│   │   ├── salesReturn.tsx          # NEW
│   │   └── components/
│   ├── inventory/                   # MOVED from setting
│   │   ├── routes.tsx
│   │   ├── inventoryItem.tsx
│   │   ├── inventoryCatalog.tsx
│   │   └── components/
│   ├── supplier/                    # MOVED from purchase
│   │   ├── routes.tsx
│   │   ├── supplier.tsx
│   │   └── components/
│   └── warehouse/                   # NEW
│       ├── routes.tsx
│       └── warehouse.tsx
├── pos/                             # MOVED from setting
│   ├── routes.tsx
│   ├── menu/                        # (was posCatalog)
│   ├── category/                    # (was posCategory)
│   ├── channel/                     # (was posChannel)
│   ├── payment-method/              # NEW
│   └── topup-bonus/                 # NEW
├── reports/                         # REBUILT
│   └── ...
└── settings/                        # SIMPLIFIED
    ├── routes.tsx
    ├── business/
    ├── outlet/
    └── user/

temp/pages/                          # LEGACY REFERENCE
├── purchase/                        # Original pages
├── sales/
├── report/
└── setting/
```

---

## 7. Implementation Priority

### Phase 1: Core Operations (High Priority)
1. **Production Module** - Completely new
   - Production Plan list, create, detail
   - Production Item management
2. **Demand Module** - New location
   - Move from `/purchase/demand`
   - Add item demand page
3. **Sales Return** - New feature
   - Return list, detail, approve functionality

### Phase 2: Supply Chain Updates (High Priority)
1. **Purchase Order** - Rebuild forms
   - Fix payload mismatch
   - Update to use `catalog_id` instead of `item_id`
   - Add `warehouse_id` field
2. **Sales Order** - Update forms
   - Verify payload alignment
   - Add missing fields
3. **Supplier** - Rebuild
   - Move to Supply Chain module

### Phase 3: POS & Settings (Medium Priority)
1. **Payment Method** - New page
   - Use `payment-method` API
2. **Topup Bonus** - New page
   - Use `member` API
3. **Warehouse** - New page (read-only)

### Phase 4: Reports (Medium Priority)
1. Rebuild all report pages using new API layer
2. Use `reports` API types

---

## 8. Key Technical Notes

### 8.1 Type Definitions Location
```
src/services/types/
├── api.ts           # ApiResponse, PaginatedResponse
├── auth.ts          # Auth types
├── inventory.ts     # InventoryItem, InventoryCatalog
├── outlet.ts        # Outlet, OutletType
├── pos.ts           # POSMenu, POSCategory, POSChannel
├── production.ts    # ProductionPlan, ProductionItem
├── purchase.ts      # PurchaseOrder
├── sales.ts         # SalesOrder, SalesReturn
├── supplier.ts      # Supplier
└── reports.ts       # Report types
```

### 8.2 Common Imports for New Pages

```tsx
// Layout
import { Page } from "@/components/app/layout";

// Table
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";

// UI Components
import { Button, Input, DatePicker, RemoteSelect } from "@/components/ui";

// CRUD Hooks
import { useEntity } from "@/services/[module]/hooks";

// Redux
import { useAppSelector } from "@/hooks";

// Enigma UI (toast, dialog, etc.)
import { useEnigmaUI } from "@/components";

// Utilities
import { currencyFormat } from "@/utils";
import dayjs from "dayjs";
```

### 8.3 Form State Management

Forms use Redux store for error state:
```tsx
const FormState = useAppSelector((s) => s.form);
// Access errors: FormState?.errors?.[fieldName]
```

---

## 9. Open Questions

1. **Route Structure**: Should we use nested routes (`/supply-chain/purchase`) or flat routes (`/purchase`)?
   - Recommendation: Keep flat routes for simplicity, update menu grouping only
   Answer: Confirmed (`/supply-chain/purchase`, etc.)

2. **Warehouse Page**: Is a dedicated Warehouse page needed, or is selection within transactions sufficient?
   - API provides read-only access, suggesting limited management needs
   Answer: Confirmed (Create new page)

3. **Report Migration**: Should reports be rebuilt incrementally or all at once?
   - Recommendation: Incremental, starting with most-used reports
   Answer: Confirmed (Leave in `temp/`, do not include in router)

4. **Form Validation**: Should we add Zod schema validation?
   - Current forms use manual validation
   - Recommendation: Keep existing pattern for consistency
   Answer: Confirmed (Keep existing patterns)

---

## 10. Next Steps

1. **Create Spec**: Run `/specify page-api-implement` with this research as foundation
2. **Plan Implementation**: Run `/plan page-api-implement` for technical breakdown
3. **Start with Production Module**: Highest priority new feature
4. **Migrate Purchase Forms**: Fix critical payload mismatch

---

*Research updated with SDD 2.0 - 2026-06-06*
