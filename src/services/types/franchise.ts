export interface FranchiseBase {
  name: string;
  outlet_type_id: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  owner_name: string;
  owner_username: string;
  owner_password: string;
}

export type FranchiseCreateRequest = FranchiseBase;
export type FranchiseUpdateRequest = Partial<FranchiseCreateRequest>;

export interface FranchiseDetail extends FranchiseBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  /** Relasi outlet type (dari backend, saat detail/list). */
  outlet_type?: {
    id: string;
    name: string;
  };
}
