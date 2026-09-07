/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Drawer, Modal } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/franchise.config";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useEnigmaUI } from "@/components";
import { FranchiseForm } from "./components/FranchiseForm";
import { Building2, Save, UserPlus } from "lucide-react";
import { useIsSuperuser, useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import type {
  FranchisorCreateRequest,
  FranchisorRow,
  FranchisorRowUpdateRequest,
} from "@/services/types/franchisor";

type DrawerMode = "create" | "edit";

const FranchiseListPage: React.FC = () => {
  const navigate = useNavigate();
  const isSuperuser = useIsSuperuser();
  const canManage = useCan(ACTION.user);
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
    remove,
    removeResult,
  } = useFranchisorList();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editRow, setEditRow] = useState<FranchisorRow | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [deleteRow, setDeleteRow] = useState<FranchisorRow | null>(null);

  // Bukan superuser → redirect (guard tambahan di halaman).
  useEffect(() => {
    if (!isSuperuser) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSuperuser, navigate]);

  const openCreate = useCallback(() => {
    setDrawerMode("create");
    setEditRow(null);
    setEditData(null);
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
    async (row: FranchisorRow) => {
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

  const handleToggleActive = useCallback(
    (row: FranchisorRow) => {
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
        onView: (row) => navigate(`/franchise/${row.id}`),
        onEdit: openEdit,
        onRemove: (row) => setDeleteRow(row),
        onToggleActive: handleToggleActive,
        canManage,
      }),
    [navigate, openEdit, handleToggleActive, canManage],
  );
  const Table = useTable("franchise-list", tableConfig as TableConfig<unknown>);

  const handleCreate = useCallback(
    async (data: FranchisorCreateRequest | FranchisorRowUpdateRequest) => {
      create(data as any);
    },
    [create],
  );

  const handleUpdate = useCallback(
    async (data: FranchisorCreateRequest | FranchisorRowUpdateRequest) => {
      if (!editRow) return;
      update({ id: editRow.id, payload: data as any });
    },
    [editRow, update],
  );

  const handleDelete = useCallback(() => {
    if (!deleteRow) return;
    remove({ id: deleteRow.id });
  }, [deleteRow, remove]);

  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "Franchise berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      createResult.reset?.();
    }
  }, [createResult, showToast, closeDrawer, Table]);

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Franchise berhasil diperbarui",
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
    if (removeResult?.isSuccess) {
      showToast({
        message: "Franchise berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      setDeleteRow(null);
      Table.boot();
      removeResult.reset?.();
    }
  }, [removeResult, showToast, Table]);

  useEffect(() => {
    if (activateResult?.isSuccess) {
      showToast({
        message: "Franchise berhasil diaktifkan",
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
        message: "Franchise berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [deactivateResult, showToast, Table]);

  if (!isSuperuser) {
    return (
      <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
        <Page.Body className='flex items-center justify-center'>
          <p className='text-slate-400'>Tidak ada akses.</p>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Settings'
        title='Franchise'
        subtitle='Kelola brand / franchisor (outlet & mitra).'
        backTo={() => navigate(-1)}
        action={
          <Button variant='primary' onClick={openCreate}>
            <UserPlus className='w-4 h-4 mr-2' />
            Tambah Franchise
          </Button>
        }
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools hideSearch>
          <div />
        </Table.Tools>
        <Table.Render
          emptyTitle='Data Tidak Ditemukan'
          emptyDescription='Belum ada brand/franchise.'
        />
        <Table.Pagination />
      </Page.Body>

      {/* Drawer: tambah / edit franchise */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        position='right'
        className='!w-[30rem]'
      >
        <div className='flex flex-col h-full'>
          <div className='p-5 border-b border-slate-100'>
            <h3 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
              <Building2 size={18} className='text-primary' />
              {drawerMode === "create" ? "Tambah Franchise" : "Edit Franchise"}
            </h3>
            <p className='text-xs text-slate-500 mt-1'>
              {drawerMode === "create"
                ? "Buat brand baru sekaligus akun owner."
                : "Perbarui data brand."}
            </p>
          </div>
          <div className='flex-1 overflow-y-auto p-5'>
            <FranchiseForm
              id={drawerMode === "create" ? "franchise-create-form" : "franchise-edit-form"}
              initialData={drawerMode === "edit" ? (editData ?? editRow) : null}
              onSubmit={drawerMode === "create" ? handleCreate : handleUpdate}
            />
          </div>
          <div className='p-5 border-t border-slate-100 flex justify-end gap-2'>
            <Button variant='secondary' onClick={closeDrawer}>
              Batal
            </Button>
            <Button
              type='submit'
              form={
                drawerMode === "create"
                  ? "franchise-create-form"
                  : "franchise-edit-form"
              }
              variant='success'
              isLoading={
                drawerMode === "create"
                  ? createResult?.isLoading
                  : updateResult?.isLoading
              }
            >
              <Save className='w-4 h-4 mr-2' />
              Simpan
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Modal konfirmasi hapus */}
      <Modal.Wrapper
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        closeOnOutsideClick={false}
      >
        <Modal.Header>Hapus Franchise</Modal.Header>
        <Modal.Body>
          <p className='text-sm text-slate-600'>
            Apakah Anda yakin ingin menghapus franchise{" "}
            <strong>{deleteRow?.name}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDeleteRow(null)}>
            Batal
          </Button>
          <Button
            variant='error'
            onClick={handleDelete}
            isLoading={removeResult?.isLoading}
          >
            Hapus
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default FranchiseListPage;
