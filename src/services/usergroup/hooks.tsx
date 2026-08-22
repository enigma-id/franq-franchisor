import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetUserGroupsQuery,
  useLazyGetUserGroupQuery,
  useCreateUserGroupMutation,
  useUpdateUserGroupMutation,
  useDeleteUserGroupMutation,
  useActivateUserGroupMutation,
  useDeactivateUserGroupMutation,
} from "./api";
import type { UserGroupDetail } from "../types";

export const useUserGroup = createCrudHook<UserGroupDetail>({
  entityName: "userGroup",
  useLazyGetQuery: useLazyGetUserGroupsQuery,
  useLazyShowQuery: useLazyGetUserGroupQuery,
  useCreateMutation: useCreateUserGroupMutation,
  useUpdateMutation: useUpdateUserGroupMutation,
  useRemoveMutation: useDeleteUserGroupMutation,
  customOperations: {
    activate: { hook: useActivateUserGroupMutation },
    deactivate: { hook: useDeactivateUserGroupMutation },
  },
});
