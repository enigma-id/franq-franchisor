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
  useLazyGetOutletMapQuery,
  useLazyGetCancelledProductSalesQuery,
  useLazyGetCancelledProductSalesSummaryQuery,
  useLazyGetTopupCancelledQuery,
  useLazyGetTopupCancelledSummaryQuery,
  useLazyGetProductItemQuery,
  useLazyGetProductItemSummaryQuery,
  useLazyGetB2BProductItemQuery,
  useLazyGetB2BProductItemSummaryQuery,
  useLazyGetOutletSaldoSummaryQuery,
} from "./api";

export const useReport = createCrudHook<any>({
  entityName: "report",
  additionalQueries: {
    productSales: useLazyGetProductSalesQuery,
    productSalesSummary: useLazyGetProductSalesSummaryQuery,
    rawMaterial: useLazyGetRawMaterialSalesQuery,
    rawMaterialSummary: useLazyGetRawMaterialSalesSummaryQuery,
    warehouseStock: useLazyGetWarehouseStockQuery,
    outletMap: useLazyGetOutletMapQuery,
    outletSaldoSummary: useLazyGetOutletSaldoSummaryQuery,
  },
});

export const usePOSReport = createCrudHook<any>({
  entityName: "pos-report",
  additionalQueries: {
    outstanding: useLazyGetOutstandingQuery,
    outstandingSummary: useLazyGetOutstandingSummaryQuery,
    settlement: useLazyGetPOSSettlementQuery,
    settlementSummary: useLazyGetPOSSettlementSummaryQuery,
    cancelledProductSales: useLazyGetCancelledProductSalesQuery,
    cancelledProductSalesSummary: useLazyGetCancelledProductSalesSummaryQuery,
    topupCancelled: useLazyGetTopupCancelledQuery,
    topupCancelledSummary: useLazyGetTopupCancelledSummaryQuery,
    productItem: useLazyGetProductItemQuery,
    productItemSummary: useLazyGetProductItemSummaryQuery,
  },
});

export const useB2BReport = createCrudHook<any>({
  entityName: "b2b-report",
  additionalQueries: {
    settlement: useLazyGetB2BSettlementQuery,
    settlementSummary: useLazyGetB2BSettlementSummaryQuery,
    productSales: useLazyGetB2BProductSalesQuery,
    productSalesSummary: useLazyGetB2BProductSalesSummaryQuery,
    productItem: useLazyGetB2BProductItemQuery,
    productItemSummary: useLazyGetB2BProductItemSummaryQuery,
  },
});
