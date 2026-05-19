import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetTypesQuery,
  useLazyShowTypeQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useRemoveTypeMutation,
} from "./api";

export const useCatalog = createCrudHook({
  useLazyGetQuery: useLazyGetTypesQuery,
  useLazyShowQuery: useLazyShowTypeQuery,
  useCreateMutation: useCreateTypeMutation,
  useUpdateMutation: useUpdateTypeMutation,
  useRemoveMutation: useRemoveTypeMutation,
  entityName: "catalogType",
});
