/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/menu.config";
import type { TableConfig } from "@/services/table/const";
import { usePOSMenu } from "@/services/pos/hooks";
import type { POSMenuDetail } from "@/services/types";
import { Modal, useEnigmaUI } from "@/components";

const POSMenuListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = usePOSMenu();
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row) => navigate(`/setting/pos/menu/${row.id}`),
        onEdit: (row) => navigate(`/setting/pos/menu/update/${row.id}`),
        onRemove: (v) => {
          openDelete(v);
        },
        onToggleActive: (row) => handleToggleActive(row),
      }),
    [navigate],
  );

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const Table = useTable("pos-menu-list", tableConfig as TableConfig);

  const openDelete = (v: POSMenuDetail) => {
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
              isLoading={removeResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-item")}
              disabled={removeResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: POSMenuDetail) => {
    if (v) {
      remove({ id: v?.id });
    }
  };

  useEffect(() => {
    if (removeResult?.isSuccess) {
      closeModal("delete-item");
      Table.boot();
    }
  }, [removeResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "POS Channel berhasil diaktifkan",
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
        message: "POS Channel berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="POS Menu"
        subtitle="Kelola daftar menu makanan dan minuman untuk POS."
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/setting/pos/menu/create")}
          >
            <Plus size={18} />
            Tambah Menu
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />

        <Table.Render
          emptyTitle="Belum Ada Menu"
          emptyDescription="Daftar menu POS yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default POSMenuListPage;
