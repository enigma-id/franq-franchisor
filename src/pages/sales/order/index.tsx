import { Page } from "@/components/app/layout";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export default function SalesOrder() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.salesOrder);
  const { remove: removeItem, removeResult: removeItemResult, publish: publishItem, publishResult, paid: paidItem, paidResult } =
    useSalesOrder();
  const [selectedRow, setSelectedRow] = useState<SalesOrderDetail | null>(null);
  const [actionType, setActionType] = useState<"publish" | "paid" | null>(null);
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (row) => navigate(`/sales/order/${row.id}`),
      onRemove: (v) => openDelete(v),
      onEdit: (row) => navigate(`/sales/order/update/${row.id}`),
      onPublish: (row) => openConfirmModal(row, "publish"),
      onPaid: (row) => openConfirmModal(row, "paid"),
      canManage,
    });
  }, [navigate, canManage]);

  const Table = useTable("sales_order", tableConfig as TableConfig<unknown>);

  useEffect(() => { tableRef.current = Table; }, [Table]);

  const openConfirmModal = useCallback((row: SalesOrderDetail, type: "publish" | "paid") => {
    setSelectedRow(row);
    setActionType(type);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedRow) return;
    const id = selectedRow.id;
    switch (actionType) {
      case "publish": await publishItem({ id }); break;
      case "paid": await paidItem({ id }); break;
    }
  }, [selectedRow, actionType, publishItem, paidItem]);

  const activeResult = useMemo(() => {
    switch (actionType) {
      case "publish": return publishResult;
      case "paid": return paidResult;
      default: return null;
    }
  }, [actionType, publishResult, paidResult]);

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
      showToast({ message: "Sales order berhasil dihapus", type: "success", position: "bottom-center" });
      Table.boot();
    }
  }, [removeItemResult]);

  useEffect(() => {
    if (activeResult?.isSuccess) {
      showToast({ message: "Berhasil", type: "success", position: "bottom-center" });
      closeConfirmModal();
      activeResult.reset?.();
      tableRef.current?.boot();
    }
  }, [activeResult?.isSuccess]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Sales Order"
        subtitle="Kelola transaksi penjualan ke seluruh outlet."
        action={
          canManage && (
            <Button
              variant="primary"
              shape="wide"
              size="md"
              onClick={() => navigate("/sales/order/create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Order
            </Button>
          )
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

      <Modal.Wrapper
        open={!!selectedRow && !!actionType}
        onClose={closeConfirmModal}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className="font-bold leading-7">
            Konfirmasi {actionType === "publish" ? "Publish" : "Pembayaran"}
          </div>
        </Modal.Header>
        <Modal.Body className="text-sm font-normal leading-5 space-y-4">
          <p>
            Apakah Anda yakin ingin {actionType === "publish" ? "menerbitkan" : "membayar"}{" "}
            sales order <strong>{selectedRow?.code}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="flex-1 rounded-xl"
            variant="primary"
            onClick={handleConfirmAction}
            isLoading={activeResult?.isLoading}
          >
            Konfirmasi
          </Button>
          <Button
            className="flex-1 rounded-xl"
            styleType="outline"
            variant="secondary"
            onClick={closeConfirmModal}
            disabled={activeResult?.isLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
