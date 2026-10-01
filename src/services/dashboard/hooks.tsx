import { createCrudHook } from "../hooks/createCrudHook";
import { useLazyGetDashboardQuery, useLazyGetLiveMapQuery } from "./api";

export const useDashboard = createCrudHook({
  useLazyGetQuery: useLazyGetDashboardQuery,
  additionalQueries: {
    liveMap: useLazyGetLiveMapQuery,
  },
  entityName: "dashboard",
});
