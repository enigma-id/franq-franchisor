import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetPlansQuery,
  useLazyGetPlanQuery,
  useCreatePlanMutation,
  useDeletePlanMutation,
  usePublishPlanMutation,
  useCompletePlanMutation,
  useUpdateProductionItemMutation,
  useCompleteProductionItemMutation,
} from "./api";
import type { ProductionPlanDetail } from "../types/production";

export const useProductionPlan = createCrudHook<ProductionPlanDetail>({
  useLazyGetQuery: useLazyGetPlansQuery,
  useLazyShowQuery: useLazyGetPlanQuery,
  useCreateMutation: useCreatePlanMutation,
  useRemoveMutation: useDeletePlanMutation,
  customOperations: {
    publish: { hook: usePublishPlanMutation },
    complete: { hook: useCompletePlanMutation },
    updateItem: { hook: useUpdateProductionItemMutation },
    completeItem: { hook: useCompleteProductionItemMutation },
  },

  entityName: "productionPlan",
});
