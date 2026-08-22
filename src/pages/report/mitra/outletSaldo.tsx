/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useState } from "react";
import createTableConfig from "./table/outlet-saldo.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { Banknote, Landmark } from "lucide-react";
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
        label='Total Mitra'
        value={data.total_outlets}
        icon={Landmark}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Total Saldo'
        value={currencyFormat(data.total_saldo)}
        icon={Banknote}
        theme={THEMES.blue}
      />
    </div>
  );
};

export default function MitraOutletSaldoPage() {
  const [outletType, setOutletType] = useState<any>(null);

  const { get: getOutletType, getResult: getOutletTypeResult } =
    useOutletType();

  useEffect(() => {
    getOutletType({ search: "Mitra" });
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

  return <OutletSaldoTable outletTypeId={outletType.id} />;
}

function OutletSaldoTable({ outletTypeId }: { outletTypeId: string }) {
  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: { outlet_type_id: outletTypeId },
      }),
    [outletTypeId],
  );

  const Table = useTable(
    "mitra_report_outlet_saldo",
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

  const { outletSaldoSummary, outletSaldoSummaryResult } = useReport();
  const { data: summaryResult } = outletSaldoSummaryResult;

  useEffect(() => {
    outletSaldoSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Mitra Saldo'
        subtitle='Laporan mitra saldo mitra.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OverviewCards data={summary} />

        <Table.Tools downloadable />
        <Table.Render
          emptyTitle='Belum Ada Data'
          emptyDescription='Data mitra saldo akan muncul di sini.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
