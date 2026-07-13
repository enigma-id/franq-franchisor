# API Contract — Franchisor v2

**Source of Truth:** Go source code at `D:\Enigma\franq\backend\franchisor`
**Generated:** 2026-07-09
**Endpoints:** ~156 across 29 modules

---

## 0. Conventions

### Base URL
```
https://[host]/api/v1
```

### Authentication
- **Method:** Bearer JWT
- **Header:** `Authorization: Bearer <access_token>`
- **Obtained from:** `POST /auth/login` response
- **Auto-refresh:** 401/403 → signout (FE handles automatically)

### Standard Response Envelope
```json
{
  "success": true,
  "message": "success",
  "data": { ... }
}
```

### Paginated Response Envelope
```json
{
  "success": true,
  "message": "success",
  "data": [ ... ],
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

### Error Response
```json
{
  "success": false,
  "message": "error description",
  "errors": {
    "field_name": ["validation error 1", "validation error 2"]
  }
}
```

### Activate/Deactivate Pattern
All CRUD modules follow this pattern for status toggling:
```
PUT /<resource>/{id}/activate   → is_active = true
PUT /<resource>/{id}/deactivate → is_active = false
```
Valid when: current state is opposite of target state.

### Standard List Query Params
All list endpoints support:
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 10) |
| `search` | string | Full-text search |

---

## 1. Auth + Profile

### 1.1 POST /auth/login

**Request:**
```json
{
  "identifier": "username_or_email",
  "password": "plaintext_password"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "user": {
      "id": "uuid",
      "franchisor_id": "uuid",
      "usergroup_id": "uuid",
      "outlet_id": "uuid",
      "username": "string",
      "name": "string",
      "is_active": true,
      "last_activity_at": "datetime|null",
      "created_at": "datetime",
      "updated_at": "datetime"
    },
    "access_token": "jwt_token_string"
  }
}
```

### 1.2 POST /auth/signup

**Request:**
```json
{
  "name": "string",
  "company_name": "string",
  "email": "string",
  "phone": "string",
  "username": "string",
  "password": "plaintext_password",
  "confirm_password": "plaintext_password"
}
```

**Response 200:** Same as login (returns user + access_token).

### 1.3 GET /profile/me

**Headers:** Authorization: Bearer <token>

**Response 200:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "uuid",
    "franchisor_id": "uuid",
    "usergroup_id": "uuid",
    "outlet_id": "uuid",
    "username": "string",
    "name": "string",
    "is_active": true,
    "last_activity_at": "datetime|null",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### 1.4 PUT /profile/me

**Request:**
```json
{
  "name": "string (optional)",
  "password": "string (optional)",
  "confirm_password": "string (optional, required if password provided)"
}
```

**Response 200:** Updated user object.

---

## 2. Franchisor

### 2.1 GET /franchisor/me

**Response 200:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "logo_url": "string",
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### 2.2 PUT /franchisor/me

**Request:**
```json
{
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "logo_url": "string"
}
```

**Response 200:** Updated franchisor object.

---

## 3. Dashboard

### 3.1 GET /dashboard

**Response 200:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "total_revenue": 0,
    "po_pending": 0,
    "withdrawal_pending": 0,
    "withdrawal_pending_amount": 0,
    "stock_kritis": 0,
    "sales_graph": {
      "labels": ["string"],
      "series": [{ "name": "string", "data": [0] }]
    },
    "omset_retail": 0,
    "omset_b2b": 0,
    "omset_franchise": 0,
    "omset_total": 0,
    "omset_bahan_baku": 0,
    "total_outlet": 0,
    "outlet_aktif": 0,
    "total_saldo_membership": 0,
    "total_service_charge": 0,
    "total_discount": 0,
    "outstanding_total": 0,
    "outstanding_count": 0,
    "total_withdrawal_bulan_ini": 0,
    "so_pipeline": { "pending": 0, "published": 0, "completed": 0 },
    "po_pipeline": { "pending": 0, "published": 0, "completed": 0 },
    "revenue_composition": { "labels": ["string"], "data": [0] },
    "b2b_summary": { "total_outstanding": 0, "unpaid_count": 0 },
    "production_plan_summary": { "plan": 0, "completed": 0 },
    "outlet_balance_total": { "total_saldo": 0, "total_withdrawn": 0 }
  }
}
```

---

## 4. Inventory Item

**Base:** `/inventory/item`

### 4.1 GET /inventory/item

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search name/barcode |
| `type` | string | Filter: `raw_material`, `finished_goods` |
| `category` | string | Filter by category |
| `is_active` | bool | Filter by active status |

