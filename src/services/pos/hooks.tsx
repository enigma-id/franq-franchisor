import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetCatalogsQuery,
  useLazyShowCatalogQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
  useDeleteCatalogMutation,
  useLazyGetCategoriesQuery,
  useLazyShowCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
  useDeleteCategoryMutation,
  useLazyGetChannelsQuery,
  useLazyShowChannelQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
  useLazyGetPaymentMethodsQuery,
  useLazyShowPaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useLazyGetTopupSchemasQuery,
  useLazyShowTopupSchemaQuery,
  useCreateTopupSchemaMutation,
  useUpdateTopupSchemaMutation,
  useDeleteTopupSchemaMutation,
} from "./api";

// POS Catalog
export const usePOSCatalog = createCrudHook({
  useLazyGetQuery: useLazyGetCatalogsQuery,
  useLazyShowQuery: useLazyShowCatalogQuery,
  useCreateMutation: useCreateCatalogMutation,
  useUpdateMutation: useUpdateCatalogMutation,
  useRemoveMutation: useDeleteCatalogMutation,
  customOperations: {
    activate: { hook: useActivateCatalogMutation },
    deactivate: { hook: useDeactivateCatalogMutation },
  },
  entityName: "posCatalog",
});

// POS Category
export const usePOSCategory = createCrudHook({
  useLazyGetQuery: useLazyGetCategoriesQuery,
  useLazyShowQuery: useLazyShowCategoryQuery,
  useCreateMutation: useCreateCategoryMutation,
  useUpdateMutation: useUpdateCategoryMutation,
  useRemoveMutation: useDeleteCategoryMutation,
  customOperations: {
    activate: { hook: useActivateCategoryMutation },
    deactivate: { hook: useDeactivateCategoryMutation },
  },
  entityName: "posCategory",
});

// POS Channel
export const usePOSChannel = createCrudHook({
  useLazyGetQuery: useLazyGetChannelsQuery,
  useLazyShowQuery: useLazyShowChannelQuery,
  useCreateMutation: useCreateChannelMutation,
  useUpdateMutation: useUpdateChannelMutation,
  useRemoveMutation: useDeleteChannelMutation,
  entityName: "posChannel",
});

// POS Payment Method
export const usePOSPaymentMethod = createCrudHook({
  useLazyGetQuery: useLazyGetPaymentMethodsQuery,
  useLazyShowQuery: useLazyShowPaymentMethodQuery,
  useCreateMutation: useCreatePaymentMethodMutation,
  useUpdateMutation: useUpdatePaymentMethodMutation,
  useRemoveMutation: useDeletePaymentMethodMutation,
  entityName: "posPaymentMethod",
});

// POS Topup Schema
export const usePOSTopupSchema = createCrudHook({
  useLazyGetQuery: useLazyGetTopupSchemasQuery,
  useLazyShowQuery: useLazyShowTopupSchemaQuery,
  useCreateMutation: useCreateTopupSchemaMutation,
  useUpdateMutation: useUpdateTopupSchemaMutation,
  useRemoveMutation: useDeleteTopupSchemaMutation,
  entityName: "posTopupSchema",
});
