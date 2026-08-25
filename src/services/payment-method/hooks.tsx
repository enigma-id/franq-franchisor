import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useActivatePaymentMethodMutation,
  useDeactivatePaymentMethodMutation,
  useLazyGetPaymentMethodQuery,
  useUpdatePaymentMethodOutletTypeMutation,
} from "./api";
import type { PaymentMethodDetail } from "../types/pos";

export const usePaymentMethod = createCrudHook<PaymentMethodDetail>({
  entityName: "paymentMethod",
  useLazyGetQuery: useLazyGetPaymentMethodsQuery,
  useLazyShowQuery: useLazyGetPaymentMethodQuery,
  useCreateMutation: useCreatePaymentMethodMutation,
  useUpdateMutation: useUpdatePaymentMethodMutation,
  useRemoveMutation: useDeletePaymentMethodMutation,
  customOperations: {
    activate: { hook: useActivatePaymentMethodMutation },
    deactivate: { hook: useDeactivatePaymentMethodMutation },
    updateOutletType: { hook: useUpdatePaymentMethodOutletTypeMutation },
  },
});
