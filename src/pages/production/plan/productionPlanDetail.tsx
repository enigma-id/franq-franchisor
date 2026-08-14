/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Button, Modal, RemoteSelect } from "@/components/ui";
import { Input, useEnigmaUI } from "@/components";
import { useProductionPlan } from "@/services/production/hooks";
import {
  Loader2,
  Store,
  ListOrdered,
  FileText,
  Send,
  Trash2,
  Printer,
  CheckCircle,
  Pencil,
} from "lucide-react";
import dayjs from "dayjs";
import type {
  ProductionPlanDetail,
  ProductionPlanItem,
  WarehouseDetail,
} from "@/services/types";
import { useProductionPlanGuards } from "@/hooks/useProductionPlanGuards";
import { GuardedButton } from "@/components/app";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useAppSelector } from "@/hooks";
import { getStatusVariant } from "@/utils";
import { usePrintWindow } from "@/utils/usePrintWindow";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import Plan from "@/components/app/print/plan";

const ProductionPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canManage = useCan(ACTION.production);
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
    updateItem,
    updateItemResult,
    completeItem,
    completeItemResult,
  } = useProductionPlan();
  const { get: getWarehouse, getResult: warehouseResult } = useWarehouse();

  const [warehouse, setWarehouse] = useState<WarehouseDetail | null>(null);
  const [editingPlanned, setEditingPlanned] = useState<{
    item: ProductionPlanItem;
    quantity: number;
  } | null>(null);

  const { data, isLoading } = showResult;
  const plan = data?.data as ProductionPlanDetail;
  const hasWarehouse =
    plan?.warehouse_id &&
    plan?.warehouse_id !== "00000000-0000-0000-0000-000000000000";
  const guards = useProductionPlanGuards(plan);

  const [confirmModal, setConfirmModal] = useState<{
    type: "publish" | "complete" | "delete";
    title: string;
    message: string;
    onConfirm: (v?: any) => void;
    variant: "primary" | "error" | "success";
  } | null>(null);

  const [completeItemModal, setCompleteItemModal] = useState<{
    item: ProductionPlanItem;
    warehouse: WarehouseDetail | null;
    quantityProduced: number;
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
      removeResult.isSuccess ||
      updateItemResult.isSuccess ||
      completeItemResult.isSuccess
    ) {
      setConfirmModal(null);
      setCompleteItemModal(null);
      if (publishResult.isSuccess) {
        showToast({
          message: "Rencana produksi berhasil diterbitkan",
          type: "success",
          position: "bottom-center",
        });
        publishResult.reset?.();
      }
      if (completeResult.isSuccess) {
        showToast({
          message: "Rencana produksi berhasil diselesaikan",
          type: "success",
          position: "bottom-center",
        });
        completeResult.reset?.();
      }
      if (removeResult.isSuccess) {
        showToast({
          message: "Rencana produksi berhasil dihapus",
          type: "success",
          position: "bottom-center",
        });
        removeResult.reset?.();
        navigate("/production/plan");
      }
      if (updateItemResult.isSuccess) {
        updateItemResult.reset?.();
        setEditingPlanned(null);
      }
      if (completeItemResult.isSuccess) {
        showToast({
          message: "Item berhasil diselesaikan",
          type: "success",
          position: "bottom-center",
        });
        completeItemResult.reset?.();
      }
      if (id) show({ id });
    }
  }, [
    publishResult.isSuccess,
    completeResult.isSuccess,
    removeResult.isSuccess,
    updateItemResult.isSuccess,
    completeItemResult.isSuccess,
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
    const repeatCount =
      item.quantity_produced > 0
        ? item.quantity_produced
        : item.quantity_planned;
    openPrint(<Plan data={item} plan={plan} repeatCount={repeatCount} />);
  };

  const handleOpenEditPlanned = (item: ProductionPlanItem) => {
    setEditingPlanned({ item, quantity: item.quantity_planned });
  };

  const handleSavePlanned = () => {
    if (!editingPlanned || !id) return;
    const qty = editingPlanned.quantity;
    if (qty < 0) return;
    updateItem({ id: editingPlanned.item.id, payload: { quantity: qty } });
  };

  const handleOpenCompleteItem = (item: ProductionPlanItem) => {
    setCompleteItemModal({
      item,
      warehouse: null,
      quantityProduced: item.quantity_produced,
    });
  };

  const handleConfirmCompleteItem = () => {
    if (!completeItemModal || !id) return;
    if (!completeItemModal.warehouse?.id) {
      showToast({
        message: "Warehouse tujuan harus dipilih",
        type: "error",
        position: "bottom-center",
      });
      return;
    }
    completeItem({
      id: completeItemModal.item.id,
      payload: {
        warehouse_id: completeItemModal.warehouse.id,
        quantity_produced: completeItemModal.quantityProduced,
      },
    });
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

  const isProcess = plan.document_status === "process";

  const statusVariant = getStatusVariant(plan.document_status);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title={`Detail Rencana Produksi - ${plan.code}`}
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <div className="flex gap-2">
              <GuardedButton
                allowed={guards.canPublish}
                reason="Hanya rencana dengan status pending yang dapat disetujui."
                variant="primary"
                onClick={handlePublish}
                isLoading={publishResult.isLoading}
                title="Publish"
              >
                <Send className="w-4 h-4" />
              </GuardedButton>
              <GuardedButton
                allowed={guards.canComplete}
                reason="Hanya rencana dengan status published yang dapat diselesaikan."
                variant="success"
                onClick={handleComplete}
                isLoading={completeResult.isLoading}
                title="Complete"
              >
                <CheckCircle className="w-4 h-4" />
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
          )
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
                    className="capitalize px-2.5 font-semibold text-[10px] tracking-wider"
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
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    {isProcess ? "Action" : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {plan.items?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
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
                      <td className="px-4 py-3 text-right align-text-top!">
                        <div className="inline-flex items-center justify-end gap-1">
                          <span className="text-[15px] font-bold text-primary">
                            {item.quantity_planned}
                          </span>
                          {canManage &&
                            isProcess &&
                            item.document_status !== "completed" && (
                              <Button
                                styleType="ghost"
                                size="sm"
                                onClick={() => handleOpenEditPlanned(item)}
                                title="Ubah Qty Planned"
                              >
                                <Pencil size={12} />
                              </Button>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[15px] font-bold text-slate-600 text-right align-text-top!">
                        {item.quantity_produced}
                      </td>
                      <td className="px-4 py-3 text-right align-text-top!">
                        <div className="flex items-center justify-end gap-1">
                          {canManage &&
                            isProcess &&
                            item.document_status === "new" && (
                              <Button
                                styleType="ghost"
                                onClick={() => handleOpenCompleteItem(item)}
                                title="Selesaikan Item"
                              >
                                <CheckCircle size={15} />
                              </Button>
                            )}
                          <Button
                            styleType="ghost"
                            onClick={() => handleOpenPrint(item)}
                          >
                            <Printer size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Page.Body>

      {/* Confirm Modal (publish / complete plan / delete) */}
      <Modal.Wrapper
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
      >
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>
          {confirmModal?.message}
          {confirmModal?.type === "publish" && !hasWarehouse && (
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
            onClick={() => confirmModal?.onConfirm(warehouse)}
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

      {/* Edit Qty Planned Modal */}
      <Modal.Wrapper
        open={!!editingPlanned}
        onClose={() => setEditingPlanned(null)}
      >
        <Modal.Header>Update Quantity Planned</Modal.Header>
        <Modal.Body>
          <Input
            label="Quantity Planned"
            type="number"
            value={editingPlanned?.quantity ?? 0}
            onChange={(e) =>
              setEditingPlanned((prev) =>
                prev ? { ...prev, quantity: Number(e.target.value) } : null,
              )
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setEditingPlanned(null)} variant="default">
            Batal
          </Button>
          <Button
            onClick={handleSavePlanned}
            variant="primary"
            isLoading={updateItemResult.isLoading}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>

      {/* Complete Item Modal */}
      <Modal.Wrapper
        open={!!completeItemModal}
        onClose={() => setCompleteItemModal(null)}
      >
        <Modal.Header>Complete Item Production</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Input
              label="Quantity Produced"
              type="number"
              value={completeItemModal?.quantityProduced ?? 0}
              onChange={(e) =>
                setCompleteItemModal((prev) =>
                  prev
                    ? { ...prev, quantityProduced: Number(e.target.value) }
                    : null,
                )
              }
            />
            <RemoteSelect<WarehouseDetail>
              label="Warehouse Tujuan"
              required
              hook={warehouseResult as any}
              fetchData={(page, search) => getWarehouse({ page, search })}
              getLabel={(item: any) => item?.name}
              value={completeItemModal?.warehouse ?? null}
              onChange={(item: WarehouseDetail) =>
                setCompleteItemModal((prev) =>
                  prev ? { ...prev, warehouse: item } : null,
                )
              }
              placeholder="Pilih warehouse"
              error={FormState?.errors?.warehouse_id as string}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setCompleteItemModal(null)} variant="default">
            Batal
          </Button>
          <Button
            onClick={handleConfirmCompleteItem}
            variant="primary"
            isLoading={completeItemResult.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default ProductionPlanDetailPage;
