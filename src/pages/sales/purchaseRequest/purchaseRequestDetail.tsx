/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import { Loading, Button, Badge, Modal } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { useEnigmaUI } from "@/components";
import { formatDate, formatDateTime, getStatusVariant } from "@/utils";
import type { SalesOrderDetail } from "@/services/types/sales";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import {
  ArrowLeft,
  Store,
  Hash,
  AlertCircle,
  ListOrdered,
  Trash2,
  CornerDownRight,
  Edit,
  Check,
} from "lucide-react";

export default function PurchaseRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();

  const {
    show,
    showResult,
    publish,
    publishResult,
    remove,
    removeResult,
  } = useSalesOrder();
  const order = showResult?.data?.data as SalesOrderDetail | undefined;
  const orderItems = (order as any)?.items ?? order?.items ?? [];
  const isLoading = showResult?.isLoading || showResult?.isFetching;

  const canManage = useCan(ACTION.purchaseRequest);

  const [confirmModal, setConfirmModal] = useState<{
    type: "publish" | "delete";
    title: string;
    message: string;
    onConfirm: (v?: any) => void;
    variant: "primary" | "error";
  } | null>(null);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  useEffect(() => {
    if (removeResult.isSuccess) {
      showToast({ message: "Purchase request berhasil dihapus", type: "success", position: "bottom-center" });
      setConfirmModal(null);
      removeResult.reset?.();
      navigate("/sales/purchase-request");
    }
  }, [removeResult.isSuccess, navigate, removeResult, showToast]);

  useEffect(() => {
    if (publishResult.isSuccess) {
      showToast({ message: "Purchase request berhasil diapprove", type: "success", position: "bottom-center" });
      setConfirmModal(null);
      if (id) show({ id });
      publishResult.reset?.();
    }
  }, [publishResult.isSuccess, id, show, publishResult, showToast]);

  const handlePublish = async () => {
    if (id) {
      await publish({ id });
      show({ id });
    }
  };

  const openApproveModal = () => {
    setConfirmModal({
      type: "publish",
      title: "Konfirmasi Approve",
      message: `Apakah Anda yakin ingin menyetujui purchase request ${order?.code}?`,
      variant: "primary",
      onConfirm: () => handlePublish(),
    });
  };

  const openDeleteModal = () => {
    setConfirmModal({
      type: "delete",
      title: "Hapus Purchase Request",
      message:
        "Apakah Anda yakin ingin menghapus purchase request ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "error",
      onConfirm: () => {
        if (id) remove({ id });
      },
    });
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

  if (!order) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 mb-2">
                Purchase request tidak ditemukan
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/sales/purchase-request")}
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

  const isPending = order?.document_status === "pending";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Purchase Request Detail"
        backTo={() => navigate(-1)}
        action={
          canManage && isPending && (
            <div className="flex gap-2">
              <Button
                variant="info"
                onClick={() => navigate(`/sales/purchase-request/update/${order?.id}`)}
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                onClick={openApproveModal}
                isLoading={publishResult.isLoading}
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="error"
                onClick={openDeleteModal}
                isLoading={removeResult.isLoading}
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )
        }
      />
      <Page.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <dt className="info-label">Telepon</dt>
                  <dd className="info-value">{order.outlet?.phone}</dd>
                </div>
                <div className="info-row flex-col items-start gap-1">
                  <dt className="info-label">Alamat</dt>
                  <dd className="info-value text-left w-full wrap-break-words mt-0.5">
                    {order.outlet?.address || "-"}
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

          {/* Request Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Hash size={18} />
              </div>
              <h2 className="card-section-title">Informasi Request</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Kode</dt>
                <dd className="info-value">{order.code}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal Request</dt>
                <dd className="info-value">
                  {formatDate(order.shipping_date)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Dibuat Pada</dt>
                <dd className="info-value">
                  {formatDateTime(order.created_at)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Document Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.document_status)}
                    size="xs"
                    className="px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.document_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Request Items Table */}
        <div className="card-table card-animate mt-6">
          <div className="table-header p-6!">
            <div className="table-header-icon">
              <ListOrdered size={16} />
            </div>
            <h2 className="table-header-title">
              Request Items ({orderItems?.length || 0})
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
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Qty
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
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
                          <div className="flex flex-col">
                            <span>
                              {item.catalog?.name || item.item?.name || "-"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {(item.catalog?.code || item.item?.code || "") &&
                                `${item.catalog?.code || item.item?.code}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right whitespace-nowrap">
                          {item.catalog?.is_bundle ? (
                            <Badge
                              variant="info"
                              size="xs"
                              className="px-2 font-semibold text-[10px]"
                            >
                              Bundle
                            </Badge>
                          ) : (
                            <>
                              {item.quantity_ordered}{" "}
                              <span className="text-[12px] text-slate-400">
                                {item.fraction?.name ||
                                  item.item?.default_fraction ||
                                  "PCS"}
                              </span>
                            </>
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
                            <td className="px-4 py-2 align-middle text-[12px] text-gray-500 text-right whitespace-nowrap">
                              {bundle.quantity_ordered}{" "}
                              <span className="text-slate-400">
                                {bundle.fraction?.name ||
                                  bundle.item?.default_fraction ||
                                  "PCS"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Note */}
          <div className="flex flex-col md:flex-row gap-6 p-5 border-t border-slate-100">
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Catatan
              </span>
              <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                {order.note || "-"}
              </p>
            </div>
          </div>
        </div>
      </Page.Body>

      <Modal.Wrapper
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
      >
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>
          {confirmModal?.message}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmModal(null)} variant="default">
            Batal
          </Button>
          <Button
            onClick={() => {
              if (confirmModal) {
                confirmModal.onConfirm();
              }
            }}
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
            isLoading={removeResult.isLoading || publishResult.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
