# Specification: New API Service Layer Migration

**Task ID:** new-api-service
**Created:** 2026-06-05
**Status:** Ready for Planning
**Version:** 1.0

## 1. Problem Statement

- **The Problem:** The existing API service layer does not align with the new backend API defined in the Postman collection (`docs/Franchisor.postman_collection.json`). Endpoints, payloads, and data structures have evolved, making incremental patching risky and error-prone.

- **Current Situation:** The codebase uses RTK Query services that were built for an older API version. Modifying them in-place would create a hybrid state where old and new contracts coexist, leading to confusion and potential runtime errors.

- **Desired Outcome:** A clean, fully-aligned API service layer that implements every endpoint from the new Postman collection with correct payloads, enabling the frontend to communicate reliably with the new backend.

## 2. User Personas

### Primary User: Franchisor Admin
- **Who:** Administrative staff managing franchises, outlets, inventory, and sales.
- **Goals:** Perform CRUD operations on outlets, menus, inventory items, and orders with accurate data submission.
- **Pain Points:** Current forms may submit incorrect payloads, leading to backend validation errors or data corruption.

### Secondary User: Developer
- **Who:** Frontend developers maintaining the codebase.
- **Goals:** Have a predictable, well-typed API layer that matches backend expectations.
- **Pain Points:** Unclear payload requirements, missing endpoints, and type mismatches.

## 3. Functional Requirements

### FR-1: Authentication & Profile Management

**Description:** Handle user authentication (signup, login) and profile management.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| POST | `/auth/signup` | `company_name`, `username`, `name`, `email`, `phone`, `password`, `confirm_password` |
| POST | `/auth/login` | `username`, `password` |
| GET | `/profile/me` | - |
| PUT | `/profile/me` | `name`, `password`, `confirm_password` |

**User Story:**
> As a Franchisor Admin, I want to sign up and log in with accurate credentials so that I can securely access the system.

**Acceptance Criteria:**
- [ ] Given valid signup data, when I submit the form, then a new account is created and I receive an access token.
- [ ] Given valid login credentials, when I submit the form, then I receive an access token and user profile.
- [ ] Given an existing profile, when I update my name or password, then the changes are persisted.

**Priority:** Must Have

---

### FR-2: Outlet Management

**Description:** Manage outlets, outlet types, and POS channel assignments.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/outlet` | - |
| POST | `/outlet` | `outlet_type_id`, `name`, `recipient_name`, `phone`, `address`, `region_id`, `service_charges`, `channels[]`, `owner_name`, `owner_username`, `owner_password` |
| GET | `/outlet/:id` | - |
| PUT | `/outlet/:id` | Same as POST |
| DELETE | `/outlet/:id` | - |
| PUT | `/outlet/:id/activate` | - |
| PUT | `/outlet/:id/deactivate` | - |
| PUT | `/outlet/:id/channels` | `channels[]` (array of `{ pos_channel_id, is_active }`) |
| GET | `/outlet/type` | - |
| POST | `/outlet/type` | `name` |
| PUT | `/outlet/type/:id` | `name` |
| DELETE | `/outlet/type/:id` | - |
| PUT | `/outlet/type/:id/activate` | - |
| PUT | `/outlet/type/:id/deactivate` | - |

**User Story:**
> As a Franchisor Admin, I want to create and configure outlets with shipping details and POS channel mappings so that each outlet operates correctly.

**Acceptance Criteria:**
- [ ] Given valid outlet data, when I create an outlet, then the system stores all shipping and owner details.
- [ ] Given an outlet ID, when I update its channels, then the POS channel assignments are updated.
- [ ] Given an outlet or outlet type, when I trigger activate/deactivate, then the status is updated.

**Priority:** Must Have

---

### FR-3: POS Menu & Category Management

**Description:** Manage POS menus with ingredients, channel prices, and addon groups.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/pos/menu` | - |
| POST | `/pos/menu` | `category_id`, `name`, `base_price`, `image`, `is_vatable`, `is_additional`, `channel_prices[]`, `ingredients[]`, `addon_groups[]` |
| GET | `/pos/menu/:id` | - |
| PUT | `/pos/menu/:id` | Same as POST |
| DELETE | `/pos/menu/:id` | - |
| PUT | `/pos/menu/:id/activate` | - |
| PUT | `/pos/menu/:id/deactivate` | - |
| PUT | `/pos/menu/:id/types` | `outlet_type_ids[]` (array of strings) |
| GET | `/pos/category` | - |
| POST | `/pos/category` | `name`, `image` |
| PUT | `/pos/category/:id` | `name`, `image` |
| DELETE | `/pos/category/:id` | - |
| PUT | `/pos/category/:id/activate` | - |
| PUT | `/pos/category/:id/deactivate` | - |

