/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import useTable from "@/services/table/hooks";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { useOutlet } from "@/services/outlet/hooks";
import createTableConfig from "./table/catalog.config";
import TableFilter from "./table/catalog.filter";
import type { InventoryCatalogDetail } from "@/services/types/inventory";
import type { TableConfig } from "@/services/table/const";
import { AssignOutletTypeModal } from "./components/AssignOutletTypeModal";

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
  const { get: getOutlets } = useOutlet();

  const openOutletNames = async (_row: any, outletType: any) => {
    const typeId = outletType.outlet_type?.id || outletType.outlet_type_id;
    if (!typeId) return;
    const res = await getOutlets({ outlet_type_id: typeId, limit: 100 });
    const outlets = (res as any)?.data ?? [];
    openModal({
      id: "outlet-names",
      content: (
        <Modal.Wrapper open onClose={() => closeModal("outlet-names")}>
          <Modal.Header>
            <div className="font-bold leading-7">
              {outletType.outlet_type?.name || "Outlet"}
            </div>
            <div className="text-xs text-slate-500 font-normal mt-1">
              Outlet dengan tipe ini
            </div>
          </Modal.Header>
          <Modal.Body className="max-h-[60vh] overflow-y-auto p-5">
            {outlets.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-400">
                Tidak ada outlet
              </div>
            ) : (
              <div className="space-y-2">
                {outlets.map((o: any) => (
                  <div
                    key={o.id}
                    className="p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                  >
                    {o.name}
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("outlet-names")}
            >
              Tutup
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

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
        onClick: (row) => navigate(`/inventory/catalog/${row.id}`),
        onEdit: (row) => navigate(`/inventory/catalog/update/${row.id}`),
        onRemove: (row) => openDelete(row),
        onOutletType: (row, ot) => {
          if (ot) {
            openOutletNames(row, ot);
          } else {
            openOutletType(row);
          }
        },
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
        <AssignOutletTypeModal
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
        category="Inventory & Warehouse"
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
        <Table.Tools>
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
