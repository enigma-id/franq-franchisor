import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetTopupBonusesQuery,
  useCreateTopupBonusMutation,
  useDeleteTopupBonusMutation,
  useUpdateTopupBonusMutation,
  useLazyGetTopupBonusQuery,
  useActivateTopupBonusMutation,
  useDeactivateTopupBonusMutation,
} from "./api";
import type { TopupBonusDetail } from "../types/pos";

export const useMemberTopupBonus = createCrudHook<TopupBonusDetail>({
  entityName: "topupBonus",
  useLazyGetQuery: useLazyGetTopupBonusesQuery,
  useLazyShowQuery: useLazyGetTopupBonusQuery,
  useCreateMutation: useCreateTopupBonusMutation,
  useUpdateMutation: useUpdateTopupBonusMutation,
  useRemoveMutation: useDeleteTopupBonusMutation,
  customOperations: {
    activate: {
      hook: useActivateTopupBonusMutation,
    },
    deactivate: {
      hook: useDeactivateTopupBonusMutation,
    },
  },
});
