/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react";
import { Page } from "@/components/app/layout";
import { Button, RemoteSelect, Drawer } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/user.config";
import type { UserDetail } from "@/services/types";
import TableFilter from "./table/user.filter";
import { useUser } from "@/services/user/hooks";
import { useUserGroup } from "@/services/usergroup/hooks";
import { useEnigmaUI } from "@/components";
import { UserForm } from "./components/UserForm";
import { Save, UserPlus, ShieldCheck } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import type { UserGroupDetail } from "@/services/types";

type DrawerMode = "create" | "edit" | "permission";

const UserListPage: React.FC = () => {
  useDocumentMeta("User | Sukabread Franchisee", "");
  const { showToast } = useEnigmaUI();
  const { create, createResult, update, updateResult, show } = useUser();
  const { get: getUsergroups, getResult: usergroupsResult } = useUserGroup();
  const canManage = useCan(ACTION.user);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editRow, setEditRow] = useState<UserDetail | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [permGroup, setPermGroup] = useState<UserGroupDetail | null>(null);

  const handleView = useCallback(
    (row: UserDetail) => {
      setDrawerMode("edit");
      setEditRow(row);
      setEditData(row);
      setDrawerOpen(true);
    },
    [],
  );

  const openCreate = useCallback(() => {
    setDrawerMode("create");
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditRow(null);
    setEditData(null);
    setPermGroup(null);
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
    (row: UserDetail) => {
      setDrawerMode("permission");
      setEditRow(row);
      const list = (usergroupsResult?.data as { data?: UserGroupDetail[] })
        ?.data ?? [];
      const found = list.find((g) => g.id === row.usergroup_id);
      setPermGroup(found ?? null);
      setDrawerOpen(true);
    },
    [usergroupsResult?.data],
  );

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onView: handleView,
        onEdit: openEdit,
        onPermission: openPermission,
        canManage,
      }),
    [handleView, openEdit, openPermission, canManage],
  );
  const Table = useTable("user-list", tableConfig as TableConfig<unknown>);

  const handleCreate = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        await create(data);
        showToast({
          message: "User berhasil dibuat",
          type: "success",
          position: "bottom-center",
          duration: 4000,
        });
        closeDrawer();
        Table.boot();
      } catch {
        /* error form state handled by createCrudHook */
      }
    },
    [create, showToast, closeDrawer, Table],
  );

  const handleUpdate = useCallback(
    async (data: Record<string, unknown>) => {
      if (!editRow) return;
      try {
        await update({ id: editRow.id, payload: data as any });
        showToast({
          message: "User berhasil diperbarui",
          type: "success",
          position: "bottom-center",
          duration: 4000,
        });
        closeDrawer();
        Table.boot();
      } catch {
        /* handled */
      }
    },
    [editRow, update, showToast, closeDrawer, Table],
  );

  const handleSavePermission = useCallback(async () => {
    if (!editRow) return;
    try {
      await update({
        id: editRow.id,
        payload: { usergroup_id: permGroup?.id ?? null },
      });
      showToast({
        message: "Permission user berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
    } catch {
      /* handled */
    }
  }, [editRow, permGroup, update, showToast, closeDrawer, Table]);

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
        : "Pilih usergroup untuk mengatur hak akses. Kosongkan untuk tanpa usergroup (super admin).";

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
              <RemoteSelect
                placeholder="Pilih Usergroup (kosongkan utk super admin)"
                value={permGroup}
                hook={usergroupsResult as any}
                fetchData={(page, search) =>
                  getUsergroups({ page: page || 1, limit: 50, search })
                }
                getLabel={(item: any) => (item ? item.name : "")}
                renderItem={(item: any) => item?.name}
                getValue={(item: any) => item?.id}
                onChange={(val: any) => setPermGroup(val)}
                onClear={() => setPermGroup(null)}
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
                variant="primary"
                onClick={handleSavePermission}
                isLoading={updateResult?.isLoading}
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
