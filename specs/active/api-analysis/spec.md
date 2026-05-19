# Specification: API Action and Condition Rebuild (Client-Side Guard Rules)

**Task ID:** api-analysis
**Created:** 2026-05-18
**Status:** Ready for Planning
**Version:** 1.0

---

## 1. Problem Statement
- **The Problem:** Rebuilding the Franchisor web client from Vue to React introduces risks of state inconsistency, illegal state transitions, and race conditions if client-side action guards are not strictly ported. Without precise UI constraints, a user could dispatch a publish, update, delete, or payment request on documents or orders that have already progressed past their valid lifecycle states. This causes unnecessary roundtrips, API failures, or frontend/backend desynchronization.
- **Current Situation:** The existing Vue portal governs these actions using computed properties or inline method checks (e.g., `doPublished()`, `doPayment()`). They block buttons, disable navigation links, or control data-table toggles dynamically.
- **Desired Outcome:** A robust, fully-typed React validation system (using TypeScript guards, custom hooks, and centralized state-guard logic) that mirrors every validation condition from the Vue portal. The user interface must proactively block invalid actions, while RTK Query ensures cache invalidation and UI reactivity.

---

## 2. User Personas
### Primary User: Outlet Manager
- **Who:** Responsible for purchasing inventory and handling incoming orders.
- **Goals:** Quickly create purchase orders, approve transactions, receive sales payments, and view accurate daily reports.
- **Pain points:** Slow or buggy interface; clicking a button twice by accident resulting in duplicate API submissions; seeing buttons active for documents that are already locked.

### Secondary User: Franchisor Admin
- **Who:** System administrator overseeing user management, system-wide catalog settings, and franchise data.
- **Goals:** Enable or disable master products, active items, user accounts, and review aggregate settlement reports.
- **Pain points:** Accidentally deactivating active system administrators, or lack of visual feedback when changing catalogs.

---

## 3. Functional Requirements

### 3.1 Purchase Order Lifecycle Guards (Module: Purchase)
Governs actions on `/purchase/order/detail.vue` and forms on `/purchase/order/create.vue` / `update.vue`.

| ID | Action | Target States / Conditions | UI Behavior | User Story |
|----|--------|----------------------------|-------------|------------|
| **FR-PO-01** | Publish Document | `document_status === 'pending'` | Enable "Approve / Publish" button. | As an Outlet Manager, I want to approve a pending PO so that the supplier knows it is official. |
| **FR-PO-02** | Update Document (Edit) | `document_status === 'pending'` | Enable "Edit" button & allow navigation to update form. Redirect to detail if directly accessed via URL when not pending. | As an Outlet Manager, I want to edit a pending PO to fix quantities before publishing. |
| **FR-PO-03** | Delete Document | `document_status === 'pending'` | Show "Delete" option in UI. Disallow if status is not pending. | As an Outlet Manager, I want to delete a pending PO to discard an accidental draft. |
| **FR-PO-04** | Make Payment | `document_status !== 'pending'` **AND** `payment_status === 'void'` | Enable "Make Payment" button. If payment is already made or document is still pending, disable/hide payment action. | As an Outlet Manager, I want to record a payment for an approved, unpaid PO to keep records up to date. |
| **FR-PO-05** | Form Line Validation | All PO item lines must have valid `item_id`, `fraction_id`, and `quantity > 0` | Disable form "Submit" button until all lines are valid. | As an Outlet Manager, I want the form to block submission until I fill all item fields correctly. |

**Acceptance Criteria for FR-PO-01 to FR-PO-05:**
- Given a Purchase Order with `document_status === 'pending'`, the Edit, Delete, and Publish options are visible and active. The Payment option must be hidden or disabled.
- Given a Purchase Order with `document_status === 'published'` (or any non-pending status) and `payment_status === 'void'`, the Edit, Delete, and Publish options are hidden/disabled, while the "Make Payment" button is active.
- Given a Purchase Order with `payment_status === 'paid'`, the "Make Payment" button is hidden/disabled.
- The React form at `/purchase/order/create` or `/purchase/order/:id/update` blocks submit triggers if any row in the item list has an empty item select or a quantity of `0` or less.

