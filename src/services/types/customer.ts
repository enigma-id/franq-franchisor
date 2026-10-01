/**
 * Customer Types
 */

import type { FranchisorDetail } from "./franchisor";

export interface CustomerRequest {
  /** Diisi superuser saat create untuk brand tertentu (backend mewajibkan bila session kosong). */
  franchisor_id?: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  note?: string;
}

export interface CustomerDetail extends CustomerRequest {
  id: string;
  franchisor_id: string;
  /** Relasi brand (di-preload backend pada list & detail). */
  franchisor?: FranchisorDetail;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
