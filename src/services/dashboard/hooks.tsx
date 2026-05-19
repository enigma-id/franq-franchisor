import {
  useLazyGetDashboardSalesQuery,
  useLazyGetDashboardItemQuery,
  useLazyGetDashboardGraphQuery,
  useLazyGetDashboardCommissionQuery,
} from "./api";

export const useDashboard = () => {
  const [triggerSales, salesResult] = useLazyGetDashboardSalesQuery();
  const [triggerItem, itemResult] = useLazyGetDashboardItemQuery();
  const [triggerGraph, graphResult] = useLazyGetDashboardGraphQuery();
  const [triggerCommission, commissionResult] =
    useLazyGetDashboardCommissionQuery();

  return {
    sales: salesResult.data,
    isLoadingSales: salesResult.isLoading || salesResult.isFetching,
    getSales: (params: any = {}) => triggerSales(params).unwrap(),

    item: itemResult.data,
    isLoadingItem: itemResult.isLoading || itemResult.isFetching,
    getItem: (params: any = {}) => triggerItem(params).unwrap(),

    graph: graphResult.data,
    isLoadingGraph: graphResult.isLoading || graphResult.isFetching,
    getGraph: (params: any = {}) => triggerGraph(params).unwrap(),

    commission: commissionResult.data,
    isLoadingCommission:
      commissionResult.isLoading || commissionResult.isFetching,
    getCommission: (params: any = {}) => triggerCommission(params).unwrap(),
  };
};
