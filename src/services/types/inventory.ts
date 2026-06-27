/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Inventory Types (v2)
 * Synchronized with Postman Collection
 */

import type { SupplierDetail } from "./supplier";

export type InventoryItemType = "raw_material" | "finished_goods";
export type InventoryItemPickingStrategy = "fifo" | "fefo" | "lifo" | "manual";

export interface InventoryFraction {
  name: string;
  quantity: number;
}

export interface InventoryBOM {
  material_id: string;
  quantity: number;
  measurement: string;
}

export interface InventoryItemBase {
  type: InventoryItemType;
  supplier?: SupplierDetail;
  supplier_id?: string;
  barcode: string;
  name: string;
  variant: string;
  packaging: string;
  size: string;
  picking_strategy: InventoryItemPickingStrategy;
  is_batch_tracking: boolean;
  base_price: number;
  weight: number;
  volume: number;
  category: string;
  safety_stock: number;
  is_vatable: boolean;
  fractions: InventoryFraction[];
  materials?: InventoryBOM[];
}

export interface InventoryItemCreateRequest extends InventoryItemBase {
  boms?: InventoryBOM[];
}

export type InventoryItemUpdateRequest = Partial<InventoryItemCreateRequest>;

export interface InventoryFractionDetail {
  id: string;
  item_id: string;
  name: string;
  quantity: number;
  is_smallest: boolean;
}

export interface InventoryItemDetail extends InventoryItemBase {
  id: string;
  franchisor_id: string;
  supplier_id: string;
  code: string;
  stock_available: number;
  stock_defect: number;
  in_catalog: boolean;
  boms?: InventoryBOM[];
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  alias_name: string;
  default_fraction: string;
  fractions: InventoryFractionDetail[];
}

export interface InventoryCatalogBase {
  name?: string;
  is_bundle: boolean;
  unit_price: number;
  measurement: string;
  unit: number;
  image?: string;
}

export interface BundleItemDetail {
  fraction: InventoryFractionDetail;
  margin: any;
  id: string;
  item_id: string;
  catalog_id: string;
  fraction_id: string;
  quantity: number;
  item: InventoryItemDetail;
}

export interface ItemDetail {
  id: string;
  name: string;
  category: string;
  alias_name: string;
}

export interface InventoryCatalogItem {
  id?: string;
  item_id: string;
  fraction_id: string;
  quantity: number;
  margin: number;
}

export interface InventoryCatalogRequest extends InventoryCatalogBase {
  item_id?: string;
  fraction_id?: string;
  items?: InventoryCatalogItem[];
  image?: string;
  weight?: number; // Added based on table
}

export interface InventoryCatalogDetailBase extends InventoryCatalogBase {
  id: string;
  franchisor_id: string;
  code: string;

  base_price: number;
  weight: number;
  volume: number;

  unit: number;
  measurement: string;

  is_active: boolean;
  is_vatable: boolean;

  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;

  outlet_types: {
    id: string;
    outlet_type_id: string;
    catalog_id: string;
    outlet_type: {
      id: string;
      franchisor_id: string;
      name: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  }[];
}

export interface BundleCatalogItem {
  id: string;
  catalog_id: string;

  item_id: string;
  fraction_id: string;

  quantity: number;
  base_price: number;
  margin: number;

  item: InventoryItemDetail;
  fraction: InventoryFractionDetail;
}

export interface InventoryCatalogStandard extends InventoryCatalogDetailBase {
  is_bundle: false;

  item_id: string;
  fraction_id: string;

  item: InventoryItemDetail;
  item_fraction: InventoryFractionDetail;
}

export interface InventoryCatalogBundle extends InventoryCatalogDetailBase {
  is_bundle: true;

  item_id: string;
  fraction_id: string;

  bundle_items: BundleCatalogItem[];
}

export type InventoryCatalogDetail =
  | InventoryCatalogStandard
  | InventoryCatalogBundle;
