import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetPurchaseOrdersQuery,
  useLazyGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  usePaymentPurchaseOrderMutation,
  useLazyGetSuppliersQuery,
  useLazyGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from "./api";

// Purchase Order
export const usePurchaseOrder = createCrudHook({
  useLazyGetQuery: useLazyGetPurchaseOrdersQuery,
  useLazyShowQuery: useLazyGetPurchaseOrderQuery,
  useCreateMutation: useCreatePurchaseOrderMutation,
  useUpdateMutation: useUpdatePurchaseOrderMutation,
  useRemoveMutation: useDeletePurchaseOrderMutation,
  customOperations: {
    approve: { hook: useApprovePurchaseOrderMutation },
    payment: { hook: usePaymentPurchaseOrderMutation },
  },
  entityName: "purchase order",
});

// Supplier
export const useSupplier = createCrudHook({
  useLazyGetQuery: useLazyGetSuppliersQuery,
  useLazyShowQuery: useLazyGetSupplierQuery,
  useCreateMutation: useCreateSupplierMutation,
  useUpdateMutation: useUpdateSupplierMutation,
  useRemoveMutation: useDeleteSupplierMutation,
  entityName: "supplier",
});
