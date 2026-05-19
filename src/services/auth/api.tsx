import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    /**
     * POST /auth/signin
     * User login
     */
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/signin",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * GET /auth/me
     * Get current user
     */
    getMe: builder.query({
      query: (params) => ({
        url: "/auth/me",
        method: "GET",
        params,
      }),
    }),

    /**
     * PUT /auth/me
     * Update current user
     */
    updateMe: builder.mutation({
      query: (payload) => ({
        url: "/auth/me",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetMeQuery,
  useUpdateMeMutation,
} = authApi;
