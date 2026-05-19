import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    /**
     * GET /user
     * List user with pagination
     */
    getUser: builder.query({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /user/:id
     * Get customer detail
     */
    showUser: builder.query({
      query: ({ id, ...params }) => ({
        url: `/user/${id}`,
        method: "GET",
        params,
      }),
    }),
    /**
     * POST /user
     * Create new user
     */
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/user",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /user/:id
     * Update user
     */
    updateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /user/:id
     * Delete user (soft delete)
     */
    removeUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /**
     * PUT /user/:id/activate
     * Activate user
     */
    activateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/user/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /user/:id/deactivate
     * Deactivate user
     */
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
  useLazyGetUserQuery,
  useLazyShowUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useRemoveUserMutation,
} = userApi;
