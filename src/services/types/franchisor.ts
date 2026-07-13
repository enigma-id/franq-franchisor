export interface FranchisorBase {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
}

export type FranchisorUpdateRequest = FranchisorBase;

export interface FranchisorDetail extends FranchisorBase {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
