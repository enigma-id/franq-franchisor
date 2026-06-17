import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import createTableConfig from "./table/inventory-catalog.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/inventory-catalog.filter";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { AssignOutletModal } from "./components/AssignOutletModal";

export function InventoryCatalog() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove: removeCatalog,
    removeResult: removeCatalogResult,
    activate: activateCatalog,
    activateResult: activateCatalogResult,
    deactivate: deactivateCatalog,
    deactivateResult: deactivateCatalogResult,
  } = useInventoryCatalog();

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivateCatalog({ id: v.id as string });
    } else {
      activateCatalog({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) =>
          navigate(`/setting/inventory/catalog/update/${row.id}`),
        onRemove: (row: any) => openDelete(row),
        onOutletType: (row: any) => openOutletType(row),
        onToggleActive: (row: any) => handleToggleActive(row),
      }),
    [navigate, activateCatalog, deactivateCatalog],
  );

  const Table = useTable(
    "setting_inventory_catalog",
    tableConfig as TableConfig<unknown>,
  );

  const openOutletType = (row: any) => {
    openModal({
      id: "assign-outlet-catalog",
      content: (
        <AssignOutletModal
          catalog={row}
          onClose={() => closeModal("assign-outlet-catalog")}
          onSuccess={() => {
            closeModal("assign-outlet-catalog");
            Table.boot();
          }}
        />
      ),
    });
  };

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
            <div className="font-bold! leading-7">Delete Catalog</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure you want to delete catalog "{v?.name}"?</p>
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
        message: "Catalog berhasil diaktifkan",
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
        message: "Catalog berhasil dinonaktifkan",
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
        category="Inventory"
        title="Inventory Catalog"
        subtitle="Daftar catalog inventori yang tersedia."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/setting/inventory/catalog/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Catalog
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data catalog inventori akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default InventoryCatalog;
