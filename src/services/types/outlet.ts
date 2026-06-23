/**
 * Outlet Types (v2 - New Collection)
 * Synchronized with Postman Collection
 */

import type { RegionDetail } from "./region";

export interface OutletBase {
  outlet_type_id: string;
  name: string;
  recipient_name: string;
  phone: string;
  address: string;
  region_id: string;
  service_charges: number;
  owner_name: string;
  owner_username: string;
  owner_password: string;
}

export interface OutletChannel {
  pos_channel_id: string;
  is_active: boolean;
}

export interface OutletCreateRequest extends OutletBase {
  channels: OutletChannel[];
}

export type OutletUpdateRequest = Partial<OutletCreateRequest>;

export interface OutletChannelsUpdateRequest {
  channels: OutletChannel[];
}

export interface OutletDetail extends OutletBase {
  id: string;
  franchisor_id?: string;
  channels: OutletChannel[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  saldo?: number;
  region?: RegionDetail;
}

export interface OutletTypeBase {
  name: string;
}

export type OutletTypeRequest = OutletTypeBase;

export interface OutletTypeDetail extends OutletTypeBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
