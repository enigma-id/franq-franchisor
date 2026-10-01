import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

/**
 * Resource agregat `product` (item -> catalog -> menu) — service franchisor.
 * Identitas produk = `menu.id`.
 */
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    /**
     * GET /inventory/product
     * List menu (+ category) dengan pagination.
     */
    getProducts: builder.query({
      query: (params) => ({
        url: "/inventory/product",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /inventory/product/:id
     * Detail rantai penuh: { item|null, catalog|null, menu }.
     */
    getProduct: builder.query({
      query: ({ id, ...params }) => ({
        url: `/inventory/product/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /inventory/product
     * Payload ramping — item/catalog/resep di-derive backend.
     */
    createProduct: builder.mutation({
      query: (payload) => ({
        url: "/inventory/product",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/product/:id
     */
    updateProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/product/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /inventory/product/:id
     * Soft-delete cascade: menu -> catalog -> item (addon: menu saja).
     */
    deleteProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/product/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/product/:id/activate
     * Toggle is_active menu + catalog + item serentak (addon: menu saja).
     */
    activateProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/product/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/product/:id/deactivate
     */
    deactivateProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/product/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetProductsQuery,
  useLazyGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useActivateProductMutation,
  useDeactivateProductMutation,
} = productApi;
