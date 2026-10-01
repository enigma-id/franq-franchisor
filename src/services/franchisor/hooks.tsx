import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyListFranchisorsQuery,
  useLazyGetFranchisorByIdQuery,
  useCreateFranchisorMutation,
  useUpdateFranchisorByIdMutation,
  useDeleteFranchisorByIdMutation,
  useActivateFranchisorMutation,
  useDeactivateFranchisorMutation,
} from "./api";

// CRUD baris brand/franchisor (GET/POST /franchisor, dst) — khusus superuser
export const useFranchisorList = createCrudHook({
  entityName: "franchisorList",
  useLazyGetQuery: useLazyListFranchisorsQuery,
  useLazyShowQuery: useLazyGetFranchisorByIdQuery,
  useCreateMutation: useCreateFranchisorMutation,
  useUpdateMutation: useUpdateFranchisorByIdMutation,
  useRemoveMutation: useDeleteFranchisorByIdMutation,
  customOperations: {
    activate: { hook: useActivateFranchisorMutation },
    deactivate: { hook: useDeactivateFranchisorMutation },
  },
});
