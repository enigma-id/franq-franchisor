/**
 * Warehouse Types
 * Based on provided payload:
 * {
 *   "id": "c6078a32-a982-4129-9d59-6c9a6ca26192",
 *   "brand_id": "00000000-0000-0000-0000-000000000000",
 *   "type": "",
 *   "name": "CGB",
 *   "address": "CGB No. 149",
 *   "region_id": "167357b8-5562-4cdb-9165-36f919588940",
 *   "is_default": false,
 *   "is_active": false,
 *   "has_area": false,
 *   "created_by": "",
 *   "created_at": "0001-01-01T00:00:00Z"
 * }
 */

export interface WarehouseBase {
  brand_id: string;
  type: string;
  name: string;
  address: string;
  is_default: boolean;
  is_active: boolean;
  has_area: boolean;
  created_by: string;
}

export interface WarehouseDetail extends WarehouseBase {
  id: string;
  created_at: string;
}
