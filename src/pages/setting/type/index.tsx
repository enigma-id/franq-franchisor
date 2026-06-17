/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Save } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Input, Modal } from "@/components/ui";
import { useOutletType } from "@/services/outlet/hooks";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/type.config";
import { Loading, useEnigmaUI } from "@/components";
import type { TableConfig } from "@/services/table/const";
import { useAppSelector } from "@/hooks";

const OutletTypePage: React.FC = () => {
  const FormState = useAppSelector((s) => s.form);
  const { openModal, closeModal, showToast } = useEnigmaUI();

  const {
    create,
    createResult,
    update,
    updateResult,
    remove: removeOutletType,
    removeResult: removeOutletTypeResult,
    activate,
    activateResult: activateResult,
    deactivate,
    deactivateResult: deactivateResult,
  } = useOutletType();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } =
    removeOutletTypeResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

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
        onClick: (row: any) => {
          setEditingItem(row);
          setFormData({
            name: row?.name ?? "",
          });
          setModalOpen(true);
        },
        onRemove: (row: any) => {
          openDelete(row);
        },
        onToggleActive: (row: any) => handleToggleActive(row),
      }),
    [],
  );

  const Table = useTable(
    "setting_outlet_type",
    tableConfig as TableConfig<unknown>,
  );

  useEffect(() => {
    if (isCreateSuccess) {
      showToast({
        message: "Tipe Outlet berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      createResult.reset?.();
      Table.boot();
    }
  }, [isCreateSuccess, createResult, Table]);

  // Handle Update Success
  useEffect(() => {
    if (isUpdateSuccess) {
      showToast({
        message: "Tipe Outlet berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      updateResult.reset?.();
      Table.boot();
    }
  }, [isUpdateSuccess, Table, updateResult]);

  // Handle Delete Success
  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-outlet-type");
      showToast({
        message: "Tipe Outlet berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeOutletTypeResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess, Table, removeOutletTypeResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Tipe Outlet berhasil diaktifkan",
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
        message: "Tipe Outlet berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
    };

    if (editingItem) {
      update({ id: editingItem.id, ...payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (row: any) => {
    openModal({
      id: "delete-outlet-type",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-outlet-type")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus Tipe Outlet
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus tipe outlet{" "}
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
              onClick={() => closeModal("delete-outlet-type")}
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
      removeOutletType({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Tipe Outlet"
        subtitle="Definisikan kategori tipe outlet untuk segmentasi bisnis."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tipe Outlet
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0 bg-white border-t border-slate-200">
        <Table.Tools />

        <Table.Render
          emptyTitle="Belum Ada Tipe Outlet"
          emptyDescription="Daftar tipe outlet yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-slate-900">
              {editingItem ? "Ubah Tipe Outlet" : "Tambah Tipe Outlet"}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {editingItem
                ? "Ubah detail klasifikasi tipe outlet."
                : "Buat klasifikasi tipe outlet baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-4 pb-2 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Tipe Outlet"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Express, Premium, Booth"
              variant="primary"
              error={FormState?.errors?.name as string}
            />
          </form>
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-2 pt-4">
          <Button
            onClick={handleCloseModal}
            variant="secondary"
            disabled={isCreating || isUpdating}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            variant="success"
          >
            {isCreating || isUpdating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Simpan Perubahan" : "Simpan Tipe Outlet"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default OutletTypePage;
