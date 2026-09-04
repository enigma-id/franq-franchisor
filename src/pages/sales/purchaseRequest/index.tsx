import { Page } from "@/components/app/layout";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import createTableConfig from "./table/purchaseRequest.config";
import TableFilter from "../order/table/order.filter";
import type { SalesOrderDetail } from "@/services/types";
import { useEnigmaUI } from "@/components";
import { useSalesOrder } from "@/services/sales/hooks";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export default function PurchaseRequestList() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.purchaseRequest);
  const { remove: removeItem, removeResult: removeItemResult, publish: publishItem, publishResult } =
    useSalesOrder();
  const [selectedRow, setSelectedRow] = useState<SalesOrderDetail | null>(null);
  const [actionType, setActionType] = useState<"publish" | null>(null);
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (row) => navigate(`/sales/purchase-request/${row.id}`),
      onRemove: (v) => openDelete(v),
      onEdit: (row) => navigate(`/sales/purchase-request/update/${row.id}`),
      onPublish: (row) => openConfirmModal(row),
      canManage,
    });
  }, [navigate, canManage]);

  const Table = useTable("purchase_request", tableConfig as TableConfig<unknown>);

  useEffect(() => { tableRef.current = Table; }, [Table]);

  const openConfirmModal = useCallback((row: SalesOrderDetail) => {
    setSelectedRow(row);
    setActionType("publish");
  }, []);

  const closeConfirmModal = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedRow) return;
    await publishItem({ id: selectedRow.id });
  }, [selectedRow, publishItem]);

  const openDelete = (v: SalesOrderDetail) => {
    openModal({
      id: "delete-purchase-request",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-purchase-request")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Hapus Purchase Request</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Apakah Anda yakin ingin menghapus purchase request ini?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => { if (v) removeItem({ id: v.id }); }}
              isLoading={removeItemResult?.isLoading}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-purchase-request")}
              disabled={removeItemResult?.isLoading}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  useEffect(() => {
    if (removeItemResult?.isSuccess) {
      closeModal("delete-purchase-request");
      showToast({ message: "Purchase request berhasil dihapus", type: "success", position: "bottom-center" });
      Table.boot();
    }
  }, [removeItemResult?.isSuccess]);

  useEffect(() => {
    if (publishResult?.isSuccess) {
      showToast({ message: "Purchase request berhasil diapprove", type: "success", position: "bottom-center" });
      closeConfirmModal();
      publishResult.reset?.();
      tableRef.current?.boot();
    }
  }, [publishResult?.isSuccess]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Purchase Request"
        subtitle="Kelola permintaan pembelian dari outlet."
        action={
          canManage && (
            <Button
              variant="primary"
              shape="wide"
              size="md"
              onClick={() => navigate("/sales/purchase-request/create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Request
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Purchase Request"
          emptyDescription="Purchase request akan muncul di sini setelah tersedia."
        />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper
        open={!!selectedRow && !!actionType}
        onClose={closeConfirmModal}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className="font-bold leading-7">Konfirmasi Approve</div>
        </Modal.Header>
        <Modal.Body className="text-sm font-normal leading-5 space-y-4">
          <p>
            Apakah Anda yakin ingin menyetujui purchase request{" "}
            <strong>{selectedRow?.code}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="flex-1 rounded-xl"
            variant="primary"
            onClick={handleConfirmAction}
            isLoading={publishResult?.isLoading}
          >
            Approve
          </Button>
          <Button
            className="flex-1 rounded-xl"
            styleType="outline"
            variant="secondary"
            onClick={closeConfirmModal}
            disabled={publishResult?.isLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
