/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UserRound, Save } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Drawer } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/franchise.config";
import { Modal, useEnigmaUI } from "@/components";
import TableFilter from "./table/franchise.filter";
import { useFranchise } from "@/services/franchise/hooks";
import { OutletUserForm } from "./outlet/components/OutletUserForm";
import { useUser } from "@/services/user/hooks";
import type { TableConfig } from "@/services/table/const";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const FranchiseListPage: React.FC = () => {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const navigate = useNavigate();
  const canManage = useCan(ACTION.franchise);
  const canManageUser = useCan(ACTION.user);

  const {
    remove: removeFranchise,
    removeResult: removeFranchiseResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useFranchise();

  const {
    get: getUsers,
    update: updateUser,
    updateResult: updateUserResult,
  } = useUser();

  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [userEditData, setUserEditData] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeFranchiseResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const handleManageUser = async (row: any) => {
    setUserLoading(true);
    setUserDrawerOpen(true);
    try {
      const res = await getUsers({ franchise_id: row.id, outlet_id: "null" });
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

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => navigate(`/franchise/update/${row.id}`),
        onDetail: (row: any) => navigate(`/franchise/${row.id}`),
        onRemove: (row: any) => openDelete(row),
        onToggleActive: (row: any) => handleToggleActive(row),
        onManageUser: (row: any) => handleManageUser(row),
        canManage,
        canManageUser,
      }),
    [canManage, canManageUser],
  );

  const Table = useTable("franchise-list", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-franchise");
      showToast({
        message: "Franchise berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeFranchiseResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Franchise berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateResult.reset?.();
    }
  }, [isActivateSuccess]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      showToast({
        message: "Franchise berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess]);

  // Update user franchise success → toast + close drawer
  useEffect(() => {
    if (updateUserResult?.isSuccess) {
      showToast({
        message: "User franchise berhasil diperbarui",
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

  const openDelete = (row: any) => {
    openModal({
      id: "delete-franchise",
      content: (
        <Modal.Wrapper open onClose={() => closeModal("delete-franchise")} closeOnOutsideClick={false}>
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">Hapus Franchise</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus franchise{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className="flex gap-2">
            {canManage && (
              <Button
                className="flex-1 rounded-xl"
                variant="error"
                onClick={() => removeFranchise({ id: row.id })}
                isLoading={isDeleting}
              >
                Hapus
              </Button>
            )}
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-franchise")}
              disabled={isDeleting}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Daftar Franchise"
        subtitle="Kelola semua franchise yang terdaftar di sistem."
        action={
          canManage && (
            <Button variant="primary" onClick={() => navigate("/franchise/create")}>
              <Plus size={18} />
              Tambah Franchise
            </Button>
          )
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0 bg-white border-t border-slate-200">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Franchise"
          emptyDescription="Daftar franchise yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>

      {/* Drawer: update user pemilik franchise */}
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
              Update User Franchise
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Perbarui nama & password user pemilik franchise.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {userLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                  Memuat data user franchise...
                </p>
              </div>
            ) : (
              <OutletUserForm
                id="franchise-user-form"
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
              form="franchise-user-form"
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
    </Page>
  );
};

export default FranchiseListPage;
