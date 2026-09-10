/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/app/layout";
import { Button, Drawer, Loading } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/outlet.config";
import { Modal, useEnigmaUI } from "@/components";
import TableFilter from "./table/outlet.filter";
import { useOutlet } from "@/services/outlet/hooks";
import type { TableConfig } from "@/services/table/const";
import { OutletUserForm } from "./components/OutletUserForm";
import { OutletForm } from "./components/outletForm";
import type { OutletCreateRequest, OutletDetail } from "@/services/types/outlet.ts";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { useUser } from "@/services/user/hooks";
import { UserRound, Save, Store, Plus } from "lucide-react";

const OutletListPage: React.FC = () => {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.outlet);
  const canManageUser = useCan(ACTION.user);

  const {
    create,
    createResult,
    update,
    updateResult,
    show: showOutlet,
    remove: removeOutlet,
    removeResult: removeOutletResult,
    activate,
    activateResult: activateResult,
    deactivate,
    deactivateResult: deactivateResult,
  } = useOutlet();

  const {
    get: getUsers,
    show: showUser,
    update: updateUser,
    updateResult: updateUserResult,
  } = useUser();

  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [userEditData, setUserEditData] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Drawer create/edit outlet (pola Franchise)
  const [outletDrawerOpen, setOutletDrawerOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<OutletDetail | null>(null);
  const [outletEditData, setOutletEditData] = useState<OutletDetail | null>(null);
  const [outletLoading, setOutletLoading] = useState(false);

  const openCreateOutlet = () => {
    setEditingOutlet(null);
    setOutletEditData(null);
    setOutletDrawerOpen(true);
  };

  const openEditOutlet = async (row: OutletDetail) => {
    setEditingOutlet(row);
    setOutletEditData(null);
    setOutletDrawerOpen(true);
    setOutletLoading(true);
    try {
      const res = await showOutlet({ id: row.id });
      setOutletEditData((res as any)?.data ?? row);
    } catch {
      setOutletEditData(row);
    } finally {
      setOutletLoading(false);
    }
  };

  const closeOutletDrawer = () => {
    setOutletDrawerOpen(false);
    setEditingOutlet(null);
    setOutletEditData(null);
    createResult?.reset?.();
    updateResult?.reset?.();
  };

  const handleOutletSubmit = (data: OutletCreateRequest) => {
    if (editingOutlet) {
      update({ id: editingOutlet.id, payload: data as any });
    } else {
      create(data as any);
    }
  };

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } =
    removeOutletResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const handleManageUser = async (row: OutletDetail) => {
    setUserLoading(true);
    setUserDrawerOpen(true);
    try {
      let user: any = null;
      let userId: string | null = null;
      if (row?.user_id) {
        // Backend sekarang meng-embed user_id → fetch detail user langsung.
        const res = await showUser({ id: row.user_id });
        user = (res as any)?.data ?? null;
        userId = user?.id ?? row.user_id;
      } else {
        // Fallback data lama: cari lewat list user per outlet.
        const res = await getUsers({ outlet_id: row.id });
        const users = (res as any)?.data ?? [];
        user = users[0] ?? null;
        userId = user?.id ?? null;
      }
      setUserEditData(user);
      setCurrentUserId(userId);
    } catch {
      setUserEditData(null);
      setCurrentUserId(null);
    } finally {
      setUserLoading(false);
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => openEditOutlet(row),
        onRemove: (row: any) => {
          openDelete(row);
        },
        onToggleActive: (row: any) => handleToggleActive(row),
        onManageUser: (row: any) => handleManageUser(row),
        canManage,
        canManageUser,
      }),
    [canManage, canManageUser, handleManageUser, openEditOutlet],
  );

  const Table = useTable("outlet-list", tableConfig as TableConfig<unknown>);

  // Handle Delete Success
  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-outlet-type");
      showToast({
        message: "Outlet berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeOutletResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess, Table, removeOutletResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Outlet berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateResult.reset?.();
    }
  }, [isActivateSuccess, Table, activateResult]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      showToast({
        message: "Outlet berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeModal("delete-catalog");
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  // Update user outlet success → toast + close drawer
  useEffect(() => {
    if (updateUserResult?.isSuccess) {
      showToast({
        message: "User outlet berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      setUserDrawerOpen(false);
      setUserEditData(null);
      setCurrentUserId(null);
      updateUserResult.reset?.();
    }
  }, [updateUserResult, showToast]);

  // Create outlet success → toast + close drawer + refresh
  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "Outlet berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeOutletDrawer();
      createResult.reset?.();
      Table.boot();
    }
  }, [createResult?.isSuccess]);

  // Update outlet success → toast + close drawer + refresh
  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Outlet berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeOutletDrawer();
      updateResult.reset?.();
      Table.boot();
    }
  }, [updateResult?.isSuccess]);

  const openDelete = (row: any) => {
    openModal({
      id: "delete-outlet",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-outlet")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus Outlet
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus outlet{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className="flex gap-2">
            {canManage && (
              <Button
                className="flex-1 rounded-xl"
                variant="error"
                onClick={() => handleDelete(row)}
                isLoading={isDeleting}
              >
                Hapus
              </Button>
            )}
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-outlet")}
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
      removeOutlet({ id: row.id });
    }
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Daftar Outlet"
        subtitle="Kelola semua outlet yang terdaftar di sistem."
        action={
          canManage && (
            <Button variant="primary" onClick={openCreateOutlet}>
              <Plus size={18} />
              Tambah Outlet
            </Button>
          )
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0 bg-white border-t border-slate-200">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Outlet"
          emptyDescription="Daftar outlet yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>

      {/* Drawer: update user outlet */}
      <Drawer
        open={userDrawerOpen}
        onClose={() => {
          setUserDrawerOpen(false);
          setUserEditData(null);
          setCurrentUserId(null);
        }}
        position="right"
        className="!w-[28rem]"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserRound size={18} className="text-emerald-600" />
              Update User Outlet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Perbarui nama & password user pemilik outlet.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {userLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                  Memuat data user outlet...
                </p>
              </div>
            ) : (
              <OutletUserForm
                id="outlet-user-form"
                initialData={userEditData}
                onSubmit={(data) => {
                  if (!currentUserId) return;
                  updateUser({
                    id: currentUserId,
                    payload: data as any,
                  });
                }}
              />
            )}
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setUserDrawerOpen(false);
                setUserEditData(null);
                setCurrentUserId(null);
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="outlet-user-form"
              variant="success"
              disabled={userLoading || !currentUserId}
              isLoading={updateUserResult?.isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Drawer: tambah / edit outlet (pola Franchise) */}
      <Drawer
        open={outletDrawerOpen}
        onClose={closeOutletDrawer}
        position='right'
        className='!w-[30rem]'
      >
        <div className='flex flex-col h-full'>
          <div className='p-5 border-b border-slate-100'>
            <h3 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
              <Store size={18} className='text-primary' />
              {editingOutlet ? "Edit Outlet" : "Tambah Outlet"}
            </h3>
            <p className='text-xs text-slate-500 mt-1'>
              {editingOutlet
                ? "Perbarui data outlet."
                : "Daftarkan outlet baru."}
            </p>
          </div>
          <div className='flex-1 overflow-y-auto p-5'>
            {outletLoading && editingOutlet ? (
              <div className='flex justify-center py-20'>
                <Loading size='lg' variant='spinner' />
              </div>
            ) : (
              <OutletForm
                id='outlet-form'
                initialData={editingOutlet ? (outletEditData ?? editingOutlet) : null}
                hideOwnerSection={!!editingOutlet}
                onSubmit={handleOutletSubmit}
              />
            )}
          </div>
          <div className='p-5 border-t border-slate-100 flex justify-end gap-2'>
            <Button variant='secondary' onClick={closeOutletDrawer}>
              Batal
            </Button>
            <Button
              type='submit'
              form='outlet-form'
              variant='success'
              isLoading={
                editingOutlet
                  ? updateResult?.isLoading
                  : createResult?.isLoading
              }
            >
              <Save className='w-4 h-4 mr-2' />
              Simpan
            </Button>
          </div>
        </div>
      </Drawer>
    </Page>
  );
};

export default OutletListPage;
