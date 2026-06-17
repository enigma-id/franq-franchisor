# Technical Plan: V1 Standard Alignment for Franchisor-V2

**Task ID:** v1-pages-analysis
**Status:** Ready for Implementation
**Based on:** spec.md

## 1. System Architecture

### Overview

The goal for franchisor-v2 is to establish a consistent development standard derived from the `v1-pages-analysis/research.md` blueprint. This means any new or existing pages in franchisor-v2 will adopt the V1 patterns for layout, API consumption, state management, and UI component usage. The existing V1 modules are *not* being migrated directly. Instead, their documented structure and logic serve as the enforced standard for building or updating equivalent functionality in V2.

### Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Module Structure Standard** | Domain-based folders (`src/pages/purchase`, `src/pages/sales`, etc.) | Enforces separation of concerns and aligns with the V1 standard for modularity. |
| **API Layer Standard** | RTK Query Hooks (e.g., `usePurchaseOrder`, `useSupplier`) | Adopt the V1 pattern for consistent data fetching, caching, and state management. |
| **UI Components Standard** | Enigma UI Kit (Tables, Forms, Modals, RemoteSelect) | Enforces the V1 standard for consistent look-and-feel and development efficiency. |
| **Table Implementation Standard** | `useTable` hook + Config-driven | Adopt the V1 pattern for highly reusable and configurable tables. |
| **Form Management Standard** | Controlled components with `onSubmit` delegation | Adopt the V1 pattern for centralized form state and validation. |
| **API Contract Adherence** | Strict adherence to V1 API payloads | Ensures compatibility with existing backend and preserves core business logic without modifying backend contracts. |
| **Error Handling Standard** | Global Toast Notifications + Form-specific errors | Adopts the V1 pattern for consistent user feedback.
|

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Frontend Framework** | React.js | Latest (v18+) | Industry standard, robust ecosystem. |
| **TypeScript** | Latest | Type safety, improved developer experience, better maintainability. |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS for rapid and consistent styling. |
| **State Management** | Redux Toolkit (RTK) Query | Latest | Declarative data fetching, caching, and state management. |
| **Routing** | React Router | v6 | Modern, hook-based routing for SPA. |
| **UI Kit** | Enigma UI Kit | Custom | Reusable components for tables, forms, inputs, etc. |
| **Date Handling** | Day.js | Latest | Lightweight date parsing and formatting. |
| **Currency Formatting** | Custom Utility (`currencyFormat`) | - | Consistent currency display. |

### Dependencies (Conceptual - specific package.json not shown)
```json
{
  "dependencies": {
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-router-dom": "^6.x.x",
    "@reduxjs/toolkit": "^1.x.x",
    "react-redux": "^8.x.x",
    "dayjs": "^1.x.x",
    "tailwindcss": "^3.x.x",
    "@headlessui/react": "^1.x.x",
    "lucide-react": "^0.x.x",
    "zod": "^3.x.x" // For form validation, if adopted
  }
}
```

## 3. Component Design

### Layout Components (V1 Standard)
- **`Page`**: Top-level wrapper for all pages, providing consistent layout (header, body).
- **`Page.Header`**: Contains page title, breadcrumbs, and primary actions (e.g., "+ Create Button").
- **`Page.Body`**: Main content area.

### Data Display Components (V1 Standard)
- **`Table.Render`**: Generic table component, renders data based on `tableConfig`.
- **`Table.Tools`**: Toolbar for search, filters, and bulk actions (e.g., Download).
- **`Table.Pagination`**: Standard pagination controls.
- **`SummaryCards`**: Displays aggregated KPIs (e.g., Dashboard).
- **Status Badges**: Inline components for displaying document/payment/delivery statuses.

### Form Components (V1 Standard)
- **`Input` / `Textarea`**: Standard text inputs.
- **`Select` / `RemoteSelect`**: Dropdowns for static or API-fetched options.
- **`DatePicker`**: Date selection (single or range).
- **`Button`**: Action buttons (Submit, Cancel, Add Row, Delete).

### Reusable Domain Forms (V1 Standard)
- **`PurchaseOrderForm`**: Encapsulates complex PO creation/update logic (supplier, items, fractions, totals).
- **`SupplierForm`**: Manages Supplier data (business info, bank details).
- **`InventoryCatalogForm` / `InventoryItemForm`**: For managing inventory configurations.
- **`OutletTypeForm` / `StoreOutletForm`**: For outlet-related settings.
- **`POSCatalogForm`**: For POS-specific catalog settings.
- **`UserForm`**: For user management.

