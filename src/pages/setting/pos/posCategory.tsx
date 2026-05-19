import { Page } from "@/components/app/layout";
import { useMemo, useState, useEffect } from "react";
import createTableConfig from "./table/pos-category.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { usePOSCategory } from "@/services/pos/hooks";
import { Button, Input, Checkbox, Loading, Modal } from "@/components/ui";
import { Plus, Save } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";

export function PosCategory() {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const FormState = useAppSelector((s) => s.form);

  const {
    create,
    createResult,
    update,
    updateResult,
    remove: removeCategory,
    removeResult,
  } = usePOSCategory();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    is_topping: false,
  });

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => {
          setEditingItem(row);
          setFormData({
            name: row?.name ?? "",
            is_topping: row?.is_topping === 1,
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
    "setting_pos_category",
    tableConfig as TableConfig<unknown>,
  );

  // Handle Create Success
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
      Table.refetch();
    }
  }, [isCreateSuccess, Table, createResult]);

  // Handle Update Success
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
      Table.refetch();
    }
  }, [isUpdateSuccess, Table, updateResult]);

  // Handle Delete Success
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
      Table.refetch();
    }
  }, [isDeleteSuccess, Table, removeResult]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", is_topping: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      is_topping: formData.is_topping ? 1 : 0,
    };

    if (editingItem) {
      update({ id: editingItem.id, ...payload });
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
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus Kategori
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus kategori{" "}
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
      removeCategory({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="POS Category"
        subtitle="Daftar kategori POS."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori POS
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data kategori POS akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-slate-900">
              {editingItem ? "Ubah Kategori POS" : "Tambah Kategori POS"}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {editingItem
                ? "Ubah detail kategori menu kasir POS."
                : "Buat kategori menu kasir POS baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-4 pb-2 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Kategori"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Roti Manis, Minuman Dingin"
              variant="primary"
              error={FormState?.errors?.name as string}
            />
            <div className="pt-2">
              <Checkbox
                label="Apakah kategori topping / menu tambahan?"
                checked={formData.is_topping}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_topping: e.target.checked,
                  }))
                }
                variant="primary"
              />
            </div>
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
                {editingItem ? "Simpan Perubahan" : "Simpan Kategori"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}

export default PosCategory;
