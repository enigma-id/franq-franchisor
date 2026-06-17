# Research: New API Service Layer Migration

**Task ID:** new-api-service
**Date:** 2026-06-05
**Status:** Complete

---

## Executive Summary

The goal is to replace the entire API service layer of the project to align with a new Postman collection (`docs/Franchisor.postman_collection.json`). The current implementation uses RTK Query with a custom `createCrudHook` factory. While the existing architecture is sound, the API contracts (endpoints, payloads, and response shapes) have evolved.

The migration requires a full replacement rather than incremental edits to avoid regression and ensure a clean transition to the new API version. The strategy is to preserve the core infrastructure (`baseQuery.tsx`, `createCrudHook.ts`, and base types) while rebuilding all domain-specific services (auth, outlet, pos, inventory, etc.) from scratch based on the new collection.

---

## Codebase Analysis

### Existing Patterns

The current service layer follows a strict three-tier structure:
1. **API Definition (`api.tsx`)**: Uses `createApi` from RTK Query to define endpoints and tags.
2. **Hook Wrapper (`hooks.tsx`)**: Uses `createCrudHook` to wrap lazy queries and mutations into a standardized CRUD interface.
3. **Type Definitions (`types/*.ts`)**: Defines request and response interfaces.

**Example Pattern:**
- `src/services/user/api.tsx` $\rightarrow$ Defines `getUser`, `createUser`, etc.
- `src/services/user/hooks.tsx` $\rightarrow$ Exports `useUser` hook via `createCrudHook`.
- `src/services/types/user.ts` $\rightarrow$ Defines `UserDetail`, `UserCreateRequest`.

### Reusable Components

- **`src/services/baseQuery.tsx`**: Must be kept. It handles auth headers, interceptors, and file downloads.
- **`src/services/hooks/createCrudHook.ts`**: Must be kept. It provides the standardized hook interface used by the UI.
- **`src/services/types/api.ts`**: Must be kept. Provides `ApiResponse<T>` and `PaginatedResponse<T>`.

### Conventions to Follow

- All new services must follow the `api.tsx` $\rightarrow$ `hooks.tsx` $\rightarrow$ `types.ts` pattern.
- Use semantic tag naming for cache invalidation (e.g., `tagTypes: ["User"]`).
- Ensure all endpoints in the Postman collection are implemented, including custom actions (activate, deactivate, publish, etc.).

---

## New API Collection Analysis

Based on the Postman collection, the following domain changes were identified:

### 1. Auth & Profile
- New endpoint: `POST /auth/signup`.
- Profile management moved to `/profile/me`.

### 2. Outlet Management
- Payloads expanded: Now requires `recipient_name`, `region_id`, `service_charges`, `owner_name`, etc.
- New endpoint: `PUT /outlet/:id/channels` for POS channel mapping.

### 3. POS & Menu
- **Menu Structure**: Now includes `ingredients` (catalog mapping) and `addon_groups`.
- **Payload Changes**: `POSMenuCreateRequest` now requires `channel_prices`.
- **Topup Schema**: Path changed to `/member/topup-bonus`.
- **Payment Method**: Path changed to `/payment/method`.

### 4. Inventory & Catalog
- **Item Types**: Explicit split between `raw_material` and `finished_goods`.
- **BOM (Bill of Materials)**: `finished_goods` now require a `boms` array in the payload.
- **Fractions**: Items now have a `fractions` array for different packaging sizes.

### 5. Purchase & Sales
- **Common Payload**: Both use a similar shipment structure (`recipient_name`, `recipient_address`, etc.).
- **Sales Actions**: Added `publish`, `paid`, and `cancel` endpoints.
- **Purchase Actions**: Added `publish` (approve) and `payment` endpoints.

### 6. Production & Demand
- New endpoints for production planning: `POST /production/plan`.
- Demand forecasting endpoints: `GET /demand/production` and `GET /demand/item`.

---

## Comparison Matrix (Current vs New)

| Domain | Current Implementation | New Collection | Change Impact |
|----------|-----------------------|----------------|-----------------|
| Auth | Login/Profile | Signup + Login + Profile | Medium (New signup flow) |
| Outlet | Basic Details | Detailed Shipping + Owner info | Medium (UI updates needed) |
| POS | Basic Menu | Ingredients + Addons + Multi-Price | High (Complex payloads) |
| Inventory | Simple Item | BOM + Fractions + Item Types | High (Logic change) |
| Purchase | Simple Order | Order Workflow (Publish/Paid) | Medium (State tracking) |
| Sales | Simple Order | Order Workflow (Publish/Paid/Cancel) | Medium (State tracking) |
| Production| Missing/Partial | Full Planning + Demand | High (New feature) |

---

## Recommendations

### Primary Recommendation: "Clean Slate" Migration
Move all current `src/services/[domain]` directories to a `temp/` folder and implement the new services from scratch. This avoids "ghost" endpoints from the old API and ensures the types strictly match the new collection.

### Implementation Strategy
1. **Types First**: Define all `src/services/types/*.ts` based on the Postman payloads.
2. **API Definition**: Create `api.tsx` for each domain using the new endpoints.
3. **Hook Wrapping**: Use `createCrudHook` in `hooks.tsx` to maintain compatibility with existing UI pages.
4. **Integration**: Update `src/services/reducer.tsx` and `src/services/store.tsx` to register new APIs.

---

## Open Questions
- **API Responses**: The user will provide the exact response shapes later. Types should be designed as flexible interfaces that can be refined.
- **Page Impact**: Some pages might use endpoints that are no longer in the new collection; these will need to be identified and removed/updated during the implementation phase.

---

## Next Steps
1. Review this research document.
2. Run `/plan new-api-service` to define the technical architecture and file structure.
3. Generate task breakdown with `/tasks new-api-service`.
4. Execute implementation with `/implement new-api-service`.

---

*Research completed with SDD 4.0*
