import { Page } from "@/components/app/layout";
import { useEffect, useMemo, useState } from "react";
import createTableConfig from "./table/outlet-type.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Button, Input, Loading, Modal } from "@/components/ui";
import { Plus, Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useOutletType } from "@/services/outlet/hooks";
import { useAppSelector } from "@/hooks";

export function OutletType() {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const FormState = useAppSelector((s) => s.form);

  const {
    create,
    createResult,
    update,
    updateResult,
    remove: removeOutletType,
    removeResult: removeOutletTypeResult,
  } = useOutletType();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeOutletTypeResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

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
      }),
    []
  );

  const Table = useTable("setting_outlet_type", tableConfig as TableConfig<unknown>);

  // Handle Create Success
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
      Table.refetch();
    }
  }, [isCreateSuccess, Table, createResult]);

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
      Table.refetch();
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
      Table.refetch();
    }
  }, [isDeleteSuccess, Table, removeOutletTypeResult]);

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
            <div className="font-bold text-lg text-slate-900 leading-7">Hapus Tipe Outlet</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>Apakah Anda yakin ingin menghapus tipe outlet <strong>{row?.name}</strong>?</p>
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
        subtitle="Daftar tipe klasifikasi outlet."
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
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data tipe outlet akan muncul di sini."
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
              {editingItem ? "Ubah detail klasifikasi tipe outlet." : "Buat klasifikasi tipe outlet baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-4 pb-2 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Tipe Outlet"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Express, Premium, Booth"
              variant="primary"
              error={FormState?.errors?.name as string}
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
                {editingItem ? "Simpan Perubahan" : "Simpan Tipe Outlet"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}

export default OutletType;
