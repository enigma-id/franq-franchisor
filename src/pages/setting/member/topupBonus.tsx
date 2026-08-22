/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Input, Loading, Modal, useEnigmaUI } from "@/components";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/topup-bonus.config";
import type { TableConfig } from "@/services/table/const";
import { useMemberTopupBonus } from "@/services/member/hooks";
import { useAppSelector } from "@/hooks";
import type { TopupBonusDetail } from "@/services/types/pos";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const TopupBonusPage: React.FC = () => {
  const FormState = useAppSelector((s) => s.form);
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.memberTopup);

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
  } = useMemberTopupBonus();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TopupBonusDetail | null>(null);
  const [formData, setFormData] = useState({
    min_amount: "",
    bonus_percentage: "",
  });

  const handleToggleActive = (v: TopupBonusDetail) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onEdit: (row: TopupBonusDetail) => {
          setEditingItem(row);
          setFormData({
            min_amount: String(row?.min_amount ?? ""),
            bonus_percentage: String(row?.bonus_percentage ?? ""),
          });
          setModalOpen(true);
        },
        onRemove: (row: TopupBonusDetail) => {
          openDelete(row);
        },
        onToggleActive: (row: TopupBonusDetail) => handleToggleActive(row),
        canManage,
      }),
    [canManage],
  );

  const Table = useTable(
    "member-topup-bonus-list",
    tableConfig as TableConfig<unknown>,
  );

  useEffect(() => {
    if (isCreateSuccess) {
      showToast({
        message: "Schema bonus berhasil dibuat",
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
        message: "Schema bonus berhasil diperbarui",
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
      closeModal("delete-topup-bonus");
      showToast({
        message: "Schema bonus berhasil dihapus",
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
        message: "Schema bonus berhasil diaktifkan",
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
        message: "Schema bonus berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  function handleCloseModal() {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ min_amount: "", bonus_percentage: "" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      min_amount: Number(formData.min_amount),
      bonus_percentage: Number(formData.bonus_percentage),
    };

    if (editingItem) {
      update({ id: editingItem.id, payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (row: TopupBonusDetail) => {
    openModal({
      id: "delete-topup-bonus",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-topup-bonus")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className='font-bold text-lg text-slate-900 leading-7'>
              Hapus Schema Bonus
            </div>
          </Modal.Header>
          <Modal.Body className='text-sm font-normal text-slate-600 leading-5'>
            <p>
              Apakah Anda yakin ingin menghapus schema bonus topup minimal{" "}
              <strong>{row?.min_amount}</strong>?
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
              onClick={() => closeModal("delete-topup-bonus")}
              disabled={isDeleting}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (row: TopupBonusDetail) => {
    if (row?.id) {
      remove({ id: row.id });
    }
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category="Settings"
        title='Schema Bonus Topup'
        subtitle='Kelola schema bonus topup untuk member.'
        action={
          canManage && (
            <Button
              variant='primary'
              shape='wide'
              size='md'
              onClick={() => setModalOpen(true)}
            >
              <Plus size={18} />
              Tambah Schema
            </Button>
          )
        }
      />

      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools hideSearch />

        <Table.Render
          emptyTitle='Belum Ada Schema'
          emptyDescription='Daftar schema bonus topup yang Anda buat akan muncul di sini.'
        />

        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className='flex flex-col text-left'>
            <span className='text-lg font-bold text-slate-900'>
              {editingItem ? "Ubah Schema" : "Tambah Schema"}
            </span>
            <span className='text-xs text-slate-500 font-medium mt-0.5'>
              {editingItem
                ? "Ubah detail schema bonus topup."
                : "Buat schema bonus topup baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className='pt-4 pb-2 text-left'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Minimal Topup'
                required
                type='number'
                value={formData.min_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    min_amount: e.target.value,
                  }))
                }
                variant='primary'
                error={FormState?.errors?.min_amount as string}
                placeholder='0'
              />
              <Input
                label='Bonus (%)'
                required
                type='number'
                value={formData.bonus_percentage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bonus_percentage: e.target.value,
                  }))
                }
                variant='primary'
                error={FormState?.errors?.bonus_percentage as string}
                placeholder='0'
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer className='flex justify-end gap-2 pt-4'>
          <Button
            onClick={handleCloseModal}
            variant='secondary'
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
                  {editingItem ? "Simpan Perubahan" : "Simpan Schema"}
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default TopupBonusPage;
