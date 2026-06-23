import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetMenusQuery,
  useLazyGetMenuQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useActivateMenuMutation,
  useDeactivateMenuMutation,
  useUpdateMenuTypesMutation,
  useLazyGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
  useLazyGetChannelsQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
  useActivateChannelMutation,
  useDeactivateChannelMutation,
} from "./api";
import type {
  POSMenuDetail,
  POSCategoryDetail,
  POSChannelDetail,
} from "../types/pos";

export const usePOSMenu = createCrudHook<POSMenuDetail>({
  entityName: "posMenu",
  useLazyGetQuery: useLazyGetMenusQuery,
  useLazyShowQuery: useLazyGetMenuQuery,
  useCreateMutation: useCreateMenuMutation,
  useUpdateMutation: useUpdateMenuMutation,
  useRemoveMutation: useDeleteMenuMutation,
  customOperations: {
    activate: { hook: useActivateMenuMutation },
    deactivate: { hook: useDeactivateMenuMutation },
    updateTypes: { hook: useUpdateMenuTypesMutation },
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

export const usePOSChannel = createCrudHook<POSChannelDetail>({
  entityName: "posChannel",
  useLazyGetQuery: useLazyGetChannelsQuery,
  useCreateMutation: useCreateChannelMutation,
  useUpdateMutation: useUpdateChannelMutation,
  useRemoveMutation: useDeleteChannelMutation,
  customOperations: {
    activate: { hook: useActivateChannelMutation },
    deactivate: { hook: useDeactivateChannelMutation },
  },
});
