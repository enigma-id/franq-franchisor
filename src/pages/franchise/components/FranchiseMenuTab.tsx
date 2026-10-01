import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import createTableConfig from "@/pages/setting/pos/menu/table/menu.config";
import type { TableConfig } from "@/services/table/const";
import { useProduct } from "@/services/product/hooks";
import type { POSMenuDetail } from "@/services/types";
import { Button, Modal, useEnigmaUI } from "@/components";
import { UtensilsCrossed, Plus } from "lucide-react";

interface FranchiseMenuTabProps {
  /** Brand (franchisor_id) yang kelola menu-nya. */
  franchisorId: string;
  franchiseName?: string;
}

/**
 * Tab Menu di detail Franchise: daftar POS Menu milik brand ini.
 * Create/edit/detail memakai halaman POS Menu existing dgn konteks
 * ?franchisor_id=&back= agar kembali ke detail franchise.
 */
export const FranchiseMenuTab: React.FC<FranchiseMenuTabProps> = ({
  franchisorId,
  franchiseName,
}) => {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useProduct();

  const back = `/franchise/${franchisorId}`;
  const ctxQuery = `?franchisor_id=${encodeURIComponent(franchisorId)}&back=${encodeURIComponent(back)}`;

  const openDelete = (v: POSMenuDetail) => {
    openModal({
      id: "franchise-menu-delete",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("franchise-menu-delete")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Hapus Menu</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>
              Apakah Anda yakin ingin menghapus menu{" "}
              <strong>{v.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => remove({ id: v.id })}
              isLoading={removeResult?.isLoading}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("franchise-menu-delete")}
              disabled={removeResult?.isLoading}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleToggleActive = (v: POSMenuDetail) => {
    if (v.is_active) {
      deactivate({ id: v.id });
    } else {
      activate({ id: v.id });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row) => navigate(`/setting/pos/menu/${row.id}`),
        onEdit: (row) =>
          navigate(`/setting/pos/menu/update/${row.id}${ctxQuery}`),
        onRemove: (v) => openDelete(v),
        onToggleActive: (v) => handleToggleActive(v),
        filter: { franchisor_id: franchisorId },
        canManage: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, ctxQuery, franchisorId],
  );

  const Table = useTable(
    `franchise-menu-list-${franchisorId}`,
    tableConfig as TableConfig,
  );

  useEffect(() => {
    if (removeResult?.isSuccess) {
      closeModal("franchise-menu-delete");
      showToast({
        message: "Menu berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [removeResult?.isSuccess, closeModal, showToast, removeResult, Table]);

  useEffect(() => {
    if (activateResult?.isSuccess) {
      showToast({
        message: "Menu berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      activateResult.reset?.();
      Table.boot();
    }
  }, [activateResult, showToast, Table]);

  useEffect(() => {
    if (deactivateResult?.isSuccess) {
      showToast({
        message: "Menu berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      deactivateResult.reset?.();
      Table.boot();
    }
  }, [deactivateResult, showToast, Table]);

  return (
    <div className='card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm'>
      <div className='table-header p-5! border-b border-slate-100 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <UtensilsCrossed size={16} className='text-slate-400' />
          <h2 className='table-header-title font-bold text-slate-700'>
            Menu POS {franchiseName ? `(${franchiseName})` : ""}
          </h2>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            navigate(`/setting/pos/menu/create${ctxQuery}`)
          }
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Menu
        </Button>
      </div>
      <div className='flex-1 flex flex-col min-h-0'>
        <Table.Tools />
        <Table.Render
          emptyTitle='Belum Ada Menu POS'
          emptyDescription={`Belum ada menu POS untuk brand ${franchiseName ?? "ini"}.`}
        />
        <Table.Pagination />
      </div>
    </div>
  );
};

export default FranchiseMenuTab;
