# Halaman Menu pindah ke endpoint aggregate `/inventory/product` — Franchisor (FE)

**Date:** 2026-09-10
**Status:** Implemented
**Repo:** `franq-franchisor` (frontend)
**Backend referensi:** `~/Workspaces/franq` → `docs/feature/inventory-product-aggregate-crud.md`

---

## Problem

Pengelolaan produk di FE masih berlapis tiga: **Item → Catalog → Menu** (tiga CRUD, tiga permission,
tiga halaman berurutan). Backend franchisor sudah menyediakan satu resource agregat
**`product`** (`/inventory/product`) yang mengorkestrasi `item → catalog → menu` dalam **satu
transaksi** dan **satu event** (`franchisor:product.*`), dengan **payload ramping** — field teknis
(item, catalog, fraction, ingredient) di-derive backend.

Halaman POS Menu (`/setting/pos/menu`) masih memakai endpoint lama `/pos/menu` dengan payload
lama (`ingredients`, `channel_prices`) sehingga:

1. FE mengirim `ingredients` (multi-bahan) padahal model aggregate memaksa **1:1** (`item` :
   `catalog` non-bundle) dan **tepat satu** `menu_ingredient`.
2. FE mengisi field teknis yang sebenarnya ditentukan backend.
3. Menu yang dibuat lewat halaman ini **tidak** mengikuti jalur aggregate → event per-entitas,
   bukan event `franchisor:product.*`.

---

## Keputusan (hasil klarifikasi)

