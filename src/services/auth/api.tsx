import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type {
  SignupRequest,
  LoginRequest,
  LoginResponse,
  ProfileUpdateRequest,
  User,
} from "../types/auth";
import type { ApiResponse } from "../types/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    /**
     * POST /auth/signup
     * User registration
     */
    signup: builder.mutation<
      ApiResponse<{ user: User; access_token: string }>,
      SignupRequest
    >({
      query: (payload) => ({
        url: "/auth/signup",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * POST /auth/login
     * User login
     */
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * GET /profile/me
     * Get current user profile
     */
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/profile/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    /**
     * POST /profile/me
     * Update current user profile
     */
    updateMe: builder.mutation<ApiResponse<User>, ProfileUpdateRequest>({
      query: (payload) => ({
        url: "/profile/me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLazyGetMeQuery,
  useUpdateMeMutation,
} = authApi;
