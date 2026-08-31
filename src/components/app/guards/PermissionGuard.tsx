import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCanAny } from "@/utils/permission";

interface PermissionGuardProps {
  /** Slug permission (MENU.*) atau array slug (any-of). */
  permission: string | string[];
  /** Redirect target saat tidak punya akses. Default "/dashboard". */
  fallbackUrl?: string;
  children: React.ReactNode;
}

/**
 * Route guard berbasis permission (frontend.franchisor.*).
 * Super admin (tanpa permission data) → selalu render children.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallbackUrl = "/dashboard",
  children,
}) => {
  const required = Array.isArray(permission) ? permission : [permission];
  const allowed = useCanAny(required);
  const location = useLocation();

  // Anti self-loop: jangan redirect ke fallback yang sama dengan pathname saat ini.
  // Kalau tidak, user tanpa permission (mis. tanpa `frontend.franchisor.dashboard`)
  // akan stuck di infinite <Navigate replace> loop → semua navigasi berikutnya (sidebar)
  // jadi no-op & UI macet.
  // Saat sudah di fallback & tetap tak diizinkan → render null (tidak menampilkan data
  // tanpa izin), bukan redirect loop.
  if (!allowed) {
    if (location.pathname === fallbackUrl) {
      return null;
    }
    return <Navigate to={fallbackUrl} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
