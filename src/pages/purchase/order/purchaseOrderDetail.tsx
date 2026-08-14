/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import { Button, Badge, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { formatCurrency, getStatusVariant } from "@/utils";
import type { PurchaseOrderDetail } from "@/services/types/purchase";
import {
  Store,
  Hash,
  Wallet,
  ListOrdered,
  CreditCard,
  Trash2,
  Edit,
  Send,
} from "lucide-react";
import { usePurchaseOrderGuards } from "@/hooks";
import { GuardedButton } from "@/components/app";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();

  const {
    show,
    showResult,
    publish,
    publishResult,
    paid,
    paidResult,
    remove,
    removeResult,
  } = usePurchaseOrder();

  const [confirmModal, setConfirmModal] = useState<{
    type: "publish" | "cancel" | "paid" | "delete";
    title: string;
    message: string;
    onConfirm: (v?: any) => void;
    variant: "primary" | "error";
  } | null>(null);

  const { data: detail } = showResult;

  const handlePublish = () => {
    setConfirmModal({
      type: "cancel",
      title: "Konfirmasi Penerbitan",
      message:
        "Apakah Anda yakin ingin memproses penerbitan untuk Purchase Order ini?",
      variant: "primary",
      onConfirm: () => {
        if (id) publish({ id });
        setConfirmModal(null);
      },
    });
  };

  const handlePaid = () => {
    setConfirmModal({
      type: "paid",
      title: "Konfirmasi Pembayaran",
      message:
        "Apakah Anda yakin ingin memproses pembayaran untuk Purchase Order ini?",
      variant: "primary",
      onConfirm: () => {
        if (id) paid({ id });
        setConfirmModal(null);
      },
    });
  };

  const handleDelete = () => {
    setConfirmModal({
      type: "delete",
      title: "Hapus Purchase Order",
      message:
        "Apakah Anda yakin ingin menghapus Purchase Order ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "error",
      onConfirm: () => {
        if (id) remove({ id });
        setConfirmModal(null);
      },
    });
  };

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  useEffect(() => {
    if (publishResult?.isSuccess) {
      showToast({ message: "Purchase order berhasil diterbitkan", type: "success", position: "bottom-center" });
      publishResult.reset?.();
      show({ id });
    }
  }, [publishResult?.isSuccess]);

  useEffect(() => {
    if (paidResult?.isSuccess) {
      showToast({ message: "Pembayaran berhasil diproses", type: "success", position: "bottom-center" });
      paidResult.reset?.();
      show({ id });
    }
  }, [paidResult?.isSuccess]);

  useEffect(() => {
    if (removeResult?.isSuccess) {
      showToast({ message: "Purchase order berhasil dihapus", type: "success", position: "bottom-center" });
      navigate(-1);
    }
  }, [removeResult?.isSuccess]);

  const data = detail?.data as PurchaseOrderDetail;
  const guards = usePurchaseOrderGuards(data);
  const canManage = useCan(ACTION.purchaseOrder);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Purchase"
        title={`Order #${data?.code}`}
        backTo={() => navigate("/purchase/order")}
        action={
          canManage && (
            <div className="flex gap-2">
            <GuardedButton
              allowed={guards.canEdit}
              reason="Hanya order tipe default dengan status pending yang dapat diperbaharui (Edit)."
              variant="info"
              onClick={() => navigate(`/purchase/order/update/${data?.id}`)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canPublish}
              reason="Hanya order tipe default dengan status pending yang dapat disetujui (publish)."
              variant="primary"
              onClick={handlePublish}
              isLoading={publishResult.isLoading}
              title="Publish"
            >
              <Send className="w-4 h-4" />
            </GuardedButton>
            {guards.canPaid && (
              <Button
                variant="success"
                onClick={handlePaid}
                isLoading={paidResult.isLoading}
                title="Pay"
              >
                <CreditCard className="w-4 h-4" />
              </Button>
            )}
            <GuardedButton
              allowed={guards.canDelete}
              reason="Hanya order tipe default dengan status pending yang dapat dihapus."
              variant="error"
              onClick={handleDelete}
              isLoading={removeResult.isLoading}
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </GuardedButton>
            </div>
          )
        }
      />
      <Page.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Store size={18} />
              </div>
              <h2 className="card-section-title">
                Informasi Supplier & Warehouse
              </h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Supplier</dt>
                <dd className="info-value">{data?.supplier?.name}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Kode Supplier</dt>
                <dd className="info-value">{data?.supplier?.code}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Telepon</dt>
                <dd className="info-value">{data?.supplier?.phone}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Sales Person</dt>
                <dd className="info-value">{data?.supplier?.sales_person}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Alamat Supplier</dt>
                <dd className="info-value">{data?.supplier?.address}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Warehouse</dt>
                <dd className="info-value">{data?.warehouse_name}</dd>
              </div>
            </dl>
          </div>

          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Hash size={18} />
              </div>
              <h2 className="card-section-title">Informasi Pesanan</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Kode PO</dt>
                <dd className="info-value">{data?.code}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Status</dt>
                <dd className="info-value">
                  <Badge variant={getStatusVariant(data?.document_status)}>
                    {data?.document_status}
                  </Badge>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Penerima</dt>
                <dd className="info-value">{data?.recipient_name}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">No. Telepon</dt>
                <dd className="info-value">{data?.recipient_phone}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Alamat</dt>
                <dd className="info-value">{data?.address}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">ETA Date</dt>
                <dd className="info-value">
                  {data?.eta_date
                    ? new Date(data.eta_date).toLocaleDateString()
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Wallet size={18} />
              </div>
              <h2 className="card-section-title">Pembayaran</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Subtotal Nett</dt>
                <dd className="info-value">
                  {formatCurrency(data?.subtotal_nett)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Subtotal Tax</dt>
                <dd className="info-value">
                  {formatCurrency(data?.subtotal_tax)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Biaya Kirim</dt>
                <dd className="info-value">
                  {formatCurrency(data?.shipping_charges)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Total</dt>
                <dd className="info-value font-bold text-lg">
                  {formatCurrency(data?.total_charges)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Status Pembayaran</dt>
                <dd className="info-value">
                  <Badge variant={getStatusVariant(data?.payment_status)}>
                    {data?.payment_status}
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
              Order Items ({data?.items?.length || 0})
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table
              className="table-hover table-vcenter datatable table"
              width="100%"
            >
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    #
                  </th>
                  <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                    Produk
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Qty
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Qty Received
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Harga
                  </th>
                  <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{item.item.name}</td>
                    <td className="px-4 py-3 text-right">
                      {item.quantity_ordered} {item.fraction.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.quantity_received ?? 0} {item.fraction.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.unit_nett)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.unit_nett * item.quantity_ordered)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
