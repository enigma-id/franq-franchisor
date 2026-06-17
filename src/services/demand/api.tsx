import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const demandApi = createApi({
  reducerPath: "demandApi",
  baseQuery,
  tagTypes: ["Demand"],
  endpoints: (builder) => ({
    getProductionDemand: builder.query({
      query: (params) => ({
        url: "/demand/production",
        method: "GET",
        params,
      }),
    }),
    getItemDemand: builder.query({
      query: (params) => ({
        url: "/demand/item",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useLazyGetProductionDemandQuery, useLazyGetItemDemandQuery } =
  demandApi;
