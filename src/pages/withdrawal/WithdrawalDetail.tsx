/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/utils";
import { Badge, Button, Modal, Input, Loading } from "@/components/ui";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useWithdrawal } from "@/services/withdrawal/hooks";
import { useEnigmaUI } from "@/components";

export function WithdrawalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { show, showResult, approve, approveResult, reject, rejectResult } =
    useWithdrawal();

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  const data = showResult?.data?.data as any;
  const isLoading = showResult?.isLoading || showResult?.isFetching;
  const isPending = data?.document_status === "pending";

  const [confirmModal, setConfirmModal] = useState<{
    type: "approve" | "reject";
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const refetch = () => {
    if (id) show({ id });
  };

  // Success effects
  useEffect(() => {
    if (approveResult.isSuccess && confirmModal?.type === "approve") {
      showToast({
        message: "Penarikan disetujui",
        type: "success",
        position: "bottom-center",
      });
      setConfirmModal(null);
      refetch();
      approveResult.reset?.();
    }
  }, [approveResult.isSuccess]);

  useEffect(() => {
    if (rejectResult.isSuccess && confirmModal?.type === "reject") {
      showToast({
        message: "Penarikan ditolak",
        type: "success",
        position: "bottom-center",
      });
      setConfirmModal(null);
      setRejectReason("");
      refetch();
      rejectResult.reset?.();
    }
  }, [rejectResult.isSuccess]);

  const handleApprove = async () => {
    if (!id) return;
    await approve({ id });
  };

  const handleReject = async () => {
    if (!id) return;
    await reject({ id, payload: { rejected_reason: rejectReason } });
  };

  if (isLoading) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <Loading size="lg" variant="spinner" />
          </div>
        </Page.Body>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 mb-2">
                Withdrawal tidak ditemukan
              </p>
              <Button variant="primary" onClick={() => navigate(-1)}>
                Kembali
              </Button>
            </div>
          </div>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Detail Penarikan"
        subtitle={`ID: ${data?.id ?? ""}`}
        backTo={() => navigate(-1)}
        action={
          isPending ? (
            <div className="flex items-center gap-2">
              <Button
                variant="success"
                onClick={() => setConfirmModal({ type: "approve" })}
                disabled={approveResult.isLoading}
              >
                <CheckCircle2 size={18} /> Approve
              </Button>
              <Button
                variant="error"
                onClick={() => setConfirmModal({ type: "reject" })}
                disabled={rejectResult.isLoading}
              >
                <XCircle size={18} /> Reject
              </Button>
            </div>
          ) : null
        }
      />
      <Page.Body className="p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between">
            <span className="text-base-content/60">Kode</span>
            <span className="font-semibold font-mono text-sm">
              {data?.code || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Outlet</span>
            <span className="font-semibold">{data?.outlet?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Jumlah</span>
            <span className="font-bold text-lg">
              {currencyFormat(data?.amount || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Saldo Saat Pengajuan</span>
            <span>{currencyFormat(data?.balance_at_request || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Bank</span>
            <span>{data?.bank_name || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">No. Rekening</span>
            <span className="font-mono">
              {data?.bank_account_number || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Atas Nama</span>
            <span>{data?.bank_account_name || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Status</span>
            <Badge
              variant={
                data?.document_status === "approved"
                  ? "success"
                  : data?.document_status === "rejected"
                    ? "error"
                    : "warning"
              }
            >
              {data?.document_status}
            </Badge>
          </div>
          {data?.rejected_reason && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              Alasan ditolak: {data.rejected_reason}
            </div>
          )}
        </div>
      </Page.Body>

      {/* Confirm Approve Modal */}
      <Modal.Wrapper
        open={confirmModal?.type === "approve"}
        onClose={() => setConfirmModal(null)}
      >
        <Modal.Header>Konfirmasi Approval</Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menyetujui penarikan sebesar{" "}
          {currencyFormat(data?.amount || 0)}?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmModal(null)} variant="default">
            Batal
          </Button>
          <Button
            onClick={handleApprove}
            variant="primary"
            isLoading={approveResult.isLoading}
          >
            Setujui
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>

      {/* Confirm Reject Modal */}
      <Modal.Wrapper
        open={confirmModal?.type === "reject"}
        onClose={() => {
          setConfirmModal(null);
          setRejectReason("");
        }}
      >
        <Modal.Header>Konfirmasi Penolakan</Modal.Header>
        <Modal.Body>
          <p className="mb-4">
            Apakah Anda yakin ingin menolak penarikan sebesar{" "}
            {currencyFormat(data?.amount || 0)}?
          </p>
          <Input
            type="textarea"
            label="Alasan Ditolak"
            placeholder="Masukkan alasan penolakan..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setConfirmModal(null);
              setRejectReason("");
            }}
            variant="default"
          >
            Batal
          </Button>
          <Button
            onClick={handleReject}
            variant="error"
            isLoading={rejectResult.isLoading}
            disabled={!rejectReason.trim()}
          >
            Tolak
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
