import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery,
  tagTypes: ["PurchaseOrder"],
  endpoints: (builder) => ({
    get: builder.query({
      query: (params) => ({
        url: "/purchase/order",
        method: "GET",
        params,
      }),
    }),

    show: builder.query({
      query: ({ id, ...params }) => ({
        url: `/purchase/order/${id}`,
        method: "GET",
        params,
      }),
    }),

    create: builder.mutation({
      query: (payload) => ({
        url: "/purchase/order",
        method: "POST",
        body: payload,
      }),
    }),

    update: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    delete: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    publish: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}/publish`,
        method: "PUT",
        body: payload,
      }),
    }),

    paid: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}/paid`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetQuery,
  useLazyShowQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  usePublishMutation,
  usePaidMutation,
} = purchaseApi;
