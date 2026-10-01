/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Input, Loading, Modal, useEnigmaUI } from "@/components";
import { useAppSelector } from "@/hooks";
import { useMembershipReport } from "@/services/report/hooks";
import type { MembershipSettlementRow } from "@/services/types";
import type { SettlementAction } from "../table/settlement.config";

interface SettlementActionModalsProps {
  settlement: MembershipSettlementRow;
  action: SettlementAction;
  onClose: () => void;
  /**
   * Dipanggil setelah aksi sukses dengan perubahan baris yang bisa langsung
   * dipakai caller. `reconcile` mengirim row hasil perbaikan dari BE; `settle`/
   * `unsettle` mengirim status + kolom audit yang berubah (BE tidak mengembalikan
   * row pada dua aksi itu).
   */
  onSuccess?: (patch: Record<string, any>) => void;
}

const SUCCESS_MESSAGE: Record<SettlementAction, string> = {
  settle: "Settlement berhasil di-settle",
  unsettle: "Settlement berhasil di-unsettle",
  reconcile: "Settlement berhasil direkonsiliasi",
};

const TITLE: Record<SettlementAction, string> = {
  settle: "Settle Settlement",
  unsettle: "Unsettle Settlement",
  reconcile: "Reconcile Settlement",
};

/**
 * Modal aksi HO untuk satu baris settlement. Render kondisional dari parent dengan
 * `key` per (id + action) supaya state form selalu fresh.
 */
export function SettlementActionModals({
  settlement,
  action,
  onClose,
  onSuccess,
}: SettlementActionModalsProps) {
  const { showToast } = useEnigmaUI();
  // BE mengisi `settled_by` dari display name session — dipakai untuk update lokal.
  const userName = useAppSelector((s) => s.auth.session?.user?.name);
  const {
    settle,
    settleResult,
    unsettle,
    unsettleResult,
    reconcile,
    reconcileResult,
  } = useMembershipReport();

  const [transferReference, setTransferReference] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [reason, setReason] = useState("");

  const activeResult =
    action === "settle"
      ? settleResult
      : action === "unsettle"
        ? unsettleResult
        : reconcileResult;

  const isLoading = Boolean(activeResult?.isLoading);

  useEffect(() => {
    if (!activeResult?.isSuccess) return;

    showToast({
      message: SUCCESS_MESSAGE[action],
      type: "success",
      position: "bottom-center",
      duration: 4000,
    });

    // `reconcile` mengembalikan row hasil perbaikan (authoritative); `settle`/
    // `unsettle` tidak mengembalikan row, jadi status + kolom audit disusun di sini.
    const patch: Record<string, any> =
      action === "settle"
        ? {
            status: "settled",
            settled_by: userName ?? "",
            settled_at: new Date().toISOString(),
            transfer_reference: transferReference,
            transfer_note: transferNote,
          }
        : action === "unsettle"
          ? {
              status: "pending",
              settled_by: "",
              settled_at: "",
              unsettled_reason: reason,
            }
          : ((reconcileResult?.data as any)?.data ?? {});

    activeResult.reset?.();
    onSuccess?.(patch);
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResult?.isSuccess]);

  const handleSubmit = () => {
    if (action === "settle") {
      settle({
        id: settlement.id,
        payload: {
          transfer_reference: transferReference,
          transfer_note: transferNote,
        },
      });
    } else if (action === "unsettle") {
      unsettle({ id: settlement.id, payload: { reason } });
    } else {
      reconcile({ id: settlement.id });
    }
  };

  const disabled =
    isLoading ||
    (action === "settle" && !transferReference.trim()) ||
    (action === "unsettle" && !reason.trim());

  return (
    <Modal.Wrapper open onClose={onClose} closeOnOutsideClick={false}>
      <Modal.Header>
        <div className='flex flex-col text-left'>
          <span className='text-lg font-bold text-slate-900'>
            {TITLE[action]}
          </span>
          <span className='text-xs text-slate-500 font-medium mt-0.5'>
            {settlement.outlet?.name ?? "-"} • {settlement.date?.slice(0, 10)}
          </span>
        </div>
      </Modal.Header>

      <Modal.Body className='pt-4 pb-2 text-left space-y-4'>
        {action === "settle" && (
          <>
            <p className='text-sm text-slate-600'>
              Tandai settlement{" "}
              <strong>{settlement.outlet?.name ?? "-"}</strong> tanggal{" "}
              <strong>{settlement.date?.slice(0, 10)}</strong> sebagai sudah
              dibayar.
            </p>
            <Input
              label='Transfer Reference'
              required
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              placeholder='Nomor referensi transfer'
              variant='primary'
            />
            <Input
              type='textarea'
              label='Transfer Note'
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder='Catatan transfer (opsional)'
            />
          </>
        )}

        {action === "unsettle" && (
          <>
            <p className='text-sm text-slate-600'>
              Kembalikan settlement{" "}
              <strong>{settlement.outlet?.name ?? "-"}</strong> tanggal{" "}
              <strong>{settlement.date?.slice(0, 10)}</strong> ke status
              pending.
            </p>
            <Input
              type='textarea'
              label='Alasan'
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='Alasan unsettle...'
            />
          </>
        )}

        {action === "reconcile" && (
          <p className='text-sm text-slate-600'>
            Item settlement <strong>{settlement.outlet?.name ?? "-"}</strong>{" "}
            tanggal <strong>{settlement.date?.slice(0, 10)}</strong> akan
            disesuaikan dengan ledger franchise (item yang tidak ada di ledger
            dibuang, yang belum ada ditambahkan), lalu totalnya dihitung ulang.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer className='flex justify-end gap-2 pt-4'>
        <Button
          onClick={onClose}
          variant='secondary'
          styleType='outline'
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          variant={
            action === "unsettle"
              ? "error"
              : action === "reconcile"
                ? "warning"
                : "success"
          }
        >
          {isLoading ? <Loading size='sm' variant='spinner' /> : TITLE[action]}
        </Button>
      </Modal.Footer>
    </Modal.Wrapper>
  );
}

export default SettlementActionModals;
