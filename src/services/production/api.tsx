import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const productionApi = createApi({
  reducerPath: "productionApi",
  baseQuery,
  tagTypes: ["ProductionPlan"],
  endpoints: (builder) => ({
    // ── /production/plan ──

    /**
     * GET /production/plan
     * List production plans with pagination
     */
    getPlans: builder.query({
      query: (params) => ({
        url: "/production/plan",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /production/plan/:id
     * Get production plan detail
     */
    getPlan: builder.query({
      query: ({ id, ...params }) => ({
        url: `/production/plan/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /production/plan
     * Create new production plan
     */
    createPlan: builder.mutation({
      query: (payload) => ({
        url: "/production/plan",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * DELETE /production/plan/:id
     * Delete production plan
     */
    deletePlan: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/production/plan/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /**
     * PUT /production/plan/:id/publish
     * Publish production plan
     */
    publishPlan: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/production/plan/${id}/publish`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /production/plan/:id/complete
     * Complete production plan
     */
    completePlan: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/production/plan/${id}/complete`,
        method: "PUT",
        body: payload,
      }),
    }),

    // ── /production/item ──

    /**
     * PUT /production/item/:id
     * Update production item quantity
     */
    updateProductionItem: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/production/item/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /production/item/:id/complete
     * Complete production item
     */
    completeProductionItem: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/production/item/${id}/complete`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetPlansQuery,
  useLazyGetPlanQuery,
  useCreatePlanMutation,
  useDeletePlanMutation,
  usePublishPlanMutation,
  useCompletePlanMutation,
  useUpdateProductionItemMutation,
  useCompleteProductionItemMutation,
} = productionApi;
