/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/settlement.config";
import TableFilter from "./table/settlement.filter";
import { useLazyGetPOSSettlementSummaryQuery } from "@/services/report/api";
import { SettlementSummaryCards } from "@/components/app";
import { useNavigate } from "react-router-dom";

export default function SettlementMonthlyPage() {
  const navigate = useNavigate();

  const tableConfig = useMemo(() => {
    return createTableConfig({
      filter: { periode: new Date().getFullYear() },
      onRowClick: (row: any) =>
        navigate(`/report/pos/settlement/daily?periode=${row.date}`),
    });
  }, [navigate]);

  const Table = useTable("pos_settlement", tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const [triggerSummary, { data: summaryResponse }] =
    useLazyGetPOSSettlementSummaryQuery();

  useEffect(() => {
    if (Table.State) {
      triggerSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, triggerSummary, Table.State !== undefined]);

  const summary = useMemo(() => {
    if (!summaryResponse?.data) return [];
    const d = summaryResponse.data;

    // Handle array response [{ payment_methods: [], nominals: [] }]
    if (Array.isArray(d)) {
      if (d.length > 0 && d[0].payment_methods && d[0].nominals) {
        return d[0].payment_methods.map((m: string, i: number) => ({
          method: m,
          total: d[0].nominals[i] || 0,
        }));
      }
      return d.map((item: any) => ({
        method: item.payment_method || item.method || item.name || "Unknown",
        total: item.nominal || item.total || item.amount || 0,
      }));
    }

    // Handle object response { payment_methods: [], nominals: [] }
    if (typeof d === "object" && d !== null) {
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
  }, [summaryResponse]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="POS Settlement"
        subtitle="Laporan penyelesaian pembayaran."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <SettlementSummaryCards summary={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Settlement Data"
          emptyDescription="Settlement data will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
