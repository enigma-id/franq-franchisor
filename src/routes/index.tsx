import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { UnauthorizedLayout } from "@/components/app/route-layout/UnauthorizedLayout";
import { AuthorizedLayout } from "@/components/app/route-layout/AuthorizedLayout";
import { useAppSelector, useAppMetadata } from "@/hooks";

import SignInPage from "@/pages/signin";
import DashboardPage from "@/pages/dashboard";

// Domain Subrouters
import { purchaseRoutes } from "@/pages/purchase/routes";
import { reportRoutes } from "@/pages/report/routes";
import { salesRoutes } from "@/pages/sales/routes";
import { settingRoutes } from "@/pages/setting/routes";

// Combine all domain routes
const allDomainRoutes = [
  ...purchaseRoutes,
  ...reportRoutes,
  ...salesRoutes,
  ...settingRoutes,
];

export function AppRoutes() {
  useAppMetadata();
  const isAuthenticated = useAppSelector((s) => s.auth.authenticated);

  if (!isAuthenticated) {
    return (
      <Routes>
        {/* Public routes — wrapped in UnauthorizedLayout */}
        <Route element={<UnauthorizedLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Protected routes — wrapped in ProtectedRoute + AuthorizedLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AuthorizedLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Dynamically register all domain subroutes */}
        {allDomainRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
