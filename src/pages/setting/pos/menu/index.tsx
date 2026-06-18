import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/menu.config";
import TableFilter from "./table/menu.filter";
import type { TableConfig } from "@/services/table/const";
import { useLazyGetOutletTypesQuery } from "@/services/outlet/api";
import { useLazyGetChannelsQuery } from "@/services/pos/api";
import { usePOSMenu } from "@/services/pos/hooks";
import type { POSMenuDetail } from "@/services/types/pos";
import { AssignMenuOutletTypeModal } from "./components/AssignOutletTypeModal";

const POSMenuListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const [fetchTypes, { data: typesData }] = useLazyGetOutletTypesQuery();
  const [fetchChannels, { data: channelsData }] = useLazyGetChannelsQuery();
  const {
    remove: removeMenu,
    removeResult: removeMenuResult,
    activate: activateMenu,
    activateResult: activateMenuResult,
    deactivate: deactivateMenu,
    deactivateResult: deactivateMenuResult,
  } = usePOSMenu();

  React.useEffect(() => {
    fetchTypes();
    fetchChannels({ limit: 100 });
  }, [fetchTypes, fetchChannels]);

  const outletTypes = (typesData as any)?.data ?? [];
  const channels = (channelsData as any)?.data ?? [];

  const handleToggleActive = (v: POSMenuDetail) => {
    if (v.is_active) {
      deactivateMenu({ id: v.id });
    } else {
      activateMenu({ id: v.id });
    }
  };

  const openOutletType = (row: POSMenuDetail) => {
    openModal({
      id: "assign-menu-outlet-type",
      content: (
        <AssignMenuOutletTypeModal
          menu={row}
          onClose={() => closeModal("assign-menu-outlet-type")}
          onSuccess={() => {
            closeModal("assign-menu-outlet-type");
            Table.boot();
          }}
        />
      ),
    });
  };

  const openDelete = (v: POSMenuDetail) => {
    openModal({
      id: "delete-menu",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-menu")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Menu</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure you want to delete this menu?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => removeMenu({ id: v.id })}
              isLoading={removeMenuResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-menu")}
              disabled={removeMenuResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onEdit: (id) => navigate(`/setting/pos/menu/update/${id}`),
        onToggleActive: (row) => handleToggleActive(row),
        onRemove: (row) => openDelete(row),
        onOutletType: (row) => openOutletType(row),
        outletTypes,
        channels,
      }),
    [navigate, outletTypes, channels],
  );

  const Table = useTable("pos-menu-list", tableConfig as TableConfig);

  useEffect(() => {
    if (removeMenuResult?.isSuccess) {
      closeModal("delete-menu");
      Table.boot();
    }
  }, [removeMenuResult]);

  useEffect(() => {
    if (activateMenuResult?.isSuccess) {
      showToast({
        message: "Menu berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateMenuResult.reset?.();
    }
  }, [activateMenuResult, Table, showToast]);

  useEffect(() => {
    if (deactivateMenuResult?.isSuccess) {
      showToast({
        message: "Menu berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateMenuResult.reset?.();
    }
  }, [deactivateMenuResult, Table, showToast]);

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
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

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
