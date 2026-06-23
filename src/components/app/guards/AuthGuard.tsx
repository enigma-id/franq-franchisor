import { useAppSelector } from "@/hooks";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGuard: React.FC = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.authenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
