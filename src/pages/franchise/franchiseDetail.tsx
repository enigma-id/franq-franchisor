/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Drawer, Modal, Badge } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createOutletTableConfig from "@/pages/setting/outlet/table/outlet.config";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useOutlet } from "@/services/outlet/hooks";
import { useUser } from "@/services/user/hooks";
import { useEnigmaUI } from "@/components";
import { OutletUserForm } from "@/pages/setting/outlet/components/OutletUserForm";
import { OutletForm } from "@/pages/setting/outlet/components/outletForm";
import { useIsSuperuser, useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { getTypeVariant } from "@/utils";
import { UserRound, Save, Plus, Store } from "lucide-react";
import type { OutletCreateRequest, OutletDetail } from "@/services/types/outlet.ts";
import type { FranchisorRow } from "@/services/types/franchisor";
import { Loading } from "@/components/ui";

const FranchiseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isSuperuser = useIsSuperuser();
  const canManage = useCan(ACTION.outlet);
  const canManageUser = useCan(ACTION.user);
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { show: showFranchise, showResult: franchiseResult } = useFranchisorList();

  const {
    create: createOutlet,
    createResult: createOutletResult,
    update: updateOutlet,
    updateResult: updateOutletResult,
    show: showOutlet,
    remove: removeOutlet,
    removeResult: removeOutletResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useOutlet();
  const { get: getUsers, update: updateUser, updateResult: updateUserResult } =
    useUser();

  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [userEditData, setUserEditData] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Drawer tambah/edit outlet (pola Franchise)
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
    createOutletResult?.reset?.();
    updateOutletResult?.reset?.();
  };

  const handleOutletSubmit = (data: OutletCreateRequest) => {
    const payload = {
      ...data,
      franchisor_id: id,
    };
    if (editingOutlet) {
      updateOutlet({ id: editingOutlet.id, payload: payload as any });
    } else {
      createOutlet(payload as any);
    }
  };

  useEffect(() => {
    if (!isSuperuser) {
      navigate("/dashboard", { replace: true });
    }
    if (id) {
      showFranchise({ id });
    }
  }, [isSuperuser, id, showFranchise, navigate]);

  const franchise = franchiseResult?.data?.data as FranchisorRow | undefined;
  const isLoading = franchiseResult?.isLoading || franchiseResult?.isFetching;

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } =
    removeOutletResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const handleToggleActive = (v: OutletDetail) => {
    if (v.is_active) {
      deactivate({ id: v.id });
    } else {
      activate({ id: v.id });
    }
  };

  const handleManageUser = async (row: OutletDetail) => {
    setUserLoading(true);
    setUserDrawerOpen(true);
    try {
      const res = await getUsers({ outlet_id: row.id });
      const users = (res as any)?.data ?? [];
      const user = users[0] ?? null;
      setUserEditData(user);
      setCurrentUserId(user?.id ?? null);
    } catch {
      setUserEditData(null);
      setCurrentUserId(null);
    } finally {
      setUserLoading(false);
    }
  };

  const tableConfig = useMemo(() => {
    if (!id) return null;
    return createOutletTableConfig({
      onClick: (row: any) => openEditOutlet(row),
      onRemove: (row: OutletDetail) => openDelete(row),
      onToggleActive: (row: any) => handleToggleActive(row),
      onManageUser: (row: any) => handleManageUser(row),
      canManage,
      canManageUser,
      // Scope ke brand ini.
      filter: { franchisor_id: id },
    });
  }, [id, canManage, canManageUser, handleToggleActive, openEditOutlet]);

  const Table = useTable(
    "franchise-outlet-list",
    (tableConfig as any) ?? { url: "/outlet", columns: {} },
  );

  const bootTable = () => Table.boot();

  const openDelete = (row: OutletDetail) => {
    openModal({
      id: "delete-outlet-detail",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-outlet-detail")}
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
                onClick={() => {
                  if (row?.id) removeOutlet({ id: row.id });
                }}
                isLoading={isDeleting}
              >
                Hapus
              </Button>
            )}
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-outlet-detail")}
              disabled={isDeleting}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-outlet-detail");
      showToast({
        message: "Outlet berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeOutletResult.reset?.();
      bootTable();
    }
  }, [isDeleteSuccess, removeOutletResult]);

  useEffect(() => {
    if (createOutletResult?.isSuccess) {
      showToast({
        message: "Outlet berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeOutletDrawer();
      createOutletResult.reset?.();
      bootTable();
    }
  }, [createOutletResult?.isSuccess]);

  useEffect(() => {
    if (updateOutletResult?.isSuccess) {
      showToast({
        message: "Outlet berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeOutletDrawer();
      updateOutletResult.reset?.();
      bootTable();
    }
  }, [updateOutletResult?.isSuccess]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Outlet berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      activateResult.reset?.();
      bootTable();
    }
  }, [isActivateSuccess, activateResult]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      showToast({
        message: "Outlet berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      deactivateResult.reset?.();
      bootTable();
    }
  }, [isDeactivateSuccess, deactivateResult]);

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

  if (!isSuperuser) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body className="flex items-center justify-center">
          <p className="text-slate-400">Tidak ada akses.</p>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title={franchise?.name ? `Detail Franchise — ${franchise.name}` : "Detail Franchise"}
        subtitle="Informasi brand & daftar outlet yang terdaftar."
        backTo={() => navigate("/franchise")}
        action={
          <Button variant="primary" onClick={openCreateOutlet}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Outlet
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-6 space-y-6">
        {isLoading || !franchise ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" variant="spinner" />
          </div>
        ) : (
          <>
            {/* Info Brand */}
            <div className="card-info card-animate p-6 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Store size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{franchise.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant={getTypeVariant(franchise.type)}
                      size="xs"
                      className="px-2.5 font-semibold text-[10px] tracking-wider capitalize"
                    >
                      {franchise.type}
                    </Badge>
                    <Badge
                      variant={franchise.is_active ? "success" : "error"}
                      size="xs"
                      className="px-2.5 font-semibold text-[10px] tracking-wider"
                    >
                      {franchise.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="info-row">
                  <dt className="info-label">Email</dt>
                  <dd className="info-value">{franchise.email || "-"}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Telepon</dt>
                  <dd className="info-value">{franchise.phone || "-"}</dd>
                </div>
                <div className="info-row md:col-span-2">
                  <dt className="info-label">Alamat</dt>
                  <dd className="info-value">{franchise.address || "-"}</dd>
                </div>
              </dl>
            </div>

            {/* Daftar Outlet brand ini */}
            <div className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="table-header p-5! border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-slate-400" />
                  <h2 className="table-header-title font-bold text-slate-700">
                    Daftar Outlet ({franchise.name})
                  </h2>
                </div>
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <Table.Tools hideSearch>
                  <div />
                </Table.Tools>
                <Table.Render
                  emptyTitle="Belum Ada Outlet"
                  emptyDescription={`Belum ada outlet untuk brand ${franchise.name}.`}
                />
                <Table.Pagination />
              </div>
            </div>
          </>
        )}
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

      {/* Drawer: tambah/edit outlet brand ini (pola Franchise) */}
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
              {editingOutlet ? "Edit Outlet" : `Tambah Outlet — ${franchise?.name ?? ""}`}
            </h3>
            <p className='text-xs text-slate-500 mt-1'>
              {editingOutlet
                ? "Perbarui data outlet brand ini."
                : "Daftarkan outlet baru untuk brand ini."}
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
                defaultFranchisorId={id}
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
                  ? updateOutletResult?.isLoading
                  : createOutletResult?.isLoading
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

export default FranchiseDetailPage;
