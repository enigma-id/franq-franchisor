import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const franchiseApi = createApi({
  reducerPath: "franchiseApi",
  baseQuery,
  tagTypes: ["Franchise"],
  endpoints: (builder) => ({
    /**
     * GET /franchise/:id
     * Get franchise detail
     */
    getFranchise: builder.query({
      query: ({ id, ...params }) => ({
        url: `/franchise/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * PUT /franchise/:id
     * Update franchise
     */
    updateFranchise: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchise/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetFranchiseQuery,
  useUpdateFranchiseMutation,
} = franchiseApi;
