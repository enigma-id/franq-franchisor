import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const b2bApi = createApi({
  reducerPath: "b2bApi",
  baseQuery,
  tagTypes: ["B2BOrder"],
  endpoints: (builder) => ({
    getB2BOrders: builder.query({
      query: (params) => ({
        url: "/b2b/order",
        method: "GET",
        params,
      }),
    }),

    getB2BOrder: builder.query({
      query: ({ id, ...params }) => ({
        url: `/b2b/order/${id}`,
        method: "GET",
        params,
      }),
    }),

    createB2BOrder: builder.mutation({
      query: (payload) => ({
        url: "/b2b/order",
        method: "POST",
        body: payload,
      }),
    }),

    updateB2BOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/b2b/order/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteB2BOrder: builder.mutation({
      query: ({ id, payload = {} }) => ({
        url: `/b2b/order/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    shipB2BOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/b2b/order/${id}/ship`,
        method: "PUT",
        body: payload,
      }),
    }),

    receiveB2BOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/b2b/order/${id}/receive`,
        method: "PUT",
        body: payload,
      }),
    }),

    invoiceB2BOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/b2b/order/${id}/invoice`,
        method: "PUT",
        body: payload,
      }),
    }),

    payB2BOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/b2b/order/${id}/pay`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetB2BOrdersQuery,
  useLazyGetB2BOrderQuery,
  useCreateB2BOrderMutation,
  useUpdateB2BOrderMutation,
  useDeleteB2BOrderMutation,
  useShipB2BOrderMutation,
  useReceiveB2BOrderMutation,
  useInvoiceB2BOrderMutation,
  usePayB2BOrderMutation,
} = b2bApi;