**Response 200 (paginated):**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "supplier_id": "uuid",
    "type": "raw_material|finished_goods",
    "code": "string",
    "barcode": "string",
    "name": "string",
    "variant": "string",
    "packaging": "string",
    "size": "string",
    "picking_strategy": "fifo|fefo|lifo|manual",
    "is_batch_tracking": false,
    "default_fraction": "string",
    "base_price": 0,
    "weight": 0,
    "volume": 0,
    "category": "string",
    "safety_stock": 0,
    "stock_available": 0,
    "stock_defect": 0,
    "in_catalog": false,
    "is_vatable": false,
    "is_active": true,
    "alias_name": "string",
    "created_by": "uuid",
    "updated_by": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime",
    "fractions": [{
      "id": "uuid",
      "item_id": "uuid",
      "name": "string",
      "quantity": 0,
      "is_smallest": false
    }]
  }],
  "meta": { "page": 1, "page_size": 10, "total": 0, "total_pages": 0, "has_next": false, "has_prev": false }
}
```

### 4.2 POST /inventory/item

**Request:**
```json
{
  "type": "raw_material|finished_goods",
  "supplier_id": "uuid",
  "barcode": "string",
  "name": "string",
  "variant": "string",
  "packaging": "string",
  "size": "string",
  "picking_strategy": "fifo|fefo|lifo|manual",
  "is_batch_tracking": false,
  "base_price": 0,
  "weight": 0,
  "volume": 0,
  "category": "string",
  "safety_stock": 0,
  "is_vatable": false,
  "fractions": [{ "name": "string", "quantity": 0 }],
  "boms": [{ "material_id": "uuid", "quantity": 0, "measurement": "string" }]
}
```

**Validation Rules:**
- `type` must be `raw_material` or `finished_goods`
- BOMs only relevant for `finished_goods` type
- At least one fraction required

### 4.3 GET /inventory/item/{id}

**Response 200:** Single item detail (same shape as list item).

### 4.4 GET /inventory/item/{id}/fractions

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "item_id": "uuid",
    "name": "string",
    "quantity": 0,
    "is_smallest": false
  }]
}
```

### 4.5 PUT /inventory/item/{id}

**Request:** Same structure as POST. All fields optional (partial update).

### 4.6 DELETE /inventory/item/{id}

**Response 200:** `{ "success": true, "message": "Item deleted" }`

### 4.7 PUT /inventory/item/{id}/activate

### 4.8 PUT /inventory/item/{id}/deactivate

---

## 5. Inventory Catalog

**Base:** `/inventory/catalog`

### 5.1 GET /inventory/catalog

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search name |
| `is_active` | bool | Filter by active status |
| `item_type` | string | Filter by item type |

**Response 200 (paginated):**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "name": "string",
    "is_bundle": false,
    "item_id": "uuid",
    "fraction_id": "uuid",
    "base_price": 0,
    "unit_price": 0,
    "weight": 0,
    "volume": 0,
    "measurement": "string",
    "unit": 0,
    "is_active": true,
    "is_vatable": false,
    "created_by": "uuid",
    "updated_by": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime",
    "item": { ... },
    "item_fraction": { ... },
    "bundle_items": [{ "id": "uuid", "catalog_id": "uuid", "item_id": "uuid", "fraction_id": "uuid", "quantity": 0, "margin": 0, "base_price": 0, "item": { ... }, "fraction": { ... } }],
    "outlet_types": [{ "id": "uuid", "outlet_type_id": "uuid", "catalog_id": "uuid", "outlet_type": { "id": "uuid", "name": "string", ... } }]
  }],
  "meta": { ... }
}
```

### 5.2 POST /inventory/catalog

**Request (standard — `is_bundle: false`):**
```json
{
  "name": "string",
  "item_id": "uuid",
  "fraction_id": "uuid",
  "unit_price": 0,
  "measurement": "string",
  "unit": 0,
  "is_bundle": false
}
```

**Request (bundle — `is_bundle: true`):**
```json
{
  "name": "string",
  "is_bundle": true,
  "measurement": "string",
  "unit": 0,
  "items": [{
    "item_id": "uuid",
    "fraction_id": "uuid",
    "quantity": 0,
    "margin": 0
  }]
}
```

### 5.3 GET /inventory/catalog/{id}

### 5.4 PUT /inventory/catalog/{id}

**Request:** Same as POST. `is_bundle` cannot be changed after creation.

### 5.5 DELETE /inventory/catalog/{id}

### 5.6 PUT /inventory/catalog/{id}/activate

### 5.7 PUT /inventory/catalog/{id}/deactivate

### 5.8 PUT /inventory/catalog/{id}/types

**Request:**
```json
{
  "types": ["outlet_type_id_1", "outlet_type_id_2"]
}
```
Assigns which outlet types this catalog is available to.

---

## 6. Outlet

**Base:** `/outlet`

### 6.1 GET /outlet

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search name/phone |
| `outlet_type_id` | string | Filter by type |
| `is_active` | bool | Filter by active status |

**Response 200 (paginated):**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "outlet_type_id": "uuid",
    "name": "string",
    "recipient_name": "string",
    "phone": "string",
    "address": "string",
    "region_id": "uuid",
    "service_charges": 0,
    "is_active": true,
    "saldo": 0,
    "created_at": "datetime",
    "updated_at": "datetime",
    "owner_name": "string",
    "owner_username": "string",
    "pos_channels": [{ "id": "uuid", "pos_channel": { "id": "uuid", "name": "string" } }],
    "region": { ...region_detail },
    "outlet_type": { "id": "uuid", "name": "string" }
  }],
  "meta": { ... }
}
```

### 6.2 POST /outlet

