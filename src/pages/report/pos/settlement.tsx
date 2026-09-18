/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import type { RootState } from "@/services/store";
import createTableConfig from "./table/settlement.config";
import TableFilter from "./table/settlement.filter";
import { useLazyGetPOSSettlementSummaryQuery } from "@/services/report/api";
import { SettlementSummaryCards } from "@/components/app";
import { useNavigate } from "react-router-dom";
import { useOutletType } from "@/services/outlet/hooks";

/**
 * Body report reusable — dipakai halaman Settlement tahunan standalone dan tab di
 * detail Laporan Outlet (outlet dikunci saat `outletId` diisi).
 */
export function SettlementReport({
  outletId,
  outletTypeId,
  onDetail,
}: {
  outletId?: string;
  outletTypeId?: string;
  onDetail?: (row: any) => void;
}) {
  const lockOutlet = !!outletId;

  const tableConfig = useMemo(() => {
    return createTableConfig({
      filter: {
        periode: new Date().getFullYear(),
        ...(lockOutlet
          ? { outlet_id: outletId }
          : { outlet_type_id: outletTypeId }),
      },
      lockedFilter: lockOutlet ? { outlet_id: outletId } : undefined,
      onDetail,
    });
  }, [lockOutlet, outletId, outletTypeId, onDetail]);

  const Table = useTable(
    lockOutlet ? "outlet_tab_settlement" : "pos_settlement",
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
    <>
      <SettlementSummaryCards summary={summary} />

      <Table.Tools downloadable hideSearch>
        <TableFilter
          table={Table}
          outletTypeId={outletTypeId}
          lockOutlet={lockOutlet}
        />
      </Table.Tools>

      <Table.Render
        emptyTitle='No Settlement Data'
        emptyDescription='Settlement data will appear here once available.'
      />
    </>
  );
}

export default function POSSettlementMonthlyPage() {
  const [outletType, setOutletType] = useState<any>(null);

  const { get: getOutletType, getResult: getOutletTypeResult } =
    useOutletType();

  useEffect(() => {
    getOutletType({ search: "Outlet" });
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

  return <SettlementMonthlyTable outletTypeId={outletType.id} />;
}

function SettlementMonthlyTable({ outletTypeId }: { outletTypeId: string }) {
  const navigate = useNavigate();

  const activeOutletId = useSelector(
    (state: RootState) => state?.table?.data?.pos_settlement?.filter?.outlet_id,
  );

  const onDetail = useCallback(
    (row: any) =>
      navigate(
        `/report/pos/settlement/daily?periode=${row.date}${
          activeOutletId ? `&outlet_id=${activeOutletId}` : ""
        }`,
      ),
    [navigate, activeOutletId],
  );

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Settlement'
        subtitle='Rekap penyelesaian pembayaran outlet.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0 '>
        <SettlementReport outletTypeId={outletTypeId} onDetail={onDetail} />
      </Page.Body>
    </Page>
  );
}
