/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Images,
  ListOrdered,
  Pencil,
  Printer,
  Store,
  Trash2,
  X,
} from "lucide-react";

import { Page } from "@/components/app/layout";
import { Badge, Button, Modal, Tooltip } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import ReceivingDocPrint from "@/components/app/print/receiving-doc";
import { useReceiving } from "@/services/warehouse/hooks";
import type { Receiving } from "@/services/types";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import {
  dateFormat,
  formatDate,
  formatDateTime,
  getStatusVariant,
} from "@/utils";
import { usePrintWindow } from "@/utils/usePrintWindow";

type ConfirmState = {
  title: string;
  message: string;
  onConfirm: () => void;
} | null;

export default function ReceivingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.receiving);

  const { open: openPrint } = usePrintWindow({
    title: "Print Receiving Doc",
    autoClose: true,
  });

  const { show, showResult, complete, completeResult, remove, removeResult } =
    useReceiving();

  const [confirmModal, setConfirmModal] = useState<ConfirmState>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const data = showResult?.data?.data as Receiving | undefined;
  // Rencana sudah ikut di response dokumen ini (relasi Plan diteruskan BE).
  const plan = data?.plan;

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  const backToPlan = () =>
    navigate(
      data?.plan_id
        ? `/warehouse/receiving-plan/${data.plan_id}`
        : "/warehouse/receiving-plan",
    );

  useEffect(() => {
    if (completeResult?.isSuccess) {
      showToast({
        message: "Dokumen penerimaan berhasil diselesaikan",
        type: "success",
        position: "bottom-center",
      });
      completeResult.reset?.();
      setConfirmModal(null);
      if (id) show({ id });
    }
  }, [completeResult?.isSuccess]);

  useEffect(() => {
    if (removeResult?.isSuccess) {
      showToast({
        message: "Dokumen penerimaan berhasil dihapus",
        type: "success",
        position: "bottom-center",
      });
      removeResult.reset?.();
      setConfirmModal(null);
      backToPlan();
    }
  }, [removeResult?.isSuccess]);

  const handleComplete = () => {
    setConfirmModal({
      title: "Konfirmasi Selesaikan Penerimaan",
      message: `Yakin ingin menyelesaikan dokumen penerimaan ${data?.code}? Status akan menjadi selesai dan tidak dapat diubah lagi.`,
      onConfirm: () => {
        if (id) complete({ id });
      },
    });
  };

  const handleDelete = () => {
    setConfirmModal({
      title: "Hapus Dokumen Penerimaan",
      message: `Apakah Anda yakin ingin menghapus dokumen penerimaan ${data?.code}?`,
      onConfirm: () => {
        if (id) remove({ id });
      },
    });
  };

  const items = data?.items ?? [];

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Warehouse'
        title={`Receiving #${data?.code ?? "-"}`}
        subtitle={
          data?.received_at
            ? `Tanggal diterima ${formatDateTime(data.received_at)}`
            : undefined
        }
        backTo={backToPlan}
        action={
          <div className='flex gap-2'>
            <Tooltip label='Print'>
              <Button
                onClick={() => openPrint(<ReceivingDocPrint data={data} />)}
              >
                <Printer className='w-4 h-4' />
              </Button>
            </Tooltip>
            {canManage && data?.document_status === "new" && (
              <>
                <Tooltip label='Edit'>
                  <Button
                    variant='secondary'
                    onClick={() =>
                      navigate(`/warehouse/receiving/update/${id}`)
                    }
                  >
                    <Pencil className='w-4 h-4' />
                  </Button>
                </Tooltip>
                <Tooltip label='Selesaikan'>
                  <Button
                    variant='success'
                    onClick={handleComplete}
                    isLoading={completeResult?.isLoading}
                  >
                    <CheckCircle2 className='w-4 h-4' />
                  </Button>
                </Tooltip>
                <Tooltip label='Hapus'>
                  <Button
                    variant='error'
                    onClick={handleDelete}
                    isLoading={removeResult?.isLoading}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </Tooltip>
              </>
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
                  Item Diterima ({items.length})
                </h2>
              </div>
              <div className='overflow-auto'>
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
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Batch
                      </th>
                      <th className='px-4 py-4 text-start uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Qty Diterima
                      </th>
                      <th className='px-4 py-4 text-start uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Qty Defect
                      </th>
                      <th className='px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold'>
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id} className='border-b'>
                        <td className='px-4 py-3'>{idx + 1}</td>
                        <td className='px-4 py-3'>
                          <div className='flex flex-col'>
                            <span>
                              {item.plan_item?.item?.alias_name || "-"}
                            </span>
                            <span className='text-[11px] text-slate-400'>
                              {item.plan_item?.item?.code || ""}
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-3'>
                          {item?.plan_item?.item?.is_batch_tracking ? (
                            <div className='text-sm text-start! py-2'>
                              {item?.batch?.code}
                              <p className='text-xs text-slate-400'>
                                {item?.plan_item?.item?.picking_strategy ===
                                "fefo" ? (
                                  <>
                                    {dateFormat(
                                      item?.batch?.expired_at,
                                      "DD/MM/YYYY",
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {dateFormat(
                                      item?.batch?.entry_at,
                                      "DD/MM/YYYY",
                                    )}
                                  </>
                                )}
                              </p>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className='px-4 py-3'>
                          <div className='text-sm text-center! py-2'>
                            {item?.quantity_received}{" "}
                            {item?.plan_item?.item?.default_fraction}
                            {item?.quantity_received > 0 && (
                              <p className='text-xs text-slate-400'>{`(${item?.quantity_received_fracted})`}</p>
                            )}
                          </div>
                        </td>
                        <td className='px-4 py-3'>
                          <div className='text-sm text-center py-2'>
                            {item?.quantity_defect}{" "}
                            {item?.plan_item?.item?.default_fraction}
                            {item?.quantity_defect > 0 && (
                              <p className='text-xs text-slate-400'>{`(${item?.quantity_defect_fracted})`}</p>
                            )}
                          </div>
                        </td>
                        <td className='px-4 py-3'>{item.note || "-"}</td>
                      </tr>
                    ))}
                    {!items.length && (
                      <tr>
                        <td
                          colSpan={6}
                          className='px-4 py-6 text-center text-slate-400'
                        >
                          Belum ada item diterima.
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
                <h2 className='card-section-title'>Informasi Penerimaan</h2>
              </div>
              <dl className='space-y-1'>
                <div className='info-row'>
                  <dt className='info-label'>Kode</dt>
                  <dd className='info-value'>{data?.code || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Waktu Terima</dt>
                  <dd className='info-value'>
                    {formatDateTime(data?.received_at)}
                  </dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Diterima Oleh</dt>
                  <dd className='info-value'>{data?.created_by || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Gudang</dt>
                  <dd className='info-value'>{data?.warehouse?.name || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Status</dt>
                  <dd className='info-value'>
                    <Badge variant={getStatusVariant(data?.document_status)}>
                      {data?.document_status?.toLowerCase() || "-"}
                    </Badge>
                  </dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Catatan</dt>
                  <dd className='info-value'>{data?.note || "-"}</dd>
                </div>
              </dl>

              {!!data?.photos?.length && (
                <div className='mt-4'>
                  <div className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2'>
                    <Images className='w-3.5 h-3.5' /> Foto (
                    {data.photos.length})
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {data.photos.map((photo, index) => (
                      <button
                        key={photo + index}
                        type='button'
                        onClick={() => setSelectedPhoto(photo)}
                        className='w-16 h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-primary/60 transition-colors'
                      >
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='card-info card-animate p-6'>
              <div className='card-section-header'>
                <div className='card-section-icon'>
                  <ListOrdered size={18} />
                </div>
                <h2 className='card-section-title'>Informasi Rencana</h2>
              </div>
              <dl className='space-y-1'>
                <div className='info-row'>
                  <dt className='info-label'>Kode Plan</dt>
                  <dd className='info-value'>{plan?.code || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Ref Code</dt>
                  <dd className='info-value'>{plan?.ref_code || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Pengirim</dt>
                  <dd className='info-value'>{plan?.sender_name || "-"}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Tanggal Rencana</dt>
                  <dd className='info-value'>{formatDate(plan?.plan_date)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Page.Body>

      {selectedPhoto && (
        <div
          className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4'
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type='button'
            onClick={() => setSelectedPhoto(null)}
            className='absolute top-4 right-4 text-white hover:text-slate-300'
          >
            <X className='w-8 h-8' />
          </button>
          <img
            src={selectedPhoto}
            alt='Preview'
            className='max-w-full max-h-full object-contain rounded'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
            isLoading={completeResult?.isLoading || removeResult?.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
