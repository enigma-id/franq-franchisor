import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Page } from "@/components/app/layout";
import { Button, Modal, Loading } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/order.config";
import type { B2BOrderDetail } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { useB2BOrder } from "@/services/b2b/hooks";
import TableFilter from "./table/order.filter";
import { useEnigmaUI } from "@/components";
import { Plus } from "lucide-react";

type ActionType = "ship" | "receive" | "invoice" | "pay" | "delete";

const B2BOrderListPage: React.FC = () => {
  useDocumentMeta("B2B Order | Sukabread Franchisee", "");
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { remove, removeResult, ship, shipResult, receive, receiveResult, invoice, invoiceResult, pay, payResult } = useB2BOrder();
  const [selectedRow, setSelectedRow] = useState<B2BOrderDetail | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const handleView = useCallback(
    (row: B2BOrderDetail) => navigate(`/b2b/order/${row.id}`),
    [navigate],
  );

  const handleEdit = useCallback(
    (row: B2BOrderDetail) => navigate(`/b2b/order/update/${row.id}`),
    [navigate],
  );

  const openConfirm = useCallback((row: B2BOrderDetail, type: ActionType) => {
    setSelectedRow(row);
    setActionType(type);
  }, []);

  const closeConfirm = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedRow) return;
    const id = selectedRow.id;

    switch (actionType) {
      case "ship":
        await ship({ id });
        break;
      case "receive":
        await receive({ id });
        break;
      case "invoice":
        await invoice({ id });
        break;
      case "pay":
        await pay({ id });
        break;
      case "delete":
        await remove({ id });
        break;
    }
  }, [selectedRow, actionType, ship, receive, invoice, pay, remove]);

  const activeResult = useMemo(() => {
    switch (actionType) {
      case "ship": return shipResult;
      case "receive": return receiveResult;
      case "invoice": return invoiceResult;
      case "pay": return payResult;
      case "delete": return removeResult;
      default: return null;
    }
  }, [actionType, shipResult, receiveResult, invoiceResult, payResult, removeResult]);

  const tableConfig = useMemo(() => createTableConfig({
    onClick: handleView,
    onEdit: handleEdit,
    onRemove: (row) => openConfirm(row, "delete"),
    onShip: (row) => openConfirm(row, "ship"),
    onReceive: (row) => openConfirm(row, "receive"),
    onInvoice: (row) => openConfirm(row, "invoice"),
    onPay: (row) => openConfirm(row, "pay"),
  }), [handleView, handleEdit, openConfirm]);

  const Table = useTable("b2b-order-list", tableConfig as TableConfig<unknown>);

  // Keep ref in sync
  useEffect(() => {
    tableRef.current = Table;
  }, [Table]);

  useEffect(() => {
    if (activeResult?.isSuccess) {
      showToast({ message: "Berhasil", type: "success", position: "bottom-center" });
      closeConfirm();
      activeResult.reset?.();
      tableRef.current?.boot();
    }
  }, [activeResult?.isSuccess]);

  const actionLabel = actionType
    ? { ship: "Ship", receive: "Receive", invoice: "Invoice", pay: "Pay", delete: "Delete" }[actionType]
    : "";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="B2B"
        title="B2B Order"
        subtitle="Kelola pesanan B2B."
        action={
          <Button onClick={() => navigate("/b2b/order/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Pesanan
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render emptyTitle="Data Tidak Ditemukan" emptyDescription="Belum ada pesanan B2B." />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper
        open={!!selectedRow && !!actionType}
        onClose={closeConfirm}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className="font-bold leading-7">Konfirmasi {actionLabel}</div>
        </Modal.Header>
        <Modal.Body className="text-sm font-normal leading-5">
          <p>
            Apakah Anda yakin ingin {actionLabel === "Delete" ? "menghapus" : `memproses "${actionLabel}"`} pesanan{" "}
            <strong>{selectedRow?.code}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="flex-1 rounded-xl"
            variant={actionType === "delete" ? "error" : "primary"}
            onClick={handleConfirm}
            isLoading={activeResult?.isLoading}
          >
            {activeResult?.isLoading ? <Loading size="sm" variant="spinner" /> : "Konfirmasi"}
          </Button>
          <Button
            className="flex-1 rounded-xl"
            styleType="outline"
            variant="secondary"
            onClick={closeConfirm}
            disabled={activeResult?.isLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default B2BOrderListPage;
