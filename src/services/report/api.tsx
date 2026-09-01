import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/baseQuery";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery,
  endpoints: (builder) => ({
    getOutstanding: builder.query({
      query: (params) => ({
        url: `/report/franchise/outstanding`,
        method: "GET",
        params,
      }),
    }),
    getOutstandingSummary: builder.query({
      query: (params) => ({
        url: `/report/franchise/outstanding/summary`,
        method: "GET",
        params,
      }),
    }),

    getPOSSettlement: builder.query({
      query: (params) => ({
        url: `/report/franchise/settlement`,
        method: "GET",
        params,
      }),
    }),
    getPOSSettlementSummary: builder.query({
      query: (params) => ({
        url: `/report/franchise/settlement/summary`,
        method: "GET",
        params,
      }),
    }),

    getOutletMap: builder.query({
      query: (params) => ({
        url: `/report/franchise/outlet-maps`,
        method: "GET",
        params,
      }),
    }),

    getProductSales: builder.query({
      query: (params) => ({
        url: `/report/franchise/product-sales`,
        method: "GET",
        params,
      }),
    }),
    getProductSalesSummary: builder.query({
      query: (params) => ({
        url: `/report/franchise/product-sales/summary`,
        method: "GET",
        params,
      }),
    }),

    getCancelledProductSales: builder.query({
      query: (params) => ({
        url: `/report/franchise/cancelled-product-sales`,
        method: "GET",
        params,
      }),
    }),
    getCancelledProductSalesSummary: builder.query({
      query: (params) => ({
        url: `/report/franchise/cancelled-product-sales/summary`,
        method: "GET",
        params,
      }),
    }),

    getProductItem: builder.query({
      query: (params) => ({
        url: `/report/franchise/product-item`,
        method: "GET",
        params,
      }),
    }),
    getProductItemSummary: builder.query({
      query: (params) => ({
        url: `/report/franchise/product-item/summary`,
        method: "GET",
        params,
      }),
    }),

    getB2BProductSales: builder.query({
      query: (params) => ({
        url: `/report/b2b/product-sales`,
        method: "GET",
        params,
      }),
    }),
    getB2BProductSalesSummary: builder.query({
      query: (params) => ({
        url: `/report/b2b/product-sales/summary`,
        method: "GET",
        params,
      }),
    }),

    getB2BProductItem: builder.query({
      query: (params) => ({
        url: `/report/b2b/product-item`,
        method: "GET",
        params,
      }),
    }),
    getB2BProductItemSummary: builder.query({
      query: (params) => ({
        url: `/report/b2b/product-item/summary`,
        method: "GET",
        params,
      }),
    }),

    getB2BSettlement: builder.query({
      query: (params) => ({
        url: `/report/b2b/settlement`,
        method: "GET",
        params,
      }),
    }),
    getB2BSettlementSummary: builder.query({
      query: (params) => ({
        url: `/report/b2b/settlement/summary`,
        method: "GET",
        params,
      }),
    }),

    getRawMaterialSales: builder.query({
      query: (params) => ({
        url: `/report/sales-order-item`,
        method: "GET",
        params,
      }),
    }),
    getRawMaterialSalesSummary: builder.query({
      query: (params) => ({
        url: `/report/sales-order-item/summary`,
        method: "GET",
        params,
      }),
    }),

    getWarehouseStock: builder.query({
      query: (params) => ({
        url: `/report/warehouse-stock`,
        method: "GET",
        params,
      }),
    }),

    getOutletSaldoSummary: builder.query({
      query: (params) => ({
        url: `/report/outlet-saldo/summary`,
        method: "GET",
        params,
      }),
    }),

    getMembership: builder.query({
      query: (params) => ({
        url: `/report/membership`,
        method: "GET",
        params,
      }),
    }),
    getMembershipSummary: builder.query({
      query: (params) => ({
        url: `/report/membership/summary`,
        method: "GET",
        params,
      }),
    }),

    getSaldoLog: builder.query({
      query: (params) => ({
        url: `/report/saldo/log`,
        method: "GET",
        params,
      }),
    }),
    getSaldoLogSummary: builder.query({
      query: (params) => ({
        url: `/report/saldo/log/summary`,
        method: "GET",
        params,
      }),
    }),
  }),
});

// export hooks RTK Query
export const {
  useLazyGetOutstandingQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetPOSSettlementQuery,
  useLazyGetPOSSettlementSummaryQuery,
  useLazyGetB2BSettlementQuery,
  useLazyGetB2BSettlementSummaryQuery,
  useLazyGetProductSalesQuery,
  useLazyGetProductSalesSummaryQuery,
  useLazyGetB2BProductSalesQuery,
  useLazyGetB2BProductSalesSummaryQuery,
  useLazyGetRawMaterialSalesQuery,
  useLazyGetRawMaterialSalesSummaryQuery,
  useLazyGetWarehouseStockQuery,
  useLazyGetOutletMapQuery,
  useLazyGetCancelledProductSalesQuery,
  useLazyGetCancelledProductSalesSummaryQuery,
  useLazyGetProductItemQuery,
  useLazyGetProductItemSummaryQuery,
  useLazyGetB2BProductItemQuery,
  useLazyGetB2BProductItemSummaryQuery,
  useLazyGetOutletSaldoSummaryQuery,
  useLazyGetMembershipQuery,
  useLazyGetMembershipSummaryQuery,
  useLazyGetSaldoLogQuery,
  useLazyGetSaldoLogSummaryQuery,
} = reportApi;
