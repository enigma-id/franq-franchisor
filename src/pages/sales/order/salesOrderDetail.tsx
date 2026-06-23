/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import { Loading, Button, Badge, Modal, Input } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { formatCurrency, formatDate, getStatusVariant } from "@/utils";
import type { SalesOrderDetail } from "@/services/types/sales";
import { useAppSelector, useSalesOrderGuards } from "@/hooks";
import { GuardedButton } from "@/components/app";
import {
  ArrowLeft,
  Store,
  Hash,
  AlertCircle,
  Wallet,
  ListOrdered,
  Check,
  CreditCard,
  Trash2,
  CornerDownRight,
  X,
} from "lucide-react";

export default function SalesOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);

  const {
    show,
    showResult,
    publish,
    publishResult,
    paid,
    paidResult,
    remove,
    removeResult,
    cancel,
    cancelResult,
  } = useSalesOrder();
  const order = showResult?.data?.data as SalesOrderDetail | undefined;
  // API returns items as "items", not "sales_order_items"
  const orderItems = (order as any)?.items ?? order?.items ?? [];
  const isLoading = showResult?.isLoading || showResult?.isFetching;

  const [note, setNote] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    type: "publish" | "cancel" | "paid" | "delete";
    title: string;
    message: string;
    onConfirm: (v?: any) => void;
    variant: "primary" | "error";
  } | null>(null);

  const guards = useSalesOrderGuards(order);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  useEffect(() => {
    if (paidResult.isSuccess) {
      setConfirmModal(null);
      if (id) show({ id });
      paidResult.reset?.();
    }
  }, [paidResult.isSuccess, id, show, paidResult]);

  useEffect(() => {
    if (removeResult.isSuccess) {
      setConfirmModal(null);
      removeResult.reset?.();
      navigate("/sales/order");
    }
  }, [removeResult.isSuccess, navigate, removeResult]);

  useEffect(() => {
    if (cancelResult.isSuccess) {
      setConfirmModal(null);
      if (id) show({ id });
      cancelResult.reset?.();
    }
  }, [cancelResult.isSuccess, id, show, cancelResult]);

  const handlePublish = async () => {
    if (id) {
      await publish({ id });
      show({ id });
    }
  };

  const handleCancel = () => {
    setConfirmModal({
      type: "cancel",
      title: "Konfirmasi Pembatalan",
      message:
        "Apakah Anda yakin ingin memproses pembatalan untuk Sales Order ini?",
      variant: "primary",
      onConfirm: (v) => {
        const payload = { note: v };

        if (id) {
          cancel({ id, payload });
        }
      },
    });
  };

  const handlePaid = () => {
    setConfirmModal({
      type: "paid",
      title: "Konfirmasi Pembayaran",
      message:
        "Apakah Anda yakin ingin memproses pembayaran untuk Sales Order ini?",
      variant: "primary",
      onConfirm: () => {
        if (id) paid({ id });
      },
    });
  };

  const handleDelete = () => {
    setConfirmModal({
      type: "delete",
      title: "Hapus Sales Order",
      message:
        "Apakah Anda yakin ingin menghapus Sales Order ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "error",
      onConfirm: () => {
        if (id) remove({ id });
      },
    });
  };

  if (isLoading) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Header category="Operations" title="Sales Order Detail" />
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <Loading size="lg" variant="spinner" />
          </div>
        </Page.Body>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Header category="Operations" title="Sales Order Detail" />
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 mb-2">
                Order tidak ditemukan
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/sales/order")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        </Page.Body>
      </Page>
    );
  }

  const totalQty =
    orderItems?.reduce(
      (sum: number, item: any) => sum + (item.quantity_ordered || 0),
      0,
    ) || 0;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title={`Order #${order.code}`}
        backTo={() => navigate(-1)}
        action={
          <div className="flex gap-2">
            <GuardedButton
              allowed={guards.canPublish}
              reason="Hanya order tipe default dengan status pending yang dapat disetujui (publish)."
              variant="success"
              onClick={handlePublish}
              isLoading={publishResult.isLoading}
              title="Setujui (Approve)"
            >
              <Check className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canCancel}
              reason="Hanya order dengan status pembayaran unpaid yang dapat dibatalkan."
              variant="error"
              onClick={handleCancel}
              isLoading={cancelResult.isLoading}
              title="Batalkan"
            >
              <X className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canPay}
              reason="Hanya order dengan status pembayaran void yang dapat dibayar (lunas)."
              variant="primary"
              onClick={handlePaid}
              isLoading={paidResult.isLoading}
              title="Bayar (Pay)"
            >
              <CreditCard className="w-4 h-4" />
            </GuardedButton>
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
        }
      />
      <Page.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Outlet Info */}
          <div className="card-info card-animate p-6 flex flex-col justify-between">
            <div>
              <div className="card-section-header">
                <div className="card-section-icon">
                  <Store size={18} />
                </div>
                <h2 className="card-section-title">Informasi Outlet</h2>
              </div>
              <dl className="space-y-1">
                <div className="info-row">
                  <dt className="info-label">Nama Outlet</dt>
                  <dd className="info-value">{order.outlet?.name}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Penerima</dt>
                  <dd className="info-value">{order.recipient_name}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Telepon</dt>
                  <dd className="info-value">{order.recipient_phone}</dd>
                </div>
                <div className="info-row flex-col items-start gap-1">
                  <dt className="info-label">Alamat</dt>
                  <dd className="info-value text-left w-full wrap-break-words mt-0.5">
                    {[order.recipient_address, order.region?.name]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Warehouse</dt>
                  <dd className="info-value">{order.warehouse_name}</dd>
                </div>
              </dl>
            </div>
            {order.void_note && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs font-medium text-red-600">
                  Void Note: {order.void_note}
                </p>
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Hash size={18} />
              </div>
              <h2 className="card-section-title">Informasi Pesanan</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Kode</dt>
                <dd className="info-value">{order.code}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal Order</dt>
                <dd className="info-value">
                  {formatDate(order.created_at, "DD MMM YYYY, HH:mm")}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal Kirim</dt>
                <dd className="info-value">
                  {formatDate(order.shipping_date, "DD MMM YYYY")}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Document Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.document_status)}
                    size="xs"
                    className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.document_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Payment Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.payment_status)}
                    size="xs"
                    className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.payment_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Fulfillment Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.fulfillment_status)}
                    size="xs"
                    className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.fulfillment_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Wallet size={18} />
              </div>
              <h2 className="card-section-title">Pembayaran</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Jatuh Tempo</dt>
                <dd className="info-value">
                  {order.payment_expired_at &&
                  order.payment_expired_at !== "0001-01-01T00:00:00Z"
                    ? formatDate(order.payment_expired_at, "DD MMM YYYY, HH:mm")
                    : "-"}
                </dd>
              </div>
              {order.paid_at && order.paid_at !== "0001-01-01T00:00:00Z" && (
                <div className="info-row">
                  <dt className="info-label">Dibayar</dt>
                  <dd className="info-value">
                    {formatDate(order.paid_at, "DD MMM YYYY, HH:mm")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="card-table card-animate mt-6">
          <div className="table-header p-6!">
            <div className="table-header-icon">
              <ListOrdered size={16} />
            </div>
            <h2 className="table-header-title">
              Order Items ({orderItems?.length || 0})
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table
              className="table-hover table-vcenter datatable table"
              width="100%"
            >
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    #
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Produk
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Tipe
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Qty
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Qty Fulfil
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Harga
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-base-content/50"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  orderItems?.map((item: any, idx: number) => (
                    <React.Fragment key={item.id || idx}>
                      {/* Main item row */}
                      <tr className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors">
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                          {item.catalog?.name || item.item?.name || "-"}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                          {item.catalog?.is_bundle ? (
                            <Badge
                              variant="info"
                              size="xs"
                              className="rounded-full px-2 font-semibold text-[10px]"
                            >
                              Bundle
                            </Badge>
                          ) : (
                            item.fraction?.name ||
                            item.item?.default_fraction ||
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                          {item.quantity_ordered}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                          {item.quantity_fulfilled}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                          {formatCurrency(item.unit_nett || 0)}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                          {formatCurrency(
                            (item.unit_nett || 0) *
                              (item.quantity_ordered || 0),
                          )}
                        </td>
                      </tr>
                      {/* Bundle sub-items */}
                      {item.catalog?.is_bundle &&
                        item.bundles?.map((bundle: any, bIdx: number) => (
                          <tr
                            key={bundle.id || `bundle-${bIdx}`}
                            className="bg-slate-50/30 border-b border-gray-50 last:border-0"
                          >
                            <td className="px-4 py-2 align-middle" />
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-500">
                              <div className="flex items-center gap-1.5 pl-2">
                                <CornerDownRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>
                                  {bundle.item?.alias_name ||
                                    bundle.item?.name ||
                                    "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-500">
                              {bundle.fraction?.name ||
                                bundle.item?.default_fraction ||
                                "-"}
                            </td>
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-500 text-right">
                              {bundle.quantity_ordered}
                            </td>
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-500 text-right">
                              {bundle.quantity_fulfilled}
                            </td>
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-400 text-right">
                              -
                            </td>
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-400 text-right">
                              -
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
              <tfoot className="border-t border-slate-200">
                {/* Subtotal */}
                <tr className="bg-slate-50/50 font-semibold border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600" colSpan={4}>
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {totalQty} item(s)
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right text-slate-800 mono">
                    {formatCurrency(order.subtotal_nett || 0)}
                  </td>
                </tr>
                {/* Shipping Charges */}
                <tr className="bg-slate-50/50 font-semibold border-b border-slate-100">
                  <td
                    className="px-4 py-3 text-slate-600 text-right"
                    colSpan={6}
                  >
                    Shipping Charges
                  </td>
                  <td className="px-4 py-3 text-right text-slate-800 mono">
                    {formatCurrency(order.shipping_charges || 0)}
                  </td>
                </tr>
                {/* Tax (PPN) */}
                <tr className="bg-slate-50/50 font-semibold border-b border-slate-100">
                  <td
                    className="px-4 py-3 text-slate-600 text-right"
                    colSpan={6}
                  >
                    Tax
                  </td>
                  <td className="px-4 py-3 text-right text-slate-800 mono">
                    {formatCurrency(order.subtotal_tax || 0)}
                  </td>
                </tr>
                {/* Total Bill */}
                <tr className="bg-slate-100 font-bold border-t border-slate-200">
                  <td
                    className="px-4 py-3.5 text-slate-800 text-right text-[14px]"
                    colSpan={6}
                  >
                    Total Bill
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-900 text-[14px] mono">
                    {formatCurrency(order.total_charges || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Page.Body>

      <Modal.Wrapper
        open={!!confirmModal}
        onClose={() => {
          setConfirmModal(null);
          setNote("");
        }}
      >
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>
          {confirmModal?.message}
          {confirmModal?.type === "cancel" && (
            <div className="mt-4">
              <Input
                type="textarea"
                label="Alasan"
                placeholder="Contoh: Batalkan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                error={FormState?.errors?.note as string}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmModal(null)} variant="default">
            Batal
          </Button>
          <Button
            onClick={() => {
              if (confirmModal) {
                confirmModal.onConfirm(note);
              }
            }}
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
            isLoading={paidResult.isLoading || removeResult.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
