import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsMitraAccess } from "@/utils/permission";

interface MitraAccessGuardProps {
  /** Redirect target saat user tak punya akses mitra. Default "/dashboard". */
  fallbackUrl?: string;
  children: React.ReactNode;
}

/**
 * Route guard khusus akses Mitra (page Withdrawal/Topup).
 * Hanya utk superuser ATAU user dengan franchisor.type === "mitra".
 */
export const MitraAccessGuard: React.FC<MitraAccessGuardProps> = ({
  fallbackUrl = "/dashboard",
  children,
}) => {
  const allowed = useIsMitraAccess();
  const location = useLocation();

  if (!allowed) {
    if (location.pathname === fallbackUrl) {
      return null;
    }
    return <Navigate to={fallbackUrl} replace />;
  }

  return <>{children}</>;
};

export default MitraAccessGuard;
