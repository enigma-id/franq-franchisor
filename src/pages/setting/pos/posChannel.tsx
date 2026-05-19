import { Page } from "@/components/app/layout";
import { useMemo, useState, useEffect } from "react";
import createTableConfig from "./table/pos-channel.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { usePOSChannel } from "@/services/pos/hooks";
import { Button, Input, Loading, Modal } from "@/components/ui";
import { Plus, Save } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";

export function PosChannel() {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const FormState = useAppSelector((s) => s.form);

  const {
    create,
    createResult,
    update,
    updateResult,
    remove: removeChannel,
    removeResult,
  } = usePOSChannel();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    margin: 0,
  });

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => {
          setEditingItem(row);
          setFormData({
            name: row?.name ?? "",
            margin: row?.margin ?? 0,
          });
          setModalOpen(true);
        },
        onRemove: (row: any) => {
          openDelete(row);
        },
      }),
    []
  );

  const Table = useTable("setting_pos_channel", tableConfig as TableConfig<unknown>);

  // Handle Create Success
  useEffect(() => {
    if (isCreateSuccess) {
      showToast({
        message: "POS Channel berhasil dibuat",
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
        message: "POS Channel berhasil diperbarui",
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
      closeModal("delete-channel");
      showToast({
        message: "POS Channel berhasil dihapus",
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
    setFormData({ name: "", margin: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      margin: Number(formData.margin),
    };

    if (editingItem) {
      update({ id: editingItem.id, ...payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (row: any) => {
    openModal({
      id: "delete-channel",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-channel")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">Hapus POS Channel</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>Apakah Anda yakin ingin menghapus channel <strong>{row?.name}</strong>?</p>
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
              onClick={() => closeModal("delete-channel")}
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
      removeChannel({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="POS Channel"
        subtitle="Daftar channel penjualan POS."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Channel POS
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data channel POS akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-slate-900">
              {editingItem ? "Ubah POS Channel" : "Tambah POS Channel"}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {editingItem ? "Ubah detail sales channel POS kasir." : "Buat sales channel baru untuk POS kasir."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-4 pb-2 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Channel"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: GrabFood, ShopeeFood, Dine In"
              variant="primary"
              error={FormState?.errors?.name as string}
            />
            <Input
              label="Margin (%)"
              required
              type="number"
              value={formData.margin}
              onChange={(e) => setFormData((prev) => ({ ...prev, margin: Number(e.target.value) }))}
              placeholder="Contoh: 20"
              variant="primary"
              min={0}
              error={FormState?.errors?.margin as string}
            />
          </form>
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-2 pt-4">
          <Button onClick={handleCloseModal} variant="secondary" disabled={isCreating || isUpdating}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || isUpdating} variant="success">
            {isCreating || isUpdating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Simpan Perubahan" : "Simpan Channel"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}

export default PosChannel;
