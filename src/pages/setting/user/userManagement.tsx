import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import createTableConfig from "./table/user.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import TableFilter from "./table/user.filter";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useUser } from "@/services/user/hooks";

export function UserManagement() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove: removeUser,
    removeResult: removeUserResult,
    activate: activateUser,
    activateResult: activateUserResult,
    deactivate: deactivateUser,
    deactivateResult: deactivateUserResult,
  } = useUser();

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivateUser({ id: v.id as string });
    } else {
      activateUser({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(() => createTableConfig({
    onClick: (row: any) => navigate(`/setting/user/update/${row.id}`),
    onRemove: (row: any) => openDelete(row),
    onToggleActive: (row: any) => handleToggleActive(row),
  }), [navigate]);

  const Table = useTable("setting_user", tableConfig as TableConfig<unknown>);

  const openDelete = (v: any) => {
    openModal({
      id: "delete-user",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-user")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7 text-red-600">Hapus Akun User</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Apakah Anda yakin ingin menghapus akun user <strong>"{v?.name}"</strong>?</p>
            <p className="text-xs text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeUserResult?.isLoading}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-user")}
              disabled={removeUserResult?.isLoading}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: any) => {
    if (v) {
      removeUser({ id: v?.id as string });
    }
  };

  useEffect(() => {
    if (removeUserResult?.isSuccess) {
      closeModal("delete-user");
      showToast({
        message: "User berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      removeUserResult.reset?.();
    }
  }, [removeUserResult, Table, closeModal, showToast]);

  useEffect(() => {
    if (activateUserResult?.isSuccess) {
      showToast({
        message: "User berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateUserResult.reset?.();
    }
  }, [activateUserResult, Table, showToast]);

  useEffect(() => {
    if (deactivateUserResult?.isSuccess) {
      showToast({
        message: "User berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateUserResult.reset?.();
    }
  }, [deactivateUserResult, Table, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="User"
        subtitle="Manajemen pengguna sistem."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/setting/user/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data pengguna akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default UserManagement;
