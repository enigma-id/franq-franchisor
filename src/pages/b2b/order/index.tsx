/* eslint-disable react-hooks/set-state-in-effect */
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Page } from "@/components/app/layout";
import { Button, Modal, Loading, Input } from "@/components/ui";
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
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

type ActionType = "ship" | "invoice" | "pay" | "delete" | "cancel";

const B2BOrderListPage: React.FC = () => {
  useDocumentMeta("B2B Order | Sukabread Franchisee", "");
  const navigate = useNavigate();
  const canManage = useCan(ACTION.b2b);
  const canCancel = useCan(ACTION.b2bCancel);
  const { showToast } = useEnigmaUI();
  const {
    remove,
    removeResult,
    ship,
    shipResult,
    invoice,
    invoiceResult,
    pay,
    payResult,
    cancel,
    cancelResult,
  } = useB2BOrder();
  const [selectedRow, setSelectedRow] = useState<B2BOrderDetail | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [cancelNote, setCancelNote] = useState("");
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
    if (type === "cancel") setCancelNote("");
  }, []);

  const closeConfirm = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
    setCancelNote("");
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedRow) return;
    const id = selectedRow.id;

    switch (actionType) {
      case "ship":
        await ship({ id });
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
      case "cancel":
        if (!cancelNote.trim()) return;
        await cancel({ id, payload: { cancelled_reason: cancelNote.trim() } });
        break;
    }
  }, [selectedRow, actionType, ship, invoice, pay, remove, cancel, cancelNote]);

  const activeResult = useMemo(() => {
    switch (actionType) {
      case "ship":
        return shipResult;
      case "invoice":
        return invoiceResult;
      case "pay":
        return payResult;
      case "delete":
        return removeResult;
      case "cancel":
        return cancelResult;
      default:
        return null;
    }
  }, [
    actionType,
    shipResult,
    invoiceResult,
    payResult,
    removeResult,
    cancelResult,
  ]);

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: handleView,
        onEdit: handleEdit,
        onRemove: (row) => openConfirm(row, "delete"),
        onShip: (row) => openConfirm(row, "ship"),
        onInvoice: (row) => openConfirm(row, "invoice"),
        onPay: (row) => openConfirm(row, "pay"),
        onCancel: (row) => openConfirm(row, "cancel"),
        canManage,
        canCancel,
      }),
    [handleView, handleEdit, openConfirm, canManage, canCancel],
  );

  const Table = useTable("b2b-order-list", tableConfig as TableConfig<unknown>);

  // Keep ref in sync
  useEffect(() => {
    tableRef.current = Table;
  }, [Table]);

  useEffect(() => {
    if (activeResult?.isSuccess) {
      showToast({
        message: "Berhasil",
        type: "success",
        position: "bottom-center",
      });
      closeConfirm();
      activeResult.reset?.();
      tableRef.current?.boot();
    }
  }, [activeResult?.isSuccess]);

  const actionLabel = actionType
    ? {
        ship: "Ship",
        invoice: "Invoice",
        pay: "Pay",
        delete: "Delete",
        cancel: "Cancel",
      }[actionType]
    : "";

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Sales'
        title='B2B Order'
        subtitle='Kelola pesanan B2B.'
        action={
          canManage && (
            <Button
              variant='primary'
              onClick={() => navigate("/b2b/order/create")}
            >
              <Plus className='w-4 h-4 mr-2' />
              Buat Pesanan
            </Button>
          )
        }
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle='Data Tidak Ditemukan'
          emptyDescription='Belum ada pesanan B2B.'
        />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper
        open={!!selectedRow && !!actionType}
        onClose={closeConfirm}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className='font-bold leading-7'>Konfirmasi {actionLabel}</div>
        </Modal.Header>
        <Modal.Body className='text-sm font-normal leading-5'>
          <p>
            Apakah Anda yakin ingin{" "}
            {actionLabel === "Delete"
              ? "menghapus"
              : actionLabel === "Cancel"
                ? "membatalkan"
                : `memproses "${actionLabel}"`}{" "}
            pesanan <strong>{selectedRow?.code}</strong>?
          </p>
          {actionType === "cancel" && (
            <div className='mt-4'>
              <Input
                type='textarea'
                label='Alasan Pembatalan'
                required
                placeholder='Tuliskan alasan pembatalan order...'
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='flex-1 rounded-xl'
            variant={actionType === "delete" || actionType === "cancel" ? "error" : "primary"}
            onClick={handleConfirm}
            isLoading={activeResult?.isLoading}
            disabled={actionType === "cancel" && !cancelNote.trim()}
          >
            {activeResult?.isLoading ? (
              <Loading size='sm' variant='spinner' />
            ) : (
              "Konfirmasi"
            )}
          </Button>
          <Button
            className='flex-1 rounded-xl'
            styleType='outline'
            variant='secondary'
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
