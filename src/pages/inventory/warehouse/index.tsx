import React, { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/warehouse.config";
import type { TableConfig } from "@/services/table/const";

const WarehouseListPage: React.FC = () => {
  const tableConfig = useMemo(() => createTableConfig(), []);

  const Table = useTable("warehouse-list", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Daftar Gudang"
        subtitle="Kelola lokasi penyimpanan inventaris."
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />

        <Table.Render
          emptyTitle="Belum Ada Gudang"
          emptyDescription="Daftar gudang penyimpanan akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default WarehouseListPage;
