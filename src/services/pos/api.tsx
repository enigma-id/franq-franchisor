import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const posApi = createApi({
  reducerPath: "posApi",
  baseQuery,
  tagTypes: [
    "POSCatalog",
    "POSCategory",
    "POSChannel",
    "POSPaymentMethod",
    "POSTopupSchema",
  ],
  endpoints: (builder) => ({
    // ── /pos/catalog ──

    /** GET /pos/catalog - List catalogs */
    getCatalogs: builder.query({
      query: (params) => ({
        url: "/pos/catalog",
        method: "GET",
        params,
      }),
    }),

    /** GET /pos/catalog/:id - Get catalog detail */
    showCatalog: builder.query({
      query: ({ id, ...params }) => ({
        url: `/pos/catalog/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /pos/catalog - Create catalog */
    createCatalog: builder.mutation({
      query: (payload) => ({
        url: "/pos/catalog",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /pos/catalog/:id - Update catalog */
    updateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/catalog/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /pos/catalog/:id/activate - Activate catalog */
    activateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/catalog/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /pos/catalog/:id/deactivate - Deactivate catalog */
    deactivateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/catalog/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /pos/catalog/:id - Delete catalog */
    deleteCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/catalog/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /pos/category ──

    /** GET /pos/category - List categories */
    getCategories: builder.query({
      query: (params) => ({
        url: "/pos/category",
        method: "GET",
        params,
      }),
    }),

    /** GET /pos/category/:id - Get category detail */
    showCategory: builder.query({
      query: ({ id, ...params }) => ({
        url: `/pos/category/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /pos/category - Create category */
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/pos/category",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /pos/category/:id - Update category */
    updateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /pos/category/:id/activate - Activate category */
    activateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /pos/category/:id/deactivate - Deactivate category */
    deactivateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /pos/category/:id - Delete category */
    deleteCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /pos/channel ──

    /** GET /pos/channel - List channels */
    getChannels: builder.query({
      query: (params) => ({
        url: "/pos/channel",
        method: "GET",
        params,
      }),
    }),

    /** GET /pos/channel/:id - Get channel detail */
    showChannel: builder.query({
      query: ({ id, ...params }) => ({
        url: `/pos/channel/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /pos/channel - Create channel */
    createChannel: builder.mutation({
      query: (payload) => ({
        url: "/pos/channel",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /pos/channel/:id - Update channel */
    updateChannel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/channel/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /pos/channel/:id - Delete channel */
    deleteChannel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/channel/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /pos/payment-method ──

    /** GET /pos/payment-method - List payment methods */
    getPaymentMethods: builder.query({
      query: (params) => ({
        url: "/pos/payment-method",
        method: "GET",
        params,
      }),
    }),

    /** GET /pos/payment-method/:id - Get payment method detail */
    showPaymentMethod: builder.query({
      query: ({ id, ...params }) => ({
        url: `/pos/payment-method/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /pos/payment-method - Create payment method */
    createPaymentMethod: builder.mutation({
      query: (payload) => ({
        url: "/pos/payment-method",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /pos/payment-method/:id - Update payment method */
    updatePaymentMethod: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/payment-method/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /pos/payment-method/:id - Delete payment method */
    deletePaymentMethod: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/payment-method/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /pos/topup-schema ──

    /** GET /pos/topup-schema - List topup schemas */
    getTopupSchemas: builder.query({
      query: (params) => ({
        url: "/pos/topup-schema",
        method: "GET",
        params,
      }),
    }),

    /** GET /pos/topup-schema/:id - Get topup schema detail */
    showTopupSchema: builder.query({
      query: ({ id, ...params }) => ({
        url: `/pos/topup-schema/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /pos/topup-schema - Create topup schema */
    createTopupSchema: builder.mutation({
      query: (payload) => ({
        url: "/pos/topup-schema",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /pos/topup-schema/:id - Update topup schema */
    updateTopupSchema: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/topup-schema/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /pos/topup-schema/:id - Delete topup schema */
    deleteTopupSchema: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/topup-schema/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  // Catalog
  useLazyGetCatalogsQuery,
  useLazyShowCatalogQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
  useDeleteCatalogMutation,

  // Category
  useLazyGetCategoriesQuery,
  useLazyShowCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
  useDeleteCategoryMutation,

  // Channel
  useLazyGetChannelsQuery,
  useLazyShowChannelQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,

  // Payment Method
  useLazyGetPaymentMethodsQuery,
  useLazyShowPaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,

  // Topup Schema
  useLazyGetTopupSchemasQuery,
  useLazyShowTopupSchemaQuery,
  useCreateTopupSchemaMutation,
  useUpdateTopupSchemaMutation,
  useDeleteTopupSchemaMutation,
} = posApi;
