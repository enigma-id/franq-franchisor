# Todo List: API Action and Condition Rebuild (Client-Side Guard Rules)

**Task ID:** api-analysis
**Created:** 2026-05-18
**Status:** In Progress
**Version:** 1.0

---

## Progress Log

| Date | Phase | Task ID | Description | Status |
|------|-------|---------|-------------|--------|
| 2026-05-18 | Phase 1 | Task 1.1 | Implement PO pure guard functions | pending |
| 2026-05-18 | Phase 1 | Task 1.2 | Implement SO pure guard functions | pending |
| 2026-05-18 | Phase 1 | Task 1.3 | Write Vitest unit checks | pending |
| 2026-05-18 | Phase 2 | Task 2.1 | Implement custom React hooks | pending |
| 2026-05-18 | Phase 3 | Task 3.1 | Implement GuardedButton component | pending |
| 2026-05-18 | Phase 3 | Task 3.2 | Implement UpdateRouteGuard routing check | pending |
| 2026-05-18 | Phase 4 | Task 4.1 | Integrate state guards on details/setting screens | pending |
| 2026-05-18 | Phase 4 | Task 4.2 | Bind Dashboard & Settlement auto-fetching filters | pending |

---

## Phase 1: Pure Logic Foundations
- [ ] **Task 1.1: Purchase Order Pure Guard Functions**
  - [ ] Create `src/utils/guards/purchase.ts`
  - [ ] Write `canPublishPo(po)`, `canEditPo(po)`, `canDeletePo(po)`, and `canPayPo(po)`
  - [ ] Verify standard TypeScript typing checks compile
- [ ] **Task 1.2: Sales Order Pure Guard Functions**
  - [ ] Create `src/utils/guards/sales.ts`
  - [ ] Write `canPublishSo(so)`, `canEditSo(so)`, `canDeleteSo(so)`, and `canPaySo(so)`
  - [ ] Verify conditional outlet vs default type rules
- [ ] **Task 1.3: Vitest Guard Unit Tests**
  - [ ] Create `src/utils/guards/purchase.test.ts`
  - [ ] Create `src/utils/guards/sales.test.ts`
  - [ ] Run test suite with `npm test` and assert all pass

## Phase 2: React Hook Bindings
- [ ] **Task 2.1: Custom React Guard Hooks**
  - [ ] Create `src/hooks/usePurchaseOrderGuards.ts`
  - [ ] Create `src/hooks/useSalesOrderGuards.ts`
  - [ ] Implement useMemo memoization triggers on po/so shifts

## Phase 3: Guarded UI Elements
- [ ] **Task 3.1: Centralized GuardedButton Component**
  - [ ] Create `src/components/app/guards/GuardedButton.tsx`
  - [ ] Connect custom tooltips, opacities, cursors, and loading attributes
- [ ] **Task 3.2: Routing Interceptor URL Guard**
  - [ ] Create `src/components/app/guards/UpdateRouteGuard.tsx`
  - [ ] Implement local router navigation redirect blocks

## Phase 4: Component Integration & Auto-fetching
- [ ] **Task 4.1: PO & SO Screens State Guard Integration**
  - [ ] Wire detail page buttons in PO/SO pages
  - [ ] Wire Create/Update form validator criteria
  - [ ] Connect master settings toggles and user active checks
- [ ] **Task 4.2: Reactive Analytics & Settlement Filters**
  - [ ] Auto-bind period selections in Dashboard to reload graph/saldo summary
  - [ ] Auto-bind POS Settlement filters to reload RTK Query cache states

---
*Created with SDD 4.0*
