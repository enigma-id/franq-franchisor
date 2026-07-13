import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params,
      }),
    }),

    getUser: builder.query({
      query: ({ id, ...params }) => ({
        url: `/user/${id}`,
        method: "GET",
        params,
      }),
    }),

    createUser: builder.mutation({
      query: (payload) => ({
        url: "/user",
        method: "POST",
        body: payload,
      }),
    }),

    updateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),

    activateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
} = userApi;
