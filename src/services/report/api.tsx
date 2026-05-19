import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery,
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    // POS Settlement

    /** GET /report/pos/settlement - Get settlement data */
    getSettlement: builder.query({
      query: (params) => ({
        url: "/report/pos/settlement",
        method: "GET",
        params,
      }),
    }),

    /** GET /report/pos/settlement/summary - Get settlement summary */
    getSettlementSummary: builder.query({
      query: (params) => ({
        url: "/report/pos/settlement/summary",
        method: "GET",
        params,
      }),
    }),

    // POS Item Sales Daily

    /** GET /report/pos/item/sales/daily - Get item sales daily */
    getItemSalesDaily: builder.query({
      query: (params) => ({
        url: "/report/pos/item/sales/daily",
        method: "GET",
        params,
      }),
    }),

    // POS Order Summary

    /** GET /report/pos/order/summary - Get sales order summary */
    getSalesOrderSummary: builder.query({
      query: (params) => ({
        url: "/report/pos/order/summary",
        method: "GET",
        params,
      }),
    }),

    // POS Outstanding Summary

    /** GET /report/pos/order/outstanding/summary - Get outstanding summary */
    getOutstandingSummary: builder.query({
      query: (params) => ({
        url: "/report/pos/order/outstanding/summary",
        method: "GET",
        params,
      }),
    }),

    // Membership

    /** GET /report/membership - Get membership report */
    getMembership: builder.query({
      query: (params) => ({
        url: "/report/membership",
        method: "GET",
        params,
      }),
    }),

    /** GET /report/membership/summary - Get membership saldo summary */
    getMembershipSaldoSummary: builder.query({
      query: (params) => ({
        url: "/report/membership/summary",
        method: "GET",
        params,
      }),
    }),

    /** GET /report/membership/:id - Get membership detail */
    showMembership: builder.query({
      query: ({ id, ...params }) => ({
        url: `/report/membership/${id}`,
        method: "GET",
        params,
      }),
    }),

    // Stock Report

    /** GET /report/stock - Get stock report */
    getStockReport: builder.query({
      query: (params) => ({
        url: "/report/stock",
        method: "GET",
        params,
      }),
    }),

    // Sales Report (alias for item sales daily)

    /** GET /report/sales - Get sales report */
    getSalesReport: builder.query({
      query: (params) => ({
        url: "/report/pos/item/sales/daily",
        method: "GET",
        params,
      }),
    }),

    // Settlement Report (alias for settlement)

    /** GET /report/settlement - Get settlement report */
    getSettlementReport: builder.query({
      query: (params) => ({
        url: "/report/pos/settlement",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetSettlementQuery,
  useLazyGetSettlementSummaryQuery,
  useLazyGetItemSalesDailyQuery,
  useLazyGetSalesOrderSummaryQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetMembershipQuery,
  useLazyGetMembershipSaldoSummaryQuery,
  useLazyShowMembershipQuery,
  useLazyGetStockReportQuery,
  useLazyGetSalesReportQuery,
  useLazyGetSettlementReportQuery,
} = reportApi;
