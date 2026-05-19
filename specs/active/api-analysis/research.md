# Research: API Action and Condition Breakdown in Franchisor Web Client

**Task ID:** api-analysis
**Date:** 2026-05-18
**Status:** Complete

---

## Executive Summary

Analisis ini menyajikan pemetaan komprehensif untuk seluruh pemanggilan API (*store dispatch*) beserta kondisi operasional (*state/condition*) yang mengaturnya pada aplikasi web client Franchisor (`D:\Enigma\suka-bread\clients\web\franchisor`). Pengendalian alur eksekusi berdasarkan status/kondisi ini sangat krusial untuk menjaga integritas data sebelum menyentuh *backend* dan mencegah terjadinya *race conditions*.

Analisis difokuskan langsung pada *use case* di dalam layar (*screen*) yang memicu aksi tersebut beserta kondisinya, dengan mengabaikan otentikasi, penanganan kesalahan, atau format parameter kueri.

---

## Codebase Analysis

Berikut adalah rincian aksi pemanggilan API dan kondisi yang memicunya di masing-masing modul layar:

### 1. Modul Purchase Order (PO)

#### Screen: Detail Purchase Order (`/purchase/order/detail.vue`)

*   **Aksi: Publish Document (`PurchaseOrder/Approve`)**
    *   **Kondisi:** Hanya dapat dieksekusi jika status dokumen saat ini adalah pending:
        ```javascript
        doPublished() {
          return this.purchaseOrder.document_status === 'pending';
        }
        ```
*   **Aksi: Update Document (Navigasi / Edit ke `/purchase/order/:id/update`)**
    *   **Kondisi:** Hanya diperbolehkan jika status dokumen saat ini adalah pending:
        ```javascript
        doUpdated() {
          return this.purchaseOrder.document_status === 'pending';
        }
        ```
*   **Aksi: Delete Document (`PurchaseOrder/Delete`)**
    *   **Kondisi:** Hanya dapat dieksekusi jika status dokumen saat ini adalah pending (menggunakan kondisi `doPublished` pada UI):
        ```javascript
        doPublished() {
          return this.purchaseOrder.document_status === 'pending';
        }
        ```
*   **Aksi: Make Payment (`PurchaseOrder/Payment`)**
    *   **Kondisi:** Hanya dapat dipanggil jika dokumen sudah di-publish (bukan pending) DAN status pembayaran belum lunas (`void`):
        ```javascript
        doPayment() {
          return this.purchaseOrder.document_status !== 'pending' && this.purchaseOrder.payment_status === 'void';
        }
        ```

#### Screen: Create & Update Purchase Order (`/purchase/order/create.vue` & `update.vue`)

*   **Aksi: Submit Form (`PurchaseOrder/Create` & `PurchaseOrder/Update`)**
    *   **Kondisi:** Dieksekusi saat form disubmit (`onSubmit`). Baris item PO harus valid (memiliki `item_id`, `fraction_id`, dan `quantity > 0`).

---

### 2. Modul Sales Order (SO)

#### Screen: Detail Sales Order (`/sales/order/detail.vue` / `/sales/detail.vue`)

*   **Aksi: Publish Document (`Order/Publish`)**
    *   **Kondisi:** Hanya dapat dieksekusi jika status order saat ini adalah pending DAN tipe penjualannya reguler (`default`):
        ```javascript
        doPublished() {
          return this.salesOrder.order_status === 'pending' && this.salesOrder.type == 'default';
        }
        ```
*   **Aksi: Delete Document (`Order/Delete`)**
    *   **Kondisi:** Hanya dapat dieksekusi jika status order saat ini adalah pending DAN tipe penjualannya reguler (menggunakan kondisi `doPublished` pada UI):
        ```javascript
        doPublished() {
          return this.salesOrder.order_status === 'pending' && this.salesOrder.type == 'default';
        }
        ```
*   **Aksi: Update Document (Navigasi / Edit ke `/sales/order/:id/update`)**
    *   **Kondisi:** Hanya diperbolehkan jika status order saat ini adalah pending DAN tipe penjualannya reguler (menggunakan kondisi `doPublished` pada UI).
*   **Aksi: Make Payment / Terima Pembayaran (`Order/Paid`)**
    *   **Kondisi:** Pembayaran dapat diterima jika status pembayaran saat ini belum dibayar (`void`) DAN memenuhi salah satu dari dua kondisi status order berikut:
        1.  Order berstatus aktif (`active`) dengan tipe penjualan reguler (`default`).
        2.  Order berasal dari outlet (`outlet`) baik statusnya masih `pending` maupun sudah `void`.
        ```javascript
        doPayment() {
          return (
            ((this.salesOrder.order_status === 'active' && this.salesOrder.type == 'default') ||
              ((this.salesOrder.order_status === 'pending' || this.salesOrder.order_status == 'void') &&
                this.salesOrder.type == 'outlet')) &&
            this.salesOrder.payment_status === 'void'
          );
        }
        ```

