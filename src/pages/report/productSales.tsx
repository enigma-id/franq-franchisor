/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/product-sales.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/product-sales.filter";
import { useReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { ArrowUpCircle, Banknote, Landmark } from "lucide-react";
import { currencyFormat } from "@/utils";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SummaryCard
        label="Total Qty"
        value={data.total_qty}
        icon={Landmark}
        theme={THEMES.orange}
      />
      <SummaryCard
        label="Total Discount"
        value={currencyFormat(data.total_nett)}
        icon={Banknote}
        theme={THEMES.blue}
      />
      <SummaryCard
        label="Total Nett"
        value={currencyFormat(data.total_discount)}
        icon={ArrowUpCircle}
        theme={THEMES.red}
      />
    </div>
  );
};

export default function ProductSalesPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_product_sales",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { productSalesSummary, productSalesSummaryResult } = useReport();
  const { data: summaryResult } = productSalesSummaryResult;

  useEffect(() => {
    productSalesSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Product Sales"
        subtitle="Laporan penjualan produk retail."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data penjualan produk akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
