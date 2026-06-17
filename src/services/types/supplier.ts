/**
 * Supplier Types
 */

export type SupplierType = "factory" | "distributor" | "wholesaler" | "retailer";

export interface SupplierBase {
  name: string;
  phone: string;
  email?: string;
  address: string;
}

export interface SupplierRequest extends SupplierBase {
  type?: SupplierType;
  sales_person?: string;
  bank_name?: string;
  bank_account?: string;
  bank_number?: string;
  top?: number;
  is_pkp?: boolean;
  lead_time?: number;
}

export interface SupplierDetail extends SupplierBase {
  id: string;
  franchisor_id: string;
  code: string;
  type: SupplierType;
  sales_person: string;
  bank_name: string;
  bank_account: string;
  bank_number: string;
  top: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
