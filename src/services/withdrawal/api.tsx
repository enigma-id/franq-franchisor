import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const withdrawalApi = createApi({
  reducerPath: "withdrawalApi",
  baseQuery,
  tagTypes: ["Withdrawal"],
  endpoints: (builder) => ({
    getList: builder.query({
      query: (params) => ({
        url: "/withdrawal-request",
        method: "GET",
        params,
      }),
    }),
    show: builder.query({
      query: ({ id, ...params }) => ({
        url: `/withdrawal-request/${id}`,
        method: "GET",
        params,
      }),
    }),
    approve: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/withdrawal-request/${id}/approve`,
        method: "PUT",
        body: payload,
      }),
    }),
    reject: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/withdrawal-request/${id}/reject`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetListQuery,
  useLazyShowQuery,
  useApproveMutation,
  useRejectMutation,
} = withdrawalApi;
