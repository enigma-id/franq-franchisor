# Specification: franchisor‑v2

**Task ID:** franchisor‑v2
**Created:** 2026‑05‑10
**Status:** Ready for Implementation

## 1. Problem Statement
Re‑implement the existing `clients/web/franchisor` Vue portal using a modern React stack while preserving every UI screen, navigation flow, and API contract. The new codebase must follow the clean service‑layer pattern you already built for `franchisee‑v2`.

## 2. User Personas
- **Franchisor Admin** – oversees the whole franchise network, needs dashboards and system settings.
- **Outlet Manager** – manages purchases, cash flow, and sales for a single outlet.
- **System Operator** – handles user accounts, permissions, and platform health.

## 3. Functional Requirements
### 3.1 Authentication
| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|----------------------|
| FR‑AUTH‑01 | Login | As a user, I enter my phone number and PIN to access the system. | UI shows username & password fields.<br>POST `/auth/signin` → token stored in Redux‑Persist.<br>Redirect to dashboard. |
| FR‑AUTH‑02 | Auto‑login (persisted state) | As a returning user, I stay logged in across reloads. | On app start, persisted state is rehydrated; if token exists, protected routes open automatically. |
| FR‑AUTH‑03 | Logout | As a user, I can log out and clear my session. | Clicking logout dispatches `$signout`.<br>Redux state resets; `persist:root` removed from localStorage. |
| FR‑AUTH‑04 | Profile fetch | As a logged‑in user, I can view my profile data. | After login, GET `/auth/me` executes and populates profile view. |
| FR‑AUTH‑05 | Profile update | As a user, I can change my name or password. | PUT `/auth/me` with changed fields; success updates Redux state and shows confirmation. |

### 3.2 Navigation & Routing
| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| FR‑NAV‑01 | Public login route (`/signin`) | Unauthenticated users are redirected to `/signin`. |
| FR‑NAV‑02 | Protected routes (`/dashboard`, `/purchase`, `/report`, `/sales`, `/setting`) | Authenticated users can access; otherwise redirected to `/signin`. |
| FR‑NAV‑03 | Navigation Structure | The sidebar should follow the original Vue app's structure exactly:<br>- **Dashboard**<br>- **Purchase**: Supplier, Order, Demand<br>- **Report POS**: POS Order, POS Outstanding, POS Settlement Monthly, POS Settlement Daily, POS Sales Item, POS Item Daily<br>- **Report Stock**: Stock Report<br>- **Sales**: Sales Order List, Add, Detail<br>- **Setting**: Update Profile<br>- **Setting Franchise**: Data Franchise<br>- **Setting Inventory**: Master Catalog, Master Item<br>- **Setting Outlet**: Outlet List, Outlet Type<br>- **Setting POS**: POS Channel, POS Category, POS Catalog, POS Payment, Topup Schema<br>- **Setting User**: User Management |

### 3.3 Core Screens
| ID | Screen | Description | Acceptance Criteria |
|----|--------|-------------|----------------------|
| FR‑SCR‑01 | Dashboard | High‑level overview of franchise performance. | Data fetched from `/dashboard` endpoint; KPI cards displayed. |
| FR‑SCR‑02 | Purchase | Manage suppliers, purchase orders, and item demands. | Views for Supplier, Order, and Demand management. |
| FR‑SCR‑03 | Report | Generate sales, POS, and stock reports. | Views for POS Order, Outstanding, Settlement, Item, and Stock reports. |
| FR‑SCR‑04 | Sales | Manage sales orders. | List, create, and detail views for sales orders. |
| FR‑SCR‑05 | Setting | System configuration and master data management. | Sub-modules for Profile, Franchise, Inventory, Outlet, POS, and Users. |

### 3.4 State Management (service pattern)
- **Store configuration** identical to `franchisee‑v2/src/services/store.tsx`.
- **Root reducer** combines auth slice and all RTK Query API reducers (`authApi`, `purchaseApi`, `reportApi`, `salesApi`, `settingApi`).
- **Persist config** blacklists API slices; persists only auth‑related data (`token`, `user`, `outlet`, `franchise`).

### 3.5 API Layer
All endpoints are wrapped with **RTK Query** using the shared `baseQuery` from `franchisee‑v2`:
```ts
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: User }, Credentials>(...),
    getMe: builder.query<User, void>(...),
    updateMe: builder.mutation<User, Partial<User>>(...)
  })
});
export const { useLoginMutation, useLazyGetMeQuery, useUpdateMeMutation } = authApi;
```
Other domain APIs (`purchaseApi`, `reportApi`, `salesApi`, `settingApi`) follow the same pattern.

### 3.6 Non‑Functional Requirements
| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| NFR‑01 | Performance | First paint ≤ 2 s on 3G; subsequent API calls ≤ 300 ms. |
| NFR‑02 | Security | All traffic over HTTPS; JWT stored only in Redux‑Persist; `Authorization: Bearer` header used for every request. |
| NFR‑03 | Accessibility | WCAG 2.1 AA – keyboard focus, ARIA labels, colour contrast ≥ 4.5:1. |
| NFR‑04 | Test Coverage | `npm test` reports ≥ 80 % coverage across reducers, RTK Query slices, and critical UI components. |
| NFR‑05 | CI Pipeline | Lint, type‑check, and test must pass before `npm run build`. |
| NFR‑06 | Browser Support | Chrome 108+, Edge 108+, Firefox 107+, Safari 15+. |

## 4. Open Questions (re‑iterated)
1. Exact **API base URL** for the new front‑end.
2. Any additional **environment variables** (feature flags, analytics keys) that differ from `franchisee‑v2`.
3. **Branding assets** – reuse existing logo/assets or supply new ones?
4. Preferred **deployment target** (Vercel, Netlify, internal CDN) and CI configuration.

## 5. Acceptance Checklist
- [ ] Project skeleton (`src/`, `services/`, `components/`) matches the layout above.
- [ ] Redux store, reducer, and persist configuration compile without TypeScript errors.
- [ ] All routes (`AuthorizedRoute`, `UnauthorizedRoute`) behave as specified.
- [ ] Auth flow works end‑to‑end against the live back‑end.
- [ ] UI screens (Dashboard, Purchase, Report, Sales, Setting) render data from API without modification.
- [ ] Lint, type‑check, and test suite all pass.

## 6. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026‑05‑10 | Initial specification derived from original Franchisor Vue portal flow and `franchisee‑v2` service pattern. |
| 1.1 | – | Pending updates after answers to open questions. |
