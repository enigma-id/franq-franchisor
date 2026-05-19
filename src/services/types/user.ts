// User Management
export interface ManagedUser {
  id: number
  name: string
  username: string
  is_active: boolean
  is_supervisor: boolean
  last_login_at: string
}

export interface CreateUserRequest {
  name: string
  username: string
  password: string
  confirm_password: string
}

export interface UpdateUserRequest {
  name: string
  username: string
  password?: string
  confirm_password?: string
}