---

### 3.2 Sales Order Lifecycle Guards (Module: Sales)
Governs actions on `/sales/order/detail.vue` and forms on `/sales/create.vue` / `update.vue`.

| ID | Action | Target States / Conditions | UI Behavior | User Story |
|----|--------|----------------------------|-------------|------------|
| **FR-SO-01** | Publish Document | `salesOrder.order_status === 'pending'` **AND** `salesOrder.type === 'default'` | Enable "Publish" button for regular orders. | As an Outlet Manager, I want to publish a pending regular sales order to initiate fulfillment. |
| **FR-SO-02** | Update/Edit Document | `salesOrder.order_status === 'pending'` **AND** `salesOrder.type === 'default'` | Enable "Edit" navigation. Block/redirect if accessed directly for non-pending or non-default types. | As an Outlet Manager, I want to edit a pending regular sales order to adjust customer requests. |
| **FR-SO-03** | Delete Document | `salesOrder.order_status === 'pending'` **AND** `salesOrder.type === 'default'` | Show and enable the "Delete" action. | As an Outlet Manager, I want to delete an accidental regular sales order draft. |
| **FR-SO-04** | Make/Accept Payment | `salesOrder.payment_status === 'void'` **AND** EITHER:<br>1. `order_status === 'active'` AND `type === 'default'`<br>2. `(order_status === 'pending' OR order_status === 'void')` AND `type === 'outlet'` | Enable the "Receive Payment / Paid" button. | As an Outlet Manager, I want to receive payment for an active regular order or a pending/void outlet order to close the sale. |
| **FR-SO-05** | Form Line Validation | All SO item lines must have valid `catalog_id` and `quantity > 0` | Disable "Submit" button until all lines are valid. | As an Outlet Manager, I want the sales order form to validate items before letting me save. |

**Acceptance Criteria for FR-SO-01 to FR-SO-05:**
- Given a Sales Order of type `default` with status `pending`, the Publish, Update, and Delete actions are enabled.
- Given a Sales Order of type `default` with status `active` and payment status `void`, the "Receive Payment" button is enabled. Publish, Update, and Delete are disabled.
- Given a Sales Order of type `outlet` with status `pending` or `void`, and payment status `void`, the "Receive Payment" button is active.
- Given any Sales Order with payment status `paid` (or any non-void status), the "Receive Payment" button must be completely disabled.

---

### 3.3 Master Data & Configuration Toggles (Module: Setting)
Governs status switches on inventory, POS, and user management screens.

| ID | Action | Target States / Conditions | UI Behavior | User Story |
|----|--------|----------------------------|-------------|------------|
| **FR-SET-01** | Master Catalog Toggle | None (Global) | Toggle switch triggers `Catalog/Activate` if new value is `1` and `Catalog/Deactivate` if `0`. | As a Franchisor Admin, I want to toggle a catalog's active state to control its visibility system-wide. |
| **FR-SET-02** | Master Item Toggle | None (Global) | Toggle switch triggers `Item/Activate` if `1` and `Item/Deactivate` if `0`. | As a Franchisor Admin, I want to activate or deactivate individual raw items. |
| **FR-SET-03** | POS Catalog Toggle | None (Global) | Toggle switch triggers `POSCatalog/Activate` if `1` and `POSCatalog/Deactivate` if `0`. | As a Franchisor Admin, I want to manage POS channel items easily. |
| **FR-SET-04** | User Active Guard Toggle | Targeted user's `usergroup.id === 1` | Render interactive switch ONLY if the user belongs to User Group 1 (Administrator/Franchisor Admin). For all other groups, render static status indicator (Checkmark or dash). | As a Franchisor Admin, I want to toggle active states only for administrative users to prevent accidental lockouts of service accounts. |

