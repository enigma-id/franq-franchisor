import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import createTableConfig from "./table/pos-catalog.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { usePOSCatalog } from "@/services/pos/hooks";

export function PosCatalog() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { 
    remove: removeCatalog, 
    removeResult: removeCatalogResult,
    activate: activateCatalog,
    activateResult: activateCatalogResult,
    deactivate: deactivateCatalog,
    deactivateResult: deactivateCatalogResult,
  } = usePOSCatalog();

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivateCatalog({ id: v.id as string });
    } else {
      activateCatalog({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(() => createTableConfig({
    onClick: (row: any) => navigate(`/setting/pos/catalog/update/${row.id}`),
    onRemove: (row: any) => openDelete(row),
    onToggleActive: (row: any) => handleToggleActive(row),
  }), [navigate, activateCatalog, deactivateCatalog]);

  const Table = useTable(
    "setting_pos_catalog",
    tableConfig as TableConfig<unknown>,
  );

  const openDelete = (v: any) => {
    openModal({
      id: "delete-catalog",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-catalog")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Menu POS</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure you want to delete POS menu "{v?.name}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeCatalogResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-catalog")}
              disabled={removeCatalogResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: any) => {
    if (v) {
      removeCatalog({ id: v?.id as string });
    }
  };

  useEffect(() => {
    if (removeCatalogResult?.isSuccess) {
      closeModal("delete-catalog");
      Table.boot();
    }
  }, [removeCatalogResult]);

  useEffect(() => {
    if (activateCatalogResult?.isSuccess) {
      showToast({
        message: "POS Catalog berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateCatalogResult.reset?.();
    }
  }, [activateCatalogResult, Table, showToast]);

  useEffect(() => {
    if (deactivateCatalogResult?.isSuccess) {
      showToast({
        message: "POS Catalog berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateCatalogResult.reset?.();
    }
  }, [deactivateCatalogResult, Table, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="POS Catalog"
        subtitle="Daftar menu POS."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/setting/pos/catalog/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Menu POS
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data catalog POS akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default PosCatalog;
