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
  useLazyGetOutletReportQuery,
  useLazyGetOutletReportSummaryQuery,
  useLazyGetSessionReportQuery,
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
  useLazyGetPointLogQuery,
  useLazyGetPointLogSummaryQuery,
  useLazyGetMembershipSettlementQuery,
  useLazyGetMembershipSettlementSummaryQuery,
  useLazyGetMembershipSettlementDetailQuery,
  useLazyGetMembershipSettlementItemsQuery,
  useLazyGetMembershipSettlementItemsSummaryQuery,
  useSettleMembershipSettlementMutation,
  useUnsettleMembershipSettlementMutation,
  useReconcileMembershipSettlementMutation,
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
    outletReport: useLazyGetOutletReportQuery,
    outletReportSummary: useLazyGetOutletReportSummaryQuery,
    sessionReport: useLazyGetSessionReportQuery,
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

export const useMembershipReport = createCrudHook<any>({
  entityName: "membership-report",
  additionalQueries: {
    membership: useLazyGetMembershipQuery,
    membershipSummary: useLazyGetMembershipSummaryQuery,
    saldoLog: useLazyGetSaldoLogQuery,
    saldoLogSummary: useLazyGetSaldoLogSummaryQuery,
    pointLog: useLazyGetPointLogQuery,
    pointLogSummary: useLazyGetPointLogSummaryQuery,
    settlement: useLazyGetMembershipSettlementQuery,
    settlementSummary: useLazyGetMembershipSettlementSummaryQuery,
    settlementDetail: useLazyGetMembershipSettlementDetailQuery,
    settlementItems: useLazyGetMembershipSettlementItemsQuery,
    settlementItemsSummary: useLazyGetMembershipSettlementItemsSummaryQuery,
  },
  // Aksi HO (superuser only) — {id} = id header settlement.
  customOperations: {
    settle: {
      hook: useSettleMembershipSettlementMutation,
      errorMessage: "Failed to settle membership settlement",
    },
    unsettle: {
      hook: useUnsettleMembershipSettlementMutation,
      errorMessage: "Failed to unsettle membership settlement",
    },
    reconcile: {
      hook: useReconcileMembershipSettlementMutation,
      errorMessage: "Failed to reconcile membership settlement",
    },
  },
});
