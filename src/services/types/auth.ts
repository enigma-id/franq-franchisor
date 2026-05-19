// Auth
export interface User {
  id: number;
  name: string;
  username: string;
  is_supervisor: boolean;
  is_active: boolean;
  last_login_at: string;
}

export interface AuthUser extends User {
  token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface ProfileUpdateRequest {
  name: string;
  password?: string;
  confirm_password?: string;
}
