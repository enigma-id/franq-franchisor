import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/order.config";
import TableFilter from "./table/order.filter";
import type { TableConfig } from "@/services/table/const";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { Modal, useEnigmaUI } from "@/components";
import type { PurchaseOrderDetail } from "@/services/types";

const PurchaseOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { remove: removeItem, removeResult: removeItemResult } =
    usePurchaseOrder();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row) => navigate(`/purchase/order/${row.id}`),
        onEdit: (row) => navigate(`/purchase/order/update/${row.id}`),
        onRemove: (v) => {
          openDelete(v);
        },
      }),
    [navigate],
  );

  const Table = useTable("purchase-order", tableConfig as TableConfig<unknown>);

  const openDelete = (v: PurchaseOrderDetail) => {
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

  const handleDelete = (v: PurchaseOrderDetail) => {
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
        category="Purchase Order"
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
