import { createCrudHook } from "../hooks/createCrudHook";
import type { WarehouseDetail } from "../types";
import { useLazyGetWarehousesQuery } from "./api";

export const useWarehouse = createCrudHook<WarehouseDetail>({
  entityName: "warehouse",
  useLazyGetQuery: useLazyGetWarehousesQuery,
});
