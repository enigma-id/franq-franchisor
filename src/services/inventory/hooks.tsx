import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetItemsQuery,
  useLazyGetItemQuery,
  useLazyGetItemFractionsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useActivateItemMutation,
  useDeactivateItemMutation,
  useDeleteItemMutation,
  useLazyGetCatalogsQuery,
  useLazyGetCatalogQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
  useAssignCatalogOutletMutation,
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
} from "./api";

// Inventory Item
export const useInventoryItem = createCrudHook({
  useLazyGetQuery: useLazyGetItemsQuery,
  useLazyShowQuery: useLazyGetItemQuery,
  useCreateMutation: useCreateItemMutation,
  useUpdateMutation: useUpdateItemMutation,
  useRemoveMutation: useDeleteItemMutation,
  customOperations: {
    activate: { hook: useActivateItemMutation },
    deactivate: { hook: useDeactivateItemMutation },
  },
  additionalQueries: {
    fractions: useLazyGetItemFractionsQuery,
  },
  entityName: "inventoryItem",
});

// Inventory Catalog
export const useInventoryCatalog = createCrudHook({
  useLazyGetQuery: useLazyGetCatalogsQuery,
  useLazyShowQuery: useLazyGetCatalogQuery,
  useCreateMutation: useCreateCatalogMutation,
  useUpdateMutation: useUpdateCatalogMutation,
  useRemoveMutation: useDeleteCatalogMutation,
  customOperations: {
    activate: { hook: useActivateCatalogMutation },
    deactivate: { hook: useDeactivateCatalogMutation },
    assignOutlet: { hook: useAssignCatalogOutletMutation },
  },
  entityName: "inventoryCatalog",
});
