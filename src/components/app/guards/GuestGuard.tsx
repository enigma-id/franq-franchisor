import { useAppSelector } from "@/hooks";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard: React.FC = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.authenticated);

  if (isAuthenticated) {
    // If logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
