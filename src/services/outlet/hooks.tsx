import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetOutletQuery,
  useLazyShowOutletQuery,
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useRemoveOutletMutation,
  useLazyGetTypesQuery,
  useLazyShowTypeQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useRemoveTypeMutation,
} from "./api";

// Outlet
export const useOutlet = createCrudHook({
  useLazyGetQuery: useLazyGetOutletQuery,
  useLazyShowQuery: useLazyShowOutletQuery,
  useCreateMutation: useCreateOutletMutation,
  useUpdateMutation: useUpdateOutletMutation,
  useRemoveMutation: useRemoveOutletMutation,
  entityName: "outlet",
});

// Outlet Type
export const useOutletType = createCrudHook({
  useLazyGetQuery: useLazyGetTypesQuery,
  useLazyShowQuery: useLazyShowTypeQuery,
  useCreateMutation: useCreateTypeMutation,
  useUpdateMutation: useUpdateTypeMutation,
  useRemoveMutation: useRemoveTypeMutation,
  entityName: "outletType",
});
