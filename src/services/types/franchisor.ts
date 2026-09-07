export type FranchisorType = "outlet" | "mitra";

/** Detail brand/franchisor (hasil GET /franchisor). */
export interface FranchisorDetail {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Baris brand/franchisor hasil GET /franchisor (list) */
export interface FranchisorRow extends FranchisorDetail {
  type: FranchisorType;
}

/** Payload create brand (POST /franchisor) — superuser only */
export interface FranchisorCreateRequest {
  type: FranchisorType;
  name: string;
  address: string;
  phone: string;
  email: string;
  /** Username owner (unik global). */
  username: string;
  password: string;
  confirm_password: string;
  /** Nama owner. */
  name_user: string;
}

/** Payload update brand (PUT /franchisor/:id) — superuser only */
export interface FranchisorRowUpdateRequest {
  type: FranchisorType;
  name: string;
  address: string;
  phone: string;
  email: string;
}
