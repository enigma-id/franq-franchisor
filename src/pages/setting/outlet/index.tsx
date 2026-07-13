/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/outlet.config";
import { Modal, useEnigmaUI } from "@/components";
import TableFilter from "./table/outlet.filter";
import { useOutlet } from "@/services/outlet/hooks";
import type { TableConfig } from "@/services/table/const";
import { AssignPOSChannelModal } from "./components/AssignPOSChannelModal.tsx";
import type { OutletDetail } from "@/services/types/outlet.ts";

const OutletListPage: React.FC = () => {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const navigate = useNavigate();

  const {
    remove: removeOutlet,
    removeResult: removeOutletResult,
    activate,
    activateResult: activateResult,
    deactivate,
    deactivateResult: deactivateResult,
  } = useOutlet();

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } =
    removeOutletResult;
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
        onClick: (row: any) => navigate(`/setting/outlet/update/${row.id}`),
        onRemove: (row: any) => {
          openDelete(row);
        },
        onChangeChannel: (row) => openOutletType(row),
        onToggleActive: (row: any) => handleToggleActive(row),
      }),
    [],
  );

  const Table = useTable("outlet-list", tableConfig as TableConfig<unknown>);

  const openOutletType = (row: OutletDetail) => {
    openModal({
      id: "assign-pos-channel",
      content: (
        <AssignPOSChannelModal
          data={row}
          onClose={() => closeModal("assign-pos-channel")}
          onSuccess={() => {
            closeModal("assign-pos-channel");
            Table.boot();
          }}
        />
      ),
    });
  };

  // Handle Delete Success
  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-outlet-type");
      showToast({
        message: "Outlet berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeOutletResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess, Table, removeOutletResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Outlet berhasil diaktifkan",
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
        message: "Outlet berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeModal("delete-catalog");
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  const openDelete = (row: any) => {
    openModal({
      id: "delete-outlet",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-outlet")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus Outlet
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus outlet{" "}
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
              onClick={() => closeModal("delete-outlet")}
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
      removeOutlet({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Daftar Outlet"
        subtitle="Kelola semua outlet yang terdaftar di sistem."
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/setting/outlet/create")}
          >
            <Plus size={18} />
            Tambah Outlet
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0 bg-white border-t border-slate-200">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Outlet"
          emptyDescription="Daftar outlet yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default OutletListPage;
