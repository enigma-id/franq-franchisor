/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ListOrdered,
  PackageCheck,
  PackagePlus,
  Pencil,
  Printer,
  Store,
  Trash2,
} from "lucide-react";

import { Page } from "@/components/app/layout";
import { Badge, Button, Modal, Tooltip } from "@/components/ui";
import { GuardedButton } from "@/components/app";
import { useEnigmaUI } from "@/components";
import ReceivingPlanPrint from "@/components/app/print/receiving-plan";
import ReceivingDocPrint from "@/components/app/print/receiving-doc";
import { useReceiving, useReceivingPlan } from "@/services/warehouse/hooks";
import type { Receiving, ReceivingPlanDetail } from "@/services/types";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { formatDate, formatDateTime, getStatusVariant } from "@/utils";
import { usePrintWindow } from "@/utils/usePrintWindow";

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

  const { open: openPrint } = usePrintWindow({
    title: "Print Receiving",
    autoClose: true,
  });

  const {
    show,
    showResult,
    complete,
    completeResult,
    receivings,
    receivingsResult,
  } = useReceivingPlan();

  const {
    complete: completeReceiving,
    completeResult: completeReceivingResult,
    remove: removeReceiving,
    removeResult: removeReceivingResult,
  } = useReceiving();

  const [confirmModal, setConfirmModal] = useState<ConfirmState>(null);

  const reload = () => {
    if (!id) return;
    show({ id });
    receivings({ plan_id: id, order_by: "created_at" });
  };

  useEffect(() => {
    if (id) {
      show({ id });
      receivings({ plan_id: id, order_by: "created_at" });
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
      reload();
    }
  }, [completeResult?.isSuccess]);

  useEffect(() => {
    if (completeReceivingResult?.isSuccess) {
      showToast({
        message: "Dokumen penerimaan berhasil diselesaikan",
        type: "success",
        position: "bottom-center",
      });
      completeReceivingResult.reset?.();
      setConfirmModal(null);
      reload();
    }
  }, [completeReceivingResult?.isSuccess]);

  useEffect(() => {
    if (removeReceivingResult?.isSuccess) {
      showToast({
        message: "Dokumen penerimaan berhasil dihapus",
        type: "success",
        position: "bottom-center",
      });
      removeReceivingResult.reset?.();
      setConfirmModal(null);
      reload();
    }
  }, [removeReceivingResult?.isSuccess]);

  const data = showResult?.data?.data as ReceivingPlanDetail | undefined;
  const receivingList = (receivingsResult?.data?.data ?? []) as Receiving[];

  const canComplete =
    !!data &&
    data.document_status !== "new" &&
    data.document_status !== "completed";

  const canReceive = canManage && canComplete;

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

  const handleCompleteReceiving = (r: Receiving) => {
    setConfirmModal({
      title: "Konfirmasi Selesaikan Penerimaan",
      message: `Yakin ingin menyelesaikan dokumen penerimaan ${r.code}? Status akan menjadi selesai dan tidak dapat diubah lagi.`,
      onConfirm: () => completeReceiving({ id: r.id }),
    });
  };

  const handleDeleteReceiving = (r: Receiving) => {
    setConfirmModal({
      title: "Hapus Dokumen Penerimaan",
      message: `Apakah Anda yakin ingin menghapus dokumen penerimaan ${r.code}?`,
      onConfirm: () => removeReceiving({ id: r.id }),
    });
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Warehouse'
        title={`Receiving #${data?.code ?? "-"}`}
        subtitle={
          data?.created_at
            ? `Tanggal buat ${formatDateTime(data.created_at)}`
            : undefined
        }
        backTo={() => navigate("/warehouse/receiving-plan")}
        action={
          <div className='flex gap-2'>
            <Button
              title='Print Receiving Plan'
              onClick={() => openPrint(<ReceivingPlanPrint data={data} />)}
            >
              <Printer className='w-4 h-4' />
            </Button>
            {canManage && (
              <GuardedButton
                allowed={canComplete}
                reason='Complete hanya tersedia saat plan sudah diproses dan belum selesai.'
                variant='primary'
                onClick={handleComplete}
                isLoading={completeResult?.isLoading}
                title='Complete'
              >
                <CheckCircle2 className='w-4 h-4' />
              </GuardedButton>
            )}
          </div>
        }
      />

      <Page.Body className='flex-1 flex flex-col min-h-0 overflow-y-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start'>
          <div className='flex flex-col gap-6 min-w-0'>
            <div className='card-table card-animate'>
              <div className='table-header p-6!'>
                <div className='table-header-icon'>
                  <ListOrdered size={16} />
                </div>
                <h2 className='table-header-title'>
                  Item Plan ({data?.items?.length || 0})
                </h2>
              </div>
              <div className='flex-1 overflow-auto'>
                <table
                  className='table-hover table-vcenter datatable table'
                  width='100%'
                >
                  <thead>
                    <tr>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        #
                      </th>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Produk
                      </th>
                      <th className='px-4 py-4 text-start uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Qty Rencana
                      </th>
                      <th className='px-4 py-4 text-start uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Qty Diterima
                      </th>
                      <th className='px-4 py-4 text-start uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Defect
                      </th>
                      <th className='px-4 py-4 text-start uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Sisa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.items?.map((item, idx) => (
                      <tr key={item.id} className='border-b'>
                        <td className='px-4 py-3'>{idx + 1}</td>
                        <td className='px-4 py-3'>
                          <div className='flex flex-col'>
                            <span>{item.item?.alias_name || "-"}</span>
                            <span className='text-[11px] text-slate-400'>
                              {item.item?.code || ""}
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right'>
                          <div className='text-sm text-start! py-2'>
                            {item?.quantity_planned}{" "}
                            {item?.item?.default_fraction}
                            <p className='text-xs text-slate-400'>{`(${item?.quantity_planned_fracted})`}</p>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right'>
                          <div
                            className={`text-sm text-start! py-2 font-semibold ${
                              data?.receiving_status === "new"
                                ? "font-normal!"
                                : item?.quantity_received ===
                                    item?.quantity_planned
                                  ? "text-success!"
                                  : "text-error!"
                            }`}
                          >
                            {item?.quantity_received}{" "}
                            {item?.item?.default_fraction}
                            {item?.quantity_received > 0 && (
                              <p className='text-xs text-slate-400'>{`(${item?.quantity_received_fracted})`}</p>
                            )}
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right'>
                          <div
                            className={`text-sm text-start! py-2 font-semibold ${
                              data?.receiving_status === "new"
                                ? "font-normal!"
                                : item?.quantity_defect > 0
                                  ? "text-error!"
                                  : ""
                            }`}
                          >
                            {item?.quantity_defect}{" "}
                            {item?.item?.default_fraction}
                            {item?.quantity_defect > 0 && (
                              <p className='text-xs text-slate-400'>{`(${item?.quantity_defect_fracted})`}</p>
                            )}
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right font-semibold'>
                          <div className='text-sm text-start! py-2'>
                            {item?.quantity_planned - item?.quantity_received >
                            0 ? (
                              <>
                                {item?.quantity_planned -
                                  item?.quantity_received}{" "}
                                {item?.item?.default_fraction}
                                <p className='text-xs text-slate-400'>{`(${item?.quantity_remaining_fracted})`}</p>
                              </>
                            ) : (
                              "-"
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!data?.items?.length && (
                      <tr>
                        <td
                          colSpan={6}
                          className='px-4 py-6 text-center text-slate-400'
                        >
                          Belum ada item.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='card-table card-animate'>
              <div className='table-header p-6!'>
                <div className='flex items-center justify-between gap-3 w-full'>
                  <div className='flex items-center gap-2'>
                    <div className='table-header-icon'>
                      <PackageCheck size={16} />
                    </div>
                    <h2 className='table-header-title'>
                      Penerimaan ({receivingList.length})
                    </h2>
                  </div>
                  {canReceive && (
                    <Button
                      variant='primary'
                      size='sm'
                      title='Terima barang'
                      onClick={() =>
                        navigate(`/warehouse/receiving/create/${id}`)
                      }
                    >
                      <PackagePlus className='w-4 h-4 mr-1' /> Receive
                    </Button>
                  )}
                </div>
              </div>
              <div className='flex-1 overflow-auto'>
                <table
                  className='table-hover table-vcenter datatable table'
                  width='100%'
                >
                  <thead>
                    <tr>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        #
                      </th>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Kode
                      </th>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Waktu Terima
                      </th>
                      <th className='px-4 py-4 text-center uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Status
                      </th>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Catatan
                      </th>
                      <th className='px-4 py-4 text-center uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivingList.map((r, idx) => (
                      <tr key={r.id} className='border-b'>
                        <td className='px-4 py-3'>{idx + 1}</td>
                        <td className='px-4 py-3'>
                          <button
                            type='button'
                            onClick={() =>
                              navigate(`/warehouse/receiving/${r.id}`)
                            }
                            className='font-medium text-primary underline text-success cursor-pointer'
                          >
                            {r.code || "-"}
                          </button>
                        </td>
                        <td className='px-4 py-3'>
                          {formatDateTime(r.received_at)}
                        </td>
                        <td className='px-4 py-3 text-center'>
                          <Badge
                            variant={getStatusVariant(r.document_status)}
                            size='xs'
                          >
                            {r.document_status?.toLowerCase() || "-"}
                          </Badge>
                        </td>
                        <td className='px-4 py-3'>{r.note || "-"}</td>
                        <td className='px-4 py-3'>
                          <div className='flex items-center justify-center gap-1.5'>
                            <Tooltip label='Print'>
                              <Button
                                size='sm'
                                onClick={() =>
                                  openPrint(<ReceivingDocPrint data={r} />)
                                }
                              >
                                <Printer className='w-4 h-4' />
                              </Button>
                            </Tooltip>
                            {canManage && r.document_status === "new" && (
                              <>
                                <Tooltip label='Edit'>
                                  <Button
                                    size='sm'
                                    variant='secondary'
                                    onClick={() =>
                                      navigate(
                                        `/warehouse/receiving/update/${r.id}`,
                                      )
                                    }
                                  >
                                    <Pencil className='w-4 h-4' />
                                  </Button>
                                </Tooltip>
                                <Tooltip label='Selesaikan'>
                                  <Button
                                    size='sm'
                                    variant='success'
                                    onClick={() => handleCompleteReceiving(r)}
                                  >
                                    <CheckCircle2 className='w-4 h-4' />
                                  </Button>
                                </Tooltip>
                                <Tooltip label='Hapus'>
                                  <Button
                                    size='sm'
                                    variant='error'
                                    onClick={() => handleDeleteReceiving(r)}
                                  >
                                    <Trash2 className='w-4 h-4' />
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!receivingList.length && (
                      <tr>
                        <td
                          colSpan={6}
                          className='px-4 py-6 text-center text-slate-400'
                        >
                          Belum ada penerimaan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='card-info card-animate p-6'>
              <div className='card-section-header'>
                <div className='card-section-icon'>
                  <Store size={18} />
                </div>
                <h2 className='card-section-title'>Informasi Rencana</h2>
              </div>
              <dl className='space-y-1'>
                <div className='info-row'>
                  <dt className='info-label'>Kode Plan</dt>
                  <dd className='info-value'>{data?.code || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Ref Code</dt>
                  <dd className='info-value'>{data?.ref_code || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Pengirim</dt>
                  <dd className='info-value'>{data?.sender_name || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Tanggal Rencana</dt>
                  <dd className='info-value'>{formatDate(data?.plan_date)}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Gudang</dt>
                  <dd className='info-value'>{data?.warehouse?.name || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Status Dokumen</dt>
                  <dd className='info-value'>
                    <Badge variant={getStatusVariant(data?.document_status)}>
                      {data?.document_status?.toLowerCase() || "-"}
                    </Badge>
                  </dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Status Penerimaan</dt>
                  <dd className='info-value'>
                    <Badge variant={getStatusVariant(data?.receiving_status)}>
                      {data?.receiving_status?.toLowerCase() || "-"}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Page.Body>

      <Modal.Wrapper
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
      >
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>{confirmModal?.message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmModal(null)}>Batal</Button>
          <Button
            onClick={() => confirmModal?.onConfirm()}
            variant='primary'
            isLoading={
              completeResult?.isLoading ||
              completeReceivingResult?.isLoading ||
              removeReceivingResult?.isLoading
            }
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
