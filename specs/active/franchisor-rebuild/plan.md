# Technical Plan: Franchisor Rebuild

**Task ID:** franchisor-rebuild
**Status:** Ready for Implementation
**Date:** 2026-05-12
**Based on:** spec.md

## 1. System Architecture
The system will follow a modular, service-oriented React architecture. Business logic and data fetching are decoupled from the UI using Redux Toolkit (RTK) and RTK Query.

### Architecture Decisions
| Decision | Choice | Rationale |
|----------|---------|-----------|
| UI Framework | React 18 + Vite | Modern, fast HMR, and standard for current web apps. |
| State Management | Redux Toolkit | Predictable state container, optimized for complex data flows. |
| Data Fetching | RTK Query | Built-in caching, auto-generated hooks, and standardized API layer. |
| Logic Pattern | Modular Services | Logic located in `src/services/[module]/` for high maintainability. |
| Styling | Tailwind CSS | Utility-first CSS for rapid, consistent UI development. |

## 2. Technology Stack
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Runtime | Node.js | v20+ | LTS stability. |
| Framework | React | 18.x | Concurrent features and performance. |
| Build Tool | Vite | 5.x | Instant start and fast bundling. |
| Language | TypeScript | 5.x | Robust type safety for enterprise apps. |
| State | Redux Toolkit | 2.x | Simplified Redux patterns. |
| Styling | Tailwind CSS | 4.x | Latest stable config (CSS-first engine). |

## 3. Component Design
The project structure will emphasize modularity:
- `src/components/`: Atomic and shared components (to be populated later).
- `src/layouts/`: Layout wrappers (`MainLayout`, `AuthLayout`).
- `src/pages/`: Page-level components corresponding to routes.
- `src/services/[module]/`:
    - `api.tsx`: RTK Query definitions.
    - `hook.tsx`: Custom hooks wrapping API and state logic.
    - `slice.tsx`: Redux state slices (if needed for local UI state).

## 4. Data Model
### Core Entities (TypeScript)
```ts
export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'FRANCHISOR' | 'MANAGER' | 'OPERATOR';
  franchise_id?: string;
  outlet_id?: string;
}

export interface PurchaseOrder {
  id: string;
  order_number: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED';
  total_amount: number;
  items: any[];
}
```

## 5. API Contracts
All APIs will use `baseQuery` with bearer token injection from Redux state.

| Method | Path | Description | Service Module |
|--------|------|-------------|----------------|
| POST | `/auth/signin` | Authenticate user | `auth` |
| GET | `/auth/me` | Fetch current profile | `auth` |
| GET | `/dashboard` | KPI and summary data | `dashboard` |
| GET | `/purchase` | List purchase orders | `purchase` |
| GET | `/report/sales` | Fetch sales reports | `report` |

## 6. Security Considerations
- **JWT Handling:** Stored in `Redux-Persist` (localStorage) and injected via RTK Query `baseQuery`.
- **Protected Routes:** `AuthorizedRoute` wrapper to prevent unauthenticated access.
- **Data Protection:** Sanitization of inputs and secure handling of sensitive keys in `.env`.

## 7. Performance Strategy
- **Caching:** RTK Query default cache (60s) to minimize redundant API calls.
- **Code Splitting:** Lazy loading for routes using `React.lazy` and `Suspense`.
- **Vite Optimization:** Production build minification and asset compression.

## 8. Implementation Phases
- [ ] Phase 1: Project Initialization (Vite, Tailwind, Redux Setup)
- [ ] Phase 2: Core Service Layer (Auth API & Store Persistence)
- [ ] Phase 3: Layouts & Routing (AuthGuard & Main Navigation)
- [ ] Phase 4: Module Implementation (Dashboard, Purchase, Sales, Report, Setting)
- [ ] Phase 5: Verification & Testing

## 9. Risk Assessment
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API Breaking Changes | High | Medium | Versioning and comprehensive `api.tsx` type definitions. |
| State Desync | Medium | Low | Use RTK Query `providesTags`/`invalidatesTags` for cache consistency. |
| Complex UI Rebuild | Medium | Medium | Modular components and gradual migration. |

## 10. Open Questions
- Confirmation on specific Tailwind plugins needed (Forms, Typography).
- Exact API Base URL for local vs production environments.

## Next Steps
- Review this plan.
- Run `/tasks franchisor-rebuild` to generate tasks.
- Run `/implement franchisor-rebuild` to start project scaffolding.

*Technical Plan generated with SDD 4.0*
