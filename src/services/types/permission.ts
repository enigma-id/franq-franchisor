export interface PermissionItem {
  id: string;
  slug: string;
  application: string;
  service: string;
  module: string;
  action: string;
  note?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

/** GET /permission — dikelompokkan per module. */
export interface PermissionGroup {
  module: string;
  permissions: PermissionItem[];
}
