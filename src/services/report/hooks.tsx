import { useFormActions } from "../form/hooks";
import {
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
} from "./api";

// Report is read-only with multiple report endpoints
export const useReport = () => {
  const [triggerSettlement, settlementResult] = useLazyGetSettlementQuery();
  const [triggerSettlementSummary, settlementSummaryResult] =
    useLazyGetSettlementSummaryQuery();
  const [triggerItemSalesDaily, itemSalesDailyResult] =
    useLazyGetItemSalesDailyQuery();
  const [triggerSalesOrderSummary, salesOrderSummaryResult] =
    useLazyGetSalesOrderSummaryQuery();
  const [triggerOutstandingSummary, outstandingSummaryResult] =
    useLazyGetOutstandingSummaryQuery();
  const [triggerMembership, membershipResult] = useLazyGetMembershipQuery();
  const [triggerMembershipSaldo, membershipSaldoResult] =
    useLazyGetMembershipSaldoSummaryQuery();
  const [triggerShowMembership, showMembershipResult] =
    useLazyShowMembershipQuery();
  const [triggerStockReport, stockReportResult] = useLazyGetStockReportQuery();
  const [triggerSalesReport, salesReportResult] = useLazyGetSalesReportQuery();
  const [triggerSettlementReport, settlementReportResult] =
    useLazyGetSettlementReportQuery();
  const { failureWithTimeout } = useFormActions();

  const getSettlement = async (params: any = {}) => {
    try {
      await triggerSettlement(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getSettlementSummary = async (params: any = {}) => {
    try {
      await triggerSettlementSummary(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getItemSalesDaily = async (params: any = {}) => {
    try {
      await triggerItemSalesDaily(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getSalesOrderSummary = async (params: any = {}) => {
    try {
      await triggerSalesOrderSummary(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getOutstandingSummary = async (params: any = {}) => {
    try {
      await triggerOutstandingSummary(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getMembership = async (params: any = {}) => {
    try {
      await triggerMembership(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getMembershipSaldoSummary = async (params: any = {}) => {
    try {
      await triggerMembershipSaldo(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const showMembership = async (id: string, params: any = {}) => {
    try {
      await triggerShowMembership({ id, ...params }).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getStockReport = async (params: any = {}) => {
    try {
      await triggerStockReport(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getSalesReport = async (params: any = {}) => {
    try {
      await triggerSalesReport(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getSettlementReport = async (params: any = {}) => {
    try {
      await triggerSettlementReport(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  return {
    settlement: settlementResult.data,
    isLoadingSettlement: settlementResult.isLoading || settlementResult.isFetching,
    getSettlement,
    settlementSummary: settlementSummaryResult.data,
    isLoadingSettlementSummary:
      settlementSummaryResult.isLoading || settlementSummaryResult.isFetching,
    getSettlementSummary,
    itemSalesDaily: itemSalesDailyResult.data,
    isLoadingItemSalesDaily:
      itemSalesDailyResult.isLoading || itemSalesDailyResult.isFetching,
    getItemSalesDaily,
    salesOrderSummary: salesOrderSummaryResult.data,
    isLoadingSalesOrderSummary:
      salesOrderSummaryResult.isLoading || salesOrderSummaryResult.isFetching,
    getSalesOrderSummary,
    outstandingSummary: outstandingSummaryResult.data,
    isLoadingOutstandingSummary:
      outstandingSummaryResult.isLoading || outstandingSummaryResult.isFetching,
    getOutstandingSummary,
    membership: membershipResult.data,
    isLoadingMembership: membershipResult.isLoading || membershipResult.isFetching,
    getMembership,
    membershipSaldoSummary: membershipSaldoResult.data,
    isLoadingMembershipSaldo:
      membershipSaldoResult.isLoading || membershipSaldoResult.isFetching,
    getMembershipSaldoSummary,
    membershipDetail: showMembershipResult.data,
    isLoadingMembershipDetail:
      showMembershipResult.isLoading || showMembershipResult.isFetching,
    showMembership,
    stockReport: stockReportResult.data,
    isLoadingStockReport:
      stockReportResult.isLoading || stockReportResult.isFetching,
    getStockReport,
    salesReport: salesReportResult.data,
    isLoadingSalesReport: salesReportResult.isLoading || salesReportResult.isFetching,
    getSalesReport,
    settlementReport: settlementReportResult.data,
    isLoadingSettlementReport: settlementReportResult.isLoading || settlementReportResult.isFetching,
    getSettlementReport,
  };
};
