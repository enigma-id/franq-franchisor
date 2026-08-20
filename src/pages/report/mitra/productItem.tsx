/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useState } from "react";
import createTableConfig from "./table/product-item.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/product-item.filter";
import { usePOSReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Banknote, Landmark } from "lucide-react";
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
        label='Total Qty'
        value={data.total_qty}
        icon={Landmark}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Total Nett'
        value={currencyFormat(data.total_nett)}
        icon={Banknote}
        theme={THEMES.blue}
      />
    </div>
  );
};

export default function MitraProductItemPage() {
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

  return <ProductItemTable outletTypeId={outletType.id} />;
}

function ProductItemTable({ outletTypeId }: { outletTypeId: string }) {
  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: { outlet_type_id: outletTypeId },
      }),
    [outletTypeId],
  );

  const Table = useTable(
    "mitra_report_product_item",
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

  const { productItemSummary, productItemSummaryResult } = usePOSReport();
  const { data: summaryResult } = productItemSummaryResult;

  useEffect(() => {
    productItemSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Mitra Menu'
        subtitle='Laporan penjualan menu Mitra.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} outletTypeId={outletTypeId} />
        </Table.Tools>
        <Table.Render
          emptyTitle='Belum Ada Data'
          emptyDescription='Data penjualan menu akan muncul di sini.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
