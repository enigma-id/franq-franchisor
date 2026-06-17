import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import createTableConfig from "./table/inventory-item.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/inventory-item.filter";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useInventoryItem } from "@/services/inventory/hooks";

export function InventoryItem() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove: removeItem,
    removeResult: removeItemResult,
    activate: activateItem,
    activateResult: activateItemResult,
    deactivate: deactivateItem,
    deactivateResult: deactivateItemResult,
  } = useInventoryItem();

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivateItem({ id: v.id as string });
    } else {
      activateItem({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onReload: () => {
          Table.boot();
        },
        onClick: (row: any) =>
          navigate(`/setting/inventory/item/update/${row.id}`),
        onRemove: (v: any) => {
          openDelete(v);
        },
        onToggleActive: (row: any) => handleToggleActive(row),
      }),
    [navigate, activateItem, deactivateItem],
  );
  const Table = useTable(
    "setting_inventory_item",
    tableConfig as TableConfig<unknown>,
  );

  const openDelete = (v: any) => {
    openModal({
      id: "delete-item",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-item")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Item</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeItemResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-item")}
              disabled={removeItemResult?.isLoading}
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
      removeItem({ id: v?.id as string });
    }
  };

  useEffect(() => {
    if (removeItemResult?.isSuccess) {
      closeModal("delete-item");
      Table.boot();
    }
  }, [removeItemResult]);

  useEffect(() => {
    if (activateItemResult?.isSuccess) {
      showToast({
        message: "Item berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateItemResult.reset?.();
    }
  }, [activateItemResult, Table, showToast]);

  useEffect(() => {
    if (deactivateItemResult?.isSuccess) {
      showToast({
        message: "Item berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateItemResult.reset?.();
    }
  }, [deactivateItemResult, Table, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Inventory Item"
        subtitle="Daftar item inventori."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/setting/inventory/item/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Item
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data item inventori akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default InventoryItem;
