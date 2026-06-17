import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/stock.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";

export function StockReport() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable("report_stock", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Stock"
        subtitle="Laporan stok inventori saat ini."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data stok akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
