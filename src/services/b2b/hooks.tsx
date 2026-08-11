import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetB2BOrdersQuery,
  useLazyGetB2BOrderQuery,
  useCreateB2BOrderMutation,
  useUpdateB2BOrderMutation,
  useDeleteB2BOrderMutation,
  useShipB2BOrderMutation,
  useInvoiceB2BOrderMutation,
  usePayB2BOrderMutation,
} from "./api";
import type { B2BOrderDetail } from "../types";

export const useB2BOrder = createCrudHook<B2BOrderDetail>({
  entityName: "b2bOrder",
  useLazyGetQuery: useLazyGetB2BOrdersQuery,
  useLazyShowQuery: useLazyGetB2BOrderQuery,
  useCreateMutation: useCreateB2BOrderMutation,
  useUpdateMutation: useUpdateB2BOrderMutation,
  useRemoveMutation: useDeleteB2BOrderMutation,
  customOperations: {
    ship: { hook: useShipB2BOrderMutation },
    invoice: { hook: useInvoiceB2BOrderMutation },
    pay: { hook: usePayB2BOrderMutation },
  },
});
