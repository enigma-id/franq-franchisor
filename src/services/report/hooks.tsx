/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCrudHook } from "../hooks/createCrudHook";
import {
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
} from "./api";

export const useReport = createCrudHook<any>({
  entityName: "report",
  additionalQueries: {
    outstanding: useLazyGetOutstandingQuery,
    outstandingSummary: useLazyGetOutstandingSummaryQuery,
    productSales: useLazyGetProductSalesQuery,
    productSalesSummary: useLazyGetProductSalesSummaryQuery,
    rawMaterial: useLazyGetRawMaterialSalesQuery,
    rawMaterialSummary: useLazyGetRawMaterialSalesSummaryQuery,
    warehouseStock: useLazyGetWarehouseStockQuery,
  },
});

export const usePOSReport = createCrudHook<any>({
  entityName: "pos-report",
  additionalQueries: {
    settlement: useLazyGetPOSSettlementQuery,
    settlementSummary: useLazyGetPOSSettlementSummaryQuery,
  },
});

export const useB2BReport = createCrudHook<any>({
  entityName: "b2b-report",
  additionalQueries: {
    settlement: useLazyGetB2BSettlementQuery,
    settlementSummary: useLazyGetB2BSettlementSummaryQuery,
    productSales: useLazyGetB2BProductSalesQuery,
    productSalesSummary: useLazyGetB2BProductSalesSummaryQuery,
  },
});
