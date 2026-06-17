import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../../temp/services/auth/hook";

const GuestGuard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
