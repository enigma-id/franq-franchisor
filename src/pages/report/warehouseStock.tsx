import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/warehouse-stock.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";

export default function WarehouseStockPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_warehouse_stock",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Warehouse Stock"
        subtitle="Laporan stok barang di gudang."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data stok gudang akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
