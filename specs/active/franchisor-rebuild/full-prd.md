# Product Requirements Document (PRD)
## Project: franchisor‑v2
**Location:** `D:\Enigma\franchisor‑v2`
**Date:** 2026‑05‑10

### 1. Problem Statement
The existing **Franchisor** web portal (`D:\Enigma\suka‑bread\clients\web\franchisor`) is built with Vue.js and a custom router. The business wants a **new React implementation** that mirrors the exact user‑flow, UI design, and API contracts of the current portal, but uses the modern stack you already employed for `franchisee‑v2` (React + Vite + Tailwind + DaisyUI + TypeScript + Redux Toolkit + Redux‑Persist).

### 2. Goal
Create a fresh React project (`franchisor‑v2`) that:
1. **Re‑creates every screen and navigation path** of the original Franchisor portal (login, dashboard, purchase, reports, sales, settings, etc.).
2. **Keeps the exact same back‑end API contracts** (the same endpoint URLs, request/response shapes).
3. **Adopts the service‑layer pattern** you already defined in `franchisee‑v2` (store, reducers, RTK Query API slices, persistence).
4. Provides a clean folder structure ready for you to add the React components manually.

### 3. Target Users / Personas
| Persona | Role | Primary Goals |
|---------|------|----------------|
| **Franchisor Admin** | Oversees the whole franchise network | View global dashboards, manage outlets, generate reports, configure system settings. |
| **Outlet Manager** | Manages a single franchise outlet | Process purchases, view cash flow, run settlement reports. |
| **System Operator** | Maintains the platform | Monitor activity logs, handle user accounts, manage permissions. |

### 4. Core Functional Requirements (must‑have)
| # | Feature | Description | Source (original) |
|---|---------|-------------|-------------------|
| 1 | **Authentication** | Login, logout, profile fetch/update (same `/auth/*` endpoints). | `src/services/auth/state.js`, `src/pages/unauthorized/entrance.vue` |
| 2 | **Protected Routing** | Auth‑protected routes (`/dashboard`, `/purchase`, `/report`, `/sales`, `/setting`). | `src/pages/authorized/router.js` |
| 3 | **Dashboard** | High‑level overview of franchise performance. | `src/pages/authorized/dashboard` |
| 4 | **Purchase** | Create and manage purchase orders. | `src/pages/authorized/purchase` |
| 5 | **Report** | Generate various reports (sales, settlement, etc.). | `src/pages/authorized/report` |
| 6 | **Sales** | View and edit sales data per outlet. | `src/pages/authorized/sales` |
| 7 | **Setting** | System configuration and user management. | `src/pages/authorized/setting` |
| 8 | **State Persistence** | Redux‑Persist stores auth token and minimal UI state; API slices are black‑listed. | `franchisee‑v2` store pattern (to be reused). |
| 9 | **API Layer** | All calls go through RTK Query slices generated from the original endpoint definitions. | `franchisee‑v2` service pattern. |
|10 | **Activity Indicators** | Global loading spinner driven by `Activity.processing/done`. | `src/services/activity.js` (original). |

### 5. Out‑of‑Scope (v1)
- New UI widgets beyond those present in the original portal.
- Mobile‑only native apps.
- Internationalisation (i18n) – placeholder only.
- Server‑side rendering.

### 6. Technical Stack (identical to `franchisee‑v2`)
| Layer | Technology |
|-------|------------|
| **Build** | Vite (React template) |
| **UI** | React 18, TypeScript, Tailwind CSS, DaisyUI |
| **State** | Redux Toolkit, RTK Query, Redux‑Persist |
| **Routing** | `react-router-dom` v6 (`BrowserRouter`, `Routes`, `Route`, redirects) |
| **HTTP** | Axios wrapper (`baseQuery.tsx`) with Bearer token injection |
| **Testing** | Vitest + React Testing Library |
| **Lint/Format** | ESLint + Prettier (shared config) |
| **Version Control** | Git (project under `D:\Enigma\franchisor‑v2`) |

