/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useState } from "react";
import createTableConfig from "./table/topup-cancelled.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/topup-cancelled.filter";
import { usePOSReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Banknote, XCircle } from "lucide-react";
import { useOutletType } from "@/services/outlet/hooks";

const THEMES: Record<string, any> = {
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <SummaryCard
        label='Total Nominal'
        value={currencyFormat(data.total_nominal)}
        icon={Banknote}
        theme={THEMES.green}
      />
      <SummaryCard
        label='Total Count'
        value={data.total_count}
        icon={XCircle}
        theme={THEMES.red}
      />
    </div>
  );
};

export default function POSTopupCancelledPage() {
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

  return <TopupCancelledTable outletTypeId={outletType.id} />;
}

function TopupCancelledTable({ outletTypeId }: { outletTypeId: string }) {
  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: { outlet_type_id: outletTypeId },
      }),
    [outletTypeId],
  );
  const Table = useTable(
    "pos_report_topup_cancelled",
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

  const { topupCancelledSummary, topupCancelledSummaryResult } = usePOSReport();
  const { data: summaryResult } = topupCancelledSummaryResult;

  useEffect(() => {
    topupCancelledSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Topup Cancel'
        subtitle='Laporan topup member POS yang dibatalkan.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} outletTypeId={outletTypeId} />
        </Table.Tools>
        <Table.Render
          emptyTitle='Belum Ada Data'
          emptyDescription='Data topup yang dibatalkan akan muncul di sini.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
