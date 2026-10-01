import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsSuperuser } from "@/utils/permission";

interface NonSuperuserGuardProps {
  /** Redirect utk superuser. Default "/franchise". */
  superuserFallbackUrl?: string;
  children: React.ReactNode;
}

/**
 * Halaman yang hanya utk NON-superuser (mis. kelola outlet global).
 * Superuser → redirect ke fallback (default /franchise) krn outlet dikelola
 * lewat halaman Franchise per-brand.
 */
export const NonSuperuserGuard: React.FC<NonSuperuserGuardProps> = ({
  superuserFallbackUrl = "/franchise",
  children,
}) => {
  const isSuperuser = useIsSuperuser();
  const location = useLocation();

  if (isSuperuser) {
    if (location.pathname === superuserFallbackUrl) {
      return null;
    }
    return <Navigate to={superuserFallbackUrl} replace />;
  }

  return <>{children}</>;
};

export default NonSuperuserGuard;