**Request:**
```json
{
  "outlet_type_id": "uuid",
  "name": "string",
  "recipient_name": "string",
  "phone": "string",
  "address": "string",
  "region_id": "uuid",
  "service_charges": 0,
  "channels": ["pos_channel_id_1", "pos_channel_id_2"],
  "owner_username": "string",
  "owner_name": "string",
  "owner_password": "string"
}
```

Note: Creating an outlet also creates an owner user account.

### 6.3 GET /outlet/{id}

### 6.4 PUT /outlet/{id}

**Request:** Same as POST without owner fields (owner_name, owner_username, owner_password).

```json
{
  "outlet_type_id": "uuid",
  "name": "string",
  "recipient_name": "string",
  "phone": "string",
  "address": "string",
  "region_id": "uuid",
  "service_charges": 0,
  "channels": ["pos_channel_id_1"]
}
```

### 6.5 DELETE /outlet/{id}

### 6.6 PUT /outlet/{id}/activate

### 6.7 PUT /outlet/{id}/deactivate

### 6.8 PUT /outlet/{id}/channels

**Request:**
```json
{
  "channels": ["pos_channel_id_1", "pos_channel_id_2"]
}
```

---

## 7. Outlet Type

**Base:** `/outlet/type`

### 7.1 GET /outlet/type

**Query Params:** `page`, `limit`, `search`, `is_active`

**Response 200 (paginated):**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "name": "string",
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 7.2 POST /outlet/type
```json
{ "name": "string" }
```

### 7.3 GET /outlet/type/{id}
### 7.4 PUT /outlet/type/{id}
```json
{ "name": "string" }
```
### 7.5 DELETE /outlet/type/{id}
### 7.6 PUT /outlet/type/{id}/activate
### 7.7 PUT /outlet/type/{id}/deactivate

---

## 8. POS Menu

**Base:** `/pos/menu`

### 8.1 GET /pos/menu

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search name |
| `category_id` | string | Filter by category |
| `is_active` | bool | Filter by active status |

