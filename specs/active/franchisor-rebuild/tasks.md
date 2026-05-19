# Implementation Tasks: Franchisor Rebuild

**Task ID:** franchisor-rebuild
**Created:** 2026-05-12
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 15 |
| Estimated Effort | ~11 days |
| Phases | 5 |

## Phase 1: Project Initialization

**Goal:** Set up the core development environment with Vite, Tailwind 4, and basic project structure.

### Task 1.1: Project Scaffolding
**Description:** Initialize Vite with React and TypeScript, and set up the directory structure as per the technical plan.
**Acceptance Criteria:**
- [ ] Vite project created with `react-ts` template.
- [ ] Folder structure created: `src/services`, `src/components`, `src/pages`, `src/layouts`.
- [ ] Project compiles and runs.
**Effort:** 2 hours
**Priority:** High
**Dependencies:** None

### Task 1.2: Tailwind CSS 4 Integration
**Description:** Install and configure Tailwind CSS v4 using the new `@tailwindcss/vite` plugin.
**Acceptance Criteria:**
- [ ] Tailwind 4 installed and integrated via Vite plugin.
- [ ] `@theme` and `@import "tailwindcss";` configured in `index.css`.
- [ ] Test utility class works in a component.
**Effort:** 2 hours
**Priority:** High
**Dependencies:** 1.1

### Task 1.3: Redux Store & Persist Setup
**Description:** Configure Redux Toolkit with `redux-persist` and standard store configuration.
**Acceptance Criteria:**
- [ ] `src/services/store.ts` created.
- [ ] `redux-persist` configured with `localStorage`.
- [ ] Store wrapped in `Provider` and `PersistGate` in `main.tsx`.
**Effort:** 4 hours
**Priority:** High
**Dependencies:** 1.1

---

## Phase 2: Core Service Layer

**Goal:** Establish the foundation for API communication and authentication.

### Task 2.1: Base API Utility
**Description:** Create the `baseQuery` with token injection and error handling.
**Acceptance Criteria:**
- [ ] `src/services/api.ts` (shared base) created.
- [ ] `prepareHeaders` injects JWT from Redux state.
- [ ] Global error handling (e.g., 401 redirect) implemented.
**Effort:** 4 hours
**Priority:** High
**Dependencies:** 1.3

### Task 2.2: Auth Module Service
**Description:** Implement `authApi`, `authSlice`, and `useAuth` hook.
**Acceptance Criteria:**
- [ ] `src/services/auth/api.tsx` with `login`, `getMe`, `updateMe`.
- [ ] `src/services/auth/slice.tsx` managing `token` and `user` state.
- [ ] `src/services/auth/hook.tsx` exposing clean auth methods.
**Effort:** 6 hours
**Priority:** High
**Dependencies:** 2.1

---

## Phase 3: Layouts & Routing

**Goal:** Build the navigation framework and route guards.

### Task 3.1: Routing Framework
**Description:** Set up `react-router-6` with public and protected route definitions.
**Acceptance Criteria:**
- [ ] `AppRoutes.tsx` created.
- [ ] `AuthorizedRoute` component redirects unauthenticated users to `/signin`.
- [ ] `UnauthorizedRoute` redirects logged-in users away from `/signin`.
**Effort:** 4 hours
**Priority:** High
**Dependencies:** 2.2

### Task 3.2: Main Layout & Bottom Nav
**Description:** Create the `MainLayout` with the bottom navigation bar for mobile-first experience.
**Acceptance Criteria:**
- [ ] Bottom Nav visible on protected routes.
- [ ] Navigation links point to Dashboard, Purchase, Report, Sales, and Setting.
- [ ] Responsive container for page content.
**Effort:** 4 hours
**Priority:** Medium
**Dependencies:** 3.1

---

## Phase 4: Module Implementation

**Goal:** Implement the specific business modules using the service pattern.

### Task 4.1: Dashboard Module
**Description:** Create Dashboard service and UI screen.
**Acceptance Criteria:**
- [ ] `src/services/dashboard/api.tsx` fetching KPI data.
- [ ] Dashboard page rendering summary cards.
**Effort:** 6 hours
**Priority:** Medium
**Dependencies:** 3.2

### Task 4.2: Purchase Module
**Description:** Create Purchase service and management screens.
**Acceptance Criteria:**
- [ ] `src/services/purchase/api.tsx` (List, Detail, Create).
- [ ] Purchase list and creation form implemented.
**Effort:** 8 hours
**Priority:** Medium
**Dependencies:** 3.2

### Task 4.3: Sales Module
**Description:** Create Sales tracking service and UI.
**Acceptance Criteria:**
- [ ] `src/services/sales/api.tsx` for per-outlet sales.
- [ ] Sales list with status update functionality.
**Effort:** 6 hours
**Priority:** Medium
**Dependencies:** 3.2

### Task 4.4: Report Module
**Description:** Create Reporting service and data tables.
**Acceptance Criteria:**
- [ ] `src/services/report/api.tsx` for various report types.
- [ ] Filterable tables and export functionality placeholder.
**Effort:** 8 hours
**Priority:** Low
**Dependencies:** 3.2

### Task 4.5: Setting Module
**Description:** Create System Settings service and forms.
**Acceptance Criteria:**
- [ ] `src/services/setting/api.tsx` for config and user management.
- [ ] Forms for updating system settings and profiles.
**Effort:** 6 hours
**Priority:** Low
**Dependencies:** 3.2

---

## Phase 5: Verification & Testing

**Goal:** Ensure quality and compliance with the specification.

### Task 5.1: Unit & Integration Testing
**Description:** Implement tests for Redux slices and RTK Query hooks.
**Acceptance Criteria:**
- [ ] Tests for `authSlice` and `authApi`.
- [ ] Coverage ≥ 80% for service layer.
**Effort:** 8 hours
**Priority:** Medium
**Dependencies:** 4.1, 4.2, 4.3, 4.4, 4.5

### Task 5.2: Final Audit & Bug Fixes
**Description:** Conduct an audit against the PRD and fix remaining UI/UX issues.
**Acceptance Criteria:**
- [ ] `/audit franchisor-rebuild` reports no critical issues.
- [ ] UI matches existing Vue portal flow.
**Effort:** 4 hours
**Priority:** High
**Dependencies:** 5.1

### Task 5.3: Build Optimization
**Description:** Finalize production build and verify performance NFRs.
**Acceptance Criteria:**
- [ ] `npm run build` succeeds.
- [ ] Bundle size analyzed and optimized.
**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** 5.2

---

## Quick Reference Checklist

- [ ] Task 1.1: Project Scaffolding
- [ ] Task 1.2: Tailwind CSS 4 Integration
- [ ] Task 1.3: Redux Store & Persist Setup
- [ ] Task 2.1: Base API Utility
- [ ] Task 2.2: Auth Module Service
- [ ] Task 3.1: Routing Framework
- [ ] Task 3.2: Main Layout & Bottom Nav
- [ ] Task 4.1: Dashboard Module
- [ ] Task 4.2: Purchase Module
- [ ] Task 4.3: Sales Module
- [ ] Task 4.4: Report Module
- [ ] Task 4.5: Setting Module
- [ ] Task 5.1: Unit & Integration Testing
- [ ] Task 5.2: Final Audit & Bug Fixes
- [ ] Task 5.3: Build Optimization

## Next Steps

1. Review task breakdown.
2. Run `/implement franchisor-rebuild` to start execution.

---

*Tasks created with SDD 4.0*
