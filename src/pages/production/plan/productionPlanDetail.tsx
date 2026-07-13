/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Button, Modal, RemoteSelect } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import { useProductionPlan } from "@/services/production/hooks";
import {
  Loader2,
  Store,
  ListOrdered,
  FileText,
  Check,
  Trash2,
  Printer,
} from "lucide-react";
import dayjs from "dayjs";
import type { ProductionPlanDetail, WarehouseDetail } from "@/services/types";
import { useProductionPlanGuards } from "@/hooks/useProductionPlanGuards";
import { GuardedButton } from "@/components/app";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useAppSelector } from "@/hooks";
import { usePrintWindow } from "@/utils/usePrintWindow";
import Plan from "@/components/app/print/plan";

const ProductionPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);
  const { open: openPrint } = usePrintWindow({
    title: "Print Preview",
    autoClose: true,
  });
  const { showToast } = useEnigmaUI();

  const {
    show,
    showResult,
    publish,
    publishResult,
    complete,
    completeResult,
    remove,
    removeResult,
  } = useProductionPlan();
  const { get: getWarehouse, getResult: warehouseResult } = useWarehouse();

  const [warehouse, setWarehouse] = useState<WarehouseDetail | null>(null);

  const { data, isLoading } = showResult;
  const plan = data?.data as ProductionPlanDetail;
  const guards = useProductionPlanGuards(plan);

  const [confirmModal, setConfirmModal] = useState<{
    type: "publish" | "complete" | "delete";
    title: string;
    message: string;
    onConfirm: (v?: any) => void;
    variant: "primary" | "error" | "success";
  } | null>(null);

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (
      publishResult.isSuccess ||
      completeResult.isSuccess ||
      removeResult.isSuccess
    ) {
      setConfirmModal(null);
      if (publishResult.isSuccess) {
        showToast({ message: "Rencana produksi berhasil diterbitkan", type: "success", position: "bottom-center" });
        publishResult.reset?.();
      }
      if (completeResult.isSuccess) {
        showToast({ message: "Rencana produksi berhasil diselesaikan", type: "success", position: "bottom-center" });
        completeResult.reset?.();
      }
      if (removeResult.isSuccess) {
        showToast({ message: "Rencana produksi berhasil dihapus", type: "success", position: "bottom-center" });
        removeResult.reset?.();
        navigate("/production/plan");
      } else if (id) {
        show({ id });
      }
    }
  }, [
    publishResult.isSuccess,
    completeResult.isSuccess,
    removeResult.isSuccess,
    id,
    show,
    navigate,
    showToast,
  ]);

  const handlePublish = () => {
    setConfirmModal({
      type: "publish",
      title: "Konfirmasi Setujui",
      message: "Apakah Anda yakin ingin menyetujui rencana produksi ini?",
      variant: "success",
      onConfirm: (v) => {
        const payload = { warehouse_id: v?.id };
        if (id) {
          publish({ id, payload });
        }
      },
    });
  };

  const handleComplete = () => {
    setConfirmModal({
      type: "complete",
      title: "Konfirmasi Selesai",
      message: "Apakah Anda yakin ingin menyelesaikan rencana produksi ini?",
      variant: "primary",
      onConfirm: () => {
        if (id) complete({ id });
      },
    });
  };

  const handleDelete = () => {
    setConfirmModal({
      type: "delete",
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus rencana produksi ini?",
      variant: "error",
      onConfirm: () => {
        if (id) remove({ id });
      },
    });
  };

  const handleOpenPrint = (item: any) => {
    openPrint(<Plan data={item} plan={plan} />);
  };

  if (isLoading) {
    return (
      <Page className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </Page>
    );
  }

  if (!plan) {
    return (
      <Page className="h-full flex items-center justify-center">
        <p className="text-slate-500">Data rencana produksi tidak ditemukan.</p>
      </Page>
    );
  }

  const statusMap = {
    pending: "default",
    published: "info",
    completed: "success",
    cancelled: "error",
  } as const;

  const statusVariant =
    statusMap[plan.document_status as keyof typeof statusMap] || "neutral";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title={`Detail Rencana Produksi - ${plan.code}`}
        backTo={() => navigate(-1)}
        action={
          <div className="flex gap-2">
            <GuardedButton
              allowed={guards.canPublish}
              reason="Hanya rencana dengan status pending yang dapat disetujui."
              variant="success"
              onClick={handlePublish}
              isLoading={publishResult.isLoading}
              title="Publish"
            >
              <Check className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canComplete}
              reason="Hanya rencana dengan status published yang dapat diselesaikan."
              variant="primary"
              onClick={handleComplete}
              isLoading={completeResult.isLoading}
              title="Complete"
            >
              <Check className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canDelete}
              reason="Hanya rencana dengan status pending yang dapat dihapus."
              variant="error"
              onClick={handleDelete}
              isLoading={removeResult.isLoading}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </GuardedButton>
          </div>
        }
      />

      <Page.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Info Card */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Store size={18} />
              </div>
              <h2 className="card-section-title">Informasi Rencana</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Kode</dt>
                <dd className="info-value">{plan.code}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Gudang</dt>
                <dd className="info-value">{plan.warehouse_name || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal Produksi</dt>
                <dd className="info-value">
                  {dayjs(plan.production_date).format("DD MMM YYYY")}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={statusVariant}
                    className="capitalize rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {plan.document_status}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>

          {/* Note Card */}
          <div className="card-info card-animate p-6 lg:col-span-2">
            <div className="card-section-header">
              <div className="card-section-icon">
                <FileText size={18} />
              </div>
              <h2 className="card-section-title">Catatan</h2>
            </div>
            <p className="text-slate-600 italic mt-2">{plan.note || "-"}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="card-table card-animate mt-6">
          <div className="table-header p-6!">
            <div className="table-header-icon">
              <ListOrdered size={16} />
            </div>
            <h2 className="table-header-title">
              Daftar Item Produksi ({plan.items?.length || 0})
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
                    Item
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Qty Planned
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Qty Produced
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none"></th>
                </tr>
              </thead>
              <tbody>
                {plan.items?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center text-base-content/50"
                    >
                      Tidak ada item
                    </td>
                  </tr>
                ) : (
                  plan.items?.map((item: any, idx: number) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <td className="px-4 py-3 text-[15px] font-medium text-gray-700 align-text-top!">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-[15px] font-medium text-gray-700 ">
                        {item.item?.name || "-"} ({item.item?.code || "-"})
                        {item.materials && item.materials.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-[11px] font-bold text-slate-500 uppercase">
                              Materials:
                            </p>
                            {item.materials.map((mat: any, mIdx: number) => (
                              <div
                                key={mat.id}
                                className="flex items-center gap-2 text-[12px] text-gray-500"
                              >
                                <span className="text-gray-400 font-mono w-4">
                                  {mIdx + 1}.
                                </span>
                                <span>
                                  {mat.material?.name || "-"} -
                                  <span className="font-medium text-gray-700">
                                    {mat.quantity_used} / {mat.quantity_need}{" "}
                                    {mat.measurement}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[15px] font-bold text-primary text-right align-text-top!">
                        {item.quantity_planned}
                      </td>
                      <td className="px-4 py-3 text-[15px] font-bold text-slate-600 text-right align-text-top!">
                        {item.quantity_produced}
                      </td>
                      <td className="px-4 py-3 text-[15px] font-bold text-slate-600 text-right align-text-top!">
                        <Button
                          styleType="ghost"
                          onClick={() => handleOpenPrint(item)}
                        >
                          <Printer size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Page.Body>

      <Modal.Wrapper
        open={!!confirmModal}
        onClose={() => {
          setConfirmModal(null);
        }}
      >
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>
          {confirmModal?.message}
          {confirmModal?.type === "publish" && (
            <div className="mt-4">
              <RemoteSelect<WarehouseDetail>
                label="Warehouse"
                required
                hook={warehouseResult as any}
                fetchData={(page, search) => getWarehouse({ page, search })}
                getLabel={(item: any) => item?.name}
                value={warehouse}
                onChange={(item: WarehouseDetail) => setWarehouse(item)}
                placeholder="Pilih warehouse"
                error={FormState?.errors?.warehouse_id as string}
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
                confirmModal.onConfirm(warehouse);
              }
            }}
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
            isLoading={
              publishResult.isLoading ||
              completeResult.isLoading ||
              removeResult.isLoading
            }
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default ProductionPlanDetailPage;
