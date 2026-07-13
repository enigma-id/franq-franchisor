export interface UserBase {
  usergroup_id: string;
  name: string;
}

export interface UserCreateRequest extends UserBase {
  username: string;
  password: string;
  confirm_password: string;
}

export interface UserUpdateRequest {
  usergroup_id: string;
  name: string;
  password?: string;
  confirm_password?: string;
}

export interface UserDetail extends UserBase {
  id: string;
  franchisor_id: string;
  outlet_id: string;
  username: string;
  is_active: boolean;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserGroupBase {
  name: string;
  permissions: Record<string, unknown>;
}

export type UserGroupCreateRequest = UserGroupBase;
export type UserGroupUpdateRequest = UserGroupBase;

export interface UserGroupDetail extends UserGroupBase {
  id: string;
  franchisor_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
