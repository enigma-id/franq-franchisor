import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  baseQuery,
  tagTypes: ["Warehouse", "DeliveryPlan", "ReceivingPlan"],
  endpoints: (builder) => ({
    getWarehouses: builder.query({
      query: (params) => ({
        url: "/warehouse",
        method: "GET",
        params,
      }),
    }),

    // ─── Delivery Plan ─────────────────────────────────────────────────────
    getDeliveryPlans: builder.query({
      query: (params) => ({
        url: "/delivery/plan",
        method: "GET",
        params,
      }),
    }),
    getDeliveryPlan: builder.query({
      query: ({ id, ...params }) => ({
        url: `/delivery/plan/${id}`,
        method: "GET",
        params,
      }),
    }),
    getDeliveryPlanSummary: builder.query({
      query: (params) => ({
        url: "/delivery/plan/summary",
        method: "GET",
        params,
      }),
    }),
    completeDeliveryPlan: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/delivery/plan/${id}/complete`,
        method: "PUT",
        body,
      }),
    }),
    deliverDeliveryPlan: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/delivery/plan/${id}/delivered`,
        method: "PUT",
        body,
      }),
    }),
    fulfilledDeliveryPlan: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/delivery/fulfillment/${id}/fulfilled`,
        method: "PUT",
        body,
      }),
    }),

    // ─── Receiving Plan ────────────────────────────────────────────────────
    getReceivingPlans: builder.query({
      query: (params) => ({
        url: "/receiving/plan",
        method: "GET",
        params,
      }),
    }),
    getReceivingPlan: builder.query({
      query: ({ id, ...params }) => ({
        url: `/receiving/plan/${id}`,
        method: "GET",
        params,
      }),
    }),
    getReceivingPlanSummary: builder.query({
      query: (params) => ({
        url: "/receiving/plan/summary",
        method: "GET",
        params,
      }),
    }),
    completeReceivingPlan: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/receiving/plan/${id}/complete`,
        method: "PUT",
        body,
      }),
    }),
    getReceivings: builder.query({
      query: (params) => ({
        url: "/receiving",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetWarehousesQuery,
  useLazyGetDeliveryPlansQuery,
  useLazyGetDeliveryPlanQuery,
  useLazyGetDeliveryPlanSummaryQuery,
  useCompleteDeliveryPlanMutation,
  useDeliverDeliveryPlanMutation,
  useFulfilledDeliveryPlanMutation,
  useLazyGetReceivingPlansQuery,
  useLazyGetReceivingPlanQuery,
  useLazyGetReceivingPlanSummaryQuery,
  useCompleteReceivingPlanMutation,
  useLazyGetReceivingsQuery,
} = warehouseApi;
