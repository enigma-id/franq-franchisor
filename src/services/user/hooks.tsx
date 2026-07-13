import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
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
  },
});
