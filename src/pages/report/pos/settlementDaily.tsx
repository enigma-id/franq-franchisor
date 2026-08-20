/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/settlement.daily.config";
import TableFilter from "./table/settlement.daily.filter";
import { useLazyGetPOSSettlementSummaryQuery } from "@/services/report/api";
import { SettlementSummaryCards } from "@/components/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOutletType } from "@/services/outlet/hooks";

export default function POSSettlementDailyPage() {
  const [outletType, setOutletType] = useState<any>(null);

  const { get: getOutletType, getResult: getOutletTypeResult } =
    useOutletType();

  useEffect(() => {
    getOutletType({ search: "POS" });
  }, []);

  useEffect(() => {
    if (getOutletTypeResult?.data?.data) {
      const items = getOutletTypeResult?.data?.data as any[] | undefined;
      if (items?.length === 1) {
        const item = items[0];
        setOutletType(item);
      }
    }
  }, [getOutletTypeResult]);

  if (!outletType) {
    return (
      <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
        Loading...
      </Page>
    );
  }

  return <SettlementDailyTable outletTypeId={outletType.id} />;
}

function SettlementDailyTable({ outletTypeId }: { outletTypeId: string }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const periode = params.get("periode");
  const outletId = params.get("outlet_id");

  useEffect(() => {
    if (!periode) navigate("/report/pos/settlement", { replace: true });
  }, [periode, navigate]);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      lockedFilter: { periode_type: "monthly" },
      filter: {
        periode: periode ?? "",
        outlet_id: outletId ?? "",
        outlet_type_id: outletTypeId,
      },
    });
  }, [periode, outletId]);

  const Table = useTable(
    "pos_settlement_daily",
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
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={`POS Settlement Daily — ${periode}`}
        subtitle='Laporan penyelesaian pembayaran.'
        backTo={() => navigate(-1)}
      />
      <Page.Body className='flex-1 flex flex-col min-h-0 '>
        <SettlementSummaryCards summary={summary} />

        <Table.Tools downloadable hideSearch>
          <TableFilter
            table={Table}
            periode={periode ?? ""}
            outletTypeId={outletTypeId}
          />
        </Table.Tools>

        <Table.Render
          emptyTitle='No Settlement Data'
          emptyDescription='Settlement data will appear here once available.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
