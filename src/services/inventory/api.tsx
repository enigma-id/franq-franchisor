import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery,
  tagTypes: ["InventoryItem", "InventoryCatalog"],
  endpoints: (builder) => ({
    // ── /inventory/item ──

    /**
     * GET /inventory/item
     * List inventory items with pagination
     */
    getItems: builder.query({
      query: (params) => ({
        url: "/inventory/item",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /inventory/item/:id
     * Get inventory item detail
     */
    getItem: builder.query({
      query: ({ id, ...params }) => ({
        url: `/inventory/item/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /inventory/item/:id/fractions
     * Get inventory item fractions
     */
    getItemFractions: builder.query({
      query: ({ id, ...params }) => ({
        url: `/inventory/item/${id}/fractions`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /inventory/item
     * Create new inventory item
     */
    createItem: builder.mutation({
      query: (payload) => ({
        url: "/inventory/item",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/item/:id
     * Update inventory item
     */
    updateItem: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/item/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/item/:id/activate
     * Activate inventory item
     */
    activateItem: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/item/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/item/:id/deactivate
     * Deactivate inventory item
     */
    deactivateItem: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/item/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /inventory/item/:id
     * Delete inventory item (soft delete)
     */
    deleteItem: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/item/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    // ── /inventory/catalog ──

    /**
     * GET /inventory/catalog
     * List inventory catalogs with pagination
     */
    getCatalogs: builder.query({
      query: (params) => ({
        url: "/inventory/catalog",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /inventory/catalog/:id
     * Get inventory catalog detail
     */
    getCatalog: builder.query({
      query: ({ id, ...params }) => ({
        url: `/inventory/catalog/${id}`,
        method: "GET",
        params,
      }),
    }),

    /**
     * POST /inventory/catalog
     * Create new inventory catalog
     */
    createCatalog: builder.mutation({
      query: (payload) => ({
        url: "/inventory/catalog",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/catalog/:id
     * Update inventory catalog
     */
    updateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/catalog/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/catalog/:id/types
     * Update inventory catalog outlet
     */
    updateOutletCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/catalog/${id}/types`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * DELETE /inventory/catalog/:id
     * Delete inventory catalog (soft delete)
     */
    deleteCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/catalog/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/catalog/:id/activate
     * Activate inventory catalog
     */
    activateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/catalog/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /**
     * PUT /inventory/catalog/:id/deactivate
     * Deactivate inventory catalog
     */
    deactivateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/inventory/catalog/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetItemsQuery,
  useLazyGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useActivateItemMutation,
  useDeactivateItemMutation,
  useLazyGetItemFractionsQuery,

  useLazyGetCatalogsQuery,
  useLazyGetCatalogQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
  useUpdateOutletCatalogMutation,
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
} = inventoryApi;