**Acceptance Criteria for FR-SET-01 to FR-SET-04:**
- Toggling any switch in the tables for Catalog, Item, or POS Catalog dispatches the respective API mutation immediately.
- On the User Management table, users with `usergroup.id === 1` display an active toggle switch.
- On the User Management table, users with any other group ID (e.g., `2`, `3`) display a non-interactive green checkmark (if active) or a dash `-` (if inactive).

---

### 3.4 Auto-Fetching and Filter Invalidation (Modules: Dashboard & Report)
Governs reactive data fetching.

| ID | Action | Trigger Event | State Control / Requirement |
|----|--------|---------------|-----------------------------|
| **FR-REP-01** | Dashboard Fetch | Page Load OR Filter Change | Automatically trigger parallel queries: `getDashboardGraph`, `getDashboardSales`, `getDashboardItem`, `getDashboardCommission`, and `getSaldoSummary` whenever the date period filter is updated. |
| **FR-REP-02** | Settlement Fetch | Page Load OR Filter Change | Automatically trigger `getSettlement` query whenever the search query, date filter, or selected outlet changes. |

**Acceptance Criteria for FR-REP-01 to FR-REP-02:**
- Changing the selected range in the Date Period picker on the Dashboard immediately issues all 5 dashboard API calls with the new parameters.
- Changing search inputs or outlet filters in the POS Settlement views triggers the RTK Query fetch hook without requiring a manual refresh button.

---

## 4. Non-Functional Requirements
- **NFR-TS-01: Strict Type Safety:** State-guard rules must be defined as strongly-typed pure utility functions or custom hooks (e.g. `usePurchaseOrderGuards(po)` returning `{ canPublish: boolean, canEdit: boolean, canPay: boolean }`).
- **NFR-UI-01: UX Consistency:** Disabling interactive elements must supply visual feedback. Buttons should be styled with low opacity, cursor-not-allowed, and an optional tooltip explaining *why* the action is locked (e.g., "Cannot edit a published document").
- **NFR-PERF-01: Double-Click Prevention:** Implement throttle or debounce on critical state-modifying actions (Approve, Pay, Delete, Toggle) to guarantee only one network dispatch happens if a user double-clicks.
- **NFR-TEST-01: Component & Guard Coverage:** Guard helper functions must have 100% unit test coverage using Jest/Vitest.

---

## 5. Out of Scope
- Backend enforcement of lifecycle rules (this document focuses purely on the frontend web client behavior).
- Authentication validations, JWT verification, or route-level group authorization (handled by general Auth/Route specs).
- Exact formatting of JSON error payloads from the API.

---

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| **Simultaneous rapid clicks** | The button enters a loading state (`isLoading`) immediately on the first click and disables further clicks to prevent race conditions. |
| **Offline status during action** | If the internet connection drops, disable all mutable action triggers and display a toast alert indicating the client is offline. |
| **Outdated cached state** | If the client's local cache says a PO is `pending` but the backend has already marked it `published`, the API response error (e.g., 400 Bad Request) must be handled gracefully by refetching the document details and updating the local UI status. |
| **Accidental navigation via URL** | If a user types the URL `/purchase/order/:id/update` directly in the address bar for a non-pending order, the route guard redirects them back to `/purchase/order/:id` with a warning message. |

---

## 7. Success Metrics
- **Zero invalid API requests:** Front-end code intercepts 100% of illegal state-mutation attempts before dispatching them.
- **No manual refresh required:** UI state updates reactively upon successful mutation via RTK Query cache synchronization.
- **Clean TypeScript Compilation:** Zero `any` casts in state-guard helper parameters.

---

## 8. Open Questions
- **OQ-1:** Should we allow Franchisor Admins to bypass any of these client guards (e.g. force-deleting a published document), or are these constraints absolute for all roles? *Decision: Constraints are absolute at the client level to prevent database constraint violations on the backend.*

---

## 9. Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-05-18 | Initial specification for react-rebuild API Action and Condition guards, mapped directly from the `api-analysis` research. | Raka Pradipta |

---

*Specification created with SDD 4.0*
