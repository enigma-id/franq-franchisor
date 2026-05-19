import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetUserQuery,
  useLazyShowUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useRemoveUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
} from "./api";

export const useUser = createCrudHook({
  useLazyGetQuery: useLazyGetUserQuery,
  useLazyShowQuery: useLazyShowUserQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useRemoveMutation: useRemoveUserMutation,
  customOperations: {
    activate: { hook: useActivateUserMutation },
    deactivate: { hook: useDeactivateUserMutation },
  },
  entityName: "user",
});
