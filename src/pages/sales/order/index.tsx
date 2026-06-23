import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import createTableConfig from "./table/order.config";
import TableFilter from "./table/order.filter";
import type { SalesOrderDetail } from "@/services/types";
import { useEnigmaUI } from "@/components";
import { useSalesOrder } from "@/services/sales/hooks";

export default function SalesOrder() {
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { remove: removeItem, removeResult: removeItemResult } =
    useSalesOrder();

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (row) => navigate(`/sales/order/${row.id}`),
      onRemove: (v) => {
        openDelete(v);
      },
      onEdit: (row) => navigate(`/sales/order/update/${row.id}`),
    });
  }, [navigate]);

  const Table = useTable("sales_order", tableConfig as TableConfig<unknown>);

  const openDelete = (v: SalesOrderDetail) => {
    openModal({
      id: "delete-item",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-item")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Item</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeItemResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-item")}
              disabled={removeItemResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: SalesOrderDetail) => {
    if (v) {
      removeItem({ id: v?.id });
    }
  };

  useEffect(() => {
    if (removeItemResult?.isSuccess) {
      closeModal("delete-item");
      Table.boot();
    }
  }, [removeItemResult]);

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
