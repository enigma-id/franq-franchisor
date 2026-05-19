import React from "react";
import { Navigate } from "react-router-dom";

interface UpdateRouteGuardProps {
  allowed: boolean;
  fallbackUrl: string;
  children: React.ReactNode;
}

export const UpdateRouteGuard: React.FC<UpdateRouteGuardProps> = ({
  allowed,
  fallbackUrl,
  children,
}) => {
  if (!allowed) {
    return <Navigate to={fallbackUrl} replace />;
  }

  return <>{children}</>;
};

export default UpdateRouteGuard;
