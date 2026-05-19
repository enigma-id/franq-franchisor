import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/purchase-order.config";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/purchase-order.filter";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

export function PurchaseOrder() {
  const navigate = useNavigate();
  const tableConfig = useMemo(() => {
    return createTableConfig({
      onRowClick: (row: any) => navigate(`/purchase/order/${row.id}`),
    });
  }, [navigate]);

  const Table = useTable("purchase_order", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="purchase"
        title="Purchase Order"
        subtitle="Kelola transaksi dan status order pembelian barang ke supplier."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/purchase/order/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Order
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Settlement Data"
          emptyDescription="Settlement data will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
