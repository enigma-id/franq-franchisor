import { createCrudHook } from "../hooks/createCrudHook";
import type {
  DeliveryPlanDetail,
  ItemBatch,
  Receiving,
  ReceivingPlanDetail,
  WarehouseDetail,
  WarehouseLocation,
} from "../types";
import {
  useCompleteDeliveryPlanMutation,
  useCompleteReceivingMutation,
  useCompleteReceivingPlanMutation,
  useCreateReceivingMutation,
  useDeleteReceivingMutation,
  useDeliverDeliveryPlanMutation,
  useFulfilledDeliveryPlanMutation,
  useLazyGetBatchesQuery,
  useLazyGetDeliveryPlanQuery,
  useLazyGetDeliveryPlanSummaryQuery,
  useLazyGetDeliveryPlansQuery,
  useLazyGetLocationsQuery,
  useLazyGetReceivingPlanQuery,
  useLazyGetReceivingPlanSummaryQuery,
  useLazyGetReceivingPlansQuery,
  useLazyGetReceivingQuery,
  useLazyGetReceivingsQuery,
  useLazyGetWarehousesQuery,
  useUpdateReceivingMutation,
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

export const useReceiving = createCrudHook<Receiving>({
  entityName: "receiving",
  useLazyGetQuery: useLazyGetReceivingsQuery,
  useLazyShowQuery: useLazyGetReceivingQuery,
  useCreateMutation: useCreateReceivingMutation,
  useUpdateMutation: useUpdateReceivingMutation,
  useRemoveMutation: useDeleteReceivingMutation,
  customOperations: {
    complete: { hook: useCompleteReceivingMutation },
  },
});

// Lokasi gudang (area receiving/quarantine) — proxy BE menyusul.
export const useWarehouseLocation = createCrudHook<WarehouseLocation>({
  entityName: "warehouseLocation",
  useLazyGetQuery: useLazyGetLocationsQuery,
});

// Batch item — proxy BE menyusul.
export const useItemBatch = createCrudHook<ItemBatch>({
  entityName: "itemBatch",
  useLazyGetQuery: useLazyGetBatchesQuery,
});
