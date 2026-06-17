import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetOutletsQuery,
  useLazyGetOutletQuery,
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useActivateOutletMutation,
  useDeactivateOutletMutation,
  useUpdateChannelOutletMutation,
  useDeleteOutletMutation,
  useLazyGetOutletTypesQuery,
  useCreateOutletTypeMutation,
  useLazyGetOutletTypeQuery,
  useUpdateOutletTypeMutation,
  useDeleteOutletTypeMutation,
  useActivateOutletTypeMutation,
  useDeactivateOutletTypeMutation,
} from "./api";
import type { OutletDetail, OutletTypeDetail } from "../types/outlet";

/**
 * Hook for Outlet operations
 */
export const useOutlet = createCrudHook<OutletDetail>({
  entityName: "outlet",
  useLazyGetQuery: useLazyGetOutletsQuery,
  useLazyShowQuery: useLazyGetOutletQuery,
  useCreateMutation: useCreateOutletMutation,
  useUpdateMutation: useUpdateOutletMutation,
  useRemoveMutation: useDeleteOutletMutation,
  customOperations: {
    activate: { hook: useActivateOutletMutation },
    deactivate: { hook: useDeactivateOutletMutation },
    updateChannel: { hook: useUpdateChannelOutletMutation },
  },
});

/**
 * Hook for Outlet Type operations
 */
export const useOutletType = createCrudHook<OutletTypeDetail>({
  entityName: "outletType",
  useLazyGetQuery: useLazyGetOutletTypesQuery,
  useLazyShowQuery: useLazyGetOutletTypeQuery,
  useCreateMutation: useCreateOutletTypeMutation,
  useUpdateMutation: useUpdateOutletTypeMutation,
  useRemoveMutation: useDeleteOutletTypeMutation,
  customOperations: {
    activate: { hook: useActivateOutletTypeMutation },
    deactivate: { hook: useDeactivateOutletTypeMutation },
  },
});