#### Screen: Create & Update Sales Order (`/sales/create.vue` & `update.vue`)

*   **Aksi: Submit Form (`Order/Create` & `Order/Update`)**
    *   **Kondisi:** Dieksekusi saat form disubmit (`onSubmit`). Baris item harus memiliki `catalog_id` dan `quantity > 0`.

---

### 3. Modul Master Data & Setting

#### Screen: Master Catalog (`/setting/inventory/catalog/index.vue`)

*   **Aksi: Toggle Status Aktif Katalog (`Catalog/Deactivate` & `Catalog/Activate`)**
    *   **Kondisi:** Dipanggil saat status switch diubah di dalam tabel. Memanggil `Catalog/Deactivate` jika nilai baru adalah `0` (tidak aktif), dan memanggil `Catalog/Activate` jika nilai baru adalah `1` (aktif):
        ```javascript
        statusToggle({ id, value }) {
          if (value === 0) {
            this.$store.dispatch('Catalog/Deactivate', id);
          } else {
            this.$store.dispatch('Catalog/Activate', id);
          }
        }
        ```
*   **Aksi: Update Tipe Outlet pada Katalog (`Catalog/Outlet` di sub-komponen `outlet.vue`)**
    *   **Kondisi:** Dipanggil saat tombol simpan ditekan. Hanya mengirimkan data tipe outlet yang dipilih (`is_selected: true`).

#### Screen: Master Item Inventory (`/setting/inventory/item/index.vue`)

*   **Aksi: Toggle Status Aktif Item (`Item/Deactivate` & `Item/Activate`)**
    *   **Kondisi:** Dipanggil saat switch diubah di dalam tabel. Memanggil `Item/Deactivate` jika dinonaktifkan (`value === 0`), dan `Item/Activate` jika diaktifkan.

#### Screen: POS Catalog (`/setting/pos/catalog/index.vue`)

*   **Aksi: Toggle Status Aktif POS Catalog (`POSCatalog/Deactivate` & `POSCatalog/Activate`)**
    *   **Kondisi:** Dipanggil saat switch diubah di dalam tabel. Memanggil `POSCatalog/Deactivate` jika dinonaktifkan (`value === 0`), dan `POSCatalog/Activate` jika diaktifkan.

#### Screen: User Management (`/setting/user/index.vue`)

*   **Aksi: Toggle Status Aktif User (`User/Deactivate` & `User/Activate`)**
    *   **Kondisi:** Hanya ditampilkan/dapat dieksekusi secara interaktif jika user yang dituju memiliki User Group ID 1 (misalnya Administrator/Franchisor Admin):
        ```html
        <template slot="is_active" slot-scope="item">
          <template v-if="item.data.usergroup.id === 1">
            <v-table-status-toggle :data="item.data" @toggle="statusToggle" v-model="item.data.is_active" />
          </template>
          <template v-else>
            <i class="icon ion-ios-checkmark tx-32 lh-1 tx-success" v-if="item.data.is_active" /> <span v-else>-</span>
          </template>
        </template>
        ```

---

### 4. Modul Dashboard & Laporan

#### Screen: Dashboard (`/dashboard/index.vue`)

*   **Aksi: Fetch Dashboard Data (`Dashboard/Graph`, `Dashboard/Sales`, `Dashboard/Item`, `Dashboard/Commission`, `Report/GetSaldoSummary`)**
    *   **Kondisi:** Dimuat otomatis saat layar diakses, dan akan dijalankan ulang (*refetched*) secara otomatis setiap kali filter periode (`periode`) diubah oleh pengguna.

#### Screen: POS Settlement (`/report/pos/settelment.vue` & `settelment_daily.vue`)

*   **Aksi: Fetch Settlement (`Report/GetSettlment`)**
    *   **Kondisi:** Dimuat otomatis saat filter pencarian, filter tanggal, atau filter outlet diubah oleh pengguna.

---

## Technical Recommendations

1.  **State-driven UI (Skeletal Control Flow):** Kebergantungan fungsionalitas UI pada status operasional dokumen (`document_status`, `order_status`, `payment_status`) wajib dipertahankan. Ini adalah proteksi lini pertama agar pengguna tidak melakukan tindakan ilegal seperti mengubah transaksi yang sudah diselesaikan atau membatalkan dokumen yang sudah dibayar.
2.  **Back-office Control Integration:** Logika batasan status di atas juga harus diselaraskan secara sinkron pada *backend service* API (Golang) untuk mencegah bypass langsung via API request client-side.

---

*Research completed with SDD 2.0*
