import { createCrudHook } from "../hooks/createCrudHook";
import { useLazyGetRegionQuery } from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRegion = createCrudHook<any>({
  useLazyGetQuery: useLazyGetRegionQuery,
  entityName: "region",
});
