/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useState } from "react";
import createTableConfig from "./table/outstanding.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/outstanding.filter";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { usePOSReport } from "@/services/report/hooks";
import { ArrowUpCircle, Banknote } from "lucide-react";
import { currencyFormat } from "@/utils";
import { useOutletType } from "@/services/outlet/hooks";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <SummaryCard
        label='Total Outstanding'
        value={data.total_outstanding}
        icon={Banknote}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Total Charges'
        value={currencyFormat(data.total_charges)}
        icon={ArrowUpCircle}
        theme={THEMES.blue}
      />
    </div>
  );
};

/**
 * Body report reusable — dipakai halaman Outstanding standalone dan tab di detail
 * Laporan Outlet (outlet dikunci saat `outletId` diisi).
 */
export function OutstandingReport({
  outletId,
  outletTypeId,
}: {
  outletId?: string;
  outletTypeId?: string;
}) {
  const lockOutlet = !!outletId;

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: lockOutlet
          ? { outlet_id: outletId }
          : { outlet_type_id: outletTypeId },
        lockedFilter: lockOutlet ? { outlet_id: outletId } : undefined,
      }),
    [lockOutlet, outletId, outletTypeId],
  );

  const Table = useTable(
    lockOutlet ? "outlet_tab_outstanding" : "pos_report_outstanding",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
      search: Table.State?.textSearch || "",
    };
  }, [Table.State?.lockedFilter, Table.State?.filter, Table.State?.textSearch]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { outstandingSummary, outstandingSummaryResult } = usePOSReport();
  const { data: summaryResult } = outstandingSummaryResult;

  useEffect(() => {
    if (Table.State) {
      outstandingSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <>
      <OverviewCards data={summary} />

      <Table.Tools downloadable>
        <TableFilter
          table={Table}
          outletTypeId={outletTypeId}
          lockOutlet={lockOutlet}
        />
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data outstanding akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}

export default function PosOutstandingPage() {
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

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Outstanding'
        subtitle='Rekap tagihan POS yang belum diselesaikan.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OutstandingReport outletTypeId={outletType.id} />
      </Page.Body>
    </Page>
  );
}
