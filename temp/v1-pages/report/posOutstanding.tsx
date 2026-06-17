import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/pos-outstanding.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/pos-outstanding.filter";

export function PosOutstanding() {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    "report_pos_outstanding",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="POS Outstanding"
        subtitle="Laporan transaksi outstanding yang belum diselesaikan."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data outstanding akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
