# Implementation Todo List: New API Service Layer Migration

**Task ID:** new-api-service
**Date:** 2026-06-05
**Status:** In Progress

---

## Phase 1: Preparation
- [x] 1.1: Migrate Old Services to temp/
- [x] 1.2: Create Auth Type Definitions (`src/services/types/auth.ts`)
- [x] 1.3: Create Outlet Type Definitions (`src/services/types/outlet.ts`)
- [x] 1.4: Create POS Type Definitions (`src/services/types/pos.ts`)
- [x] 1.5: Create Inventory Type Definitions (`src/services/types/inventory.ts`)
- [x] 1.6: Create Order Type Definitions (`src/services/types/purchase.ts`, `src/services/types/sales.ts`)
- [x] 1.7: Create Production & Demand Type Definitions (`src/services/types/production.ts`)
- [x] 1.8: Create Supplier Type Definitions (`src/services/types/supplier.ts`)

## Phase 2: Auth & Outlet Services
- [x] 2.1: Rebuild Auth API (`src/services/auth/api.ts`)
- [x] 2.2: Preserve Auth Slice
- [x] 2.3: Rebuild Outlet API (`src/services/outlet/api.ts`)
- [x] 2.4: Create Outlet Hooks (`src/services/outlet/hooks.ts`)
- [x] 2.5: Create Region API (Preserve from temp)
- [x] 2.6: Update Reducer for Auth & Outlet

## Phase 3: POS Services
- [x] 3.1: Rebuild POS API (Menu & Category)
- [x] 3.2: Add POS Channel Endpoints
- [x] 3.3: Create POS Hooks
- [x] 3.4: Create Payment Method API
- [x] 3.5: Create Payment Method Hooks
- [x] 3.6: Create Member Topup Bonus API
- [x] 3.7: Create Member Topup Bonus Hooks
- [x] 3.8: Update Reducer for POS Services

## Phase 4: Inventory Services
- [x] 4.1: Rebuild Inventory API (Items)
- [x] 4.2: Add Inventory Catalog Endpoints
- [x] 4.3: Create Inventory Hooks
- [x] 4.4: Update Reducer for Inventory

## Phase 5: Order Services
- [x] 5.1: Rebuild Purchase Order API
- [x] 5.2: Create Purchase Order Hooks
- [x] 5.3: Rebuild Sales Order API
- [x] 5.4: Create Sales Order Hooks
- [x] 5.5: Create Sales Return API
- [x] 5.6: Create Sales Return Hooks
- [x] 5.7: Update Reducer for Order Services (Purchase, Sales, Supplier)

## Phase 6: Production & Demand Services
- [x] 6.1: Create Production API
- [x] 6.2: Add Production Item Endpoints
- [x] 6.3: Create Production Hooks
- [x] 6.4: Create Demand API
- [x] 6.5: Create Demand Hooks
- [x] 6.6: Update Reducer for Production & Demand

## Phase 7: Supporting Services
- [x] 7.1: Create Warehouse API
- [x] 7.2: Create Warehouse Hooks
- [x] 7.3: Create Supplier API
- [x] 7.4: Create Supplier Hooks
- [x] 7.5: Update Reducer for Supporting Services

## Phase 8: Integration & Verification
- [x] 8.1: Update Store Persistence Blacklist
- [x] 8.2: TypeScript Compilation Verification
- [ ] 8.3: Endpoint Coverage Audit

---

## Progress Log

| Date | Task | Outcome |
|------|------|---------|
| 2026-06-05 | Init | Created todo-list.md |
| 2026-06-05 | Phase 4 & 5a | Rebuilt Inventory, Purchase, and Supplier APIs |
| 2026-06-05 | Phase 6 | Rebuilt Production and Demand APIs |
| 2026-06-05 | Phase 7 | Rebuilt Warehouse and Supplier APIs |
| 2026-06-05 | Phase 8 | Updated store blacklist and performed TS verification |
