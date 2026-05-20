import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import createTableConfig from "./table/supplier.config";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useSupplier } from "@/services/purchase/hooks";

export function Supplier() {
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { remove: removeSupplier, removeResult: removeSupplierResult } =
    useSupplier();

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (row: any) => navigate(`/purchase/supplier/update/${row.id}`),
      onRemove: (row: any) => openDelete(row),
    });
  }, [navigate]);

  const Table = useTable("supplier", tableConfig as TableConfig<unknown>);

  const openDelete = (v: any) => {
    openModal({
      id: "delete-supplier",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-supplier")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Supplier</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure you want to delete supplier "{v?.name}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeSupplierResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-supplier")}
              disabled={removeSupplierResult?.isLoading}
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
      removeSupplier({ id: v?.id as string });
    }
  };

  useEffect(() => {
    if (removeSupplierResult?.isSuccess) {
      closeModal("delete-supplier");
      Table.boot();
    }
  }, [removeSupplierResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Supplier"
        subtitle="Kelola data supplier untuk pembelian stok."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/purchase/supplier/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Supplier
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />

        <Table.Render
          emptyTitle="Belum Ada Data Supplier"
          emptyDescription="Data supplier akan muncul di sini setelah ditambahkan."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