### 7. Service / Folder Structure (mirrors `franchisee‑v2`)
```
franchisor‑v2/
├─ src/
│  ├─ assets/                # images, icons
│  ├─ components/
│  │   ├─ ui/                # DaisyUI‑based reusable components
│  │   ├─ layout/            # Header, Footer, Sidebar, MenuBar
│  │   └─ app/               # Dashboard, Purchase, Report, Sales, Setting shells
│  ├─ services/
│  │   ├─ store.tsx          # configureStore + redux‑persist (copy from franchisee‑v2)
│  │   ├─ reducer.tsx        # combineReducers + API slice registration
│  │   ├─ baseQuery.tsx      # axios config (base URL, auth header, error handling)
│  │   ├─ auth/              # authApi slice, hooks, reducer (mirrors original auth flow)
│  │   └─ … (other domain APIs will be added later)
│  ├─ router.authorized.tsx   # React Router config for protected pages (Dashboard, Purchase …)
│  ├─ router.unauthorized.tsx # Public login route
│  ├─ hooks/                # custom hooks (useRedux, useDocumentMeta)
│  ├─ utils/                # url builder, logger, permission helpers
│  ├─ index.css
│  └─ main.tsx
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

### 8. API Contracts (identical to original Vue app)
| Resource | Method | Path | Request Body | Response |
|----------|--------|------|--------------|----------|
| **Auth – Login** | POST | `/auth/signin` | `{ username, password }` | `{ token, user, outlet, franchise }` |
| **Auth – Get Me** | GET | `/auth/me` | – | `{ id, name, role, … }` |
| **Auth – Update Me** | PUT | `/auth/me` | `{ name?, password?, confirm_password? }` | Updated user object |
| **Dashboard** | GET | `/dashboard` | – | Aggregated KPI data |
| **Purchase** | GET/POST | `/purchase/*` | Various purchase payloads | Purchase list / creation response |
| **Report** | GET | `/report/*` | filter params | Report data (sales, settlement, etc.) |
| **Sales** | GET/PUT | `/sales/*` | sales payloads | Sales list / update response |
| **Setting** | GET/POST/PUT | `/setting/*` | configuration payloads | Settings saved response |

*All endpoints require `Authorization: Bearer <token>`.*

### 9. Non‑Functional Requirements
| Category | Requirement |
|----------|-------------|
| **Performance** | Initial bundle ≤ 2 s on 3G; API calls ≤ 300 ms. |
| **Security** | HTTPS only; JWT stored in Redux‑Persist; CSRF mitigated via SameSite. |
| **Accessibility** | WCAG 2.1 AA – focus management, ARIA labels, colour contrast. |
| **Scalability** | Persist only auth‑related slices; API slices remain transient. |
| **Reliability** | Offline fallback banner on fetch failures; persisted auth survives reloads. |
| **Testing** | ≥ 80 % unit‑test coverage on reducers, RTK Query slices, and critical UI components. |
| **CI/CD** | Lint, type‑check, test must pass before `npm run build`. |
| **Browser Support** | Chrome 108+, Edge 108+, Firefox 107+, Safari 15+. |

### 10. Success Metrics
| Metric | Target |
|--------|--------|
| **Feature Parity** | All screens/routes from the original Vue portal exist and behave identically in `franchisor‑v2`. |
| **Zero API Errors** | No 4xx/5xx responses when exercising the full flow against the existing back‑end. |
| **Build Health** | `npm run build` succeeds without TypeScript errors and produces a `dist/` folder. |
| **Stakeholder Sign‑off** | Product owner, UI designer, and backend team approve the PRD and the generated folder skeleton. |
| **Test Coverage** | `npm test -- --coverage` reports ≥ 80 % coverage. |

### 11. Open Questions (to be answered before implementation)
1. **Base URL** – What is the exact API base URL for the new front‑end?
2. **Environment Variables** – Any extra env vars (feature flags, analytics keys) beyond those used in `franchisee‑v2`?
3. **Branding Assets** – Re‑use existing logo/assets or provide new ones?
4. **Deployment Target** – Preferred static host (Vercel, Netlify, internal CDN) and CI pipeline configuration?

### 12. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026‑05‑10 | Initial PRD – derived from original Franchisor Vue portal flow and `franchisee‑v2` service pattern. |
| 1.1 | – | Pending updates after answers to open questions. |
```
