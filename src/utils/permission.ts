/**
 * Check if user has required permission
 * @param userPermissions - Array of permission slugs from user's usergroup
 * @param requiredPermission - Permission slug to check
 * @returns boolean - true if user has permission OR if user has no usergroup (super admin)
 */
export const hasPermission = (
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean => {
  // Jika user tidak punya usergroup (undefined/null), berarti super admin - akses semua
  if (userPermissions === undefined || userPermissions === null) {
    return true;
  }

  // Jika array kosong, berarti tidak punya permission
  if (userPermissions.length === 0) {
    return false;
  }

  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the required permissions (OR logic)
 * @param userPermissions - Array of permission slugs from user's usergroup
 * @param requiredPermissions - Array of permission slugs to check
 * @returns boolean - true if user has any permission OR if user has no usergroup (super admin)
 */
export const hasAnyPermission = (
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean => {
  // Jika user tidak punya usergroup (undefined/null), berarti super admin - akses semua
  if (userPermissions === undefined || userPermissions === null) {
    return true;
  }

  // Jika array kosong, berarti tidak punya permission
  if (userPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Check if user has all required permissions (AND logic)
 * @param userPermissions - Array of permission slugs from user's usergroup
 * @param requiredPermissions - Array of permission slugs to check
 * @returns boolean - true if user has all permissions OR if user has no usergroup (super admin)
 */
export const hasAllPermissions = (
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean => {
  // Jika user tidak punya usergroup (undefined/null), berarti super admin - akses semua
  if (userPermissions === undefined || userPermissions === null) {
    return true;
  }

  // Jika array kosong, berarti tidak punya permission
  if (userPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.every((perm) => userPermissions.includes(perm));
};

/**
 * Check if user has manage or readonly permission for a module
 * @param userPermissions - Array of permission slugs from user's usergroup
 * @param module - Module name (e.g., "item", "receiving plan", "delivery")
 * @returns boolean - true if user has access OR if user has no usergroup (super admin)
 */
export const hasModuleAccess = (
  userPermissions: string[] | undefined,
  module: string
): boolean => {
  // Jika user tidak punya usergroup (undefined/null), berarti super admin - akses semua
  if (userPermissions === undefined || userPermissions === null) {
    return true;
  }

  // Jika array kosong, berarti tidak punya permission
  if (userPermissions.length === 0) {
    return false;
  }

  const managePerm = `svc-warehouse.${module}.manage`;
  const readonlyPerm = `svc-warehouse.${module}.readonly`;
  return hasAnyPermission(userPermissions, [managePerm, readonlyPerm]);
};

import { useAppSelector } from "@/hooks";

/**
 * Hook: ambil permission slugs dari session user.
 * @returns undefined = super admin (akses semua); [] = tidak punya permission.
 */
export const useUserPermissions = (): string[] | undefined => {
  return useAppSelector((s) => s.auth.session?.user?.permissions);
};

/**
 * Hook: cek user punya satu slug permission.
 * @param slug - Permission slug (biasanya dari konstanta MENU / ACTION).
 * @returns boolean (super admin → true).
 */
export const useCan = (slug: string): boolean =>
  hasPermission(useUserPermissions(), slug);

/**
 * Hook: cek user punya salah satu dari beberapa slug (OR).
 * @param slugs - Array permission slug.
 * @returns boolean (super admin → true).
 */
export const useCanAny = (slugs: string[]): boolean =>
  hasAnyPermission(useUserPermissions(), slugs);

import { MENU, type MenuSlug } from "./permissions";
import type { User } from "@/services/types/auth";

/**
 * Urutan prioritas halaman default (pertama yang diizinkan user dipakai).
 * Sesuai urutan menu sidebar — dashboard di depan kalau diizinkan.
 */
export const ROUTE_BY_PERMISSION: Array<{ slug: MenuSlug; path: string }> = [
  { slug: MENU.dashboard, path: "/dashboard" },
  { slug: MENU.b2bOrder, path: "/b2b/order" },
  { slug: MENU.salesOrder, path: "/sales/order" },
  { slug: MENU.withdrawal, path: "/withdrawal" },
  { slug: MENU.outletTopup, path: "/outlet-topup" },
  { slug: MENU.inventoryItem, path: "/inventory/item" },
  { slug: MENU.inventoryCatalog, path: "/inventory/catalog" },
  { slug: MENU.demand, path: "/production/demand/production" },
  { slug: MENU.productionPlan, path: "/production/plan" },
  { slug: MENU.supplier, path: "/purchase/supplier" },
  { slug: MENU.purchaseOrder, path: "/purchase/order" },
  { slug: MENU.reportPosOutstanding, path: "/report/pos/outstanding" },
  { slug: MENU.reportMitraSettlement, path: "/report/mitra/settlement" },
  { slug: MENU.reportB2BSettlement, path: "/report/b2b/settlement" },
  { slug: MENU.reportInventoryMaterialSales, path: "/report/inventory/material-sales" },
  { slug: MENU.reportWarehouseStock, path: "/report/inventory/warehouse-stock" },
  { slug: MENU.reportOutletMap, path: "/report/outlet-maps" },
  { slug: MENU.outlet, path: "/setting/outlet" },
  { slug: MENU.outletType, path: "/setting/type/outlet" },
  { slug: MENU.posChannel, path: "/setting/pos/channel" },
  { slug: MENU.posCategory, path: "/setting/pos/category" },
  { slug: MENU.posMenu, path: "/setting/pos/menu" },
  { slug: MENU.posPayment, path: "/setting/pos/payment" },
  { slug: MENU.topupBonus, path: "/setting/member/topup-bonus" },
  { slug: MENU.user, path: "/user" },
  { slug: MENU.usergroup, path: "/usergroup" },
];

/**
 * Route default user: pertama yang diizinkan permission-nya.
 * Super admin (tanpa permission list) → dashboard.
 * User tanpa slug dashboard tetap dapat redirect valid (bukan loop ke dashboard).
 */
export function resolveDefaultRoute(
  user: Pick<User, "permissions"> | null | undefined,
): string {
  const perms = user?.permissions;
  if (perms === undefined || perms === null) {
    return "/dashboard"; // super admin
  }
  return (
    ROUTE_BY_PERMISSION.find((r) => perms.includes(r.slug))?.path ?? "/dashboard"
  );
}
