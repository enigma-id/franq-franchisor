import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetFranchisesQuery,
  useLazyGetFranchiseQuery,
  useCreateFranchiseMutation,
  useUpdateFranchiseMutation,
  useDeleteFranchiseMutation,
  useActivateFranchiseMutation,
  useDeactivateFranchiseMutation,
} from "./api";
import type { FranchiseDetail } from "../types/franchise";

export const useFranchise = createCrudHook<FranchiseDetail>({
  entityName: "franchise",
  useLazyGetQuery: useLazyGetFranchisesQuery,
  useLazyShowQuery: useLazyGetFranchiseQuery,
  useCreateMutation: useCreateFranchiseMutation,
  useUpdateMutation: useUpdateFranchiseMutation,
  useRemoveMutation: useDeleteFranchiseMutation,
  customOperations: {
    activate: { hook: useActivateFranchiseMutation },
    deactivate: { hook: useDeactivateFranchiseMutation },
  },
});