**Payload Details:**
- `channel_prices`: Array of `{ pos_channel_id: string, price: number }`
- `ingredients`: Array of `{ catalog_id: string, porsi: number }`
- `addon_groups`: Array of `{ name: string, type: "options" | "multiple", items: { addon_menu_id: string }[] }`

**User Story:**
> As a Franchisor Admin, I want to define menu items with multi-channel pricing and ingredient mappings so that sales and inventory are accurately tracked.

**Acceptance Criteria:**
- [ ] Given a menu with channel prices, when I save it, then each channel has its specific price stored.
- [ ] Given a menu with ingredients, when I save it, then the catalog-to-menu mapping is persisted.

**Priority:** Must Have

---

### FR-4: POS Channel & Payment Method

**Description:** Manage POS channels and payment methods.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/pos/channel` | - |
| POST | `/pos/channel` | `name` |
| PUT | `/pos/channel/:id` | `name` |
| DELETE | `/pos/channel/:id` | - |
| PUT | `/pos/channel/:id/activate` | - |
| PUT | `/pos/channel/:id/deactivate` | - |
| GET | `/payment/method` | - |
| POST | `/payment/method` | `name`, `provider`, `type` |
| PUT | `/payment/method/:id` | `name`, `provider`, `type` |
| DELETE | `/payment/method/:id` | - |
| PUT | `/payment/method/:id/activate` | - |
| PUT | `/payment/method/:id/deactivate` | - |

**Priority:** Must Have

---

### FR-5: Member Topup Bonus

**Description:** Manage member topup bonus schemes.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/member/topup-bonus` | - |
| POST | `/member/topup-bonus` | `name`, `amount`, `bonus` |
| GET | `/member/topup-bonus/:id` | - |
| PUT | `/member/topup-bonus/:id` | `name`, `amount`, `bonus` |
| DELETE | `/member/topup-bonus/:id` | - |
| PUT | `/member/topup-bonus/:id/activate` | - |
| PUT | `/member/topup-bonus/:id/deactivate` | - |

**Priority:** Should Have

---

### FR-6: Inventory Item Management

