import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const franchisorApi = createApi({
  reducerPath: "franchisorApi",
  baseQuery,
  tagTypes: ["Franchisor"],
  endpoints: (builder) => ({
    getFranchisor: builder.query({
      query: (params) => ({
        url: "/franchisor/me",
        method: "GET",
        params,
      }),
    }),

    updateFranchisor: builder.mutation({
      query: (payload) => ({
        url: "/franchisor/me",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetFranchisorQuery,
  useUpdateFranchisorMutation,
} = franchisorApi;
