import { createCrudHook } from "../hooks/createCrudHook";
import type { SupplierDetail } from "../types";
import {
  useLazyGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useActivateSupplierMutation,
  useDeactivateSupplierMutation,
  useLazyGetSupplierQuery,
} from "./api";

export const useSupplier = createCrudHook<SupplierDetail>({
  entityName: "supplier",
  useLazyGetQuery: useLazyGetSuppliersQuery,
  useLazyShowQuery: useLazyGetSupplierQuery,
  useCreateMutation: useCreateSupplierMutation,
  useUpdateMutation: useUpdateSupplierMutation,
  useRemoveMutation: useDeleteSupplierMutation,
  customOperations: {
    activate: { hook: useActivateSupplierMutation },
    deactivate: { hook: useDeactivateSupplierMutation },
  },
});
