import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/settlement-daily.config";
import TableFilter from "./table/settlement-daily.filter";
import { useLazyGetSettlementSummaryQuery } from "@/services/report/api";
import { SettlementSummaryCards } from "@/components/app";

export function SettlementDaily() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const month = params.get("month");

  useEffect(() => {
    if (!month) navigate("/report/sales/payment", { replace: true });
  }, [month, navigate]);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      lockedFilter: { params_type: "monthly" },
      filter: { periode: month ?? "" },
    });
  }, [month]);

  const Table = useTable(
    "settlement_daily",
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
    useLazyGetSettlementSummaryQuery();

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
        title={`Settlement Daily — ${month}`}
        subtitle=""
        backTo={() => navigate(-1)}
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
      </Page.Body>
    </Page>
  );
}
