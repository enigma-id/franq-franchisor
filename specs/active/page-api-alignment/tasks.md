# Implementation Tasks: Page-API Alignment

**Task ID:** page-api-alignment
**Created:** 2026-06-06
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 22 |
| Estimated Effort | 14 Hari Kerja |
| Phases | 5 |

## Phase 1: Core Operations (Production & Demand)

**Goal:** Implementasikan modul operasional baru.

### Task 1.1: Setup Production Plan Pages
**Description:** Implementasi halaman list, create, dan detail untuk Production Plan.
**Acceptance Criteria:**
- [ ] Halaman list menampilkan data dari `/production/plan`.
- [ ] Form create mengirim payload yang benar.
**Effort:** 6 jam
**Priority:** High

### Task 1.2: Production Item Management
**Description:** Tambahkan fitur update item dan complete item pada Production Plan.
**Acceptance Criteria:**
- [ ] Tombol update qty item berfungsi.
- [ ] Tombol 'Complete' item berfungsi.
**Effort:** 4 jam
**Priority:** High

### Task 1.3: Production Demand Page
**Description:** Implementasi halaman demand berdasarkan tanggal dan outlet.
**Acceptance Criteria:**
- [ ] Halaman menampilkan kebutuhan barang dari `/demand/production`.
**Effort:** 4 jam
**Priority:** High

---

## Phase 2: Supply Chain Rebuild

**Goal:** Rebuild modul purchase dan update inventory.

### Task 2.1: Rebuild Purchase Order Form
**Description:** Update form PO dengan payload yang aligned (catalog_id, string supplier_id, dll).
**Acceptance Criteria:**
- [ ] Payload sesuai dengan `PurchaseOrderRequest`.
- [ ] Fix mismatch fields.
**Effort:** 8 jam
**Priority:** High

### Task 2.2: Rebuild PO List/Detail Pages
**Description:** Update halaman list dan detail PO.
**Acceptance Criteria:**
- [ ] Data tersinkron dengan API baru.
**Effort:** 4 jam
**Priority:** Medium

### Task 2.3: Rebuild/Update Supplier Pages
**Description:** Pindahkan Supplier ke Supply Chain, update CRUD.
**Acceptance Criteria:**
- [ ] Supplier module di Supply Chain.
**Effort:** 4 jam
**Priority:** Medium

### Task 2.4: Update Inventory Item & Catalog
**Description:** Update payload form inventory.
**Acceptance Criteria:**
- [ ] Tambahkan field baru: packaging, size, batch tracking, dll.
**Effort:** 6 jam
**Priority:** High

---

## Phase 3: Sales & Returns

**Goal:** Alignment Sales Order dan fitur retur.

### Task 3.1: Update Sales Order Form
**Description:** Tambahkan field payment_method_id dan pos_channel_id.
**Acceptance Criteria:**
- [ ] Payload Sales Order sukses terkirim.
**Effort:** 4 jam
**Priority:** High

### Task 3.2: Sales Return Pages
**Description:** Implementasi list dan detail retur.
**Acceptance Criteria:**
- [ ] List retur tampil.
- [ ] Approve retur berfungsi.
**Effort:** 6 jam
**Priority:** High

---

## Phase 4: POS & Settings

**Goal:** Implementasi fitur POS baru.

### Task 4.1: Update POS Menu/Category/Channel
**Description:** Update payload dengan channel prices dan ingredients.
**Acceptance Criteria:**
- [ ] POS Menu form menyimpan BOM/Ingredients.
**Effort:** 8 jam
**Priority:** Medium

### Task 4.2: Create Payment Method Pages
**Description:** Implementasi CRUD Payment Method.
**Acceptance Criteria:**
- [ ] Payment method dapat diaktifkan/dinonaktifkan.
**Effort:** 4 jam
**Priority:** Medium

### Task 4.3: Create Topup Bonus Pages
**Description:** Implementasi CRUD Topup Bonus.
**Acceptance Criteria:**
- [ ] Topup bonus dapat diaktifkan/dinonaktifkan.
**Effort:** 4 jam
**Priority:** Medium

---

## Phase 5: Testing & Verification

**Goal:** Verifikasi akhir seluruh sistem.

### Task 5.1: E2E Testing
**Description:** Tes alur transaksi dari PO ke Sales.
**Acceptance Criteria:**
- [ ] Tidak ada payload mismatch di log.
**Effort:** 8 jam
**Priority:** High

### Task 5.2: Type Coverage Fix
**Description:** Hapus 'any' di folder `src/pages`.
**Acceptance Criteria:**
- [ ] Linting pass (0 any).
**Effort:** 4 jam
**Priority:** Medium

---

## Quick Reference Checklist

- [ ] Task 1.1: Production Plan Pages
- [ ] Task 1.2: Production Item Management
- [ ] Task 1.3: Production Demand Page
- [ ] Task 2.1: Rebuild Purchase Order Form
- [ ] Task 2.2: Rebuild PO List/Detail
- [ ] Task 2.3: Rebuild Supplier
- [ ] Task 2.4: Update Inventory
- [ ] Task 3.1: Update Sales Order
- [ ] Task 3.2: Sales Return
- [ ] Task 4.1: Update POS Menu
- [ ] Task 4.2: Payment Method
- [ ] Task 4.3: Topup Bonus
- [ ] Task 5.1: E2E Testing
- [ ] Task 5.2: Type Coverage Fix

## Next Steps

1. Review task breakdown
2. Run `/implement page-api-alignment` untuk mulai eksekusi

---

*Tasks created with SDD 4.0*