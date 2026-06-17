import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/pos-item.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/pos-item.filter";

export function PosItem() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_pos_item_sales",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="POS Item"
        subtitle="Laporan penjualan per item menu."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data laporan item POS akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
