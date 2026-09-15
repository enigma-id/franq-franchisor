/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ListOrdered,
  Minus,
  Plus,
  Store,
  Truck,
} from "lucide-react";

import { Page } from "@/components/app/layout";
import { Badge, Button, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import { useDeliveryPlan } from "@/services/warehouse/hooks";
import type { DeliveryPlanDetail } from "@/services/types";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { formatDate, getStatusVariant } from "@/utils";
import { useAppSelector } from "@/hooks";

type ConfirmState = {
  title: string;
  message: string;
  variant: "primary" | "error";
  onConfirm: () => void;
} | null;

export default function DeliveryPlanDetailPage() {
  const FormState = useAppSelector((s) => s.form);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.delivery);

  const {
    show,
    showResult,
    complete,
    completeResult,
    delivered,
    deliveredResult,
    fulfilled,
    fulfilledResult,
  } = useDeliveryPlan();

  const [confirmModal, setConfirmModal] = useState<ConfirmState>(null);
  const [fulfillQty, setFulfillQty] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  useEffect(() => {
    if (completeResult?.isSuccess) {
      showToast({
        message: "Delivery plan berhasil diselesaikan",
        type: "success",
        position: "bottom-center",
      });
      completeResult.reset?.();
      show({ id });
    }
  }, [completeResult?.isSuccess]);

  useEffect(() => {
    if (deliveredResult?.isSuccess) {
      showToast({
        message: "Delivery plan berhasil ditandai terkirim",
        type: "success",
        position: "bottom-center",
      });
      deliveredResult.reset?.();
      show({ id });
    }
  }, [deliveredResult?.isSuccess]);

  useEffect(() => {
    if (fulfilledResult?.isSuccess) {
      showToast({
        message: "Delivery plan berhasil di-fulfill",
        type: "success",
        position: "bottom-center",
      });
      fulfilledResult.reset?.();
      show({ id });
    }
  }, [fulfilledResult?.isSuccess]);

  const data = showResult?.data?.data as DeliveryPlanDetail | undefined;

  // Prefill qty fulfillment per plan item saat plan siap di-fulfill.
  useEffect(() => {
    if (
      data?.document_status === "published" &&
      data?.fulfillment_status === "new"
    ) {
      const next: Record<string, number> = {};
      data.items?.forEach((it) => {
        next[it.id] = it.quantity_planned ?? 0;
      });
      setFulfillQty(next);
    }
  }, [data]);

  const updateQty = (itemId: string, delta: number) => {
    setFulfillQty((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] ?? 0) + delta),
    }));
  };

  const canFulfill =
    canManage &&
    data?.document_status === "published" &&
    data?.fulfillment_status === "new";
  const canComplete =
    canManage &&
    (data?.document_status === "process" ||
      data?.document_status === "published");
  const canDeliver =
    canManage &&
    data?.shipping_status === "new" &&
    data?.document_status === "completed" &&
    data?.self_pickup === true;

  const handleFulfilled = () => {
    const items =
      data?.items?.map((it) => ({
        plan_item_id: it.id,
        quantity: fulfillQty[it.id] ?? 0,
      })) ?? [];

    if (!items.length || items.some((it) => !(it.quantity > 0))) {
      showToast({
        message: "Jumlah fulfillment setiap item harus lebih dari 0",
        type: "error",
        position: "bottom-center",
      });
      return;
    }

    setConfirmModal({
      title: "Konfirmasi Fulfillment",
      message:
        "Apakah Anda yakin ingin memproses fulfillment untuk delivery plan ini?",
      variant: "primary",
      onConfirm: () => {
        if (id)
          fulfilled({ id, payload: { items, franchisor_id: data?.brand_id } });
        setConfirmModal(null);
      },
    });
  };

  const handleComplete = () => {
    setConfirmModal({
      title: "Konfirmasi Selesaikan Delivery Plan",
      message:
        "Apakah Anda yakin ingin menyelesaikan delivery plan ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "primary",
      onConfirm: () => {
        if (id) complete({ id, payload: { franchisor_id: data?.brand_id } });
        setConfirmModal(null);
      },
    });
  };

  const handleDelivered = () => {
    setConfirmModal({
      title: "Konfirmasi Sudah Diambil",
      message:
        "Apakah Anda yakin delivery plan self-pickup ini sudah diambil oleh outlet?",
      variant: "primary",
      onConfirm: () => {
        if (id) delivered({ id, payload: { franchisor_id: data?.brand_id } });
        setConfirmModal(null);
      },
    });
  };

  const isLoading =
    completeResult?.isLoading ||
    deliveredResult?.isLoading ||
    fulfilledResult?.isLoading;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Warehouse'
        title={`Delivery #${data?.code ?? "-"}`}
        backTo={() => navigate("/warehouse/delivery-plan")}
        action={
          canManage && (
            <div className='flex gap-2'>
              {canComplete && (
                <Button
                  variant='primary'
                  onClick={handleComplete}
                  isLoading={completeResult?.isLoading}
                >
                  <CheckCircle2 className='w-4 h-4' /> Complete
                </Button>
              )}
              {canDeliver && (
                <Button
                  variant='primary'
                  onClick={handleDelivered}
                  isLoading={deliveredResult?.isLoading}
                >
                  <Truck className='w-4 h-4' /> Sudah Diambil
                </Button>
              )}
            </div>
          )
        }
      />

      <Page.Body className='flex-1 flex flex-col min-h-0 overflow-y-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='card-info card-animate p-6'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <Truck size={18} />
              </div>
              <h2 className='card-section-title'>Informasi Pengiriman</h2>
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
                <dt className='info-label'>Tipe</dt>
                <dd className='info-value capitalize'>
                  {data?.type?.replace(/_/g, " ") || "-"}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Tanggal Kirim</dt>
                <dd className='info-value'>
                  {formatDate(data?.shipping_date)}
                </dd>
              </div>
              {data?.picked_up_by?.name && (
                <div className='info-row'>
                  <dt className='info-label'>Diambil Oleh</dt>
                  <dd className='info-value'>{data.picked_up_by.name}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className='card-info card-animate p-6'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <Store size={18} />
              </div>
              <h2 className='card-section-title'>Tujuan</h2>
            </div>
            <dl className='space-y-1'>
              <div className='info-row'>
                <dt className='info-label'>Outlet</dt>
                <dd className='info-value'>
                  {`${data?.brand?.name ? data.brand.name + " - " : ""}${data?.outlet?.name ?? ""}`}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Telepon</dt>
                <dd className='info-value'>{data?.phone || "-"}</dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Alamat</dt>
                <dd className='info-value'>{data?.address || "-"}</dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Gudang</dt>
                <dd className='info-value'>{data?.warehouse?.name || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className='card-info card-animate p-6'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <CheckCircle2 size={18} />
              </div>
              <h2 className='card-section-title'>Status</h2>
            </div>
            <dl className='space-y-1'>
              <div className='info-row'>
                <dt className='info-label'>Dokumen</dt>
                <dd className='info-value'>
                  <Badge variant={getStatusVariant(data?.document_status)}>
                    {data?.document_status?.toLowerCase() || "-"}
                  </Badge>
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Fulfillment</dt>
                <dd className='info-value'>
                  <Badge variant={getStatusVariant(data?.fulfillment_status)}>
                    {data?.fulfillment_status?.toLowerCase() || "-"}
                  </Badge>
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Penerimaan</dt>
                <dd className='info-value'>
                  <Badge variant={getStatusVariant(data?.shipping_status)}>
                    {data?.shipping_status?.toLowerCase() || "-"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className='card-table card-animate mt-6'>
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
                  <th className='px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold'>
                    Qty Rencana
                  </th>
                  <th className='px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold'>
                    Qty Terpenuhi
                  </th>
                  {canFulfill && (
                    <th className='px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold'>
                      Qty Fulfillment
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((item, idx) => (
                  <tr key={item.id} className='border-b'>
                    <td className='px-4 py-3'>{idx + 1}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-col'>
                        <span>{item.item?.name || "-"}</span>
                        <span className='text-[11px] text-slate-400'>
                          {item.item?.code || ""}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-right'>
                      {item.quantity_planned}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      {item.quantity_fulfilled}
                    </td>
                    {canFulfill && (
                      <td className='px-4 py-3'>
                        <div className='flex items-center justify-end gap-1'>
                          <button
                            type='button'
                            onClick={() => updateQty(item.id, -1)}
                            className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-colors active:scale-90'
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className='text-[12px] font-black text-slate-700 w-8 text-center'>
                            {fulfillQty[item.id] ?? 0}
                          </span>
                          <button
                            type='button'
                            onClick={() => updateQty(item.id, 1)}
                            className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-colors active:scale-90'
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                        <div className='text-error text-[10px] font-medium pt-1 text-end'>
                          {
                            FormState.errors?.[
                              `items.${idx}.quantity`
                            ] as string
                          }
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {!data?.items?.length && (
                  <tr>
                    <td
                      colSpan={canFulfill ? 6 : 5}
                      className='px-4 py-6 text-center text-slate-400'
                    >
                      Belum ada item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {canFulfill && (
            <div className='flex mt-3 justify-end px-6 pb-6'>
              <Button
                variant='primary'
                onClick={handleFulfilled}
                isLoading={fulfilledResult?.isLoading}
              >
                <CheckCircle2 className='w-4 h-4' /> Fulfilled
              </Button>
            </div>
          )}
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
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
            isLoading={isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
