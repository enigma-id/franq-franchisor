import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const userGroupApi = createApi({
  reducerPath: "userGroupApi",
  baseQuery,
  tagTypes: ["UserGroup"],
  endpoints: (builder) => ({
    getUserGroups: builder.query({
      query: (params) => ({
        url: "/user/usergroup",
        method: "GET",
        params,
      }),
    }),

    getUserGroup: builder.query({
      query: ({ id, ...params }) => ({
        url: `/user/usergroup/${id}`,
        method: "GET",
        params,
      }),
    }),

    createUserGroup: builder.mutation({
      query: (payload) => ({
        url: "/user/usergroup",
        method: "POST",
        body: payload,
      }),
    }),

    updateUserGroup: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/usergroup/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteUserGroup: builder.mutation({
      query: (id) => ({
        url: `/user/usergroup/${id}`,
        method: "DELETE",
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
} = userGroupApi;
