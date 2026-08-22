import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useUpdateUserPermissionsMutation,
} from "./api";
import type { UserDetail } from "../types";

export const useUser = createCrudHook<UserDetail>({
  entityName: "user",
  useLazyGetQuery: useLazyGetUsersQuery,
  useLazyShowQuery: useLazyGetUserQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useRemoveMutation: useDeleteUserMutation,
  customOperations: {
    activate: { hook: useActivateUserMutation },
    deactivate: { hook: useDeactivateUserMutation },
    updatePermissions: {
      hook: useUpdateUserPermissionsMutation,
      errorMessage: "Failed to update user permissions",
    },
  },
});
