import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const posApi = createApi({
  reducerPath: "posApi",
  baseQuery,
  tagTypes: ["POSMenu", "POSCategory", "POSChannel"],
  endpoints: (builder) => ({
    // ── /pos/menu ──

    /**
     * GET /pos/menu
     * Dipakai dropdown add-on (form menu) & pemilihan menu di form B2B order.
     * CRUD menu dipindah ke `/inventory/product` (lihat services/product).
     */
    getMenus: builder.query({
      query: (params) => ({
        url: "/pos/menu",
        method: "GET",
        params,
      }),
    }),

    /** GET /pos/menu/price - Get menu items with channel pricing */
    getMenuPrices: builder.query({
      query: (params) => ({
        url: "/pos/menu/price",
        method: "GET",
        params,
      }),
    }),

    // ── /pos/category ──

    getCategories: builder.query({
      query: (params) => ({
        url: "/pos/category",
        method: "GET",
        params,
      }),
    }),

    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/pos/category",
        method: "POST",
        body: payload,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    activateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/category/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    // ── /pos/channel ──

    getChannels: builder.query({
      query: (params) => ({
        url: "/pos/channel",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetMenusQuery,
  useLazyGetMenuPricesQuery,
  useLazyGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
  useLazyGetChannelsQuery,
} = posApi;
