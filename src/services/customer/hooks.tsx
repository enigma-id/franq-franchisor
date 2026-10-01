import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetCustomersQuery,
  useLazyGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useActivateCustomerMutation,
  useDeactivateCustomerMutation,
} from "./api";
import type { CustomerDetail } from "../types";

export const useCustomer = createCrudHook<CustomerDetail>({
  entityName: "customer",
  useLazyGetQuery: useLazyGetCustomersQuery,
  useLazyShowQuery: useLazyGetCustomerQuery,
  useCreateMutation: useCreateCustomerMutation,
  useUpdateMutation: useUpdateCustomerMutation,
  useRemoveMutation: useDeleteCustomerMutation,
  customOperations: {
    activate: { hook: useActivateCustomerMutation },
    deactivate: { hook: useDeactivateCustomerMutation },
  },
});
