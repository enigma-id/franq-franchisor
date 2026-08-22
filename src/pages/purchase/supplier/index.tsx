/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/supplier.config";
import type { SupplierDetail } from "@/services/types/supplier";
import TableFilter from "./table/supplier.filter";
import { Modal, useEnigmaUI } from "@/components";
import { useSupplier } from "@/services/supplier/hooks";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const SupplierListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.supplier);

  const {
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useSupplier();

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => navigate(`/purchase/supplier/update/${row.id}`),
        onRemove: (row: any) => {
          openDelete(row);
        },
        onToggleActive: (row: any) => handleToggleActive(row),
        canManage,
      }),
    [navigate, canManage],
  );

  const Table = useTable<SupplierDetail>("supplier-list", tableConfig as any);

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-supplier");
      showToast({
        message: "Supplier berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess, Table, removeResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Supplier berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateResult.reset?.();
    }
  }, [isActivateSuccess, Table, activateResult]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      showToast({
        message: "Supplier berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  const openDelete = (row: any) => {
    openModal({
      id: "delete-supplier",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-supplier")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus Supplier
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus supplier{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className="flex gap-2">
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(row)}
              isLoading={isDeleting}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-supplier")}
              disabled={isDeleting}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (row: any) => {
    if (row?.id) {
      remove({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Purchase"
        title="Supplier"
        subtitle="Kelola data supplier untuk pembelian stok."
        action={
          canManage && (
            <Button
              variant="primary"
              onClick={() => navigate("/purchase/supplier/create")}
            >
              <Plus size={18} />
              Tambah Supplier
            </Button>
          )
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Data Supplier"
          emptyDescription="Data supplier akan muncul di sini setelah ditambahkan."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default SupplierListPage;
