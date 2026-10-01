import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsSuperuser } from "@/utils/permission";

interface SuperuserGuardProps {
  /** Redirect target saat user bukan superuser. Default "/dashboard". */
  fallbackUrl?: string;
  children: React.ReactNode;
}

/**
 * Route guard khusus superuser (flag is_superuser dari /profile/me).
 * User non-superuser → redirect ke fallback (default /dashboard).
 */
export const SuperuserGuard: React.FC<SuperuserGuardProps> = ({
  fallbackUrl = "/dashboard",
  children,
}) => {
  const isSuperuser = useIsSuperuser();
  const location = useLocation();

  if (!isSuperuser) {
    if (location.pathname === fallbackUrl) {
      return null;
    }
    return <Navigate to={fallbackUrl} replace />;
  }

  return <>{children}</>;
};

export default SuperuserGuard;
