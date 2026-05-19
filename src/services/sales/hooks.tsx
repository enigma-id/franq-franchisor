import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetSalesOrdersQuery,
  useLazyGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  usePublishSalesOrderMutation,
  usePaidSalesOrderMutation,
} from "./api";

// Sales Order
export const useSalesOrder = createCrudHook({
  useLazyGetQuery: useLazyGetSalesOrdersQuery,
  useLazyShowQuery: useLazyGetSalesOrderQuery,
  useCreateMutation: useCreateSalesOrderMutation,
  useUpdateMutation: useUpdateSalesOrderMutation,
  useRemoveMutation: useDeleteSalesOrderMutation,
  customOperations: {
    publish: { hook: usePublishSalesOrderMutation },
    paid: { hook: usePaidSalesOrderMutation },
  },
  entityName: "sales order",
});
