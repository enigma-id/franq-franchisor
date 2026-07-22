/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/b2b-settlement.config";
import TableFilter from "./table/settlement.filter"; // Reuse monthly filter pattern
import { SettlementSummaryCards } from "@/components/app";
import { useB2BReport } from "@/services/report/hooks";
import { useNavigate } from "react-router-dom";

export default function B2BSettlementPage() {
  const navigate = useNavigate();
  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: { periode: new Date().getFullYear() },
        onRowClick: (row: any) =>
          navigate(`/report/b2b/settlement/daily?periode=${row.periode}`),
      }),
    [navigate],
  );

  const Table = useTable("b2b_settlement", tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const { settlementSummary, settlementSummaryResult } = useB2BReport();
  const { data: summaryResult, isLoading } = settlementSummaryResult;

  useEffect(() => {
    if (Table.State) {
      settlementSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = useMemo(() => {
    if (isLoading) return [];
    const d = summaryResult?.data;

    if (Array.isArray(d)) {
      if (d.length === 0) return [];

      // Determine the key set from first row that has data
      let keys: string[] = [];
      const firstRow = d.find((r: any) => r.payment_statuses?.length > 0);
      if (firstRow?.payment_statuses) {
        keys = firstRow.payment_statuses;
      } else if (d[0].payment_statuses) {
        keys = d[0].payment_statuses;
      } else if (d[0].payment_methods) {
        keys = d[0].payment_methods;
      }

      if (keys.length > 0) {
        // Aggregate nominals across all rows
        return keys.map((key: string, i: number) => {
          const total = d.reduce(
            (sum: number, row: any) =>
              sum + (row.nominals?.[i] ?? 0),
            0,
          );
          return { method: key, total };
        });
      }

      return d.map((item: any) => ({
        method: item.payment_method || item.method || item.name || "Unknown",
        total: item.nominal || item.total || item.amount || 0,
      }));
    }

    if (typeof d === "object" && d !== null) {
      if (d.payment_statuses && d.nominals) {
        return d.payment_statuses.map((m: string, i: number) => ({
          method: m,
          total: d.nominals[i] || 0,
        }));
      }
      if (d.payment_methods && d.nominals) {
        return d.payment_methods.map((m: string, i: number) => ({
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
  }, [settlementSummaryResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="B2B Settlement"
        subtitle="Laporan penyelesaian pembayaran B2B."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <SettlementSummaryCards summary={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No B2B Settlement Data"
          emptyDescription="B2B Settlement data will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
