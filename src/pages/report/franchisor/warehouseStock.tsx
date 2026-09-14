import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/warehouse-stock.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/warehouse-stock.filter";

/**
 * Body report reusable — dipakai halaman Stok Gudang standalone dan tab di
 * detail Rekap Outlet. `tableName` dipakai supaya state tabel tab tidak bentrok
 * dengan halaman standalone.
 */
export function WarehouseStockReport({ tableName }: { tableName?: string }) {
  const tableConfig = useMemo(() => createTableConfig({}), []);
  const Table = useTable(
    tableName ?? "report_warehouse_stock",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <>
      <Table.Tools downloadable>
        <TableFilter table={Table} />
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data stok gudang akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}

export default function WarehouseStockPage() {
  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Stok Gudang'
        subtitle='Rekap stok barang di gudang.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <WarehouseStockReport />
      </Page.Body>
    </Page>
  );
}
