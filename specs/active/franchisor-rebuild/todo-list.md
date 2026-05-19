# Todo List: Franchisor Rebuild

**Task ID:** franchisor-rebuild
**Date:** 2026-05-12
**Status:** In Progress

## Phase 1: Project Initialization

- [x] **Task 1.1: Project Scaffolding**
    - [x] Create Vite project with React + TS
    - [x] Set up directory structure (`src/services`, `src/components`, `src/pages`, `src/layouts`)
    - [x] Clean up boilerplate code
- [x] **Task 1.2: Tailwind CSS 4 Integration**
    - [x] Install `tailwindcss`, `@tailwindcss/vite`
    - [x] Configure Vite plugin for Tailwind 4
    - [x] Set up `src/index.css` with Tailwind 4 directives
- [x] **Task 1.3: Redux Store & Persist Setup**
    - [x] Install `@reduxjs/toolkit`, `react-redux`, `redux-persist`
    - [x] Implement `src/services/store.ts`
    - [x] Wrap app with `Provider` and `PersistGate`

## Phase 2: Core Service Layer

- [x] **Task 2.1: Base API Utility**
    - [x] Create `src/services/api.ts` with `baseQuery`
    - [x] Implement bearer token injection logic
- [x] **Task 2.2: Auth Module Service**
    - [x] Implement `src/services/auth/api.tsx`
    - [x] Implement `src/services/auth/slice.tsx`
    - [x] Implement `src/services/auth/hook.tsx`

## Phase 3: Layouts & Routing

- [x] **Task 3.1: Routing Framework**
    - [x] Install `react-router-dom`
    - [x] Implement `AppRoutes.tsx` with Guard logic
- [x] **Task 3.2: Main Layout** (Bottom Nav postponed)
    - [x] Create `MainLayout` component shell
    - [x] Responsive container for page content

## Phase 4: Module Implementation

- [x] **Task 4.1: Dashboard Module** (Service + UI)
    - [x] Implement `src/services/dashboard/api.tsx`
    - [x] Implement `src/services/dashboard/hook.tsx`
    - [x] Update Dashboard UI with live data
- [x] **Task 4.2: Purchase Module** (Service + UI)
    - [x] Implement `src/services/purchase/api.tsx`
    - [x] Implement `src/services/purchase/hook.tsx`
    - [x] Create Purchase table UI with live data
- [x] **Task 4.3: Sales Module** (Service + UI)
    - [x] Implement `src/services/sales/api.tsx`
    - [x] Implement `src/services/sales/hook.tsx`
    - [x] Create Sales summary and table UI
- [x] **Task 4.4: Report Module** (Service + UI)
    - [x] Implement `src/services/report/api.tsx`
    - [x] Implement `src/services/report/hook.tsx`
    - [x] Create Report tabs UI (Sales & Settlement)
- [ ] **Task 4.5: Setting Module** (Service + UI)

## Phase 5: Verification

- [ ] **Task 5.1: Unit & Integration Testing**
- [ ] **Task 5.2: Final Audit & Bug Fixes**
- [ ] **Task 5.3: Build Optimization**

---

## Progress Log

| Date | Activity | Status |
|------|----------|--------|
| 2026-05-12 | Starting implementation | In Progress |
