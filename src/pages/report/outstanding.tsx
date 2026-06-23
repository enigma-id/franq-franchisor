/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/pos-outstanding.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/pos-outstanding.filter";
import { Page } from "@/components/app/layout";
import { SettlementSummaryCards } from "@/components/app";
import { usePOSReport } from "@/services/report/hooks";

export default function PosOutstandingPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_outstanding",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { outstandingSummary, outstandingSummaryResult } = usePOSReport();
  const { data: summaryResult, isLoading } = outstandingSummaryResult;

  useEffect(() => {
    if (Table.State) {
      outstandingSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = useMemo(() => {
    if (isLoading) return [];
    const d = summaryResult?.data;

    if (Array.isArray(d)) {
      return d.map((item: any) => ({
        method: item.payment_method || item.method || item.name || "Unknown",
        total: item.nominal || item.total || item.amount || 0,
      }));
    }

    if (typeof d === "object" && d !== null) {
      return Object.entries(d).map(([method, total]) => ({
        method,
        total: Number(total) || 0,
      }));
    }

    return [];
  }, [outstandingSummaryResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Outstanding"
        subtitle="Laporan transaksi outstanding yang belum diselesaikan."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <SettlementSummaryCards summary={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data outstanding akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
