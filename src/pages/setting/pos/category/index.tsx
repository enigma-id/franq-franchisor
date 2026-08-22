/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/category.config";
import type { TableConfig } from "@/services/table/const";
import { useAppSelector } from "@/hooks";
import { Input, Loading, Modal, useEnigmaUI } from "@/components";
import { usePOSCategory } from "@/services/pos/hooks";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const POSCategoryListPage: React.FC = () => {
  const FormState = useAppSelector((s) => s.form);
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.posCategory);

  const {
    create,
    createResult,
    update,
    updateResult,
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = usePOSCategory();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;
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
        canManage,
      }),
    [canManage],
  );

  const Table = useTable(
    "pos-category-list",
    tableConfig as TableConfig<unknown>,
  );

  useEffect(() => {
    if (isCreateSuccess) {
      showToast({
        message: "Kategori POS berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      createResult.reset?.();
      Table.boot();
    }
  }, [isCreateSuccess, createResult, Table]);

  useEffect(() => {
    if (isUpdateSuccess) {
      showToast({
        message: "Kategori POS berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      updateResult.reset?.();
      Table.boot();
    }
  }, [isUpdateSuccess, Table, updateResult]);

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-category");
      showToast({
        message: "Kategori POS berhasil dihapus",
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
        message: "Kategori POS berhasil diaktifkan",
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
        message: "Kategori POS berhasil dinonaktifkan",
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
      update({ id: editingItem.id, payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (row: any) => {
    openModal({
      id: "delete-category",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-category")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className='font-bold text-lg text-slate-900 leading-7'>
              Hapus Kategori POS
            </div>
          </Modal.Header>
          <Modal.Body className='text-sm font-normal text-slate-600 leading-5'>
            <p>
              Apakah Anda yakin ingin menghapus kategori POS{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            {canManage && (
              <Button
                className='flex-1 rounded-xl'
                variant='error'
                onClick={() => handleDelete(row)}
                isLoading={isDeleting}
              >
                Hapus
              </Button>
            )}
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("delete-category")}
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
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category="Settings"
        title='Kategori POS'
        subtitle='Kelola kategori menu untuk pengaturan POS.'
        action={
          canManage && (
            <Button
              variant='primary'
              shape='wide'
              size='md'
              onClick={() => setModalOpen(true)}
            >
              <Plus size={18} />
              Tambah Kategori
            </Button>
          )
        }
      />

      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools />

        <Table.Render
          emptyTitle='Belum Ada Kategori'
          emptyDescription='Daftar kategori POS yang Anda buat akan muncul di sini.'
        />

        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className='flex flex-col text-left'>
            <span className='text-lg font-bold text-slate-900'>
              {editingItem ? "Ubah Kategori" : "Tambah Kategori"}
            </span>
            <span className='text-xs text-slate-500 font-medium mt-0.5'>
              {editingItem
                ? "Ubah detail kategori menu POS."
                : "Buat kategori menu POS baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className='pt-4 pb-2 text-left'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Nama Kategori'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder='Contoh: Makanan, Minuman'
              variant='primary'
              error={FormState?.errors?.name as string}
            />
          </form>
        </Modal.Body>

        <Modal.Footer className='flex justify-end gap-2 pt-4'>
          <Button
            onClick={handleCloseModal}
            variant='secondary'
            styleType='outline'
            disabled={isCreating || isUpdating}
          >
            Batal
          </Button>
          {canManage && (
            <Button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
              variant='success'
            >
              {isCreating || isUpdating ? (
                <Loading size='sm' variant='spinner' />
              ) : (
                <>
                  <Plus className='w-4 h-4 mr-2' />
                  {editingItem ? "Simpan Perubahan" : "Simpan Kategori"}
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default POSCategoryListPage;
