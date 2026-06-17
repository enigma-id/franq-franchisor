/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import useTable from "@/services/table/hooks";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import createTableConfig from "./table/catalog.config";
import TableFilter from "./table/catalog.filter";
import type { InventoryCatalogDetail } from "@/services/types/inventory";
import type { TableConfig } from "@/services/table/const";
import { AssignOutletModal } from "./components/AssignOutletModal";

const InventoryCatalogListPage: React.FC = () => {
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

  const handleToggleActive = (v: InventoryCatalogDetail) => {
    if (v.is_active) {
      deactivateCatalog({ id: v.id });
    } else {
      activateCatalog({ id: v.id });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row) => navigate(`/inventory/catalog/update/${row.id}`),
        onRemove: (row) => openDelete(row),
        onOutletType: (row) => openOutletType(row),
        onToggleActive: (row) => handleToggleActive(row),
      }),
    [navigate, activateCatalog, deactivateCatalog],
  );

  const Table = useTable(
    "inventory-catalog-list",
    tableConfig as TableConfig<unknown>,
  );

  const openOutletType = (row: InventoryCatalogDetail) => {
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

  const openDelete = (v: InventoryCatalogDetail) => {
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
            <p>Are you sure you want to delete this catalog?</p>
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

  const handleDelete = (v: InventoryCatalogDetail) => {
    if (v) {
      removeCatalog({ id: v.id });
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
        message: "Katalog berhasil diaktifkan",
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
        message: "Katalog berhasil dinonaktifkan",
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
        title="Inventory Katalog"
        subtitle="Kelola katalog produk untuk distribusi."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/inventory/catalog/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Katalog
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Katalog"
          emptyDescription="Daftar katalog produk yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default InventoryCatalogListPage;
