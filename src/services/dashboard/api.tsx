import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    /**
     * GET /report/dashboard/sales
     * Get dashboard sales data
     */
    getDashboardSales: builder.query({
      query: (params) => ({
        url: "/report/dashboard/sales",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /report/dashboard/item
     * Get dashboard item data
     */
    getDashboardItem: builder.query({
      query: (params) => ({
        url: "/report/dashboard/item",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /report/dashboard/graph
     * Get dashboard graph data
     */
    getDashboardGraph: builder.query({
      query: (params) => ({
        url: "/report/dashboard/graph",
        method: "GET",
        params,
      }),
    }),

    /**
     * GET /report/dashboard/commission
     * Get dashboard commission data
     */
    getDashboardCommission: builder.query({
      query: (params) => ({
        url: "/report/dashboard/commission",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetDashboardSalesQuery,
  useLazyGetDashboardItemQuery,
  useLazyGetDashboardGraphQuery,
  useLazyGetDashboardCommissionQuery,
} = dashboardApi;
