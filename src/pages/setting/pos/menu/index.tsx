/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOutlet } from "@/services/outlet/hooks";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/menu.config";
import type { TableConfig } from "@/services/table/const";
import { usePOSMenu } from "@/services/pos/hooks";
import type { POSMenuDetail } from "@/services/types";
import { Button, Modal, useEnigmaUI } from "@/components";
import { Plus } from "lucide-react";
import { AssignOutletTypeModal } from "./components/AssignOutletTypeModal";

const POSMenuListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = usePOSMenu();
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row) => navigate(`/setting/pos/menu/${row.id}`),
        onEdit: (row) => navigate(`/setting/pos/menu/update/${row.id}`),
        onRemove: (v) => {
          openDelete(v);
        },
        onOutletType: (row, ot) => {
          if (ot) {
            openOutletNames(row, ot);
          } else {
            openOutletType(row);
          }
        },
        onToggleActive: (row) => handleToggleActive(row),
      }),
    [navigate, activate, deactivate],
  );

  const { get: getOutlets } = useOutlet();

  const openOutletNames = async (_row: any, outletType: any) => {
    const typeId = outletType.outlet_type?.id || outletType.outlet_type_id;
    if (!typeId) return;

    const res = await getOutlets({ outlet_type_id: typeId, limit: 100 });
    const outlets = (res as any)?.data ?? [];

    openModal({
      id: "outlet-names",
      content: (
        <Modal.Wrapper open onClose={() => closeModal("outlet-names")}>
          <Modal.Header>
            <div className="font-bold leading-7">
              {outletType.outlet_type?.name || "Outlet"}
            </div>
            <div className="text-xs text-slate-500 font-normal mt-1">
              Outlet dengan tipe ini
            </div>
          </Modal.Header>
          <Modal.Body className="max-h-[60vh] overflow-y-auto p-5">
            {outlets.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-400">
                Tidak ada outlet
              </div>
            ) : (
              <div className="space-y-2">
                {outlets.map((o: any) => (
                  <div
                    key={o.id}
                    className="p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                  >
                    {o.name}
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("outlet-names")}
            >
              Tutup
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const openOutletType = (row: POSMenuDetail) => {
    openModal({
      id: "assign-outlet-catalog",
      content: (
        <AssignOutletTypeModal
          catalog={row}
          onClose={() => closeModal("assign-outlet-menu")}
          onSuccess={() => {
            closeModal("assign-outlet-menu");
            Table.boot();
          }}
        />
      ),
    });
  };

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const Table = useTable("pos-menu-list", tableConfig as TableConfig);

  const openDelete = (v: POSMenuDetail) => {
    openModal({
      id: "delete-item",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-item")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Item</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-item")}
              disabled={removeResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: POSMenuDetail) => {
    if (v) {
      remove({ id: v?.id });
    }
  };

  useEffect(() => {
    if (removeResult?.isSuccess) {
      closeModal("delete-item");
      Table.boot();
    }
  }, [removeResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "POS Channel berhasil diaktifkan",
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
        message: "POS Channel berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="POS Menu"
        subtitle="Kelola daftar menu makanan dan minuman untuk POS."
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/setting/pos/menu/create")}
          >
            <Plus size={18} />
            Tambah Menu
          </Button>
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />

        <Table.Render
          emptyTitle="Belum Ada Menu"
          emptyDescription="Daftar menu POS yang Anda buat akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default POSMenuListPage;
