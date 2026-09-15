/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ListOrdered, PackageCheck, Store } from "lucide-react";

import { Page } from "@/components/app/layout";
import { Badge, Button, Modal } from "@/components/ui";
import { GuardedButton } from "@/components/app";
import { useEnigmaUI } from "@/components";
import { useReceivingPlan } from "@/services/warehouse/hooks";
import type { Receiving, ReceivingPlanDetail } from "@/services/types";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { formatDate, formatDateTime, getStatusVariant } from "@/utils";

type ConfirmState = {
  title: string;
  message: string;
  onConfirm: () => void;
} | null;

export default function ReceivingPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.receiving);

  const {
    show,
    showResult,
    complete,
    completeResult,
    receivings,
    receivingsResult,
  } = useReceivingPlan();

  const [confirmModal, setConfirmModal] = useState<ConfirmState>(null);

  useEffect(() => {
    if (id) {
      show({ id });
      receivings({ plan_id: id });
    }
  }, [id]);

  useEffect(() => {
    if (completeResult?.isSuccess) {
      showToast({
        message: "Receiving plan berhasil diselesaikan",
        type: "success",
        position: "bottom-center",
      });
      completeResult.reset?.();
      show({ id });
      receivings({ plan_id: id });
    }
  }, [completeResult?.isSuccess]);

  const data = showResult?.data?.data as ReceivingPlanDetail | undefined;
  const receivingList = (receivingsResult?.data?.data ?? []) as Receiving[];

  const canComplete =
    !!data &&
    data.document_status !== "new" &&
    data.document_status !== "completed";

  const handleComplete = () => {
    setConfirmModal({
      title: "Konfirmasi Selesaikan Receiving Plan",
      message:
        "Apakah Anda yakin ingin menyelesaikan receiving plan ini? Tindakan ini tidak dapat dibatalkan.",
      onConfirm: () => {
        if (id) complete({ id, payload: { franchisor_id: data?.ref_id } });
        setConfirmModal(null);
      },
    });
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Warehouse"
        title={`Receiving #${data?.code ?? "-"}`}
        subtitle={
          data?.plan_date
            ? `Tanggal rencana ${formatDate(data.plan_date)}`
            : undefined
        }
        backTo={() => navigate("/warehouse/receiving-plan")}
        action={
          canManage && (
            <div className="flex gap-2">
              <GuardedButton
                allowed={canComplete}
                reason="Complete hanya tersedia saat plan sudah diproses dan belum selesai."
                variant="primary"
                onClick={handleComplete}
                isLoading={completeResult?.isLoading}
                title="Complete"
              >
                <CheckCircle2 className="w-4 h-4" />
              </GuardedButton>
            </div>
          )
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Store size={18} />
              </div>
              <h2 className="card-section-title">Informasi Rencana</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Kode Plan</dt>
                <dd className="info-value">{data?.code || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Ref Code</dt>
                <dd className="info-value">{data?.ref_code || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Pengirim</dt>
                <dd className="info-value">{data?.sender_name || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal Rencana</dt>
                <dd className="info-value">{formatDate(data?.plan_date)}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Gudang</dt>
                <dd className="info-value">{data?.warehouse?.name || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <CheckCircle2 size={18} />
              </div>
              <h2 className="card-section-title">Status</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Dokumen</dt>
                <dd className="info-value">
                  <Badge variant={getStatusVariant(data?.document_status)}>
                    {data?.document_status?.toLowerCase() || "-"}
                  </Badge>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Penerimaan</dt>
                <dd className="info-value">
                  <Badge variant={getStatusVariant(data?.receiving_status)}>
                    {data?.receiving_status?.toLowerCase() || "-"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="card-table card-animate mt-6">
          <div className="table-header p-6!">
            <div className="table-header-icon">
              <ListOrdered size={16} />
            </div>
            <h2 className="table-header-title">
              Item Plan ({data?.items?.length || 0})
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="table-hover table-vcenter datatable table" width="100%">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    #
                  </th>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    Produk
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Qty Rencana
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Qty Diterima
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Defect
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Sisa
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{item.item?.name || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      {item.quantity_planned}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.quantity_received}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.quantity_defect}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {Math.max(
                        (item.quantity_planned ?? 0) -
                          (item.quantity_received ?? 0),
                        0,
                      )}
                    </td>
                  </tr>
                ))}
                {!data?.items?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                      Belum ada item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-table card-animate mt-6">
          <div className="table-header p-6!">
            <div className="table-header-icon">
              <PackageCheck size={16} />
            </div>
            <h2 className="table-header-title">
              Penerimaan ({receivingList.length})
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="table-hover table-vcenter datatable table" width="100%">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    #
                  </th>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    Kode
                  </th>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    Waktu Terima
                  </th>
                  <th className="px-4 py-4 text-center uppercase text-[#8B95A5] text-[11px] font-bold">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {receivingList.map((r, idx) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{r.code || "-"}</td>
                    <td className="px-4 py-3">
                      {formatDateTime(r.received_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={getStatusVariant(r.document_status)} size="xs">
                        {r.document_status?.toLowerCase() || "-"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{r.note || "-"}</td>
                  </tr>
                ))}
                {!receivingList.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      Belum ada penerimaan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Page.Body>

      <Modal.Wrapper open={!!confirmModal} onClose={() => setConfirmModal(null)}>
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>{confirmModal?.message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmModal(null)}>Batal</Button>
          <Button
            onClick={() => confirmModal?.onConfirm()}
            variant="primary"
            isLoading={completeResult?.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
