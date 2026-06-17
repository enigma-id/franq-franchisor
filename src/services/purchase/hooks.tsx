import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  usePaymentPurchaseOrderMutation,
} from "./api";
import type { PurchaseOrderDetail } from "../types/purchase";

export const usePurchaseOrder = createCrudHook<PurchaseOrderDetail>({
  entityName: "purchaseOrder",
  useLazyGetQuery: useLazyGetPurchaseOrdersQuery,
  useCreateMutation: useCreatePurchaseOrderMutation,
  useUpdateMutation: useUpdatePurchaseOrderMutation,
  useRemoveMutation: useDeletePurchaseOrderMutation,
  customOperations: {
    approve: { hook: useApprovePurchaseOrderMutation },
    pay: { hook: usePaymentPurchaseOrderMutation },
  },
});
