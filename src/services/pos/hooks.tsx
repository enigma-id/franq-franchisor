import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetMenusQuery,
  useLazyGetCategoriesQuery,
  useLazyGetChannelsQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
  useActivateMenuMutation,
  useDeactivateMenuMutation,
  useUpdateMenuTypesMutation,
  useActivateChannelMutation,
  useDeactivateChannelMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
} from "./api";
import type {
  POSMenuDetail,
  POSCategoryDetail,
  POSChannelDetail,
} from "../types/pos";

export const usePOSMenu = createCrudHook<POSMenuDetail>({
  entityName: "posMenu",
  useLazyGetQuery: useLazyGetMenusQuery,
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
