import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const posApi = createApi({
  reducerPath: "posApi",
  baseQuery,
  tagTypes: ["POSMenu", "POSCategory", "POSChannel"],
  endpoints: (builder) => ({
    // ── /pos/menu ──

    getMenus: builder.query({
      query: (params) => ({
        url: "/pos/menu",
        method: "GET",
        params,
      }),
    }),

    getMenu: builder.query({
      query: (id) => ({
        url: `/pos/menu/${id}`,
        method: "GET",
      }),
    }),

    createMenu: builder.mutation({
      query: (payload) => ({
        url: "/pos/menu",
        method: "POST",
        body: payload,
      }),
    }),

    updateMenu: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/menu/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `/pos/menu/${id}`,
        method: "DELETE",
      }),
    }),

    activateMenu: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/menu/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateMenu: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/menu/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    updateMenuTypes: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/menu/${id}/types`,
        method: "PUT",
        body: payload,
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
      query: (id) => ({
        url: `/pos/category/${id}`,
        method: "DELETE",
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

    createChannel: builder.mutation({
      query: (payload) => ({
        url: "/pos/channel",
        method: "POST",
        body: payload,
      }),
    }),

    updateChannel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/channel/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteChannel: builder.mutation({
      query: (id) => ({
        url: `/pos/channel/${id}`,
        method: "DELETE",
      }),
    }),

    activateChannel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/channel/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateChannel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/pos/channel/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetMenusQuery,
  useLazyGetMenusQuery,
  useGetMenuQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useActivateMenuMutation,
  useDeactivateMenuMutation,
  useUpdateMenuTypesMutation,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
  useActivateChannelMutation,
  useDeactivateChannelMutation,
} = posApi;
