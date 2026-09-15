import { createCrudHook } from "../hooks/createCrudHook";
import type {
  DeliveryPlanDetail,
  ReceivingPlanDetail,
  WarehouseDetail,
} from "../types";
import {
  useCompleteDeliveryPlanMutation,
  useCompleteReceivingPlanMutation,
  useDeliverDeliveryPlanMutation,
  useFulfilledDeliveryPlanMutation,
  useLazyGetDeliveryPlanQuery,
  useLazyGetDeliveryPlanSummaryQuery,
  useLazyGetDeliveryPlansQuery,
  useLazyGetReceivingPlanQuery,
  useLazyGetReceivingPlanSummaryQuery,
  useLazyGetReceivingPlansQuery,
  useLazyGetReceivingsQuery,
  useLazyGetWarehousesQuery,
} from "./api";

export const useWarehouse = createCrudHook<WarehouseDetail>({
  entityName: "warehouse",
  useLazyGetQuery: useLazyGetWarehousesQuery,
});

export const useDeliveryPlan = createCrudHook<DeliveryPlanDetail>({
  entityName: "deliveryPlan",
  useLazyGetQuery: useLazyGetDeliveryPlansQuery,
  useLazyShowQuery: useLazyGetDeliveryPlanQuery,
  customOperations: {
    complete: { hook: useCompleteDeliveryPlanMutation },
    delivered: { hook: useDeliverDeliveryPlanMutation },
    fulfilled: { hook: useFulfilledDeliveryPlanMutation },
  },
  additionalQueries: {
    summary: useLazyGetDeliveryPlanSummaryQuery,
  },
});

export const useReceivingPlan = createCrudHook<ReceivingPlanDetail>({
  entityName: "receivingPlan",
  useLazyGetQuery: useLazyGetReceivingPlansQuery,
  useLazyShowQuery: useLazyGetReceivingPlanQuery,
  customOperations: {
    complete: { hook: useCompleteReceivingPlanMutation },
  },
  additionalQueries: {
    summary: useLazyGetReceivingPlanSummaryQuery,
    receivings: useLazyGetReceivingsQuery,
  },
});
