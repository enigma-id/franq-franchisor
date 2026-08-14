/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Page } from "@/components/app/layout";
import { Button, Drawer } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/group.config";
import { useUserGroup } from "@/services/usergroup/hooks";
import { useEnigmaUI } from "@/components";
import { UserGroupForm } from "./components/UserGroupForm";
import { Save, ShieldCheck, Trash2 } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import type { UserGroupDetail } from "@/services/types";
import { Modal } from "@/components/ui";

type DrawerMode = "create" | "edit";

const UserGroupListPage: React.FC = () => {
  useDocumentMeta("Usergroup | Sukabread Franchisee", "");
  const { showToast } = useEnigmaUI();
  const {
    create,
    createResult,
    show,
    update,
    updateResult,
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useUserGroup();
  const canManage = useCan(ACTION.usergroup);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editRow, setEditRow] = useState<UserGroupDetail | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [deleteRow, setDeleteRow] = useState<UserGroupDetail | null>(null);

  const handleToggleActive = useCallback(
    (row: UserGroupDetail) => {
      if (row.is_active) {
        deactivate({ id: row.id });
      } else {
        activate({ id: row.id });
      }
    },
    [activate, deactivate],
  );

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onEdit: (row) => openEdit(row),
        onRemove: (row) => setDeleteRow(row),
        onToggleActive: handleToggleActive,
        canManage,
      }),
    [canManage, handleToggleActive],
  );
  const Table = useTable(
    "user-group-list",
    tableConfig as TableConfig<unknown>,
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditRow(null);
    setEditData(null);
    createResult.reset?.();
    updateResult.reset?.();
  }, [createResult, updateResult]);

  const openCreate = useCallback(() => {
    setDrawerMode("create");
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback(
    async (row: UserGroupDetail) => {
      setDrawerMode("edit");
      setEditRow(row);
      setDrawerOpen(true);
      try {
        const res = await show({ id: row.id });
        setEditData((res as any)?.data ?? row);
      } catch {
        setEditData(row);
      }
    },
    [show],
  );

  const handleCreate = useCallback(
    async (data: Record<string, unknown>) => {
      create(data);
    },
    [create],
  );

  const handleUpdate = useCallback(
    async (data: Record<string, unknown>) => {
      if (!editRow) return;
      update({ id: editRow.id, payload: data as any });
    },
    [editRow, update],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteRow) return;
    try {
      await remove({ id: deleteRow.id });
      showToast({
        message: "Usergroup berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      setDeleteRow(null);
      Table.boot();
      removeResult.reset?.();
    } catch {
      /* handled */
    }
  }, [deleteRow, remove, showToast, Table, removeResult]);

  // Create success → toast + close + refresh
  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "Usergroup berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      createResult.reset?.();
    }
  }, [createResult, showToast, closeDrawer, Table]);

  // Update success → toast + close + refresh
  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Usergroup berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      updateResult.reset?.();
    }
  }, [updateResult, showToast, closeDrawer, Table]);

  useEffect(() => {
    if (activateResult?.isSuccess) {
      showToast({
        message: "Usergroup berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateResult.reset?.();
    }
  }, [activateResult, showToast, Table]);

  useEffect(() => {
    if (deactivateResult?.isSuccess) {
      showToast({
        message: "Usergroup berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [deactivateResult, showToast, Table]);

  const drawerTitle = drawerMode === "create" ? "Tambah Usergroup" : "Edit Usergroup";
  const drawerSubtitle =
    drawerMode === "create"
      ? "Buat usergroup baru."
      : "Ubah nama & permission usergroup.";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Usergroup"
        subtitle="Kelola usergroup pengguna."
        action={
          canManage && (
            <Button variant="primary" onClick={openCreate}>
              + Tambah Usergroup
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada usergroup."
        />
        <Table.Pagination />
      </Page.Body>

      {/* Drawer: tambah / edit usergroup */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        position="right"
        className="!w-[28rem]"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              {drawerTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{drawerSubtitle}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <UserGroupForm
              id={drawerMode === "create" ? "usergroup-create-form" : "usergroup-edit-form"}
              initialData={drawerMode === "edit" ? editData : null}
              onSubmit={drawerMode === "create" ? handleCreate : handleUpdate}
            />
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="secondary" onClick={closeDrawer}>
              Batal
            </Button>
            <Button
              type="submit"
              form={drawerMode === "create" ? "usergroup-create-form" : "usergroup-edit-form"}
              variant="success"
              isLoading={
                drawerMode === "create"
                  ? createResult?.isLoading
                  : updateResult?.isLoading
              }
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Usergroup
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Modal: konfirmasi hapus usergroup */}
      <Modal.Wrapper
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className="text-lg font-bold text-slate-900">Hapus Usergroup</div>
        </Modal.Header>
        <Modal.Body className="text-sm text-slate-600">
          Apakah Anda yakin ingin menghapus usergroup{" "}
          <strong>{deleteRow?.name}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteRow(null)}>
            Batal
          </Button>
          <Button
            variant="error"
            onClick={handleDelete}
            isLoading={removeResult?.isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default UserGroupListPage;
