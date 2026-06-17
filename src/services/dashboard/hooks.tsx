import { createCrudHook } from "../hooks/createCrudHook";
import { useLazyGetDashboardQuery } from "./api";

export const useDashboard = createCrudHook({
  useLazyGetQuery: useLazyGetDashboardQuery,
  entityName: "dashboard",
});
