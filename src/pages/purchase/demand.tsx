import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/demand.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import dayjs from "dayjs";
import TableFilter from "./table/demand.filter";

export function Demand() {
  const tableConfig = useMemo(() => {
    return createTableConfig({
      filter: {
        date: dayjs().format("YYYY-MM-DD"),
      },
    });
  }, []);

  const Table = useTable("demand_item", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="purchase"
        title="Demand Item"
        subtitle="Daftar kebutuhan stok item berdasarkan permintaan outlet."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Data Demand"
          emptyDescription="Data demand item akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