**Response 200 (paginated):**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "category_id": "uuid",
    "name": "string",
    "base_price": 0,
    "image": "string",
    "is_vatable": false,
    "is_additional": false,
    "is_active": true,
    "is_custom": false,
    "created_by": "uuid",
    "updated_by": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime",
    "category": { "id": "uuid", "name": "string", ... },
    "channel_prices": [{
      "id": "uuid", "menu_id": "uuid", "pos_channel_id": "uuid", "price": 0,
      "pos_channel": { "id": "uuid", "name": "string", ... }
    }],
    "ingredients": [{
      "id": "uuid", "menu_id": "uuid", "catalog_id": "uuid", "porsi": 0,
      "catalog": { ...full_catalog_object }
    }],
    "addon_groups": [{
      "id": "uuid", "menu_id": "uuid", "name": "string",
      "type": "options|checkbox|quantity",
      "items": [{
        "id": "uuid", "addon_group_id": "uuid", "addon_menu_id": "uuid",
        "addon_menu": { ...full_menu_object }
      }]
    }],
    "outlet_types": [{
      "id": "uuid", "menu_id": "uuid", "outlet_type_id": "uuid",
      "outlet_type": { "id": "uuid", "name": "string", ... }
    }]
  }],
  "meta": { ... }
}
```

### 8.2 GET /pos/menu/price

Returns menu items with their channel-specific pricing.

### 8.3 POST /pos/menu

**Request:**
```json
{
  "category_id": "uuid",
  "name": "string",
  "base_price": 0,
  "image": "string (optional)",
  "is_vatable": false,
  "is_additional": false,
  "channel_prices": [{
    "pos_channel_id": "uuid",
    "price": 0
  }],
  "ingredients": [{
    "catalog_id": "uuid",
    "porsi": 0
  }],
  "addon_groups": [{
    "name": "string",
    "type": "options|checkbox|quantity",
    "items": [{ "addon_menu_id": "uuid" }]
  }]
}
```

### 8.4 GET /pos/menu/{id}
### 8.5 PUT /pos/menu/{id}
Same structure as POST.

### 8.6 DELETE /pos/menu/{id}
### 8.7 PUT /pos/menu/{id}/activate
### 8.8 PUT /pos/menu/{id}/deactivate
### 8.9 PUT /pos/menu/{id}/types

```json
{ "types": ["outlet_type_id_1", "outlet_type_id_2"] }
```

---

## 9. POS Category

**Base:** `/pos/category`

### 9.1 GET /pos/category

**Query Params:** `page`, `limit`, `search`, `is_active`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "name": "string",
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 9.2 POST /pos/category
```json
{ "name": "string" }
```

### 9.3 GET /pos/category/{id}
### 9.4 PUT /pos/category/{id}
```json
{ "name": "string" }
```
### 9.5 DELETE /pos/category/{id}
### 9.6 PUT /pos/category/{id}/activate
### 9.7 PUT /pos/category/{id}/deactivate

---

## 10. POS Channel

**Base:** `/pos/channel`

### 10.1 GET /pos/channel

**Query Params:** `page`, `limit`, `search`, `is_active`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "name": "string",
    "code": "string",
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 10.2 POST /pos/channel
```json
{ "name": "string", "code": "string" }
```

### 10.3 GET /pos/channel/{id}
### 10.4 PUT /pos/channel/{id}
### 10.5 DELETE /pos/channel/{id}
### 10.6 PUT /pos/channel/{id}/activate
### 10.7 PUT /pos/channel/{id}/deactivate

---

## 11. Payment Method

**Base:** `/payment/method`

### 11.1 GET /payment/method

**Query Params:** `page`, `limit`, `search`, `is_active`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "name": "string",
    "provider": "cash|manual|qris|midtrans|other",
    "type": "pos|franchise",
    "account_name": "string",
    "account_number": "string",
    "is_member_payment": false,
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 11.2 POST /payment/method

**Validation Rules:**
- `provider` must be one of: `cash`, `manual`, `qris`, `midtrans`, `other`
- `type` must be one of: `pos`, `franchise`

```json
{
  "name": "string",
  "provider": "cash|manual|qris|midtrans|other",
  "type": "pos|franchise",
  "account_name": "string",
  "account_number": "string",
  "is_member_payment": false
}
```

### 11.3 GET /payment/method/{id}
### 11.4 PUT /payment/method/{id}
### 11.5 DELETE /payment/method/{id}
### 11.6 PUT /payment/method/{id}/activate
### 11.7 PUT /payment/method/{id}/deactivate

---

## 12. Supplier

**Base:** `/supplier`

### 12.1 GET /supplier

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search name/phone |
| `is_active` | bool | Filter by active status |
| `type` | string | Filter: `distributor`, `factory`, `store` |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "name": "string",
    "type": "distributor|factory|store",
    "address": "string",
    "phone": "string",
    "sales_person": "string",
    "bank_name": "string",
    "bank_account": "string",
    "bank_number": "string",
    "top": 0,
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 12.2 POST /supplier

**Validation Rules:**
- `type` must be one of: `distributor`, `factory`, `store`

```json
{
  "name": "string",
  "type": "distributor|factory|store",
  "address": "string",
  "phone": "string",
  "sales_person": "string",
  "bank_name": "string",
  "bank_account": "string",
  "bank_number": "string",
  "top": 0
}
```

### 12.3 GET /supplier/{id}
### 12.4 PUT /supplier/{id}
### 12.5 DELETE /supplier/{id}
### 12.6 PUT /supplier/{id}/activate
### 12.7 PUT /supplier/{id}/deactivate

---

## 13. User

**Base:** `/user`

### 13.1 GET /user

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search name/username |
| `usergroup_id` | string | Filter by usergroup |
| `is_active` | bool | Filter by active status |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "usergroup_id": "uuid",
    "outlet_id": "uuid",
    "username": "string",
    "name": "string",
    "is_active": true,
    "last_activity_at": "datetime|null",
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 13.2 POST /user

```json
{
  "usergroup_id": "uuid",
  "username": "string",
  "password": "string",
  "confirm_password": "string",
  "name": "string"
}
```

### 13.3 GET /user/{id}
### 13.4 PUT /user/{id}

```json
{
  "usergroup_id": "uuid",
  "name": "string",
  "password": "string (optional)",
  "confirm_password": "string (optional)"
}
```

### 13.5 DELETE /user/{id}
### 13.6 PUT /user/{id}/activate
### 13.7 PUT /user/{id}/deactivate

---

## 14. User Group

**Base:** `/user/usergroup`

### 14.1 GET /user/usergroup

**Query Params:** `page`, `limit`, `search`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "name": "string",
    "permissions": {...},
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 14.2 POST /user/usergroup
```json
{
  "name": "string",
  "permissions": { ... }
}
```

### 14.3 GET /user/usergroup/{id}
### 14.4 PUT /user/usergroup/{id}
### 14.5 DELETE /user/usergroup/{id}

---

## 15. Member Topup Bonus

**Base:** `/member/topup-bonus`

### 15.1 GET /member/topup-bonus

**Query Params:** `page`, `limit`, `search`, `is_active`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "min_amount": 0,
    "bonus_percentage": 0,
    "is_active": true,
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 15.2 POST /member/topup-bonus
```json
{
  "min_amount": 0,
  "bonus_percentage": 0
}
```

### 15.3 GET /member/topup-bonus/{id}
### 15.4 PUT /member/topup-bonus/{id}
### 15.5 DELETE /member/topup-bonus/{id}
### 15.6 PUT /member/topup-bonus/{id}/activate
### 15.7 PUT /member/topup-bonus/{id}/deactivate

---

## 16. Sales Order

**Base:** `/sales/order`

### 16.1 GET /sales/order

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search |
| `document_status` | string | Filter: `pending`, `published`, `cancelled` |
| `payment_status` | string | Filter: `unpaid`, `paid` |
| `outlet_id` | string | Filter by outlet |
| `warehouse_id` | string | Filter by warehouse |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "ref_code": "string",
    "outlet_id": "uuid",
    "warehouse_id": "uuid",
    "warehouse_name": "string",
    "recipient_name": "string",
    "recipient_phone": "string",
    "recipient_address": "string",
    "recipient_region_id": "uuid",
    "order_type": "string",
    "document_status": "pending|published|cancelled",
    "fulfillment_status": "string",
    "payment_status": "unpaid|paid",
    "subtotal_base": 0,
    "subtotal_gross": 0,
    "subtotal_taxed": 0,
    "subtotal_tax": 0,
    "subtotal_nett": 0,
    "shipping_charges": 0,
    "total_charges": 0,
    "shipping_date": "datetime",
    "self_pickup": false,
    "note": "string",
    "void_note": "string|null",
    "fulfilled_at": "datetime|null",
    "paid_at": "datetime|null",
    "payment_expired_at": "datetime|null",
    "created_by": "uuid",
    "updated_by": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime",
    "outlet": { ...outlet_detail },
    "region": { ...region_detail },
    "items": [{
      "id": "uuid",
      "order_id": "uuid",
      "catalog_id": "uuid",
      "item_id": "uuid",
      "fraction_id": "uuid",
      "quantity_ordered": 0,
      "quantity_fulfilled": 0,
      "unit_base": 0,
      "unit_gross": 0,
      "unit_taxed": 0,
      "unit_tax": 0,
      "unit_nett": 0,
      "catalog": { ... },
      "item": { ... },
      "fraction": { ... },
      "bundles": [...]
    }]
  }],
  "meta": { ... }
}
```

