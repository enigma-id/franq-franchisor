import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  baseQuery,
  tagTypes: ["Warehouse"],
  endpoints: (builder) => ({
    getWarehouses: builder.query({
      query: (params) => ({
        url: "/warehouse",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useLazyGetWarehousesQuery } = warehouseApi;
