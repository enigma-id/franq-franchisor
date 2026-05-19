import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery,
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    /**
     * GET /catalog/type
     * List catalog types with pagination
     */
    getTypes: builder.query({
      query: (params) => ({
        url: "/catalog/type",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /catalog/type/:id
     * Get catalog type detail
     */
    showType: builder.query({
      query: ({ id, ...params }) => ({
        url: `/catalog/type/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /catalog/type
     * Create new catalog type
     */
    createType: builder.mutation({
      query: (payload) => ({
        url: "/catalog/type",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /catalog/type/:id
     * Update catalog type
     */
    updateType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/catalog/type/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /catalog/type/:id
     * Delete catalog type (soft delete)
     */
    removeType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/catalog/type/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetTypesQuery,
  useLazyShowTypeQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useRemoveTypeMutation,
} = catalogApi;
