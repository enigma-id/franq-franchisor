/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/raw-material-sales.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "../pos/table/product-sales.filter"; // Reuse product sales filter pattern
import { useReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { ArrowUpCircle, Banknote, Landmark } from "lucide-react";

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
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
      <SummaryCard
        label='Total Nett'
        value={currencyFormat(data.total_nett)}
        icon={ArrowUpCircle}
        theme={THEMES.purple}
      />
      <SummaryCard
        label='Total Qty Fulfilled'
        value={data.total_quantity_fulfilled}
        icon={Landmark}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Total Qty Ordered'
        value={data.total_quantity_ordered}
        icon={Banknote}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Orders'
        value={data.total_orders}
        icon={ArrowUpCircle}
        theme={THEMES.red}
      />
    </div>
  );
};

export default function RawMaterialSalesPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_raw_material_sales",
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

  const { rawMaterialSummary, rawMaterialSummaryResult } = useReport();
  const { data: summaryResult } = rawMaterialSummaryResult;

  useEffect(() => {
    rawMaterialSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Product Sales'
        subtitle='Laporan penjualan produk.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle='Belum Ada Data'
          emptyDescription='Data penjualan produk akan muncul di sini.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
