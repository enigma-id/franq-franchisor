import { Page } from "@/components/app/layout";
import { useMemo } from "react";
import createTableConfig from "./table/sales-order.config";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/sales-order.filter";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

export function SalesOrder() {
  const navigate = useNavigate();
  const tableConfig = useMemo(() => {
    return createTableConfig({
      onRowClick: (row: any) => navigate(`/sales/order/${row.id}`),
    });
  }, [navigate]);

  const Table = useTable("sales_order", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Sales Order"
        subtitle="Kelola transaksi penjualan ke seluruh outlet."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/sales/order/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Order
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Data Sales Order"
          emptyDescription="Data sales order akan muncul di sini setelah tersedia."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
