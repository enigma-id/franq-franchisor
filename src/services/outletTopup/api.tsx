import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const outletTopupApi = createApi({
  reducerPath: "outletTopupApi",
  baseQuery,
  tagTypes: ["OutletTopup"],
  endpoints: (builder) => ({
    getOutletTopups: builder.query({
      query: (params) => ({
        url: "/outlet-topup-request",
        method: "GET",
        params,
      }),
    }),

    getOutletTopup: builder.query({
      query: ({ id, ...params }) => ({
        url: `/outlet-topup-request/${id}`,
        method: "GET",
        params,
      }),
    }),

    approveOutletTopup: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet-topup-request/${id}/approve`,
        method: "PUT",
        body: payload,
      }),
    }),

    rejectOutletTopup: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet-topup-request/${id}/reject`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetOutletTopupsQuery,
  useLazyGetOutletTopupQuery,
  useApproveOutletTopupMutation,
  useRejectOutletTopupMutation,
} = outletTopupApi;
