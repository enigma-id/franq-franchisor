import { createCrudHook } from "../hooks/createCrudHook";
import { useLazyGetFranchiseQuery, useUpdateFranchiseMutation } from "./api";

export const useFranchise = createCrudHook({
  useLazyShowQuery: useLazyGetFranchiseQuery,
  useUpdateMutation: useUpdateFranchiseMutation,
  entityName: "franchise",
});
