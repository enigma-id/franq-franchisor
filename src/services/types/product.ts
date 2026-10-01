/**
 * Product Types (aggregate)
 * Backend: `/inventory/product` (franchisor) — orkestrasi item -> catalog -> menu.
 *
 * Identitas produk = `menu.id`. Untuk produk addon (`is_additional = true`),
 * `item` & `catalog` bernilai null (backend tidak membuatnya).
 */

import type { InventoryCatalogDetail, InventoryItemDetail } from "./inventory";
import type { POSMenuDetail } from "./pos";

// ── Payload tulis (create / update) ──

export interface ProductChannelPriceRequest {
  pos_channel_id: string;
  price: number;
}

export interface ProductAddonItemRequest {
  addon_menu_id: string;
}

export interface ProductAddonGroupRequest {
  name: string;
  type: "options" | "checkbox" | "quantity";
  items: ProductAddonItemRequest[];
}

export interface ProductWriteRequest {
  name: string;
  category_id: string;
  image?: string;
  is_vatable: boolean;
  is_additional: boolean;
  base_price: number;
  /** Harga beli outlet -> catalog.unit_price. Diabaikan untuk addon. */
  unit_price: number;
  /**
   * Wajib (> 0) bila channel_prices > 1.
   * Bila channel_prices = 1, backend meng-override otomatis dari harga channel itu.
   */
  production_price: number;
  channel_prices: ProductChannelPriceRequest[];
  addon_groups?: ProductAddonGroupRequest[];
}

export interface ProductCreateRequest extends ProductWriteRequest {
  /** Diisi superuser saat create untuk brand tertentu. */
  franchisor_id?: string;
}

export type ProductUpdateRequest = ProductWriteRequest;

// ── Response detail ──

export interface ProductDetail {
  item: InventoryItemDetail | null;
  catalog: InventoryCatalogDetail | null;
  menu: POSMenuDetail;
}
