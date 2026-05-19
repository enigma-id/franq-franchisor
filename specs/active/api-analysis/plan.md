# Technical Plan: API Action and Condition Rebuild (Client-Side Guard Rules)

**Task ID:** api-analysis
**Status:** Ready for Implementation
**Based on:** specs/active/api-analysis/spec.md

---

## 1. System Architecture
We will implement a layered guard control flow to enforce document lifecycle rules and restrict administrative actions. This pattern keeps the logic decoupled from visual component templates, making it easily testable, maintainable, and aligned with Clean Architecture principles.

```
+-------------------------------------------------------------+
|                        React Page/UI                        |
|   (Renders GuardedButton, forms with disabled submit states)|
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 React Custom Hooks Layer                    |
|   (usePurchaseOrderGuards, useSalesOrderGuards, etc.)       |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 Central Pure Guards Layer                   |
|   (TypeScript Pure Functions, isolated from React cycle)    |
+-------------------------------------------------------------+
```

### Architecture Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Logic Placement** | Pure TS functions | Isolates business rules from React-specific hooks and life cycles. Highly testable and fast. |
| **Component Control** | Centralized `<GuardedButton>` | Standardizes opacity, custom tooltips, cursor types, and `isLoading` loading states across the entire portal. |
| **Route Protection** | URL Guard Component | Prevents unauthorized bypass attempts where users navigate directly to `/purchase/order/:id/update`. |
| **Mutation Throttling**| RTK Query `isLoading` status | Protects against duplicate click dispatches and race conditions at the store level. |

---

## 2. Technology Stack
- **Languages:** TypeScript 5.x
- **Framework & Libraries:** React 18.x, Redux Toolkit 2.x, RTK Query, React Router 6.x
- **Testing:** Vitest, React Testing Library

### Project Dependencies
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}
```

---

## 3. Component Design

### 3.1 Pure TypeScript Guards (`src/utils/guards/`)
Provides standalone logic for checking the eligibility of document actions.

- **Purchase Order Guards (`src/utils/guards/purchase.ts`):**
  ```typescript
  import { PurchaseOrder } from "@/services/types/purchase";

  export const canPublishPo = (po: PurchaseOrder): boolean =>
    po.document_status === "pending";

  export const canEditPo = (po: PurchaseOrder): boolean =>
    po.document_status === "pending";

  export const canDeletePo = (po: PurchaseOrder): boolean =>
    po.document_status === "pending";

  export const canPayPo = (po: PurchaseOrder): boolean =>
    po.document_status !== "pending" && po.payment_status === "void";
  ```

- **Sales Order Guards (`src/utils/guards/sales.ts`):**
  ```typescript
  import { SalesOrder } from "@/services/types/sales";

  export const canPublishSo = (so: SalesOrder): boolean =>
    so.order_status === "pending" && so.type === "default";

  export const canEditSo = (so: SalesOrder): boolean =>
    so.order_status === "pending" && so.type === "default";

  export const canDeleteSo = (so: SalesOrder): boolean =>
    so.order_status === "pending" && so.type === "default";

  export const canPaySo = (so: SalesOrder): boolean => {
    if (so.payment_status !== "void") return false;
    if (so.type === "default" && so.order_status === "active") return true;
    if (so.type === "outlet" && (so.order_status === "pending" || so.order_status === "void")) return true;
    return false;
  };
  ```

### 3.2 React Custom Hooks Layer (`src/hooks/`)
Provides components with dynamic states reactively synced to RTK Query states.

- **`src/hooks/usePurchaseOrderGuards.ts`:**
  ```typescript
  import { useMemo } from "react";
  import { PurchaseOrder } from "@/services/types/purchase";
  import * as poGuards from "@/utils/guards/purchase";

  export function usePurchaseOrderGuards(po?: PurchaseOrder) {
    return useMemo(() => {
      if (!po) {
        return { canPublish: false, canEdit: false, canDelete: false, canPay: false };
      }
      return {
        canPublish: poGuards.canPublishPo(po),
        canEdit: poGuards.canEditPo(po),
        canDelete: poGuards.canDeletePo(po),
        canPay: poGuards.canPayPo(po),
      };
    }, [po]);
  }
  ```

- **`src/hooks/useSalesOrderGuards.ts`:**
  ```typescript
  import { useMemo } from "react";
  import { SalesOrder } from "@/services/types/sales";
  import * as soGuards from "@/utils/guards/sales";

  export function useSalesOrderGuards(so?: SalesOrder) {
    return useMemo(() => {
      if (!so) {
        return { canPublish: false, canEdit: false, canDelete: false, canPay: false };
      }
      return {
        canPublish: soGuards.canPublishSo(so),
        canEdit: soGuards.canEditSo(so),
        canDelete: soGuards.canDeleteSo(so),
        canPay: soGuards.canPaySo(so),
      };
    }, [so]);
  }
  ```

### 3.3 UI Custom Guard Wrappers (`src/components/app/guards/`)

- **`GuardedButton` Component:**
  Renders an action button that automatically respects conditional access, shows a tooltip if locked, and handles loading spinners.
  ```typescript
  interface GuardedButtonProps {
    allowed: boolean;
    reason: string;
    onClick: () => void;
    children: React.ReactNode;
    isLoading?: boolean;
    className?: string;
  }
  ```
  *Behavior:* When `allowed === false`, the button gets `disabled={true}`, receives a cursor-not-allowed style (`cursor-not-allowed opacity-50`), and triggers a tooltip on hover displaying `reason`.

- **`UpdateRouteGuard` Component:**
  Protects manual URL access to document edit pages (e.g., `/purchase/order/:id/update`).
  ```typescript
  interface UpdateRouteGuardProps {
    allowed: boolean;
    fallbackUrl: string;
    warningMessage?: string;
    children: React.ReactNode;
  }
  ```
  *Behavior:* Evaluates `allowed`. If false, navigates via `<Navigate to={fallbackUrl} replace />` and dispatches a temporary global UI toast notification.

---

## 4. Data Model
TypeScript definitions to support type-safe guard contracts.

```typescript
export interface PurchaseOrder {
  id: number;
  document_number: string;
  document_status: "pending" | "published" | "completed";
  payment_status: "void" | "paid";
  items: Array<{
    item_id: number;
    fraction_id: number;
    quantity: number;
  }>;
}

