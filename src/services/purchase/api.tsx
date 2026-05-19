import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery,
  tagTypes: ["PurchaseOrder", "Supplier"],
  endpoints: (builder) => ({
    // ── /purchase/order ──

    /** GET /purchase/order - List purchase orders */
    getPurchaseOrders: builder.query({
      query: (params) => ({
        url: "/purchase/order",
        method: "GET",
        params,
      }),
    }),

    /** GET /purchase/order/:id - Get purchase order detail */
    getPurchaseOrder: builder.query({
      query: ({ id, ...params }) => ({
        url: `/purchase/order/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /purchase/order - Create purchase order */
    createPurchaseOrder: builder.mutation({
      query: (payload) => ({
        url: "/purchase/order",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /purchase/order/:id - Update purchase order */
    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /purchase/order/:id/publish - Approve purchase order */
    approvePurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}/publish`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /purchase/order/:id/payment - Payment purchase order */
    paymentPurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}/payment`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /purchase/order/:id - Delete purchase order */
    deletePurchaseOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/purchase/order/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /supplier ──

    /** GET /supplier - List suppliers */
    getSuppliers: builder.query({
      query: (params) => ({
        url: "/supplier",
        method: "GET",
        params,
      }),
    }),

    /** GET /supplier/:id - Get supplier detail */
    getSupplier: builder.query({
      query: ({ id, ...params }) => ({
        url: `/supplier/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /supplier - Create supplier */
    createSupplier: builder.mutation({
      query: (payload) => ({
        url: "/supplier",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /supplier/:id - Update supplier */
    updateSupplier: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/supplier/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /supplier/:id - Delete supplier */
    deleteSupplier: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/supplier/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetPurchaseOrdersQuery,
  useLazyGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  usePaymentPurchaseOrderMutation,
  useDeletePurchaseOrderMutation,

  useLazyGetSuppliersQuery,
  useLazyGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = purchaseApi;