**Description:** Manage inventory items with support for raw materials and finished goods (including BOMs).

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/inventory/item` | Query: `type` ("raw_material" or "finished_goods") |
| POST | `/inventory/item` | See payload details below |
| GET | `/inventory/item/:id` | - |
| PUT | `/inventory/item/:id` | Same as POST |
| DELETE | `/inventory/item/:id` | - |
| PUT | `/inventory/item/:id/activate` | - |
| PUT | `/inventory/item/:id/deactivate` | - |

**Payload Details:**

**Raw Material:**
```json
{
  "type": "raw_material",
  "category": "string",
  "barcode": "string?",
  "name": "string",
  "variant": "string?",
  "packaging": "string",
  "size": "string",
  "is_batch_tracking": boolean,
  "picking_strategy": "string?",
  "base_price": number,
  "weight": number,
  "fractions": [{ "name": "string", "quantity": number }]
}
```

**Finished Goods:**
```json
{
  "type": "finished_goods",
  "category": "string",
  "barcode": "string?",
  "name": "string",
  "variant": "string?",
  "packaging": "string",
  "size": "string",
  "is_batch_tracking": boolean,
  "picking_strategy": "string?",
  "base_price": number,
  "weight": number,
  "fractions": [{ "name": "string", "quantity": number }],
  "boms": [{ "material_id": "string", "quantity": number, "measurement": "string" }]
}
```

**User Story:**
> As a Franchisor Admin, I want to create inventory items with different types so that raw materials and finished goods are tracked separately with appropriate data.

**Acceptance Criteria:**
- [ ] Given a raw material item, when I save it, then it is stored without BOM data.
- [ ] Given a finished goods item, when I save it with BOMs, then the bill of materials is linked correctly.

**Priority:** Must Have

---

### FR-7: Inventory Catalog Management

**Description:** Manage inventory catalogs with bundle support.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/inventory/catalog` | - |
| POST | `/inventory/catalog` | `name`, `is_bundle`, `unit_price`, `measurement`, `unit`, `items[]` |
| GET | `/inventory/catalog/:id` | - |
| PUT | `/inventory/catalog/:id` | Same as POST |
| DELETE | `/inventory/catalog/:id` | - |
| PUT | `/inventory/catalog/:id/activate` | - |
| PUT | `/inventory/catalog/:id/deactivate` | - |
| PUT | `/inventory/catalog/:id/types` | `outlet_type_ids[]` |
| PUT | `/inventory/catalog/:id/outlet` | `outlet_ids[]` |

**Payload Details:**
- `items`: Array of `{ item_id: string, fraction_id: string, quantity: number, margin: number }`

**Priority:** Must Have

---

### FR-8: Warehouse Management

**Description:** Manage warehouse locations.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/warehouse` | - |

**Priority:** Should Have

---

### FR-9: Purchase Order Management

**Description:** Manage purchase orders with workflow actions (publish, payment).

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/purchase/order` | - |
| POST | `/purchase/order` | See payload details below |
| GET | `/purchase/order/:id` | - |
| PUT | `/purchase/order/:id` | Same as POST |
| DELETE | `/purchase/order/:id` | - |
| PUT | `/purchase/order/:id/publish` | - |
| PUT | `/purchase/order/:id/paid` | - |

**Payload Details:**
```json
{
  "warehouse_id": "string",
  "ref_code": "string?",
  "supplier_id": "string?",
  "outlet_id": "string?",
  "recipient_name": "string?",
  "recipient_phone": "string?",
  "recipient_region_id": "string?",
  "recipient_address": "string?",
  "note": "string?",
  "shipping_date": "string?",
  "requires_shipping": boolean,
  "shipping_charges": number,
  "items": [{ "id?": "string", "catalog_id": "string", "quantity_ordered": number }]
}
```

**User Story:**
> As a Franchisor Admin, I want to create purchase orders and approve them so that inventory is replenished accurately.

**Acceptance Criteria:**
- [ ] Given a draft purchase order, when I publish it, then the order becomes active.
- [ ] Given an active order, when I record payment, then the payment status is updated.

**Priority:** Must Have

---

### FR-10: Supplier Management

**Description:** Manage suppliers.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/supplier` | - |
| POST | `/supplier` | `name`, `phone?`, `email?`, `address?` |
| GET | `/supplier/:id` | - |
| PUT | `/supplier/:id` | Same as POST |
| DELETE | `/supplier/:id` | - |
| PUT | `/supplier/:id/activate` | - |
| PUT | `/supplier/:id/deactivate` | - |

**Priority:** Should Have

---

### FR-11: Sales Order Management

**Description:** Manage sales orders with workflow actions (publish, paid, cancel).

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/sales/order` | - |
| POST | `/sales/order` | See payload details below |
| GET | `/sales/order/:id` | - |
| PUT | `/sales/order/:id` | Same as POST |
| DELETE | `/sales/order/:id` | - |
| PUT | `/sales/order/:id/publish` | - |
| PUT | `/sales/order/:id/paid` | - |
| PUT | `/sales/order/:id/cancel` | `{ "note": "string" }` |

