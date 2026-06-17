import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (params) => ({
        url: "/dashboard",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useLazyGetDashboardQuery } = dashboardApi;
