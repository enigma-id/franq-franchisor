import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetPlansQuery,
  useLazyGetPlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  usePublishPlanMutation,
  useCancelPlanMutation,
  useCompletePlanMutation,
} from "./api";
import type { ProductionPlanDetail } from "../types/production";

export const useProductionPlan = createCrudHook<ProductionPlanDetail>({
  useLazyGetQuery: useLazyGetPlansQuery,
  useLazyShowQuery: useLazyGetPlanQuery,
  useCreateMutation: useCreatePlanMutation,
  useUpdateMutation: useUpdatePlanMutation,
  useRemoveMutation: useDeletePlanMutation,
  customOperations: {
    publish: { hook: usePublishPlanMutation },
    cancel: { hook: useCancelPlanMutation },
    complete: { hook: useCompletePlanMutation },
  },
  entityName: "productionPlan",
});