### 16.2 POST /sales/order

**Request:**
```json
{
  "warehouse_id": "uuid",
  "ref_code": "string",
  "outlet_id": "uuid",
  "recipient_name": "string",
  "recipient_phone": "string",
  "recipient_address": "string",
  "region_id": "uuid",
  "note": "string",
  "shipping_date": "datetime",
  "self_pickup": false,
  "shipping_charges": 0,
  "items": [{
    "catalog_id": "uuid",
    "quantity_ordered": 0
  }]
}
```

### 16.3 GET /sales/order/{id}
### 16.4 PUT /sales/order/{id}

**Request:** Same as POST.

### 16.5 DELETE /sales/order/{id}

### 16.6 PUT /sales/order/{id}/publish

### 16.7 PUT /sales/order/{id}/paid

### 16.8 PUT /sales/order/{id}/cancel

**Request:**
```json
{
  "note": "reason for cancellation"
}
```

---

### State Machine: Sales Order

```
                  ┌──────────────────────────────────────┐
                  │                                      │
                  ▼                                      │
  [pending] ──publish──▶ [published] ──(auto)──▶ [completed]
      │                                                  ▲
      │                                                  │
      └──── cancel ────▶ [cancelled]                     │
            (only if                        (all items    │
           payment_status                    fulfilled?)  │
             = unpaid)                                    │
                                                          │
  Payment: [unpaid] ──paid──▶ [paid]                      │
                                                          │
  Fulfillment: [pending] ──(process)──▶ [completed] ──────┘
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `POST` | Always | — | Creates `document_status=pending`, `payment_status=unpaid` |
| `PUT {id}` | `document_status=pending` | Must be pending | Update draft |
| `PUT {id}/publish` | `document_status=pending` | Must be pending | `document_status=published` |
| `PUT {id}/paid` | `payment_status=unpaid` | Must be unpaid | `payment_status=paid` |
| `PUT {id}/cancel` | `payment_status=unpaid` | Must be unpaid | `document_status=cancelled` |
| `DELETE {id}` | `document_status=pending` | Soft-delete | Remove |

---

## 17. Sales Return

**Base:** `/sales/return`

### 17.1 GET /sales/return

**Query Params:** `page`, `limit`, `search`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "sales_order_id": "uuid",
    "number": "string",
    "date": "datetime",
    "status": "pending|approved",
    "items": [{
      "id": "uuid",
      "sales_order_item_id": "uuid",
      "quantity": 0,
      "reason": "string",
      "unit_price": 0
    }],
    "created_at": "datetime",
    "updated_at": "datetime"
  }],
  "meta": { ... }
}
```

### 17.2 GET /sales/return/{id}

### 17.3 PUT /sales/return/{id}/approve

---

### State Machine: Sales Return

```
[pending] ──approve──▶ [approved]
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `PUT {id}/approve` | `status=pending` | Must be pending | `status=approved` |

Note: No POST, DELETE, or PUT update endpoints exist in source.

---

## 18. Purchase Order

**Base:** `/purchase/order`

### 18.1 GET /purchase/order

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search |
| `document_status` | string | Filter: `pending`, `published` |
| `outlet_id` | string | Filter by outlet |
| `supplier_id` | string | Filter by supplier |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "ref_code": "string|null",
    "supplier_id": "uuid",
    "warehouse_id": "uuid",
    "warehouse_name": "string",
    "document_status": "pending|published",
    "receiving_status": "string",
    "payment_status": "unpaid|paid",
    "subtotal_tax": 0,
    "subtotal_nett": 0,
    "shipping_charges": 0,
    "total_charges": 0,
    "eta_date": "datetime|null",
    "note": "string|null",
    "receiving_at": "datetime|null",
    "paid_at": "datetime|null",
    "created_by": "uuid",
    "updated_by": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime",
    "supplier": { ...supplier_detail },
    "items": [{
      "id": "uuid",
      "order_id": "uuid",
      "catalog_id": "uuid",
      "item_id": "uuid",
      "fraction_id": "uuid",
      "quantity_ordered": 0,
      "quantity_received": 0,
      "unit_nett": 0,
      "unit_tax": 0,
      "item": { ...inventory_item },
      "fraction": { ...fraction_detail }
    }]
  }],
  "meta": { ... }
}
```

