import { Page } from "@/components/app/layout";
import { useMemo, useState, useEffect } from "react";
import createTableConfig from "./table/pos-topup-schema.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { usePOSTopupSchema } from "@/services/pos/hooks";
import { Button, Input, Loading, Modal } from "@/components/ui";
import { Plus, Save } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";

export function PosTopupSchema() {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const FormState = useAppSelector((s) => s.form);

  const {
    create,
    createResult,
    update,
    updateResult,
    remove: removeTopupSchema,
    removeResult,
  } = usePOSTopupSchema();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    min_nominal: 0,
    bonus: 0,
  });

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => {
          setEditingItem(row);
          setFormData({
            min_nominal: row?.min_nominal ?? 0,
            bonus: row?.bonus ?? 0,
          });
          setModalOpen(true);
        },
        onRemove: (row: any) => {
          openDelete(row);
        },
      }),
    [],
  );

  const Table = useTable(
    "setting_pos_topup_schema",
    tableConfig as TableConfig<unknown>,
  );

  // Handle Create Success
  useEffect(() => {
    if (isCreateSuccess) {
      showToast({
        message: "Skema Topup berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      createResult.reset?.();
      Table.refetch();
    }
  }, [isCreateSuccess, Table, createResult]);

  // Handle Update Success
  useEffect(() => {
    if (isUpdateSuccess) {
      showToast({
        message: "Skema Topup berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      updateResult.reset?.();
      Table.refetch();
    }
  }, [isUpdateSuccess, Table, updateResult]);

  // Handle Delete Success
  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-topup-schema");
      showToast({
        message: "Skema Topup berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.refetch();
    }
  }, [isDeleteSuccess, Table, removeResult]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ min_nominal: 0, bonus: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      min_nominal: Number(formData.min_nominal),
      bonus: Number(formData.bonus),
    };

    if (editingItem) {
      update({ id: editingItem.id, ...payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (row: any) => {
    openModal({
      id: "delete-topup-schema",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-topup-schema")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus Skema Topup
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus skema topup{" "}
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
              onClick={() => closeModal("delete-topup-schema")}
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
      removeTopupSchema({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Topup Schema"
        subtitle="Daftar skema top-up saldo."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Skema Topup
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data skema topup akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-slate-900">
              {editingItem ? "Ubah Skema Topup" : "Tambah Skema Topup"}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {editingItem
                ? "Ubah detail skema bonus topup saldo."
                : "Buat skema bonus topup saldo baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-4 pb-2 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Minimal Nominal Topup (Rp)"
              required
              type="currency"
              value={formData.min_nominal}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  min_nominal: Number(e.target.value),
                }))
              }
              placeholder="Contoh: 50000"
              variant="primary"
              min={0}
              error={FormState?.errors?.min_nominal as string}
            />
            <Input
              label="Persentase Bonus (%)"
              required
              type="number"
              value={formData.bonus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bonus: Number(e.target.value),
                }))
              }
              placeholder="Contoh: 10"
              variant="primary"
              min={0}
              max={100}
              error={FormState?.errors?.bonus as string}
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
                {editingItem ? "Simpan Perubahan" : "Simpan Skema"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}

export default PosTopupSchema;