| # | Keputusan |
|---|-----------|
| 1 | Halaman **POS Menu** (`/setting/pos/menu`: list, create, update, detail) pindah ke `/inventory/product`. |
| 2 | **Tab Menu di detail Franchise** ikut pindah (memakai table config & halaman yang sama). |
| 3 | **Form B2B order tidak dipindah** — tetap pakai `/pos/menu` (dropdown `getMenus` + `getPrices`). `/pos/menu/price` tidak punya padanan di aggregate. |
| 4 | **Route halaman tetap** `/setting/pos/menu` (URL & sidebar tidak berubah). |
| 5 | **Service FE baru** `src/services/product/` (api + hooks + types). |
| 6 | **Action slug baru** `ACTION.product = "svc-franchisor.product.manage"` (mengikuti permission baru backend). |
| 7 | **Endpoint mati dihapus** (lihat [§7](#7-penghapusan-endpoint-mati)): 7 endpoint menu + 5 endpoint tulis POS Channel + `assignOutlet` (catalog) + `updateChannel` (outlet). Service `/pos/*` tetap ada karena masih dipakai menu read, category & price. |
| 8 | **Form memakai payload ramping**: `name, category_id, image, is_vatable, is_additional, base_price, unit_price, production_price, channel_prices[], addon_groups[]`. |
| 9 | **Section Bahan Baku (ingredients) dihapus** dari form — diganti input `unit_price` & `production_price`. Item/catalog/resep di-derive backend. |
| 10 | Field harga baru ditaruh di **card terpisah "Harga Produk"**, berisi Harga Dasar (`base_price`), Harga Beli Outlet (`unit_price`), Harga Produksi (`production_price`). |
| 11 | Input **Harga Produksi kondisional**: auto dari channel saat channel aktif = 1 (input disembunyikan), tampil + wajib saat channel aktif > 1. |
| 12 | Halaman **detail**: section Ingredients **dihapus** dan **tidak** diganti info Item & Catalog. Harga **Harga Dasar, Harga Beli Outlet (`catalog.unit_price`), dan Harga Produksi (`catalog.production_price`)** ditampilkan **sejajar** di kartu informasi (satu baris 3 kolom). Baris Vatable/Additional/Custom pindah ke baris terpisah di bawahnya. Untuk addon (catalog `null`) kedua harga tampil `-`. |
| 13 | `is_additional` **tidak bisa diubah saat update** (dikunci backend) → checkbox di-disable pada mode edit. |
| 14 | **Dropdown add-on di form menu tetap di `/pos/menu`** (`addons: "yes"`) — tidak ikut pindah. Endpoint lama tidak diubah. |
| 15 | `production_price` & `unit_price` **wajib > 0** untuk non-addon; addon mengabaikan `unit_price` & `production_price`. |
| 16 | **Harga Dasar dibaca dari `item.base_price`**, bukan `menu.base_price`. Backend memetakan `base_price` → `item.base_price` (cost item / source of truth), sementara `menu.base_price` non-addon diturunkan dari ingredient = `catalog.unit_price`. Fallback ke `menu.base_price` hanya untuk addon (item `null`). |
| 17 | **Kolom list di-relabel** dari "Harga Dasar" → **"Harga Beli Outlet"**, karena response list hanya berisi `menu` (tidak ada `item`), sehingga `menu.base_price` di sana nilainya = `catalog.unit_price`. |
| 18 | **Kolom list "Harga Jual"** ditambahkan, sumber **`menu.channel_prices[].price`** (+ `pos_channel.name`). Maks **2 channel** tampil langsung di sel; bila lebih, muncul penanda `+N channel` dengan **tooltip** berisi daftar lengkap semua channel. Tanpa harga → `-`. Tidak sortable (relasi, backend tidak menyediakan sorting-nya). |

---

## Kontrak backend (yang jadi acuan FE)

Direktori handler: `backend/franchisor/src/handler/rest/inventory/product/`.

| Method | Path | Guard |
|---|---|---|
| GET | `/inventory/product` | `Restricted()` |
| GET | `/inventory/product/{id}` | `Restricted()` |
| POST | `/inventory/product` | `Restricted("svc-franchisor.product.manage")` |
| PUT | `/inventory/product/{id}` | `Restricted("svc-franchisor.product.manage")` |
| DELETE | `/inventory/product/{id}` | `Restricted("svc-franchisor.product.manage")` |
| PUT | `/inventory/product/{id}/activate` | `Restricted("svc-franchisor.product.manage")` |
| PUT | `/inventory/product/{id}/deactivate` | `Restricted("svc-franchisor.product.manage")` |

`{id}` = **`menu.id`** (identitas produk).

**Payload create/update:**

```json
{
  "franchisor_id": "uuid (create superuser, opsional)",
  "name": "",
  "category_id": "uuid",
  "image": "",
  "is_vatable": false,
  "is_additional": false,
  "base_price": 0,
  "unit_price": 0,
  "production_price": 0,
  "channel_prices": [{ "pos_channel_id": "uuid", "price": 0 }],
  "addon_groups": [{ "name": "", "type": "options", "items": [{ "addon_menu_id": "uuid" }] }]
}
```

**Response:**

- **GET list** → array **menu** saja (+ `category`, meta pagination).
  Filter: `franchisor_id`, `category_id`, `is_active`, `is_additional`, search, pagination, `order_by`.
- **GET detail / POST / PUT** → `{ "item": {...}|null, "catalog": {...}|null, "menu": {...} }`
  (`item` & `catalog` bernilai `null` untuk produk addon).

**Aturan validasi penting:**

- `channel_prices` wajib non-empty; tiap `pos_channel_id` harus ada & unik.
- Non-addon: `unit_price > 0` wajib; `production_price > 0` wajib **hanya bila** `channel_prices > 1`
  (bila tepat 1 channel → `production_price` di-override otomatis dari harga channel itu).
- Addon: `unit_price` & `production_price` diabaikan.
- Update: `is_additional` tidak boleh berubah dari nilai existing.
- Delete: ditolak bila catalog dipakai menu lain, item dipakai BOM/bundle, atau menu dipakai
  sebagai addon menu lain.

---

## Perubahan per Area

### 1. Service layer baru

`src/services/product/api.tsx` — `createApi` dengan `reducerPath: "productApi"`,
`tagTypes: ["Product"]`, endpoint: `getProducts`, `getProduct`, `createProduct`, `updateProduct`,
`deleteProduct`, `activateProduct`, `deactivateProduct` (semua ke `/inventory/product`).

`src/services/product/hooks.tsx` — `useProduct = createCrudHook<ProductDetail>({ entityName: "product", ... })`
dengan `customOperations.activate/deactivate`. **Tanpa** `additionalQueries.getPrices`
(endpoint harga tidak ada di aggregate).

`src/services/types/product.ts` — tipe request/response aggregate:

```ts
interface ProductChannelPriceRequest { pos_channel_id: string; price: number }
interface ProductAddonItemRequest { addon_menu_id: string }
interface ProductAddonGroupRequest { name: string; type: "options" | "checkbox" | "quantity"; items: ProductAddonItemRequest[] }
interface ProductWriteRequest {
  name: string; category_id: string; image?: string;
  is_vatable: boolean; is_additional: boolean;
  base_price: number; unit_price: number; production_price: number;
  channel_prices: ProductChannelPriceRequest[];
  addon_groups?: ProductAddonGroupRequest[];
}
interface ProductCreateRequest extends ProductWriteRequest { franchisor_id?: string }
type ProductUpdateRequest = ProductWriteRequest;
interface ProductDetail {
  item: InventoryItemDetail | null;
  catalog: InventoryCatalogDetail | null;
  menu: POSMenuDetail;
}
```

### 2. Permission

`src/utils/permissions.ts` — tambah `ACTION.product: "svc-franchisor.product.manage"`.
`MENU.posMenu` **tetap** dipakai untuk route guard (URL tidak berubah).

### 3. Halaman POS Menu

- `index.tsx` — ganti `usePOSMenu` → `useProduct`; navigate tetap ke `/setting/pos/menu/...`.
- `table/menu.config.tsx` — `url` berubah `/pos/menu` → `/inventory/product`;
  judul kolom `base_price` di-relabel **"Harga Dasar" → "Harga Beli Outlet"** (keputusan #17);
  kolom baru **"Harga Jual"** dari `channel_prices` + tooltip (keputusan #18).
  Field lain tidak berubah (`code`, `name`, `category`, `is_additional`, `is_active`).
- `create.tsx` / `update.tsx` — ganti hook ke `useProduct`; update membaca:
  `base_price` dari **`data.data.item.base_price`** (keputusan #16),
  `unit_price`/`production_price` dari `data.data.catalog`; tetap meneruskan
  `?franchisor_id=&back=`.
- `detail.tsx` — baca `data.data.menu` (+ `data.data.item` untuk Harga Dasar,
  `data.data.catalog` untuk Harga Beli Outlet & Harga Produksi); section Ingredients
  dihapus (tanpa pengganti info Item & Catalog); tiga harga disejajarkan dalam satu baris.
- `components/menuForm.tsx` — payload ramping; hapus section Bahan Baku + hook
  `useInventoryCatalog`; tambah card **Harga Produk**; `production_price` kondisional;
  `is_additional` di-disable saat edit. **Dropdown add-on tetap** memakai `usePOSMenu`
  (`addons: "yes"`, `is_active: true`).

### 4. Tab Menu Franchise

`src/pages/franchise/components/FranchiseMenuTab.tsx` — ganti `usePOSMenu` → `useProduct`.
Table config (dengan `url: "/inventory/product"`) sudah dipakai bersama, jadi otomatis ikut.

### 5. Yang TIDAK berubah

- `src/services/pos/api.tsx` & `hooks.tsx` — **tetap ada**, tapi dipangkas ke yang masih dipakai UI
  (`getMenus`, `getMenuPrices`, category CRUD). Endpoint mati dihapus — lihat [§7](#7-penghapusan-endpoint-mati).
- **Dropdown add-on di form menu** — tetap `usePOSMenu.get` → `GET /pos/menu?addons=yes&is_active=true`
  (kandidat identik dengan `is_additional=true` di aggregate; sengaja tidak dipindah).
- `src/pages/b2b/order/components/b2bOrderForm.tsx` — tetap `usePOSMenu` (`getMenus`, `getPrices`).
- Route `/setting/pos/menu` + `MENU.posMenu` guard.
- Halaman `setting/pos/category` & `setting/pos/payment`.

### 6. Konsumen `/pos/menu` yang tersisa (setelah migrasi)

Ditelusuri di seluruh repo (`src/**`). Setelah halaman menu pindah, `/pos/menu` **masih** dipakai:

| Lokasi | Endpoint | Dipakai untuk | Status |
|---|---|---|---|
| `pages/setting/pos/menu/components/menuForm.tsx:80,696` | `GET /pos/menu?addons=yes&is_active=true` | Dropdown pilih add-on | **Tetap** (keputusan #14) |
| `pages/b2b/order/components/b2bOrderForm.tsx:55,488` | `GET /pos/menu?addons=no&is_already_order=true&is_active=true` | Pilih menu di order B2B | **Tetap** |
| `pages/b2b/order/components/b2bOrderForm.tsx:212` | `GET /pos/menu/price` | Harga menu per channel | **Tetap** (tidak ada di aggregate) |
| — | `PUT /pos/menu/{id}/types` | — | **Dihapus** ([§7](#7-penghapusan-endpoint-mati)) |

**Service yang tidak bisa dihapus:** `src/services/pos/*` (`posApi` di `services/reducer.tsx` &
`services/store.tsx`) juga menampung endpoint **POS Category** (dipakai penuh) & **POS Channel**
(read-only), yang masih dipakai 5 tempat:

| Hook | Konsumen | Status |
|---|---|---|
| `usePOSCategory` | `FranchiseCategoryTab.tsx`, `setting/pos/category/index.tsx`, `inventory/item/components/itemForm.tsx` → `/pos/category` | Dipakai penuh (CRUD + toggle) |
| `usePOSChannel` | `b2bOrderForm.tsx`, `menuForm.tsx` → `/pos/channel` | **Hanya `.get`** — endpoint tulisnya dihapus |

> Artinya `src/services/pos/` tetap hidup karena menu read + category + channel read. Kalau nanti
> `/pos/menu` mau di-deprecate total, yang tersisa cuma **`getMenus`** & **`getPrices`**
> (dropdown add-on + form B2B).

**Non-runtime** (hanya dokumentasi/spec, tidak perlu diubah): `docs/Franchisor.postman_collection.json`,
`specs/api-contract.md`, `specs/completed/new-api-service/*`, `specs/active/**`, `docs/RBAC.md`.

### 7. Penghapusan endpoint mati

Audit seluruh `src/**` (level definisi maupun level pemakaian UI). Yang **tidak punya pemanggil**
dihapus — 14 endpoint. Dihapus **setelah** halaman menu selesai pindah (kalau tidak, build pecah).

**(a) `src/services/pos/api.tsx` — 12 endpoint**

| Endpoint | Alasan |
|---|---|
| `getMenu` (`GET /pos/menu/{id}`) | Detail menu pindah ke `useProduct.show` |
| `createMenu` (`POST /pos/menu`) | Create pindah ke `useProduct.create` |
| `updateMenu` (`PUT /pos/menu/{id}`) | Update pindah ke `useProduct.update` |
| `deleteMenu` (`DELETE /pos/menu/{id}`) | Delete pindah ke `useProduct.remove` |
| `activateMenu` (`PUT /pos/menu/{id}/activate`) | Toggle pindah ke `useProduct.activate` |
| `deactivateMenu` (`PUT /pos/menu/{id}/deactivate`) | Toggle pindah ke `useProduct.deactivate` |
| `updateMenuTypes` (`PUT /pos/menu/{id}/types`) | Tidak ada pemanggil sama sekali |
| `createChannel` (`POST /pos/channel`) | `usePOSChannel` hanya dipakai `.get` |
| `updateChannel` (`PUT /pos/channel/{id}`) | idem |
| `deleteChannel` (`DELETE /pos/channel/{id}`) | idem |
| `activateChannel` (`PUT /pos/channel/{id}/activate`) | idem |
| `deactivateChannel` (`PUT /pos/channel/{id}/deactivate`) | idem |

**Sisa di `posApi` (dipakai):** `getMenus`, `getMenuPrices`, `getCategories`, `createCategory`,
`updateCategory`, `deleteCategory`, `activateCategory`, `deactivateCategory`.
Export `useLazyGetMenuQuery`, `useCreateMenuMutation`, dst. ikut dihapus.

**(b) `src/services/pos/hooks.tsx`**

- `usePOSMenu` → sisakan `useLazyGetQuery` (`getMenus`) + `additionalQueries.getPrices`.
  Buang `useLazyShowQuery`, create/update/remove, `customOperations` (activate, deactivate, updateTypes).
- `usePOSChannel` → sisakan `useLazyGetQuery` saja; buang 5 mutation + `customOperations`.
- `usePOSCategory` → **tidak berubah**.

**(c) `src/services/inventory/*` — 1 endpoint**

- `api.tsx`: hapus `updateOutletCatalog` (`PUT /inventory/catalog/{id}/types`) + export
  `useUpdateOutletCatalogMutation`.
- `hooks.tsx`: hapus `assignOutlet` dari `useInventoryCatalog`.

**(d) `src/services/outlet/*` — 1 endpoint**

- `api.tsx`: hapus `updateChannelOutlet` (`PUT /outlet/{id}/channels`) + export
  `useUpdateChannelOutletMutation`.
- `hooks.tsx`: hapus `updateChannel` dari `useOutlet` (+ import-nya).

**(e) `src/services/types/pos.ts` — tipe mati**

Dihapus karena tidak ada konsumen lagi setelah (a):

- `POSMenuCreateRequest`, `POSMenuUpdateRequest`, `POSMenuTypesUpdateRequest`
- `POSChannelPriceRequest`, `POSIngredientRequest`, `POSAddonItemRequest`, `POSAddonGroupRequest`
  (hanya dipakai `POSMenuCreateRequest`) — `product.ts` punya tipe request sendiri.
- `POSChannelCreateRequest`, `POSChannelUpdateRequest`

**Tetap dipakai:** `POSMenuDetail` (+ `POSMenuBase`, `POSIngredient`, `POSChannelPrice`,
`POSAddonItem`, `POSAddonGroup`), `POSCategoryDetail`, `POSChannelDetail`, tipe payment & topup-bonus.

**Di luar audit ini** (belum dipastikan, jangan dihapus): additionalQueries report non-summary
(`productSales`, `rawMaterial`, `warehouseStock`, `productItem`, `cancelledProductSales`, `saldoLog`).
Halaman report hanya memakai versi `*Summary`; tabelnya load lewat `useTable` + `url`, jadi
kandidat mati — perlu verifikasi satu-satu sebelum dihapus.

---

## File yang Berubah / Dibuat / Dihapus

**Dibuat**

| File | Isi |
|---|---|
| `src/services/product/api.tsx` | RTK Query endpoints `/inventory/product` |
| `src/services/product/hooks.tsx` | `useProduct` (createCrudHook) |
| `src/services/types/product.ts` | Tipe payload & response aggregate |
| `docs/feature/menu-page-inventory-product-endpoint.md` | Dokumen ini |

**Diubah**

| File | Perubahan |
|---|---|
| `src/services/types/index.ts` | export `./product` |
| `src/utils/permissions.ts` | `ACTION.product` |
| `src/pages/setting/pos/menu/index.tsx` | `useProduct`, filter `franchisor_id` |
| `src/pages/setting/pos/menu/table/menu.config.tsx` | `url` → `/inventory/product`; kolom `base_price` di-relabel "Harga Beli Outlet"; kolom baru "Harga Jual" (channel_prices + tooltip) |
| `src/pages/setting/pos/menu/menuCreate.tsx` | `useProduct`, `ACTION.product` |
| `src/pages/setting/pos/menu/menuUpdate.tsx` | `useProduct`, `base_price` ← `item.base_price`, `unit_price`/`production_price` ← `catalog`, `ACTION.product` |
| `src/pages/setting/pos/menu/menuDetail.tsx` | baca `menu`/`item`/`catalog`; hapus section Ingredients; tiga harga disejajarkan (Harga Dasar ← `item.base_price`) |
| `src/pages/setting/pos/menu/components/menuForm.tsx` | payload ramping, card Harga Produk, hapus Bahan Baku (dropdown add-on tetap `/pos/menu`) |
| `src/pages/franchise/components/FranchiseMenuTab.tsx` | `useProduct` |
| `src/services/pos/api.tsx` | hapus 12 endpoint mati ([§7a](#7-penghapusan-endpoint-mati)) |
| `src/services/pos/hooks.tsx` | `usePOSMenu` & `usePOSChannel` dipangkas ([§7b](#7-penghapusan-endpoint-mati)) |
| `src/services/inventory/api.tsx` | hapus `updateOutletCatalog` |
| `src/services/inventory/hooks.tsx` | hapus `assignOutlet` |
| `src/services/outlet/api.tsx` | hapus `updateChannelOutlet` |
| `src/services/outlet/hooks.tsx` | hapus `updateChannel` |
| `src/services/types/pos.ts` | hapus tipe request yang jadi mati ([§7e](#7-penghapusan-endpoint-mati)) |

**Dihapus:** tidak ada **file** yang dihapus — hanya endpoint/tipe di dalam file di atas.
`src/services/pos/*` tetap ada (masih dipakai menu read, category, channel read).

---

## Verifikasi

1. `npm run lint`, `npm run build` (typecheck) hijau.
2. **List** (`/setting/pos/menu`): baris menu tampil; search/filter/pagination jalan; kolom
   Kode, Nama, Kategori, **Harga Beli Outlet**, **Harga Jual**, Add-on, Status terisi.
2b. **Kolom Harga Jual**: menu dengan **1 channel** → satu baris (nama channel + harga);
   **2 channel** → dua baris tanpa tooltip; **>2 channel** → dua baris + `+N channel`, dan hover
   pada penanda itu menampilkan tooltip berisi **semua** channel beserta harganya;
   **tanpa channel price** → `-`.
3. **Create non-addon**: isi Harga Dasar + Harga Beli Outlet + channel; submit → sukses;
   detail menampilkan tiga harga sejajar (Harga Dasar, Harga Beli Outlet, Harga Produksi).
   `production_price` auto saat channel aktif = 1.
4. **Create non-addon, channel aktif > 1**: input Harga Produksi muncul & wajib; submit tanpa
   mengisinya → error validasi.
5. **Create addon** (`is_additional = true`): field Harga Beli Outlet & Harga Produksi
   disembunyikan/diabaikan; section add-on & Bahan Baku tidak muncul; submit → sukses;
   detail menampilkan Harga Dasar saja, Harga Beli Outlet & Harga Produksi `-`.
6. **Update**: `is_additional` tidak bisa diubah; ubah harga → tersimpan; error backend
   ("catalog is used by another menu", "menu is used as an addon by another menu") tampil sebagai
   toast/validasi form.
6b. **Update tidak merusak cost item** — buka Edit sebuah produk non-addon di mana
   `base_price ≠ unit_price`: field Harga Dasar harus menampilkan **`item.base_price`** (bukan
   `unit_price`). Simpan tanpa mengubah harga → cek `GET /inventory/product/{id}`: `item.base_price`
   **tidak berubah**.
7. **Toggle status**: activate/deactivate dari list & tab Franchise → status berubah, toast muncul,
   tabel refresh.
8. **Regresi B2B order**: form B2B masih bisa pilih menu & harga channel terisi
   (`/pos/menu` + `/pos/menu/price` tetap jalan).
9. **Regresi dropdown add-on**: di form menu, opsi add-on tetap termuat dari
   `GET /pos/menu?addons=yes&is_active=true` dan hanya menampilkan menu `is_additional = true`.
10. **Regresi tab Franchise**: list menu brand terfilter `franchisor_id`; create/edit kembali ke
    detail franchise (`?back=`).
11. **Setelah penghapusan endpoint**: `npm run build` hijau (bukti tidak ada import yang
    menggantung); grep `useLazyGetMenuQuery|useCreateMenuMutation|useUpdateMenuMutation|
    useDeleteMenuMutation|useActivateMenuMutation|useDeactivateMenuMutation|
    useUpdateMenuTypesMutation|useCreateChannelMutation|useUpdateChannelMutation|
    useDeleteChannelMutation|useActivateChannelMutation|useDeactivateChannelMutation|
    useUpdateOutletCatalogMutation|useUpdateChannelOutletMutation` → **nol hasil**.
12. **Regresi halaman category**: `setting/pos/category` masih CRUD + toggle (pakai `usePOSCategory`
    yang tidak dipangkas).

### Hasil verifikasi otomatis (2026-09-10)

| Cek | Hasil |
|---|---|
| `npx eslint` pada semua file yang diubah | **0 error**, 9 warning (semuanya `react-hooks/exhaustive-deps` — pola lama yang sudah ada di file tersebut) |
| `npx tsc -b` (clean, tsbuildinfo dihapus) | **Tidak ada error baru** dari perubahan ini. 6 error yang muncul **pre-existing** (terverifikasi: dijalankan di worktree HEAD bersih, error identik) |
| `npx vite build` | **Sukses** — 2682 modul, tidak ada import menggantung (rollup gagal kalau ada named export hilang) |
| grep hook/tipe yang dihapus | **Nol hasil** |

> **Catatan pre-existing (di luar scope):** `npm run build` (`tsc -b`) sudah **gagal di HEAD**
> karena 6 error di file yang tidak tersentuh pekerjaan ini:
> `pages/customer/components/customerForm.tsx`, `pages/franchise/components/FranchiseForm.tsx`,
> `pages/inventory/catalog/index.tsx`, `pages/inventory/catalog/table/catalog.config.tsx` (2 error),
> `pages/inventory/item/components/itemForm.tsx`. Tidak diperbaiki di sini agar scope tetap bersih —
> `npx vite build` sendiri lolos.

---

## Risiko / catatan

- **Model 1:1 dipaksa backend** — menu dengan resep **>1 bahan** tidak bisa dibuka di halaman
  update/detail lewat aggregate (`resolveChain` menolak `menu must have exactly one ingredient`),
  begitu juga catalog **bundle**. Diterima karena produk di UI ini selalu 1 bahan.
- **`menu.base_price` non-addon ≠ Harga Dasar yang diisi** — nilai `menu.base_price` diturunkan
  dari ingredient = `catalog.unit_price`. Karena itu:
  - detail & form update membaca **`item.base_price`** (bukan `menu.base_price`) untuk Harga Dasar
    (keputusan #16);
  - kolom list di-relabel jadi **"Harga Beli Outlet"** (keputusan #17), sebab response list hanya
    berisi `menu`.
  Kalau FE membaca `menu.base_price` sebagai Harga Dasar, form edit akan **menimpa `item.base_price`
  (cost item)** dengan nilai `unit_price` setiap kali disimpan.
- **Kolom "Harga Jual" bergantung pada preload backend** — `ProductUsecase.Get` menambahkan
  `q.Relation("ChannelPrices.POSChannel")`, jadi list membawa `channel_prices` + `pos_channel`.
  Kalau preload itu dilepas di backend, kolom ini akan tampil `-` untuk semua baris.
- **Kolom "Harga Jual" tidak sortable** — `channel_prices` adalah relasi, dan backend
  (`ProductQueryOptions`) tidak menyediakan sorting per channel. Sengaja `sortable: false`
  supaya tidak memicu parameter `order_by` yang tidak dikenal.
- **`item.base_price` ditulis ulang oleh purchase order** — saat penerimaan barang,
  `PurchaseOrderUsecase.recalculateItemBasePrice` meng-update kolom ini lalu publish
  `franchisor:item.base_price.updated`. Jadi Harga Dasar yang tampil bisa berbeda dari yang
  diinput terakhir kali, dan itu memang perilaku backend (bukan bug FE).
- **`unit_price` tidak divalidasi FE > 0 untuk addon** (diabaikan backend) — form menyembunyikan
  field-nya agar tidak menyesatkan.
- **Permission baru harus di-assign** ke usergroup/user, kalau tidak user existing akan 403 saat
  create/update/delete/activate (`svc-franchisor.product.manage`). Route & list tetap bisa dibuka.
- **Dua jalur hidup berdampingan**: halaman menu (aggregate) vs dropdown add-on & form B2B
  (`/pos/menu`). Keduanya konvergen karena konsumen memakai semantik upsert by `ref_id`.
- **`/pos/menu` tidak punya filter `is_additional`** — parameter itu akan diabaikan diam-diam
  (`MenuQueryOptions` hanya mengenal `addons`). Karena itu dropdown add-on tetap memakai
  `addons=yes`, bukan `is_additional=true`.
- **`catalog.name` unik global** (tidak per-franchisor) — dua produk dengan nama sama (bahkan
  antar-brand) ditolak backend. Pesan error ditampilkan apa adanya.
- **Detail list hanya menu** — item/catalog tanpa menu tidak muncul di list.
- **Endpoint mati yang dihapus tidak bisa dipakai lagi** — kalau nanti butuh CRUD POS Channel
  atau `assignOutlet` catalog outlet-type, harus ditulis ulang (backend-nya masih ada; yang dihapus
  hanya definisi RTK Query di FE). Penghapusan bersifat one-way, jadi sengaja dibatasi ke yang
  sudah pasti tidak punya pemanggil.
- **`usePOSChannel` tinggal read-only** — kalau nanti muncul kebutuhan kelola channel dari UI,
  endpoint tulisnya harus ditambahkan kembali.
- **Tipe request `pos.ts` dihapus** — komponen baru yang butuh payload menu harus memakai tipe dari
  `services/types/product.ts`, bukan `POSMenuCreateRequest` (sudah tidak ada).

---

## Out of scope

- Migrasi form B2B order ke aggregate.
- Penghapusan **service** `/pos/*` (tetap dipakai dropdown add-on, form B2B, category, channel read).
- Penghapusan **endpoint backend** `/pos/menu` — yang dihapus hanya definisi RTK Query di FE.
- Audit endpoint mati di luar [§7](#7-penghapusan-endpoint-mati) (report non-summary, dll).
- Perubahan endpoint `/pos/menu/price`.
- Dukungan catalog bundle & resep multi-bahan lewat halaman menu.
- Perubahan URL/route/sidebar (`/setting/pos/menu` tetap).
