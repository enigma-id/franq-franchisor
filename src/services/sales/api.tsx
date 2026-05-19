import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery,
  tagTypes: ["SalesOrder"],
  endpoints: (builder) => ({
    /** GET /sales/order - List sales orders */
    getSalesOrders: builder.query({
      query: (params) => ({
        url: "/sales/order",
        method: "GET",
        params,
      }),
    }),

    /** GET /sales/order/:id - Get sales order detail */
    getSalesOrder: builder.query({
      query: ({ id, ...params }) => ({
        url: `/sales/order/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /sales/order - Create sales order */
    createSalesOrder: builder.mutation({
      query: (payload) => ({
        url: "/sales/order",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /sales/order/:id - Update sales order */
    updateSalesOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/order/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /sales/order/:id - Delete sales order */
    deleteSalesOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/order/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /** PUT /sales/order/:id/publish - Publish sales order */
    publishSalesOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/order/${id}/publish`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /sales/order/:id/paid - Mark sales order as paid */
    paidSalesOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/order/${id}/paid`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetSalesOrdersQuery,
  useLazyGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  usePublishSalesOrderMutation,
  usePaidSalesOrderMutation,
} = salesApi;