**Payload Details:**
```json
{
  "warehouse_id": "string",
  "ref_code": "string?",
  "outlet_id": "string",
  "recipient_name": "string?",
  "recipient_phone": "string?",
  "recipient_region_id": "string?",
  "recipient_address": "string?",
  "note": "string?",
  "shipping_date": "string?",
  "requires_shipping": boolean,
  "shipping_charges": number,
  "items": [{ "id?": "string", "catalog_id": "string", "quantity_ordered": number }]
}
```

**User Story:**
> As a Franchisor Admin, I want to create sales orders, publish them, and mark them as paid or cancelled so that order lifecycle is fully managed.

**Acceptance Criteria:**
- [ ] Given a draft sales order, when I publish it, then it becomes active.
- [ ] Given an active order, when I mark it paid, then payment status is updated.
- [ ] Given an active order, when I cancel it with a note, then it becomes cancelled.

**Priority:** Must Have

---

### FR-12: Production Planning

**Description:** Manage production plans.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/production/plan` | - |
| GET | `/production/plan/:id` | - |
| POST | `/production/plan` | `warehouse_id`, `production_date`, `note?`, `items[]` |
| PUT | `/production/plan/:id/publish` | - |
| PUT | `/production/plan/:id/complete` | - |
| DELETE | `/production/plan/:id` | - |

**Payload Details:**
- `items`: Array of `{ item_id: string, quantity: number }`

**Priority:** Should Have

---

### FR-13: Demand Forecasting

**Description:** Retrieve demand data for production and items.

**Endpoints:**

| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/demand/production` | `production_date` (string) |
| GET | `/demand/item` | - |

**Priority:** Should Have

---

### FR-15: Production Item Management

**Description:** Manage production items and their completion status.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| PUT | `/production/item/:id` | `quantity`, `note?` |
| PUT | `/production/item/:id/complete` | - |

**Priority:** Should Have

---

### FR-16: Sales Return Management

**Description:** Manage sales returns and approvals.

**Endpoints:**

| Method | Path | Payload |
|--------|------|---------|
| GET | `/sales/return` | - |
| GET | `/sales/return/:id` | - |
| PUT | `/sales/return/:id/approve` | - |

**Priority:** Should Have

---

## 4. Non-Functional Requirements

- **Performance:** All API calls must respond within 3 seconds under normal conditions.
- **Security:** All requests must include `Authorization: Bearer <token>` header. Unauthorized requests (401/403) must trigger signout.
- **Type Safety:** All request payloads must be strictly typed with TypeScript interfaces.
- **Maintainability:** Each domain must have isolated `api.tsx`, `hooks.tsx`, and type files.

## 5. Out of Scope

- ❌ **Response Shape Definition:** Exact response structures will be provided later by the user. Interfaces will use flexible shapes initially.
- ❌ **UI Component Changes:** This task focuses solely on the API service layer. Page-level changes are out of scope.
- ❌ **Legacy Endpoint Support:** Endpoints not in the new Postman collection will not be implemented.

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid payload submission | Backend returns validation errors; frontend displays error messages. |
| Unauthorized access (401/403) | System signs out user and redirects to login. |
| Network failure | Display network error toast; do not crash the app. |

## 7. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Endpoint Coverage | 100% of Postman collection | Manual audit against spec |
| Type Safety | 100% of payloads typed | TypeScript compilation passes |
| UI Compatibility | No runtime errors on existing pages | Manual testing of CRUD flows |

## 8. Open Questions

- [ ] What are the exact response shapes for each endpoint? (User will provide later)
- [ ] Are there any deprecated pages that use endpoints not in the new collection?

## 9. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.4 | 2026-06-05 | Added Sales Return, Inventory Catalog types, corrected Purchase Order paid, and ensured Production Item actions. Removed User Management. |
| 1.3 | 2026-06-05 | Removed User Management. |
| 1.0 | 2026-06-05 | Initial specification with all endpoint details |

## Next Steps

1. Review spec with stakeholders
2. Resolve open questions (response shapes)
3. Run `/plan new-api-service` to create technical implementation plan

*Specification created with SDD 4.0*
