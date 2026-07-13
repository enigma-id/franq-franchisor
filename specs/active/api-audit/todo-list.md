# Todo List: API Contract Remediation

**Task ID:** api-audit
**Created:** 2026-07-09
**Updated:** 2026-07-09

## Progress Log

| Phase | Task | Status | Date | Notes |
|-------|------|--------|------|-------|
| 1 | 1.1 PaginationMeta page_size | ✅ Done | 2026-07-09 | Added `page_size` optional field |
| 1 | 1.2 OutletCreateRequest channels | ✅ Done | 2026-07-09 | Changed to `string[]`, removed `OutletChannel` |
| 1 | 1.3 OutletChannelsUpdateRequest | ✅ Done | 2026-07-09 | Changed to `string[]` |
| 1 | 1.4 Upload contentType | ✅ Done | 2026-07-09 | Renamed to `content_type` |
| 1 | 1.5 TopupBonusBase | ✅ Done | 2026-07-09 | `amount`→`min_amount`, `bonus`→`bonus_percentage`, removed `name` |
| 1 | 1.6 SalesOrderItem request | ✅ Done | 2026-07-09 | Created `SalesOrderItemRequest` with `quantity_ordered` |
| 1 | 1.7 SalesOrderBase region/shipping | ✅ Done | 2026-07-09 | REVERTED `region_id` → `recipient_region_id` in base; `SalesOrderRequest` standalone with `region_id` |
| 1 | 1.8 ProductionPlanRequest quantity | ✅ Done | 2026-07-09 | `quantity_planned`→`quantity` |
| 4 | 4.1 SupplierType | ✅ Done | 2026-07-09 | Removed `wholesaler`/`retailer`, added `store` |
| 3 | 3.8 ProductionItemUpdateRequest | ✅ Done | 2026-07-09 | `quantity_planned`→`quantity`, removed `note` |
| 2 | 2.1 Remove rejectSalesReturn | ✅ Done | 2026-07-09 | Removed from API + hooks |
| 2 | 2.2 Remove reject button SR page | ✅ Done | 2026-07-09 | Removed handler + button from detail page |
| 2 | 2.3 Remove updatePlan | ✅ Done | 2026-07-09 | Removed from production API + hooks |
| 2 | 2.4 Remove cancelPlan | ✅ Done | 2026-07-09 | Removed from production API + hooks |
| 2 | 2.5 Remove cancel button PP page | ⬜ Skipped | — | No cancel button exists; guards only expose canPublish/canDelete/canComplete |
| 3 | 3.1 Franchisor types + API + hook | ✅ Done | 2026-07-09 | Created types, api.tsx, hooks.tsx with lazy show + update |
| 3 | 3.2 User types | ✅ Done | 2026-07-09 | Created UserBase/CreateRequest/UpdateRequest/Detail interfaces |
| 3 | 3.3 User API + hook | ✅ Done | 2026-07-09 | Full CRUD + activate/deactivate |
| 3 | 3.4 User Group API + hook | ✅ Done | 2026-07-09 | CRUD for /user/usergroup |
| 3 | 3.5 B2B Order types + API + hook | ✅ Done | 2026-07-09 | Types + CRUD + ship/receive/invoice/pay |
| 3 | 3.6 Outlet Topup types + API + hook | ✅ Done | 2026-07-09 | Types + list/show/approve/reject |
| 3 | 3.7 Production Item endpoints | ✅ Done | 2026-07-09 | Added update + complete endpoints |
| 3 | 3.9 POS Menu Price endpoint | ✅ Done | 2026-07-09 | Added getMenuPrices endpoint + getPrices hook |
| 4 | 4.2 Status union types | ✅ Done | 2026-07-09 | Added PaymentStatus, DocumentStatus*, FulfillmentStatus, ApprovalStatus, SalesReturnStatus |
| 4 | 4.3 POSMenuCreateRequest split | ✅ Done | 2026-07-09 | Created request-specific interfaces for channels/ingredients/addons |
| 5 | 5.1 Routes for new modules | ✅ Done | 2026-07-09 | Added 10 new routes for b2b, outlet-topup, user, usergroup, franchisor |
| 5 | 5.2 B2B Order pages | ✅ Done | 2026-07-09 | List (with table config), create, detail, update pages |
| 5 | 5.3 Outlet Topup pages | ✅ Done | 2026-07-09 | List (with table config), detail (approve/reject) pages |
| 5 | 5.4 User management pages | ✅ Done | 2026-07-09 | List (with table config), create, update, usergroup list + table config |
| 5 | 5.5 Franchisor profile page | ✅ Done | 2026-07-09 | Profile display page using lazy show |

## Progress: 30/30 tasks done (100%)
