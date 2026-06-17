import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/raw-material-sales.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/product-sales.filter"; // Reuse product sales filter pattern

export default function RawMaterialSalesPage() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_raw_material_sales",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Raw Material Sales"
        subtitle="Laporan pemakaian bahan baku."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data pemakaian bahan baku akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
