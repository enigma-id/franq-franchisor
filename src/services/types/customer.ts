/**
 * Customer Types
 */

export interface CustomerRequest {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  note?: string;
}

export interface CustomerDetail extends CustomerRequest {
  id: string;
  franchisor_id: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
