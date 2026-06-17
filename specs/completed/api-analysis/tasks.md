# Implementation Tasks: API Action and Condition Rebuild (Client-Side Guard Rules)

**Task ID:** api-analysis
**Created:** 2026-05-18
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 8 |
| Estimated Effort | 24 Hours |
| Phases | 4 |

---

## Phase 1: Pure Logic Foundations

**Goal:** Establish fully typed, decoupled, and unit-tested business logic guard functions for Purchase Orders and Sales Orders.

### Task 1.1: Purchase Order Pure Guard Functions
- **Description:** Implement pure TypeScript check functions for Purchase Order actions (Publish, Edit, Delete, Make Payment) at `src/utils/guards/purchase.ts` based on document and payment statuses.
- **Acceptance Criteria:**
  - [ ] `canPublishPo`, `canEditPo`, `canDeletePo` return true ONLY when `document_status === 'pending'`.
  - [ ] `canPayPo` returns true ONLY when `document_status !== 'pending'` AND `payment_status === 'void'`.
  - [ ] Functions are strongly typed with the `PurchaseOrder` type interface.
- **Effort:** 3 hours
- **Priority:** High
- **Dependencies:** None

### Task 1.2: Sales Order Pure Guard Functions
- **Description:** Implement pure TypeScript check functions for Sales Order actions at `src/utils/guards/sales.ts` based on order type, status, and payment configurations.
- **Acceptance Criteria:**
  - [ ] `canPublishSo`, `canEditSo`, `canDeleteSo` return true ONLY when `order_status === 'pending'` AND `type === 'default'`.
  - [ ] `canPaySo` returns true ONLY when `payment_status === 'void'` AND either (`type === 'default'` with `order_status === 'active'`) OR (`type === 'outlet'` with `order_status === 'pending'` or `'void'`).
  - [ ] Fully typed using the `SalesOrder` interface.
- **Effort:** 3 hours
- **Priority:** High
- **Dependencies:** None

### Task 1.3: Vitest Guard Unit Tests
- **Description:** Create unit tests `src/utils/guards/purchase.test.ts` and `src/utils/guards/sales.test.ts` to verify 100% conditional state logic.
- **Acceptance Criteria:**
  - [ ] Unit tests cover all permutations of states (pending, active, published, paid, void, default, and outlet).
  - [ ] `npm test` runs and passes successfully.
- **Effort:** 3 hours
- **Priority:** High
- **Dependencies:** Task 1.1, Task 1.2

---

## Phase 2: React Hook Bindings

**Goal:** Bridge the pure logic utilities with React component lifetimes and memoized states.

### Task 2.1: Custom React Guard Hooks
- **Description:** Implement custom React hooks `src/hooks/usePurchaseOrderGuards.ts` and `src/hooks/useSalesOrderGuards.ts` to wrap pure guard logic with React's memoization cycle.
- **Acceptance Criteria:**
  - [ ] `usePurchaseOrderGuards` accepts a `PurchaseOrder` object and returns memoized access rules (`canPublish`, `canEdit`, `canDelete`, `canPay`).
  - [ ] `useSalesOrderGuards` accepts a `SalesOrder` object and returns memoized access rules.
  - [ ] Hooks safely return fallback false values if the input object is `undefined`.
- **Effort:** 2 hours
- **Priority:** Medium
- **Dependencies:** Task 1.1, Task 1.2

---

## Phase 3: Guarded UI Elements

**Goal:** Create generic, reusable frontend elements that enforce active state control flows in the user interface.

### Task 3.1: Centralized GuardedButton Component
- **Description:** Implement the `<GuardedButton>` component at `src/components/app/guards/GuardedButton.tsx` to handle visual states, hover reasons, and lock configurations.
- **Acceptance Criteria:**
  - [ ] When `allowed === false`, the button applies `disabled={true}`, reduces opacity, shows a `cursor-not-allowed` pointer, and displays a tooltip detailing the `reason`.
  - [ ] Renders loading spinners if `isLoading === true` to block double-click dispatches.
- **Effort:** 3 hours
- **Priority:** Medium
- **Dependencies:** None

### Task 3.2: Routing Interceptor URL Guard
- **Description:** Create the `<UpdateRouteGuard>` component at `src/components/app/guards/UpdateRouteGuard.tsx` to intercept manual URL manipulations.
- **Acceptance Criteria:**
  - [ ] If `allowed === false`, automatically redirects the user to the specified fallback URL using React Router's `<Navigate replace />`.
  - [ ] Triggers a global toast notification on intercept.
- **Effort:** 3 hours
- **Priority:** Medium
- **Dependencies:** None

---

## Phase 4: Component Integration & Auto-fetching

**Goal:** Wire the hooks, components, and interceptors into the active application screens and dashboard query cycles.

### Task 4.1: PO & SO Screens State Guard Integration
- **Description:** Refactor `/purchase/order/detail` and `/sales/order/detail` page components to fetch entity status, bind state hooks, render `<GuardedButton>` elements, and wrap Update routes in routing configurations.
- **Acceptance Criteria:**
  - [ ] Approved/Published Purchase/Sales detail pages block Edit, Delete, and Publish options, but render Make Payment active.
  - [ ] Create & Update forms block submit triggers if line items contain empty IDs or quantities $\le 0$.
  - [ ] Toggles on Catalog, Item, POS Catalog, and User settings trigger immediate RTK mutation dispatches, checking active group rules for User management.
- **Effort:** 4 hours
- **Priority:** High
- **Dependencies:** Task 2.1, Task 3.1, Task 3.2

### Task 4.2: Reactive Analytics & Settlement Filters
- **Description:** Refactor Dashboard and POS Settlement page fetching to bind query hooks reactively to filter parameters (date period, search query, outlet selections).
- **Acceptance Criteria:**
  - [ ] Period filter changes on the Dashboard trigger parallel refetches of graph, sales, item, commission, and balance APIs.
  - [ ] Settlement filters trigger refetches automatically on date or outlet select changes.
- **Effort:** 3 hours
- **Priority:** Medium
- **Dependencies:** None

---

## Quick Reference Checklist

- [ ] Task 1.1: Purchase Order Pure Guard Functions
- [ ] Task 1.2: Sales Order Pure Guard Functions
- [ ] Task 1.3: Vitest Guard Unit Tests
- [ ] Task 2.1: Custom React Guard Hooks
- [ ] Task 3.1: Centralized GuardedButton Component
- [ ] Task 3.2: Routing Interceptor URL Guard
- [ ] Task 4.1: PO & SO Screens State Guard Integration
- [ ] Task 4.2: Reactive Analytics & Settlement Filters

---

## Next Steps

1. Review task breakdown.
2. Run `/implement api-analysis` to start executing.

---

*Tasks created with SDD 4.0*
