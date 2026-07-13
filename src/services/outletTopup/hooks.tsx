import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetOutletTopupsQuery,
  useLazyGetOutletTopupQuery,
  useApproveOutletTopupMutation,
  useRejectOutletTopupMutation,
} from "./api";
import type { OutletTopupDetail } from "../types";

export const useOutletTopup = createCrudHook<OutletTopupDetail>({
  entityName: "outletTopup",
  useLazyGetQuery: useLazyGetOutletTopupsQuery,
  useLazyShowQuery: useLazyGetOutletTopupQuery,
  customOperations: {
    approve: { hook: useApproveOutletTopupMutation },
    reject: { hook: useRejectOutletTopupMutation },
  },
});
