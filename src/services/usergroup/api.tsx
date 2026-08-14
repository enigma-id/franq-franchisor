import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const userGroupApi = createApi({
  reducerPath: "userGroupApi",
  baseQuery,
  tagTypes: ["UserGroup"],
  endpoints: (builder) => ({
    getUserGroups: builder.query({
      query: (params) => ({
        url: "/usergroup",
        method: "GET",
        params,
      }),
    }),

    getUserGroup: builder.query({
      query: ({ id, ...params }) => ({
        url: `/usergroup/${id}`,
        method: "GET",
        params,
      }),
    }),

    createUserGroup: builder.mutation({
      query: (payload) => ({
        url: "/usergroup",
        method: "POST",
        body: payload,
      }),
    }),

    updateUserGroup: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/usergroup/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteUserGroup: builder.mutation({
      query: (id) => ({
        url: `/usergroup/${id}`,
        method: "DELETE",
      }),
    }),

    activateUserGroup: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/usergroup/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateUserGroup: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/usergroup/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetUserGroupsQuery,
  useLazyGetUserGroupQuery,
  useCreateUserGroupMutation,
  useUpdateUserGroupMutation,
  useDeleteUserGroupMutation,
  useActivateUserGroupMutation,
  useDeactivateUserGroupMutation,
} = userGroupApi;
