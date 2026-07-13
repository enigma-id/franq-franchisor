/* eslint-disable react-hooks/set-state-in-effect */
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Modal } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/order.config";
import TableFilter from "./table/order.filter";
import type { TableConfig } from "@/services/table/const";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { useEnigmaUI } from "@/components";
import type { PurchaseOrderDetail } from "@/services/types";

const PurchaseOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove: removeItem,
    removeResult: removeItemResult,
    publish: publishItem,
    publishResult,
    paid: paidItem,
    paidResult,
  } = usePurchaseOrder();
  const [selectedRow, setSelectedRow] = useState<PurchaseOrderDetail | null>(
    null,
  );
  const [actionType, setActionType] = useState<"publish" | "paid" | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row) => navigate(`/purchase/order/${row.id}`),
        onEdit: (row) => navigate(`/purchase/order/update/${row.id}`),
        onRemove: (v) => openDelete(v),
        onPublish: (row) => openConfirmModal(row, "publish"),
        onPaid: (row) => openConfirmModal(row, "paid"),
      }),
    [navigate],
  );

  const Table = useTable("purchase-order", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    tableRef.current = Table;
  }, [Table]);

  const openConfirmModal = useCallback(
    (row: PurchaseOrderDetail, type: "publish" | "paid") => {
      setSelectedRow(row);
      setActionType(type);
      setConfirmModalOpen(true);
    },
    [],
  );

  const closeConfirmModal = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
    setConfirmModalOpen(false);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedRow) return;
    const id = selectedRow.id;
    switch (actionType) {
      case "publish":
        await publishItem({ id });
        break;
      case "paid":
        await paidItem({ id });
        break;
    }
  }, [selectedRow, actionType, publishItem, paidItem]);

  const activeResult = useMemo(() => {
    switch (actionType) {
      case "publish":
        return publishResult;
      case "paid":
        return paidResult;
      default:
        return null;
    }
  }, [actionType, publishResult, paidResult]);

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
      showToast({
        message: "Purchase order berhasil dihapus",
        type: "success",
        position: "bottom-center",
      });
      Table.boot();
    }
  }, [removeItemResult]);

  useEffect(() => {
    if (activeResult?.isSuccess) {
      showToast({
        message: "Berhasil",
        type: "success",
        position: "bottom-center",
      });
      closeConfirmModal();
      activeResult.reset?.();
      tableRef.current?.boot();
    }
  }, [activeResult?.isSuccess]);

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

      {confirmModalOpen && selectedRow && (
        <Modal.Wrapper
          open
          onClose={closeConfirmModal}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">
              {actionType === "publish" ? "Publish PO" : "Mark as Paid"}
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>
              Apakah Anda yakin ingin{" "}
              {actionType === "publish"
                ? "mempublikasikan"
                : "menandai sebagai Lunas"}{" "}
              purchase order ini?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant={actionType === "paid" ? "success" : "primary"}
              onClick={handleConfirmAction}
              isLoading={activeResult?.isLoading}
            >
              Ya, {actionType === "publish" ? "Publikasikan" : "Tandai Lunas"}
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
      )}
    </Page>
  );
};

export default PurchaseOrderListPage;
