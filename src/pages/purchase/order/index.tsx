import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/order.config";
import TableFilter from "./table/order.filter";
import type { PurchaseOrderDetail } from "@/services/types/purchase";

const PurchaseOrderListPage: React.FC = () => {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onEdit: (id) => navigate(`/purchase/order/update/${id}`),
      }),
    [navigate]
  );

  const Table = useTable<PurchaseOrderDetail>("purchase-order-list", {
    url: "/purchase/order",
    columns: tableConfig,
  });

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Purchase Order"
        subtitle="Kelola pesanan pembelian barang ke supplier."
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/purchase/order/create")}
          >
            <Plus size={18} />
            Tambah PO
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada PO"
          emptyDescription="Daftar purchase order yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default PurchaseOrderListPage;
