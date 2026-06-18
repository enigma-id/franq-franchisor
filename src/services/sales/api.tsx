import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery,
  tagTypes: ["SalesOrder"],
  endpoints: (builder) => ({
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

    /** PUT /sales/order/:id/paid - Cancel sales order */
    cancelSalesOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/order/${id}/cancel`,
        method: "PUT",
        body: payload,
      }),
    }),

    // ===================================================

    /** GET /sales/return/:id - Get sales return detail */
    getSalesReturn: builder.query({
      query: ({ id, ...params }) => ({
        url: `/sales/return/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /sales/return - Create sales return */
    createSalesReturn: builder.mutation({
      query: (payload) => ({
        url: "/sales/return",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /sales/return/:id - Update sales return */
    updateSalesReturn: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/return/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /sales/return/:id - Delete sales return */
    deleteSalesReturn: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/return/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /** PUT /sales/return/:id/approve - Approve sales return */
    approveSalesReturn: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/return/${id}/approve`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /sales/return/:id/reject - Reject sales return */
    rejectSalesReturn: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/return/${id}/reject`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  usePublishSalesOrderMutation,
  usePaidSalesOrderMutation,
  useCancelSalesOrderMutation,
  //
  useLazyGetSalesReturnQuery,
  useCreateSalesReturnMutation,
  useUpdateSalesReturnMutation,
  useDeleteSalesReturnMutation,
  useApproveSalesReturnMutation,
  useRejectSalesReturnMutation,
} = salesApi;
