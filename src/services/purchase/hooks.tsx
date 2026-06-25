import { createCrudHook } from "../hooks/createCrudHook";
import type { PurchaseOrderDetail } from "../types";
import {
  useLazyGetQuery,
  useLazyShowQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  usePublishMutation,
  usePaidMutation,
} from "./api";

export const usePurchaseOrder = createCrudHook<PurchaseOrderDetail>({
  entityName: "purchaseOrder",
  useLazyGetQuery: useLazyGetQuery,
  useLazyShowQuery: useLazyShowQuery,
  useCreateMutation: useCreateMutation,
  useUpdateMutation: useUpdateMutation,
  useRemoveMutation: useDeleteMutation,
  customOperations: {
    publish: { hook: usePublishMutation },
    paid: { hook: usePaidMutation },
  },
});
