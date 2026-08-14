/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Page } from "@/components/app/layout";
import { Button, Drawer } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/user.config";
import type { UserDetail } from "@/services/types";
import TableFilter from "./table/user.filter";
import { useUser } from "@/services/user/hooks";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";
import { UserForm } from "./components/UserForm";
import { UserPermissionForm } from "./components/UserPermissionForm";
import { Save, UserPlus, ShieldCheck } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

type DrawerMode = "create" | "edit" | "permission";

const UserListPage: React.FC = () => {
  useDocumentMeta("User | Sukabread Franchisee", "");
  const { showToast } = useEnigmaUI();
  const {
    create,
    createResult,
    update,
    updateResult,
    show,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
    updatePermissions,
    updatePermissionsResult,
  } = useUser();
  const canManage = useCan(ACTION.user);
  const currentUserId = useAppSelector((s) => s.auth.session?.user?.id);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editRow, setEditRow] = useState<UserDetail | null>(null);
  const [editData, setEditData] = useState<any | null>(null);

  const openCreate = useCallback(() => {
    setDrawerMode("create");
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditRow(null);
    setEditData(null);
    createResult.reset?.();
    updateResult.reset?.();
  }, [createResult, updateResult]);

  const openEdit = useCallback(
    async (row: UserDetail) => {
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

  const openPermission = useCallback(
    async (row: UserDetail) => {
      setDrawerMode("permission");
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

  const handleToggleActive = useCallback(
    (row: UserDetail) => {
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
        onEdit: openEdit,
        onPermission: openPermission,
        onToggleActive: handleToggleActive,
        canManage,
        currentUserId,
      }),
    [
      openEdit,
      openPermission,
      handleToggleActive,
      canManage,
      currentUserId,
    ],
  );
  const Table = useTable("user-list", tableConfig as TableConfig<unknown>);

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

  const handleSavePermission = useCallback(
    async (data: Record<string, unknown>) => {
      if (!editRow) return;
      updatePermissions({ id: editRow.id, payload: data as any });
    },
    [editRow, updatePermissions],
  );

  // Create success → toast + close + refresh
  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "User berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      createResult.reset?.();
    }
  }, [createResult, showToast, closeDrawer, Table]);

  // Update success (edit user) → toast + close + refresh
  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "User berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      updateResult.reset?.();
    }
  }, [updateResult, showToast, closeDrawer, Table]);

  // Update permissions success (drawer permission) → toast + close + refresh
  useEffect(() => {
    if (updatePermissionsResult?.isSuccess) {
      showToast({
        message: "Permission user berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      updatePermissionsResult.reset?.();
    }
  }, [updatePermissionsResult, showToast, closeDrawer, Table]);

  useEffect(() => {
    if (activateResult?.isSuccess) {
      showToast({
        message: "User berhasil diaktifkan",
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
        message: "User berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [deactivateResult, showToast, Table]);

  const drawerTitle =
    drawerMode === "create"
      ? "Tambah User"
      : drawerMode === "edit"
        ? "Edit User"
        : "Ubah Permission User";

  const drawerSubtitle =
    drawerMode === "create"
      ? "Buat pengguna baru untuk sistem."
      : drawerMode === "edit"
        ? "Perbarui data pengguna."
        : "Pilih Permission untuk mengatur hak akses.";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="User"
        subtitle="Kelola pengguna sistem."
        action={
          canManage && (
            <Button variant="primary" onClick={openCreate}>
              + Tambah User
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada user."
        />
        <Table.Pagination />
      </Page.Body>

      {/* Drawer: tambah / edit / permission user */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        position="right"
        className="!w-[28rem]"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {drawerMode === "permission" ? (
                <ShieldCheck size={18} className="text-violet-600" />
              ) : (
                <UserPlus size={18} className="text-primary" />
              )}
              {drawerTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{drawerSubtitle}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {drawerMode === "permission" ? (
              <UserPermissionForm
                id="user-permission-form"
                initialData={editData}
                onSubmit={handleSavePermission}
              />
            ) : (
              <UserForm
                id={drawerMode === "create" ? "user-create-form" : "user-edit-form"}
                initialData={drawerMode === "edit" ? editData : null}
                onSubmit={drawerMode === "create" ? handleCreate : handleUpdate}
              />
            )}
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="secondary" onClick={closeDrawer}>
              Batal
            </Button>
            {drawerMode === "permission" ? (
              <Button
                type="submit"
                form="user-permission-form"
                variant="primary"
                isLoading={updatePermissionsResult?.isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Permission
              </Button>
            ) : (
              <Button
                type="submit"
                form={
                  drawerMode === "create" ? "user-create-form" : "user-edit-form"
                }
                variant="success"
                isLoading={
                  drawerMode === "create"
                    ? createResult?.isLoading
                    : updateResult?.isLoading
                }
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan User
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </Page>
  );
};

export default UserListPage;
