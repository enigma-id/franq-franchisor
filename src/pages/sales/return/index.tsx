import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/return.config";
import TableFilter from "./table/return.filter";
import type { SalesReturnDetail } from "@/services/types/sales";

const SalesReturnListPage: React.FC = () => {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onView: (id) => navigate(`/sales/return/detail/${id}`),
      }),
    [navigate]
  );

  const Table = useTable<SalesReturnDetail>("sales-return-list", tableConfig as any);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Daftar Return Penjualan"
        subtitle="Kelola pengembalian barang dari transaksi penjualan."
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Return"
          emptyDescription="Daftar return penjualan akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default SalesReturnListPage;
