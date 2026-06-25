import {
  useLazyGetListQuery,
  useLazyShowQuery,
  useApproveMutation,
  useRejectMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useWithdrawal = createCrudHook({
  entityName: "withdrawal",
  useLazyGetQuery: useLazyGetListQuery,
  useLazyShowQuery: useLazyShowQuery,

  customOperations: {
    approve: {
      hook: useApproveMutation,
    },
    reject: {
      hook: useRejectMutation,
    },
  },
});
