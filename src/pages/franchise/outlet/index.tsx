/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Drawer } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/outlet.config";
import { Modal, useEnigmaUI } from "@/components";
import TableFilter from "./table/outlet.filter";
import { useOutlet } from "@/services/outlet/hooks";
import type { TableConfig } from "@/services/table/const";
import { AssignPOSChannelModal } from "./components/AssignPOSChannelModal";
import { OutletUserForm } from "./components/OutletUserForm";
import type { OutletDetail } from "@/services/types/outlet";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { useUser } from "@/services/user/hooks";
import { UserRound, Save } from "lucide-react";

interface OutletListProps {
  /** Filter outlet milik franchise ini. */
  franchiseId?: string;
  /** Saat true, tampilkan sebagai halaman penuh dgn header (default false = embedded). */
  fullPage?: boolean;
  /** Base path untuk aksi edit/create. Default /franchise/:franchiseId/outlet. */
  basePath?: string;
}

const OutletList: React.FC<OutletListProps> = ({
  franchiseId,
  fullPage = false,
  basePath,
}) => {
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const navigate = useNavigate();
  const canManage = useCan(ACTION.outlet);
  const canManageUser = useCan(ACTION.user);

  const outletBasePath = basePath ?? "/franchise";

  const {
    remove: removeOutlet,
    removeResult: removeOutletResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useOutlet();

  const {
    get: getUsers,
    update: updateUser,
    updateResult: updateUserResult,
  } = useUser();

  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [userEditData, setUserEditData] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) =>
          navigate(
            franchiseId
              ? `${outletBasePath}/${franchiseId}/outlet/update/${row.id}`
              : `${outletBasePath}/update/${row.id}`,
          ),
        onRemove: (row: any) => {
          openDelete(row);
        },
        onChangeChannel: (row) => openOutletType(row),
        onToggleActive: (row: any) => handleToggleActive(row),
        onManageUser: (row: any) => handleManageUser(row),
        lockedFilter: franchiseId ? { franchise_id: franchiseId } : undefined,
        canManage,
        canManageUser,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [franchiseId, outletBasePath, canManage, canManageUser],
  );

  const tableName = franchiseId
    ? `outlet-list-franchise-${franchiseId}`
    : "outlet-list";
  const Table = useTable(tableName, tableConfig as TableConfig<unknown>);

  const openOutletType = (row: OutletDetail) => {
    openModal({
      id: "assign-pos-channel",
      content: (
        <AssignPOSChannelModal
          data={row}
          onClose={() => closeModal("assign-pos-channel")}
          onSuccess={() => {
            closeModal("assign-pos-channel");
            Table.boot();
          }}
        />
      ),
    });
  };

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
  }, [isDeleteSuccess, Table, removeOutletResult, closeModal, showToast]);

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
  }, [isActivateSuccess, Table, activateResult, showToast]);

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
  }, [isDeactivateSuccess, Table, deactivateResult, closeModal, showToast]);

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

  const body = (
    <>
      <div className="flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
          {canManage && franchiseId && (
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                navigate(`${outletBasePath}/${franchiseId}/outlet/create`)
              }
            >
              <Plus size={16} />
              Tambah Outlet
            </Button>
          )}
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Outlet"
          emptyDescription="Daftar outlet yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </div>

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
    </>
  );

  if (!fullPage) {
    return body;
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Daftar Outlet"
        subtitle="Kelola semua outlet yang terdaftar di sistem."
        backTo={() => navigate(-1)}
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 bg-white border-t border-slate-200">
        {body}
      </Page.Body>
    </Page>
  );
};

export default OutletList;
