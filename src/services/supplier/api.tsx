import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery,
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
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

    activateSupplier: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/supplier/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateSupplier: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/supplier/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetSuppliersQuery,
  useLazyGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useActivateSupplierMutation,
  useDeactivateSupplierMutation,
} = supplierApi;