### 18.2 POST /purchase/order

**Request:**
```json
{
  "supplier_id": "uuid",
  "warehouse_id": "uuid",
  "note": "string",
  "eta_date": "datetime (optional)",
  "items": [{
    "catalog_id": "uuid",
    "quantity_ordered": 0
  }]
}
```

### 18.3 GET /purchase/order/{id}
### 18.4 PUT /purchase/order/{id}
### 18.5 DELETE /purchase/order/{id}
### 18.6 PUT /purchase/order/{id}/publish
### 18.7 PUT /purchase/order/{id}/paid

---

### State Machine: Purchase Order

```
[pending] ──publish──▶ [published] ──(auto)──▶ [completed]

Payment: [unpaid] ──paid──▶ [paid]
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `POST` | Always | — | `document_status=pending`, `payment_status=unpaid` |
| `PUT {id}` | `document_status=pending` | Must be pending | Update |
| `PUT {id}/publish` | `document_status=pending` | Must be pending | `document_status=published` |
| `PUT {id}/paid` | `payment_status=unpaid` | Must be unpaid | `payment_status=paid` |
| `DELETE {id}` | `document_status=pending` | Soft-delete | Remove |

---

## 19. B2B Order

**Base:** `/b2b/order`

### 19.1 GET /b2b/order

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search |
| `document_status` | string | Filter: `pending`, `shipped`, `received`, `invoiced` |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "customer_name": "string",
    "customer_phone": "string",
    "customer_address": "string",
    "note": "string",
    "document_status": "pending|shipped|received|invoiced",
    "payment_status": "unpaid|paid",
    "subtotal": 0,
    "discount_percentage": 0,
    "discount_value": 0,
    "service_charge": 0,
    "total_charges": 0,
    "shipping_date": "datetime",
    "created_at": "datetime",
    "updated_at": "datetime",
    "items": [{
      "id": "uuid",
      "order_id": "uuid",
      "menu_id": "uuid",
      "menu_name": "string",
      "quantity": 0,
      "unit_base": 0,
      "unit_gross": 0,
      "unit_tax": 0,
      "unit_taxed": 0,
      "unit_nett": 0
    }]
  }],
  "meta": { ... }
}
```

### 19.2 POST /b2b/order

**Request:**
```json
{
  "customer_name": "string",
  "customer_phone": "string",
  "customer_address": "string",
  "note": "string",
  "discount_percentage": 0,
  "discount_value": 0,
  "service_charge": 0,
  "shipping_date": "datetime",
  "items": [{
    "menu_id": "uuid",
    "menu_name": "string",
    "quantity": 0
  }]
}
```

### 19.3 GET /b2b/order/{id}
### 19.4 PUT /b2b/order/{id}
### 19.5 DELETE /b2b/order/{id}
### 19.6 PUT /b2b/order/{id}/ship
### 19.7 PUT /b2b/order/{id}/receive
### 19.8 PUT /b2b/order/{id}/invoice
### 19.9 PUT /b2b/order/{id}/pay

---

### State Machine: B2B Order

```
                     ┌─────────────────────────┐
                     │                         │
                     ▼                         │
[pending] ──ship──▶ [shipped] ──receive──▶ [received]
     │                                           │
     │                                           ▼
     └──── cancel ────────┘               [invoiced]
                                               │
                                               ▼
    Payment: [unpaid] ────pay──────▶ [paid]
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `POST` | Always | — | Creates |
| `PUT {id}/ship` | `document_status=pending` | Must be pending | `shipped` |
| `PUT {id}/receive` | `document_status=shipped` | Must be shipped | `received` |
| `PUT {id}/invoice` | `document_status=received` | Must be received | `invoiced` |
| `PUT {id}/pay` | `payment_status=unpaid` | Must be unpaid | `paid` |
| `DELETE {id}` | `document_status=pending` | — | Remove |

---

## 20. Production Plan

**Base:** `/production/plan`

### 20.1 GET /production/plan

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search |
| `document_status` | string | Filter |
| `outlet_id` | string | Filter by outlet |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "code": "string",
    "warehouse_id": "uuid",
    "warehouse_name": "string",
    "production_date": "datetime",
    "note": "string|null",
    "document_status": "pending|process|completed|cancelled",
    "is_ordered": false,
    "created_by": "uuid",
    "updated_by": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime",
    "items": [{
      "id": "uuid",
      "plan_id": "uuid",
      "item_id": "uuid",
      "dest_warehouse_id": "uuid",
      "dest_warehouse_name": "string",
      "document_status": "new|completed",
      "quantity_planned": 0,
      "quantity_produced": 0,
      "item": { ... },
      "materials": [{
        "id": "uuid",
        "plan_id": "uuid",
        "material_id": "uuid",
        "quantity_need": 0,
        "quantity_used": 0,
        "measurement": "string",
        "material": { ... }
      }]
    }]
  }],
  "meta": { ... }
}
```

### 20.2 POST /production/plan

