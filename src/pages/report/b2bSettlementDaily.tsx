/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/b2b-settlement.daily.config";
import TableFilter from "./table/settlement.daily.filter";
import { useLazyGetB2BSettlementSummaryQuery } from "@/services/report/api";
import { SettlementSummaryCards } from "@/components/app";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function B2BSettlementDailyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const periode = params.get("periode");

  useEffect(() => {
    if (!periode) navigate("/report/b2b/settlement", { replace: true });
  }, [periode, navigate]);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      lockedFilter: { periode_type: "monthly" },
      filter: { periode: periode ?? "" },
    });
  }, [periode]);

  const Table = useTable(
    "b2b_settlement_daily",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const [triggerSummary, { data: summaryResponse }] =
    useLazyGetB2BSettlementSummaryQuery();

  useEffect(() => {
    if (Table.State) {
      triggerSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, triggerSummary, Table.State !== undefined]);

  const summary = useMemo(() => {
    if (!summaryResponse?.data) return [];
    const d = summaryResponse.data;

    if (Array.isArray(d)) {
      if (d.length === 0) return [];

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
  }, [summaryResponse]);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={`B2B Settlement Daily — ${periode}`}
        subtitle='Laporan penyelesaian pembayaran B2B.'
        backTo={() => navigate(-1)}
      />
      <Page.Body className='flex-1 flex flex-col min-h-0 '>
        <SettlementSummaryCards summary={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} periode={periode ?? ""} />
        </Table.Tools>

        <Table.Render
          emptyTitle='No B2B Settlement Data'
          emptyDescription='B2B Settlement data will appear here once available.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
