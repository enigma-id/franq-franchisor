import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  usePublishSalesOrderMutation,
  usePaidSalesOrderMutation,
  useCancelSalesOrderMutation,
} from "./api";

// Sales Order
export const useSalesOrder = createCrudHook({
  entityName: "salesOrder",
  useLazyShowQuery: useLazyGetSalesOrderQuery,
  useCreateMutation: useCreateSalesOrderMutation,
  useUpdateMutation: useUpdateSalesOrderMutation,
  useRemoveMutation: useDeleteSalesOrderMutation,
  customOperations: {
    cancel: { hook: useCancelSalesOrderMutation },
    publish: { hook: usePublishSalesOrderMutation },
    paid: { hook: usePaidSalesOrderMutation },
  },
});