**Request:**
```json
{
  "warehouse_id": "uuid",
  "production_date": "datetime",
  "note": "string (optional)",
  "items": [{
    "item_id": "uuid",
    "quantity": 0
  }]
}
```

### 20.3 GET /production/plan/{id}
### 20.4 DELETE /production/plan/{id}
### 20.5 PUT /production/plan/{id}/publish

**Request:**
```json
{
  "warehouse_id": "uuid"
}
```

### 20.6 PUT /production/plan/{id}/complete

---

### State Machine: Production Plan

```
Plan: [pending] ──publish──▶ [published] ──complete──▶ [completed]
                                                 ▲
                                                 │
Item: [new] ──complete──▶ [completed] ───────────┘
                    (all items must be completed)
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `POST` | Always | — | `plan.document_status=pending`, items `document_status=new` |
| `PUT {id}/publish` | `plan.document_status=pending` | Must be pending | `published` |
| `PUT {id}/complete` | All items completed | All items `completed` | `plan.completed` |

---

## 21. Production Item

**Base:** `/production/item`

### 21.1 PUT /production/item/{id}

**Request:**
```json
{
  "quantity": 0
}
```

### 21.2 PUT /production/item/{id}/complete

**Request:**
```json
{
  "warehouse_id": "uuid",
  "quantity_produced": 0
}
```

---

### State Machine: Production Item

```
[new] ──complete──▶ [completed]
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `PUT {id}` | — | — | Update quantity |
| `PUT {id}/complete` | `item.document_status=new` | Must be new | `completed` |

---

## 22. Upload

### 22.1 POST /upload

**Request:**
```json
{
  "content_type": "string (required)",
  "filename": "string"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "url": "string",
    "filename": "string"
  }
}
```

---

## 23. Warehouse

### 23.1 GET /warehouse

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "franchisor_id": "uuid",
    "brand_id": "uuid",
    "type": "string",
    "name": "string",
    "address": "string",
    "region_id": "uuid",
    "is_default": false,
    "is_active": true,
    "has_area": false,
    "created_by": "uuid",
    "created_at": "datetime"
  }]
}
```

---

## 24. Withdrawal Request

**Base:** `/withdrawal-request`

### 24.1 GET /withdrawal-request

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search |
| `document_status` | string | Filter: `pending`, `approved`, `rejected` |
| `outlet_id` | string | Filter by outlet |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "outlet_id": "uuid",
    "amount": 0,
    "status": "pending|approved|rejected",
    "description": "string|null",
    "rejected_reason": "string|null",
    "created_at": "datetime",
    "updated_at": "datetime",
    "outlet": { "id": "uuid", "name": "string" }
  }],
  "meta": { ... }
}
```

### 24.2 GET /withdrawal-request/{id}

### 24.3 PUT /withdrawal-request/{id}/approve

No request body. Just path param.

### 24.4 PUT /withdrawal-request/{id}/reject

**Request:**
```json
{
  "rejected_reason": "reason for rejection"
}
```

---

### State Machine: Withdrawal Request

```
[pending] ──approve──▶ [approved]
     │
     └── reject ────▶ [rejected]
```

| Action | Condition | Guard | Result |
|--------|-----------|-------|--------|
| `PUT {id}/approve` | `status=pending` | Must be pending | `approved` |
| `PUT {id}/reject` | `status=pending` | Must be pending | `rejected` |

---

## 25. Outlet Topup Request

**Base:** `/outlet-topup-request`

### 25.1 GET /outlet-topup-request

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `limit` | int | Items per page |
| `search` | string | Search |
| `document_status` | string | Filter |
| `outlet_id` | string | Filter by outlet |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "outlet_id": "uuid",
    "amount": 0,
    "status": "pending|approved|rejected",
    "rejected_reason": "string|null",
    "created_at": "datetime",
    "updated_at": "datetime",
    "outlet": { "id": "uuid", "name": "string" }
  }],
  "meta": { ... }
}
```

### 25.2 GET /outlet-topup-request/{id}
### 25.3 PUT /outlet-topup-request/{id}/approve
### 25.4 PUT /outlet-topup-request/{id}/reject

```json
{
  "rejected_reason": "reason for rejection"
}
```

---

### State Machine: Outlet Topup Request

```
[pending] ──approve──▶ [approved]
     │
     └── reject ────▶ [rejected]
```

---

## 26. Reports

### 26.1 GET /report/outstanding

**Query Params:**
| Param | Type |
|-------|------|
| `outlet_id` | string |
| `start_date` | string |
| `end_date` | string |
| `page` | int |
| `limit` | int |
| `order_by` | string |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": 0,
    "code": "string",
    "ordered_at": "datetime",
    "cashier": { "name": "string" },
    "ticket": "string",
    "membership": { "name": "string" } | null,
    "total_charges": 0
  }],
  "meta": { ... }
}
```

### 26.2 GET /report/outstanding/summary
```json
{
  "success": true,
  "data": {
    "total_charges": 0
  }
}
```

### 26.3 GET /report/pos-settlement

