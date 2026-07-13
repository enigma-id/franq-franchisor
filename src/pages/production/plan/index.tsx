import React, { useMemo, useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import useTable from "@/services/table/hooks";
import { useProductionPlan } from "@/services/production/hooks";
import createTableConfig from "./table/plan.config";
import TableFilter from "./table/plan.filter";
import type { ProductionPlanDetail } from "@/services/types/production";
import type { TableConfig } from "@/services/table/const";

const ProductionPlanListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { remove: removePlan, removeResult, publish: publishItem, publishResult, complete: completeItem, completeResult } = useProductionPlan();
  const [selectedRow, setSelectedRow] = useState<ProductionPlanDetail | null>(null);
  const [actionType, setActionType] = useState<"publish" | "complete" | null>(null);
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onView: (id) => navigate(`/production/plan/${id}`),
        // onEdit: (id) => navigate(`/production/plan/update/${id}`),
        onRemove: (v) => openDelete(v),
        onPublish: (row) => openConfirmModal(row, "publish"),
        onComplete: (row) => openConfirmModal(row, "complete"),
      }),
    [navigate],
  );

  const Table = useTable(
    "production-plan-list",
    tableConfig as TableConfig<unknown>,
  );

  useEffect(() => { tableRef.current = Table; }, [Table]);

  const openConfirmModal = useCallback((row: ProductionPlanDetail, type: "publish" | "complete") => {
    setSelectedRow(row);
    setActionType(type);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setSelectedRow(null);
    setActionType(null);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedRow) return;
    const id = selectedRow.id;
    switch (actionType) {
      case "publish": await publishItem({ id }); break;
      case "complete": await completeItem({ id }); break;
    }
  }, [selectedRow, actionType, publishItem, completeItem]);

  const activeResult = useMemo(() => {
    switch (actionType) {
      case "publish": return publishResult;
      case "complete": return completeResult;
      default: return null;
    }
  }, [actionType, publishResult, completeResult]);

  const openDelete = (v: ProductionPlanDetail) => {
    openModal({
      id: "delete-plan",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-plan")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Production Plan</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>
              Are you sure you want to delete plan <strong>{v.code}</strong>?
            </p>
            <p className="text-slate-400 mt-1">This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-plan")}
              disabled={removeResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: ProductionPlanDetail) => {
    if (v) {
      removePlan({ id: v.id });
    }
  };

  useEffect(() => {
    if (removeResult?.isSuccess) {
      closeModal("delete-plan");
      showToast({
        message: "Rencana produksi berhasil dihapus",
        type: "success",
      });
      Table.boot();
      removeResult.reset?.();
    }
  }, [removeResult, Table, closeModal, showToast]);

  useEffect(() => {
    if (activeResult?.isSuccess) {
      showToast({
        message: actionType === "publish" ? "Rencana produksi berhasil diterbitkan" : "Rencana produksi berhasil diselesaikan",
        type: "success",
        position: "bottom-center",
      });
      closeConfirmModal();
      activeResult.reset?.();
      tableRef.current?.boot();
    }
  }, [activeResult?.isSuccess]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title="Daftar Rencana Produksi"
        subtitle="Kelola dan pantau rencana produksi harian."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/production/plan/create")}
          >
            <Plus size={18} className="mr-2" />
            Buat Rencana
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Rencana"
          emptyDescription="Daftar rencana produksi akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper
        open={!!selectedRow && !!actionType}
        onClose={closeConfirmModal}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className="font-bold leading-7">
            Konfirmasi {actionType === "publish" ? "Penerbitan" : "Penyelesaian"}
          </div>
        </Modal.Header>
        <Modal.Body className="text-sm font-normal leading-5">
          <p>
            Apakah Anda yakin ingin {actionType === "publish" ? "menerbitkan" : "menyelesaikan"}{" "}
            rencana produksi <strong>{selectedRow?.code}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="flex-1 rounded-xl"
            variant="primary"
            onClick={handleConfirmAction}
            isLoading={activeResult?.isLoading}
          >
            Konfirmasi
          </Button>
          <Button
            className="flex-1 rounded-xl"
            styleType="outline"
            variant="secondary"
            onClick={closeConfirmModal}
            disabled={activeResult?.isLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default ProductionPlanListPage;
