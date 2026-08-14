/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react";
import { Page } from "@/components/app/layout";
import { Button, Drawer } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/group.config";
import { useUserGroup } from "@/services/usergroup/hooks";
import { useEnigmaUI } from "@/components";
import { UserGroupForm } from "./components/UserGroupForm";
import { Save, ShieldCheck } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import type { UserGroupDetail } from "@/services/types";

type DrawerMode = "create" | "edit";

const UserGroupListPage: React.FC = () => {
  useDocumentMeta("Usergroup | Sukabread Franchisee", "");
  const { showToast } = useEnigmaUI();
  const { create, createResult, show, update, updateResult } = useUserGroup();
  const canManage = useCan(ACTION.usergroup);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editRow, setEditRow] = useState<UserGroupDetail | null>(null);
  const [editData, setEditData] = useState<any | null>(null);

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onEdit: (row) => openEdit(row),
        canManage,
      }),
    [canManage],
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
      try {
        await create(data);
        showToast({
          message: "Usergroup berhasil dibuat",
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
          message: "Usergroup berhasil diperbarui",
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
    </Page>
  );
};

export default UserGroupListPage;