**Query Params:**
| Param | Type |
|-------|------|
| `periode` | string |
| `periode_type` | string |
| `outlet_id` | string |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "periode": "string",
    "started_at": "datetime|null",
    "finished_at": "datetime|null",
    "payment_methods": ["string"],
    "nominals": [0]
  }],
  "meta": { ... }
}
```

### 26.4 GET /report/pos-settlement/summary
```json
{
  "success": true,
  "data": [{
    "payment_method": "string",
    "nominal": 0
  }]
}
```

### 26.5 GET /report/product-sales

**Query Params:** `outlet_id`, `start_date`, `end_date`, `page`, `limit`, `order_by`

### 26.6 GET /report/product-sales/summary
### 26.7 GET /report/raw-material-sales

**Query Params from usecase:** Various query options.

### 26.8 GET /report/raw-material-sales/summary

### 26.9 GET /report/warehouse-stock

**Query Params:**
| Param | Type |
|-------|------|
| `warehouse_id` | string |
| `item_id` | string |
| `page` | int |
| `limit` | int |
| `order_by` | string |

### 26.10 GET /report/b2b/settlement

### 26.11 GET /report/b2b/settlement/summary

### 26.12 GET /report/b2b/product-sales

### 26.13 GET /report/b2b/product-sales/summary

---

## 27. Demand

### 27.1 GET /demand/production

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `production_date` | string | Filter by date |
| `outlet_id` | string | Filter by outlet |

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "catalog_id": "uuid",
    "name": "string",
    "total_demand": 0,
    "uom": "string"
  }]
}
```

### 27.2 GET /demand/item

**Query Params:** `production_date`, `outlet_id`

**Response 200:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "code": "string",
    "barcode": "string",
    "name": "string",
    "variant": "string",
    "packaging": "string",
    "size": "string",
    "default_fraction": "string",
    "stock_available": 0,
    "quantity_need": 0,
    "diff": 0,
    "alias_name": "string"
  }]
}
```

---

## 28. Region

Routes come from external lib `github.com/enigma-id/region-id`. Paths not defined in this repo.

**FE uses:** `/regions/search`

**Common response shape:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "parent_id": "uuid|null",
    "name": "string",
    "code": "string",
    "type": "string",
    "level": 0,
    "administrative_area": {
      "country": "string",
      "province": "string",
      "regency": "string",
      "district": "string|null",
      "village": "string|null"
    },
    "latitude": 0,
    "longitude": 0
  }]
}
```

---

## Appendix: Activate/Deactivate Modules

All modules below support `PUT /<base>/{id}/activate` and `PUT /<base>/{id}/deactivate`:

| Module | Base Path | Activate Guard | Deactivate Guard |
|--------|-----------|----------------|------------------|
| Inventory Item | `/inventory/item` | `is_active=false` | `is_active=true` |
| Inventory Catalog | `/inventory/catalog` | `is_active=false` | `is_active=true` |
| Outlet | `/outlet` | `is_active=false` | `is_active=true` |
| Outlet Type | `/outlet/type` | `is_active=false` | `is_active=true` |
| POS Menu | `/pos/menu` | `is_active=false` | `is_active=true` |
| POS Category | `/pos/category` | `is_active=false` | `is_active=true` |
| POS Channel | `/pos/channel` | `is_active=false` | `is_active=true` |
| Payment Method | `/payment/method` | `is_active=false` | `is_active=true` |
| Supplier | `/supplier` | `is_active=false` | `is_active=true` |
| User | `/user` | `is_active=false` | `is_active=true` |
| Member Topup Bonus | `/member/topup-bonus` | `is_active=false` | `is_active=true` |

---

## Appendix: Approve/Reject Modules

| Module | Base Path | Approve Action | Reject Action |
|--------|-----------|----------------|---------------|
| Withdrawal Request | `/withdrawal-request` | `PUT {id}/approve` | `PUT {id}/reject` |
| Outlet Topup Request | `/outlet-topup-request` | `PUT {id}/approve` | `PUT {id}/reject` |
| Sales Return | `/sales/return` | `PUT {id}/approve` | — |

---

## Appendix: Cross-Module Reference

| Document Status | Used By | Transitions |
|----------------|---------|-------------|
| `pending` | Sales Order, Purchase Order, B2B Order, Production Plan, Withdrawal, Outlet Topup, Sales Return | Initial state on create |
| `published` | Sales Order, Purchase Order, Production Plan | From `pending` via publish |
| `completed` | Sales Order, Purchase Order, Production Plan | Auto or explicit complete |
| `cancelled` | Sales Order, Production Plan | From `pending`/`unpaid` via cancel |
| `approved` | Withdrawal Request, Outlet Topup, Sales Return | From `pending` via approve |
| `rejected` | Withdrawal Request, Outlet Topup | From `pending` via reject |
| `shipped` | B2B Order | From `pending` via ship |
| `received` | B2B Order | From `shipped` via receive |
| `invoiced` | B2B Order | From `received` via invoice |

| Payment Status | Used By | Transitions |
|----------------|---------|-------------|
| `unpaid` | Sales Order, Purchase Order, B2B Order | Initial |
| `paid` | Sales Order, Purchase Order, B2B Order | From `unpaid` via paid action |

---

*API Contract — Generated from Go source code at `D:\Enigma\franq\backend\franchisor`*
