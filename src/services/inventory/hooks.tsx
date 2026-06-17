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
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
  useUpdateOutletCatalogMutation,
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
  entityName: "inventoryItem",
});

// Inventory Item Fractions
export const useItemFractions = createCrudHook({
  useLazyShowQuery: useLazyGetItemFractionsQuery,
  entityName: "inventoryItemFraction",
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
    assignOutlet: { hook: useUpdateOutletCatalogMutation },
  },
  entityName: "inventoryCatalog",
});
