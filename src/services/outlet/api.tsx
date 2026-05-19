import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const outletApi = createApi({
  reducerPath: "outletApi",
  baseQuery,
  tagTypes: ["Outlet"],
  endpoints: (builder) => ({
    // ── /outlet ──

    /**
     * GET /outlet
     * List outlets with pagination
     */
    getOutlet: builder.query({
      query: (params) => ({
        url: "/outlet",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /outlet/:id
     * Get outlet detail
     */
    showOutlet: builder.query({
      query: ({ id, ...params }) => ({
        url: `/outlet/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /outlet
     * Create new outlet
     */
    createOutlet: builder.mutation({
      query: (payload) => ({
        url: "/outlet",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Update outlet
     */
    updateOutlet: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /outlet/:id
     * Delete outlet (soft delete)
     */
    removeOutlet: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /outlet/type ──

    /**
     * GET /outlet/type
     * List outlet types with pagination
     */
    getTypes: builder.query({
      query: (params) => ({
        url: "/outlet/type",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /outlet/type/:id
     * Get outlet type detail
     */
    showType: builder.query({
      query: ({ id, ...params }) => ({
        url: `/outlet/type/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /outlet/type
     * Create new outlet type
     */
    createType: builder.mutation({
      query: (payload) => ({
        url: "/outlet/type",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/type/:id
     * Update outlet type
     */
    updateType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/type/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /outlet/type/:id
     * Delete outlet type (soft delete)
     */
    removeType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/type/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetOutletQuery,
  useLazyShowOutletQuery,
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useRemoveOutletMutation,
  useLazyGetTypesQuery,
  useLazyShowTypeQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useRemoveTypeMutation,
} = outletApi;
