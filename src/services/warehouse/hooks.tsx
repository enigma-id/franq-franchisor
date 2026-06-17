import { createCrudHook } from "../hooks/createCrudHook";
import { useLazyGetWarehousesQuery } from "./api";
import type { WarehouseDetail } from "../types/purchase";

export const useWarehouse = createCrudHook<WarehouseDetail>({
  entityName: "warehouse",
  useLazyGetQuery: useLazyGetWarehousesQuery,
});
