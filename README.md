# Franchisor v2

Franchise management system for Sukabread — handles outlet operations, B2B orders, inventory, production planning, POS, purchases, reports, and financial transactions (withdrawals, top-ups).

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 8 + Rolldown
- **Styling:** Tailwind CSS 4 + DaisyUI 5
- **State:** Redux Toolkit + Redux Persist
- **Routing:** React Router 7
- **Data:** RTK Query (REST API)
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint 10 + typescript-eslint

## Getting Started

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Project Structure

```
src/
├── components/    # Shared UI components
├── hooks/         # Custom React hooks
├── pages/         # Route-level page components
│   ├── b2b/          # B2B orders
│   ├── inventory/    # Items, catalogs
│   ├── outletTopup/  # Outlet top-up requests
│   ├── production/   # Plans, demand
│   ├── purchase/     # Purchase orders, suppliers
│   ├── report/       # Reports (settlement, outstanding, sales, stock)
│   ├── sales/        # Sales orders, returns
│   ├── setting/      # POS, outlets, payment methods, users
│   └── withdrawal/   # Withdrawal requests
├── routes/        # Route definitions
├── services/      # API hooks, types, store config
└── utils/         # Helpers & formatters
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