### Modals (V1 Standard)
- **`Modal.Wrapper`**: Generic modal container.
- **`Modal.Header` / `Modal.Body` / `Modal.Footer`**: Structure for modal content.
- **Delete Confirmation Modals**: Standard pattern for critical delete actions.

## 4. Data Model (V1 Standard Adherence)

The data models for V2 pages will strictly adhere to the existing V1 API responses, using TypeScript interfaces to enforce structure.

### Key Entities (Examples - derived from V1 research):
- **`Supplier`**: `id`, `name`, `phone`, `address`, `supplier_type`, `is_pkp`, `bank_name`, `bank_account_name`, `sales_person_name`, `sales_person_phone`, `top` (Terms of Payment), `lead_time`.
- **`PurchaseOrder`**: `id`, `code`, `supplier_id`, `ordered_at`, `eta_date`, `note`, `subtotal`, `tax`, `nett`, `document_status`, `receiving_status`, `payment_status`, `items[]`.
  - `PurchaseOrderItem`: `item_id`, `fraction_id`, `qty`, `price`, `discount`.
- **`SalesOrder`**: `id`, `code`, `outlet_id`, `total`, `order_status`, `payment_status`, `delivery_status`, `created_at`, `items[]`.
- **`InventoryItem`**: `id`, `name`, `code`, `stock`, `unit`, `safety_stock`, `is_active`, `is_stockable`, `catalog_id`.
- **`Outlet`**: `id`, `name`, `address`, `outlet_type_id`, `is_active`.

## 5. API Contracts (V1 Standard Adherence)

New V2 pages will consume APIs that maintain the existing V1 endpoints, methods, and payload/query parameter structures. All API calls will be managed through RTK Query hooks.

### Key Endpoints (Examples - derived from V1 research):

| Method | Path | Description | Request Payload / Query Params | Response Data Shape |
|---|---|---|---|---|
| `GET` | `/dashboard` (various sub-endpoints) | Dashboard KPIs | `{ month: string }` | `{ sales: number, items: number, commission: number, graph: [] }` |
| `GET` | `/purchase/demand` | Demand list | `{ date: string, ...pagination }` | `DemandItem[]` |
| `GET` | `/purchase/order` | PO List | `{ order_status?: string, date_from?: string, date_to?: string, ...pagination }` | `PurchaseOrder[]` |
| `GET` | `/purchase/order/:id` | Single PO Detail | `{ id: string }` (param) | `PurchaseOrder` |
| `POST` | `/purchase/order` | Create PO | `PurchaseOrderFormData` | `{ id: string, code: string }` |
| `PATCH` | `/purchase/order/:id` | Update PO | `Partial<PurchaseOrderFormData>` | `{ id: string, code: string }` |
| `DELETE` | `/purchase/order/:id` | Delete PO | `{ id: string }` (param) | `{ success: boolean }` |
| `POST` | `/purchase/order/:id/approve` | Approve PO | `{ id: string }` (param) | `{ success: boolean }` |
| `POST` | `/purchase/order/:id/payment` | Mark PO Paid | `{ id: string }` (param) | `{ success: boolean }` |
| `GET` | `/supplier` | Supplier List | `{ search?: string, ...pagination }` | `Supplier[]` |
| `POST` | `/supplier` | Create Supplier | `SupplierFormData` | `{ id: string, name: string }` |
| `PATCH` | `/supplier/:id` | Update Supplier | `Partial<SupplierFormData>` | `{ id: string, name: string }` |
| `DELETE` | `/supplier/:id` | Delete Supplier | `{ id: string }` (param) | `{ success: boolean }` |
| `GET` | `/sales/order` | Sales Order List | `{ order_status?: string, payment_status?: string, delivery_status?: string, date_from?: string, date_to?: string, ...pagination }` | `SalesOrder[]` |
| `POST` | `/sales/order` | Create Sales Order | `SalesOrderFormData` | `{ id: string, code: string }` |
| `PATCH` | `/sales/order/:id/publish` | Publish Sales Order | `{ id: string }` (param) | `{ success: boolean }` |

