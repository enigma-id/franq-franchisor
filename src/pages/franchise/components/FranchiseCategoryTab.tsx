/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from "react";
import useTable from "@/services/table/hooks";
import createTableConfig from "@/pages/setting/pos/category/table/category.config";
import type { TableConfig } from "@/services/table/const";
import { usePOSCategory } from "@/services/pos/hooks";
import type { POSCategoryDetail } from "@/services/types";
import { Button, Input, Loading, Modal, useEnigmaUI } from "@/components";
import { Layers, Plus } from "lucide-react";

interface FranchiseCategoryTabProps {
  /** Brand (franchisor_id) yang kelola kategorinya. */
  franchisorId: string;
  franchiseName?: string;
}

/**
 * Tab Category POS di detail Franchise: daftar kategori POS milik brand ini.
 * CRUD penuh di dalam tab — create/update membawa franchisor_id utk brand ini.
 */
export const FranchiseCategoryTab: React.FC<FranchiseCategoryTabProps> = ({
  franchisorId,
  franchiseName,
}) => {
  const { openModal, closeModal, showToast } = useEnigmaUI();
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<POSCategoryDetail | null>(null);
  const [name, setName] = useState("");
  const submitting = Boolean(createResult?.isLoading || updateResult?.isLoading);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setModalOpen(true);
  };

  const openEdit = (v: POSCategoryDetail) => {
    setEditing(v);
    setName(v.name);
    setModalOpen(true);
  };

  const closeModalForm = () => {
    setModalOpen(false);
    setEditing(null);
    setName("");
    createResult?.reset?.();
    updateResult?.reset?.();
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      ...(franchisorId ? { franchisor_id: franchisorId } : {}),
    };
    if (editing) {
      update({ id: editing.id, payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (v: POSCategoryDetail) => {
    openModal({
      id: "franchise-category-delete",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("franchise-category-delete")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Hapus Kategori POS</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>
              Apakah Anda yakin ingin menghapus kategori POS{" "}
              <strong>{v.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => remove({ id: v.id })}
              isLoading={removeResult?.isLoading}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("franchise-category-delete")}
              disabled={removeResult?.isLoading}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleToggleActive = (v: POSCategoryDetail) => {
    if (v.is_active) {
      deactivate({ id: v.id });
    } else {
      activate({ id: v.id });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (v) => openEdit(v),
        onRemove: (v) => openDelete(v),
        onToggleActive: (v) => handleToggleActive(v),
        filter: { franchisor_id: franchisorId },
        canManage: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [franchisorId],
  );

  const Table = useTable(
    `franchise-category-list-${franchisorId}`,
    tableConfig as TableConfig,
  );

  useEffect(() => {
    if (removeResult?.isSuccess) {
      closeModal("franchise-category-delete");
      showToast({
        message: "Kategori POS berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [removeResult?.isSuccess, closeModal, showToast, removeResult, Table]);

  useEffect(() => {
    if (activateResult?.isSuccess) {
      showToast({
        message: "Kategori POS berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      activateResult.reset?.();
      Table.boot();
    }
  }, [activateResult, showToast, Table]);

  useEffect(() => {
    if (deactivateResult?.isSuccess) {
      showToast({
        message: "Kategori POS berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      deactivateResult.reset?.();
      Table.boot();
    }
  }, [deactivateResult, showToast, Table]);

  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "Kategori POS berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeModalForm();
      Table.boot();
    }
  }, [createResult?.isSuccess]);

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Kategori POS berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeModalForm();
      Table.boot();
    }
  }, [updateResult?.isSuccess]);

  return (
    <>
      <div className='card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm'>
        <div className='table-header p-5! border-b border-slate-100 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Layers size={16} className='text-slate-400' />
            <h2 className='table-header-title font-bold text-slate-700'>
              Kategori POS {franchiseName ? `(${franchiseName})` : ""}
            </h2>
          </div>
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Kategori
          </Button>
        </div>
        <div className='flex-1 flex flex-col min-h-0'>
          <Table.Tools hideSearch>
            <div />
          </Table.Tools>
          <Table.Render
            emptyTitle='Belum Ada Kategori POS'
            emptyDescription={`Belum ada kategori POS untuk brand ${franchiseName ?? "ini"}.`}
          />
          <Table.Pagination />
        </div>
      </div>

      {/* Modal: tambah/edit kategori POS brand ini */}
      <Modal.Wrapper open={modalOpen} onClose={closeModalForm}>
        <Modal.Header>
          <div className='flex flex-col text-left'>
            <span className='text-lg font-bold text-slate-900'>
              {editing ? "Ubah Kategori" : "Tambah Kategori"}
            </span>
            <span className='text-xs text-slate-500 font-medium mt-0.5'>
              {editing
                ? "Ubah nama kategori menu POS brand ini."
                : `Buat kategori menu POS untuk ${franchiseName ?? "brand ini"}.`}
            </span>
          </div>
        </Modal.Header>
        <Modal.Body className='pt-4 pb-2 text-left'>
          <Input
            label='Nama Kategori'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Contoh: Makanan, Minuman'
            variant='primary'
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer className='flex justify-end gap-2 pt-4'>
          <Button
            onClick={closeModalForm}
            variant='secondary'
            styleType='outline'
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
            variant='success'
          >
            {submitting ? (
              <Loading size='sm' variant='spinner' />
            ) : (
              <>
                <Plus className='w-4 h-4 mr-2' />
                {editing ? "Simpan Perubahan" : "Simpan Kategori"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </>
  );
};

export default FranchiseCategoryTab;
