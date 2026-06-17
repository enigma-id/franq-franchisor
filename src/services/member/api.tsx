import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const memberTopupBonusApi = createApi({
  reducerPath: "memberTopupBonusApi",
  baseQuery,
  tagTypes: ["TopupBonus"],
  endpoints: (builder) => ({
    getTopupBonuses: builder.query({
      query: (params) => ({
        url: "/member/topup-bonus",
        method: "GET",
        params,
      }),
    }),

    getTopupBonus: builder.query({
      query: (id) => ({
        url: `/member/topup-bonus/${id}`,
        method: "GET",
      }),
    }),

    createTopupBonus: builder.mutation({
      query: (payload) => ({
        url: "/member/topup-bonus",
        method: "POST",
        body: payload,
      }),
    }),

    updateTopupBonus: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/member/topup-bonus/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deleteTopupBonus: builder.mutation({
      query: (id) => ({
        url: `/member/topup-bonus/${id}`,
        method: "DELETE",
      }),
    }),

    activateTopupBonus: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/member/topup-bonus/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivateTopupBonus: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/member/topup-bonus/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetTopupBonusesQuery,
  useLazyGetTopupBonusQuery,
  useCreateTopupBonusMutation,
  useUpdateTopupBonusMutation,
  useDeleteTopupBonusMutation,
  useActivateTopupBonusMutation,
  useDeactivateTopupBonusMutation,
} = memberTopupBonusApi;
