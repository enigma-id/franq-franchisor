/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Page } from "@/components/app/layout";
import { Button, Modal, Input, Loading } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/withdrawal.config";
import type { WithdrawalRequest } from "@/services/types";
import { useWithdrawal } from "@/services/withdrawal/hooks";
import TableFilter from "./table/withdrawal.filter";
import { useEnigmaUI } from "@/components";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

type ActionType = "approve" | "reject";

export function WithdrawalList() {
  useDocumentMeta("Permintaan Penarikan | Sukabread Franchisee", "");
  const canManage = useCan(ACTION.withdrawalRequest);
  const { showToast } = useEnigmaUI();
  const { approve, approveResult, reject, rejectResult } = useWithdrawal();
  const [selectedRow, setSelectedRow] = useState<WithdrawalRequest | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const openConfirm = useCallback((row: WithdrawalRequest, type: ActionType) => {
    setSelectedRow(row);
    setActionType(type);
    setRejectReason("");
  }, []);

  const closeConfirm = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
    setRejectReason("");
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedRow) return;
    const id = selectedRow.id;

    switch (actionType) {
      case "approve":
        await approve({ id });
        break;
      case "reject":
        await reject({ id, payload: { rejected_reason: rejectReason } });
        break;
    }
  }, [selectedRow, actionType, rejectReason, approve, reject]);

  const activeResult = useMemo(() => {
    switch (actionType) {
      case "approve": return approveResult;
      case "reject": return rejectResult;
      default: return null;
    }
  }, [actionType, approveResult, rejectResult]);

  const tableConfig = useMemo(() => createTableConfig({
    onApprove: (row) => openConfirm(row, "approve"),
    onReject: (row) => openConfirm(row, "reject"),
    canManage,
  }), [openConfirm, canManage]);

  const Table = useTable("withdrawal-list", tableConfig as TableConfig<unknown>);

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

  const actionLabel = actionType === "approve" ? "Approve" : "Reject";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Permintaan Penarikan"
        subtitle="Kelola permintaan penarikan saldo outlet."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada permintaan penarikan."
        />
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
        <Modal.Body className="text-sm font-normal leading-5 space-y-4">
          <p>
            Apakah Anda yakin ingin {actionType === "reject" ? "menolak" : "menyetujui"} penarikan{" "}
            <strong>{selectedRow?.code}</strong>?
          </p>
          {actionType === "reject" && (
            <Input
              type="textarea"
              label="Alasan Ditolak"
              placeholder="Masukkan alasan penolakan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="flex-1 rounded-xl"
            variant={actionType === "reject" ? "error" : "primary"}
            onClick={handleConfirm}
            isLoading={activeResult?.isLoading}
            disabled={actionType === "reject" && !rejectReason.trim()}
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
}
