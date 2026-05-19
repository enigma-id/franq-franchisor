import { Suspense } from "react";
import { AppRoutes } from "@/routes";
import { FullPageLoading } from "@/components/ui";

function AppRoot() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <AppRoutes />
    </Suspense>
  );
}

export default AppRoot;
