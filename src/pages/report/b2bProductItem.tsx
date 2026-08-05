/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/b2b-product-item.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/b2b-product-item.filter";
import { useB2BReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Banknote, Landmark } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <SummaryCard
        label="Total Qty"
        value={data.total_qty}
        icon={Landmark}
        theme={THEMES.orange}
      />
      <SummaryCard
        label="Total Nett"
        value={currencyFormat(data.total_nett)}
        icon={Banknote}
        theme={THEMES.blue}
      />
    </div>
  );
};

export default function B2BProductItemPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_b2b_product_item",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { productItemSummary, productItemSummaryResult } = useB2BReport();
  const { data: summaryResult } = productItemSummaryResult;

  useEffect(() => {
    productItemSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Menu B2B"
        subtitle="Laporan penjualan menu B2B."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data penjualan menu B2B akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
