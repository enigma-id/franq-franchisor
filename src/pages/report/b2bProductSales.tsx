/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/b2b-product-sales.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/product-sales.filter"; // Reuse product sales filter pattern
import { useB2BReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SettlementSummaryCards } from "@/components/app";

export default function B2BProductSalesPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_b2b_product_sales",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { productSalesSummary, productSalesSummaryResult } = useB2BReport();
  const { data: summaryResult, isLoading } = productSalesSummaryResult;

  useEffect(() => {
    productSalesSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = useMemo(() => {
    if (isLoading) return [];
    const d = summaryResult?.data;

    if (Array.isArray(d)) {
      if (d.length > 0 && d[0].payment_methods && d[0].nominals) {
        return d[0].payment_methods.map((m: string, i: number) => ({
          method: m,
          total: d[0].nominals[i] || 0,
        }));
      }
      if (d.length > 0 && d[0].payment_statuses && d[0].nominals) {
        return d[0].payment_statuses.map((m: string, i: number) => ({
          method: m,
          total: d[0].nominals[i] || 0,
        }));
      }
      return d.map((item: any) => ({
        method: item.payment_method || item.method || item.name || "Unknown",
        total: item.nominal || item.total || item.amount || 0,
      }));
    }

    if (typeof d === "object" && d !== null) {
      if (d.payment_methods && d.nominals) {
        return d.payment_methods.map((m: string, i: number) => ({
          method: m,
          total: d.nominals[i] || 0,
        }));
      }
      if (d.payment_statuses && d.nominals) {
        return d.payment_statuses.map((m: string, i: number) => ({
          method: m,
          total: d.nominals[i] || 0,
        }));
      }
      return Object.entries(d).map(([method, total]) => ({
        method,
        total: Number(total) || 0,
      }));
    }

    return [];
  }, [productSalesSummaryResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="B2B Product Sales"
        subtitle="Laporan penjualan produk B2B."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <SettlementSummaryCards summary={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data penjualan produk B2B akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
