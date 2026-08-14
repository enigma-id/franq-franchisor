import React from "react";
import { Navigate } from "react-router-dom";
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

  if (!allowed) {
    return <Navigate to={fallbackUrl} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
