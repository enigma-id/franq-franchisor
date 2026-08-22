// Auth Types (v2 - New Collection)
// Based on: auth/signup, auth/login, profile/me

export interface User {
  id: string;
  franchisor_id: string;
  usergroup_id: string;
  outlet_id: string;
  username: string;
  name: string;
  is_active: boolean;
  /** Permission slugs dari usergroup. Undefined = super admin (akses semua). */
  permissions?: string[];
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignupRequest {
  company_name: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  password?: string;
  confirm_password?: string;
}
