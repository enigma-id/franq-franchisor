import { createCrudHook } from "../hooks/createCrudHook";
import type { PurchaseOrderDetail } from "../types";
import {
  useLazyGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  usePaymentPurchaseOrderMutation,
  useLazyGetPurchaseOrderQuery,
} from "./api";

export const usePurchaseOrder = createCrudHook<PurchaseOrderDetail>({
  entityName: "purchaseOrder",
  useLazyGetQuery: useLazyGetPurchaseOrdersQuery,
  useLazyShowQuery: useLazyGetPurchaseOrderQuery,
  useCreateMutation: useCreatePurchaseOrderMutation,
  useUpdateMutation: useUpdatePurchaseOrderMutation,
  useRemoveMutation: useDeletePurchaseOrderMutation,
  customOperations: {
    approve: { hook: useApprovePurchaseOrderMutation },
    pay: { hook: usePaymentPurchaseOrderMutation },
  },
});