## 6. Security Considerations (V1 Standard Adherence)

- **Authentication**: Leverage existing `AuthGuard` and `GuestGuard` components to protect routes.
- **Authorization**: Implement granular permission checks at the component level for actions (e.g., `canApprove`, `canDelete`). Backend API calls will enforce permissions.
- **Data Protection**: Ensure sensitive data (e.g., bank account numbers) are handled securely, consistent with V1 practices.
- **Input Validation**: Frontend form validation (e.g., using Zod) augmented by robust backend validation to prevent malicious input.

### Security Checklist
- [ ] All critical mutations (create, update, delete, approve, pay, publish) require explicit authorization checks.
- [ ] User input for all forms is validated on both client and server sides.
- [ ] Sensitive data is not exposed unnecessarily in API responses or UI.
- [ ] Proper error handling prevents information leakage on failed operations.

## 7. Performance Strategy (V1 Standard Adherence)

- **RTK Query Caching**: Utilize RTK Query's built-in caching and invalidation mechanisms to minimize redundant API calls and speed up data retrieval, mirroring V1 patterns.
- **Pagination & Filtering**: Server-side pagination and filtering for all data tables to reduce payload size.
- **Lazy Loading**: Implement lazy loading for less frequently accessed modules or heavy components.
- **Optimized Rerenders**: Use `React.memo` and `useCallback` where appropriate to prevent unnecessary component rerenders, especially for complex tables and forms.

## 8. Implementation Phases

Implementation for franchisor-v2 will focus on aligning its existing modules to the established V1 standard. Modules from `temp/v1-pages` that do not have a corresponding structure in `src/pages` (e.g., `Report`) will be excluded.

### Phase 1: Core Purchase Module
- [ ] Align `src/pages/purchase/supplier/*` pages and `SupplierForm` to the V1 standard.
- [ ] Align `src/pages/purchase/order/*` pages and `PurchaseOrderForm` to the V1 standard.
- [ ] Enforce associated table configs and filters (`src/pages/purchase/table/*`) using the V1 standard.

### Phase 2: Core Sales Module
- [ ] Align `src/pages/sales/order/*` pages to the V1 standard.
- [ ] Align `src/pages/sales/return/*` pages to the V1 standard.
- [ ] Enforce associated table configs and filters (`src/pages/sales/table/*`) using the V1 standard.

### Phase 3: Settings Module
- [ ] Align `src/pages/setting/inventory/*` (Catalog, Item, Forms, Modals, Tables) to the V1 standard.
- [ ] Align `src/pages/setting/outlet/*` (Outlet, OutletType, Forms, Tables) to the V1 standard.
- [ ] Align `src/pages/setting/pos/*` (Catalog, Category, Channel, Payment, Topup Schema, Forms, Tables) to the V1 standard.
- [ ] Align `src/pages/setting/user/*` (User Management, Profile, Forms, Tables) to the V1 standard.

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **Deviation from V1 Standard** | High: Inconsistent UI, broken API contracts, maintainability issues. | Medium: Developers introducing new patterns without adhering to the blueprint. | Clear documentation (`research.md` as blueprint), code reviews enforcing patterns, automated linting rules. |
| **Complex Form Logic Adherence** | High: Critical business logic errors, data corruption if V1 logic is not precisely replicated. | Medium: Intricate calculations and state dependencies in forms (e.g., PO fractions). | Unit tests for form logic, detailed code reviews, paired programming for critical forms. |
| **UI/UX Discrepancy** | Medium: New V2 pages visually different from V1 expectation. | Low: Using standardized UI Kit components and the V1 blueprint for layout. | Visual regression testing, consistent component usage, peer reviews. |
| **Performance Degradation** | Medium: Slow load times, unresponsive UI. | Low: RTK Query caching and server-side pagination are inherent in the V1 standard. | Performance profiling post-implementation, lighthouse audits. |

## 10. Open Questions
- [ ] Are there specific V1 UI components or patterns that should *not* be adopted into V2, even if they were present in `temp/v1-pages`?

## Next Steps
- Review plan with stakeholders
- Run `/tasks v1-pages-analysis` to generate implementation tasks
- Run `/implement v1-pages-analysis` to start building

*Technical Plan created with SDD 4.0 (V1 Standard Enforcement)*