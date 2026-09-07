import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const franchisorApi = createApi({
  reducerPath: "franchisorApi",
  baseQuery,
  tagTypes: ["Franchisor", "FranchisorList"],
  endpoints: (builder) => ({
    // ── CRUD baris franchisor / brand (khusus superuser) ──

    /** GET /franchisor - list brand/franchisor (pagination/search) */
    listFranchisors: builder.query({
      query: (params) => ({
        url: "/franchisor",
        method: "GET",
        params,
      }),
    }),

    /** GET /franchisor/:id - detail brand/franchisor */
    getFranchisorById: builder.query({
      query: ({ id, ...params }) => ({
        url: `/franchisor/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /franchisor - create brand (superuser) + auto-create outlet & owner */
    createFranchisor: builder.mutation({
      query: (payload) => ({
        url: "/franchisor",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /franchisor/:id - update brand (superuser) */
    updateFranchisorById: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchisor/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /franchisor/:id - soft delete brand (superuser) */
    deleteFranchisorById: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchisor/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /** PUT /franchisor/:id/activate */
    activateFranchisor: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchisor/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /franchisor/:id/deactivate */
    deactivateFranchisor: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchisor/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyListFranchisorsQuery,
  useLazyGetFranchisorByIdQuery,
  useCreateFranchisorMutation,
  useUpdateFranchisorByIdMutation,
  useDeleteFranchisorByIdMutation,
  useActivateFranchisorMutation,
  useDeactivateFranchisorMutation,
} = franchisorApi;
