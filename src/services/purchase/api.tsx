import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery,
  tagTypes: ["PurchaseOrder"],
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query({
      query: (params) => ({
        url: "/purchase/order",
        method: "GET",
        params,
      }),
    }),

    getPurchaseOrder: builder.query({
      query: (id) => ({
        url: `/purchase/order/${id}`,
        method: "GET",
      }),
    }),

    createPurchaseOrder: builder.mutation({
      query: (payload) => ({
        url: "/purchase/order",
        method: "POST",
        body: payload,
      }),
    }),

    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deletePurchaseOrder: builder.mutation({
      query: (id) => ({
        url: `/purchase/order/${id}`,
        method: "DELETE",
      }),
    }),

    approvePurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}/publish`,
        method: "PUT",
        body: payload,
      }),
    }),

    paymentPurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}/payment`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery,
  useLazyGetPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  usePaymentPurchaseOrderMutation,
} = purchaseApi;
