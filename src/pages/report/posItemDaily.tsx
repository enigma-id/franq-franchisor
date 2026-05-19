import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/pos-item-daily.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/pos-item-daily.filter";

export function PosItemDaily() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable("report_pos_item_daily", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="report"
        title="POS Item Daily"
        subtitle="Laporan penjualan item per hari."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data laporan item harian akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}