export interface SalesOrder {
  id: number;
  order_number: string;
  order_status: "pending" | "active" | "void" | "completed";
  type: "default" | "outlet";
  payment_status: "void" | "paid";
  items: Array<{
    catalog_id: number;
    quantity: number;
  }>;
}

export interface User {
  id: number;
  username: string;
  is_active: number; // 0 or 1
  usergroup: {
    id: number; // 1 = Admin, other = Outlet/Staff
    name: string;
  };
}
```

---

## 5. API Contracts
RTK Query mutation hooks in `purchaseApi` and `salesApi` automatically handle tag invalidation to keep the cached entity state in sync.

| API Hook | Invalidation Target | Cache Update Event |
|----------|---------------------|--------------------|
| `approvePurchaseOrder` | `["PurchaseOrder"]` | Updates `document_status` to `"published"`. |
| `paymentPurchaseOrder` | `["PurchaseOrder"]` | Updates `payment_status` to `"paid"`. |
| `publishSalesOrder` | `["SalesOrder"]` | Updates `order_status` to `"active"`. |
| `paySalesOrder` | `["SalesOrder"]` | Updates `payment_status` to `"paid"`. |

---

## 6. Security Considerations
- **Front-end / Back-end Logic Alignment:** Although these client-side guards provide a smooth UI/UX flow, the Go API service *must* reject unauthorized state mutations (e.g., returning HTTP 400 or 422 if attempting to update a published PO).
- **Service Account Safety (User Management):** Preventing accidental admin deactivation is critical. We ensure that any user whose `usergroup.id !== 1` is visually blocked from status-toggle mutations.

---

## 7. Performance Strategy
- **RTK Query Auto-refetch:** Filter state transitions on Dashboard (`FR-REP-01`) and POS Settlement (`FR-REP-02`) trigger automatic queries using React's reactive state array bindings.
- **Vitest Unit Checks:** Unit test files (`*.test.ts`) for each pure guard file will execute in parallel to keep compilation times low.

---

## 8. Implementation Phases

- [ ] **Phase 1: Pure Logic Foundations**
  - [ ] Implement `src/utils/guards/purchase.ts` and `src/utils/guards/sales.ts`
  - [ ] Write Vitest test coverage for all pure functions
- [ ] **Phase 2: React Hook Bindings**
  - [ ] Implement custom hooks `usePurchaseOrderGuards` and `useSalesOrderGuards`
- [ ] **Phase 3: Guarded UI Elements**
  - [ ] Implement the dynamic `<GuardedButton>` with styles and tooltips
  - [ ] Implement the routing wrapper `<UpdateRouteGuard>`
- [ ] **Phase 4: Component Integration & Auto-fetching**
  - [ ] Integrate guards in Purchase Order Detail and Sales Order Detail pages
  - [ ] Integrate item form-line submission validations in Create/Update screens
  - [ ] Bind date-range filters in Dashboard and Settlement to trigger automatic RTK Queries

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Local UI states diverge from server database | Medium | Low | Ensure RTK Query tags are invalidated (`PurchaseOrder` and `SalesOrder` tags) immediately upon successful mutation response. |
| Multiple rapid clicks trigger duplicate mutations | High | Medium | Centralize throttle and lock behaviors directly in `<GuardedButton>` using local loader indicators (`isLoading`). |
| Typing URLs manually bypasses PO/SO detail locks | High | Low | Enforce the `<UpdateRouteGuard>` wrapper around routing definitions in `src/routes/index.tsx`. |

---

## 10. Open Questions
- *None.* All state guard rules derived from legacy code analysis are explicit and absolute.

---

## Next Steps
1. Review the technical plan.
2. Run `/tasks api-analysis` to establish the granular task-by-task breakdown.

---

*Technical Plan created with SDD 4.0*
