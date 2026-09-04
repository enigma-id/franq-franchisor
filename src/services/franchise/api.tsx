import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const franchiseApi = createApi({
  reducerPath: "franchiseApi",
  baseQuery,
  tagTypes: ["Franchise"],
  endpoints: (builder) => ({
    getFranchises: builder.query({
      query: (params) => ({ url: "/franchise", method: "GET", params }),
    }),
    getFranchise: builder.query({
      query: ({ id, ...params }) => ({ url: `/franchise/${id}`, method: "GET", params }),
    }),
    createFranchise: builder.mutation({
      query: (payload) => ({ url: "/franchise", method: "POST", body: payload }),
    }),
    updateFranchise: builder.mutation({
      query: ({ id, ...payload }) => ({ url: `/franchise/${id}`, method: "PUT", body: payload }),
    }),
    deleteFranchise: builder.mutation({
      query: ({ id }) => ({ url: `/franchise/${id}`, method: "DELETE" }),
    }),
    activateFranchise: builder.mutation({
      query: ({ id }) => ({ url: `/franchise/${id}/activate`, method: "PUT" }),
    }),
    deactivateFranchise: builder.mutation({
      query: ({ id }) => ({ url: `/franchise/${id}/deactivate`, method: "PUT" }),
    }),
  }),
});

export const {
  useLazyGetFranchisesQuery,
  useLazyGetFranchiseQuery,
  useCreateFranchiseMutation,
  useUpdateFranchiseMutation,
  useDeleteFranchiseMutation,
  useActivateFranchiseMutation,
  useDeactivateFranchiseMutation,
} = franchiseApi;
