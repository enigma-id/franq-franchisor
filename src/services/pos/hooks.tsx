import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetMenusQuery,
  useLazyGetMenuPricesQuery,
  useLazyGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
  useLazyGetChannelsQuery,
} from "./api";
import type { POSCategoryDetail, POSChannelDetail } from "../types/pos";

/**
 * Menu POS — sisa yang masih dipakai UI: list (`getMenus`, untuk dropdown add-on &
 * form B2B order) dan `getPrices` (`/pos/menu/price`, untuk form B2B order).
 * CRUD/detail/activate/deactivate menu memakai `useProduct` (`/inventory/product`).
 */
export const usePOSMenu = createCrudHook({
  entityName: "posMenu",
  useLazyGetQuery: useLazyGetMenusQuery,
  additionalQueries: {
    getPrices: useLazyGetMenuPricesQuery,
  },
});

export const usePOSCategory = createCrudHook<POSCategoryDetail>({
  entityName: "posCategory",
  useLazyGetQuery: useLazyGetCategoriesQuery,
  useCreateMutation: useCreateCategoryMutation,
  useUpdateMutation: useUpdateCategoryMutation,
  useRemoveMutation: useDeleteCategoryMutation,
  customOperations: {
    activate: { hook: useActivateCategoryMutation },
    deactivate: { hook: useDeactivateCategoryMutation },
  },
});

/** Channel POS — read-only (endpoint tulis tidak dipakai UI, sudah dihapus). */
export const usePOSChannel = createCrudHook<POSChannelDetail>({
  entityName: "posChannel",
  useLazyGetQuery: useLazyGetChannelsQuery,
});
