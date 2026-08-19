import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const outletApi = createApi({
  reducerPath: "outletApi",
  baseQuery,
  tagTypes: ["Outlet", "OutletType"],
  endpoints: (builder) => ({
    // ── /outlet ──

    /**
     * GET /outlet
     * List outlets
     */
    getOutlets: builder.query({
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
    getOutlet: builder.query({
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
     * Delete outlet
     */
    deleteOutlet: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Active outlet
     */
    activateOutlet: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Deactive outlet
     */
    deactivateOutlet: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Channels outlet
     */
    updateChannelOutlet: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/${id}/channels`,
        method: "PUT",
        body: payload,
      }),
    }),

    // ── /outlet/type ──

    /**
     * GET /outlet/type
     * List outlet types
     */
    getOutletTypes: builder.query({
      query: (params) => ({
        url: "/outlet/type",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /outlet/:id
     * Get outlet detail
     */
    getOutletType: builder.query({
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
    createOutletType: builder.mutation({
      query: (payload) => ({
        url: "/outlet/type",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Update outlet
     */
    updateOutletType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/type/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /outlet/:id
     * Delete outlet
     */
    deleteOutletType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/type/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Active outlet
     */
    activateOutletType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/type/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /outlet/:id
     * Deactive outlet
     */
    deactivateOutletType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet/type/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetOutletsQuery,
  useLazyGetOutletQuery,
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
  useActivateOutletMutation,
  useDeactivateOutletMutation,
  useUpdateChannelOutletMutation,

  useLazyGetOutletTypesQuery,
  useLazyGetOutletTypeQuery,
  useCreateOutletTypeMutation,
  useUpdateOutletTypeMutation,
  useDeleteOutletTypeMutation,
  useActivateOutletTypeMutation,
  useDeactivateOutletTypeMutation,
} = outletApi;
