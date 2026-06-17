import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  usePublishSalesOrderMutation,
  usePaidSalesOrderMutation,
  useCancelSalesOrderMutation,
  useLazyGetSalesReturnQuery,
  useActivateSalesReturnMutation,
  useDeactivateSalesReturnMutation,
  useCreateSalesReturnMutation,
  useUpdateSalesReturnMutation,
  useDeleteSalesReturnMutation,
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

// Sales Return
export const useSalesReturn = createCrudHook({
  entityName: "salesReturn",
  useLazyShowQuery: useLazyGetSalesReturnQuery,
  useCreateMutation: useCreateSalesReturnMutation,
  useUpdateMutation: useUpdateSalesReturnMutation,
  useRemoveMutation: useDeleteSalesReturnMutation,
  customOperations: {
    active: { hook: useActivateSalesReturnMutation },
    deactive: { hook: useDeactivateSalesReturnMutation },
  },
});
