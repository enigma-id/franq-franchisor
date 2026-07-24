import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/item.config";
import TableFilter from "./table/production.filter";
import dayjs from "dayjs";

export default function DemandItemPage() {
  const lockFilter = { production_date: dayjs().format("YYYY-MM-DD") };
  const tableConfig = useMemo(
    () => createTableConfig({ filter: lockFilter }),
    [],
  );
  const Table = useTable("demand_item", tableConfig as TableConfig<unknown>);
  console.log("[DemandItem] initial filter:", Table.State?.filter);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title="Item Demand"
        subtitle="Daftar rekapitulasi permintaan per item"
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data permintaan item akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
