/* eslint-disable react-hooks/set-state-in-effect */
import { Page } from "@/components/app/layout";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import createTableConfig from "./table/central_ktichen.config";
import TableFilter from "./table/central_ktichen.filter";
import type { SalesOrderDetail } from "@/services/types";
import { useEnigmaUI } from "@/components";
import { useSalesOrder } from "@/services/sales/hooks";
import { useCan, useIsSuperuser } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export default function CentralKitchen() {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.salesOrder);
  const isSuperuser = useIsSuperuser();
  const {
    publish: publishItem,
    publishResult,
    remove: removeItem,
    removeResult,
  } = useSalesOrder();
  const [selectedRow, setSelectedRow] = useState<SalesOrderDetail | null>(null);
  const [deleteRow, setDeleteRow] = useState<SalesOrderDetail | null>(null);
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (row) => navigate(`/central-kitchen/${row.id}`),
      onRemove: (row) => setDeleteRow(row),
      onEdit: isSuperuser
        ? (row) => navigate(`/central-kitchen/update/${row.id}`)
        : undefined,
      onPublish: (row) => setSelectedRow(row),
      canManage,
      lockedFilter: isSuperuser ? { order_type: "central_kitchen" } : undefined,
    });
  }, [navigate, canManage, isSuperuser]);

  const Table = useTable("sales_order", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    tableRef.current = Table;
  }, [Table]);

  const closeConfirmModal = useCallback(() => {
    setSelectedRow(null);
  }, []);

  const handleConfirmPublish = useCallback(async () => {
    if (!selectedRow) return;
    await publishItem({ id: selectedRow.id });
  }, [selectedRow, publishItem]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteRow) return;
    await removeItem({ id: deleteRow.id });
  }, [deleteRow, removeItem]);

  useEffect(() => {
    if (removeResult?.isSuccess) {
      showToast({
        message: "Order berhasil dihapus",
        type: "success",
        position: "bottom-center",
      });
      setDeleteRow(null);
      removeResult.reset?.();
      tableRef.current?.boot();
    }
  }, [removeResult?.isSuccess, showToast, removeResult]);

  useEffect(() => {
    if (publishResult?.isSuccess) {
      showToast({
        message: "Order berhasil diterbitkan",
        type: "success",
        position: "bottom-center",
      });
      closeConfirmModal();
      publishResult.reset?.();
      tableRef.current?.boot();
    }
  }, [publishResult?.isSuccess, closeConfirmModal, publishResult, showToast]);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Produksi'
        title='Central Kitchen'
        subtitle='Kelola order pengadaan dari central kitchen ke seluruh outlet.'
        action={
          canManage &&
          isSuperuser && (
            <Button
              variant='primary'
              shape='wide'
              size='md'
              onClick={() => navigate("/central-kitchen/create")}
            >
              <Plus className='w-4 h-4 mr-2' />
              Tambah Order
            </Button>
          )
        }
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle='Belum Ada Data Order'
          emptyDescription='Data order akan muncul di sini setelah tersedia.'
        />
        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper
        open={!!selectedRow}
        onClose={closeConfirmModal}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className='font-bold leading-7'>Konfirmasi Publish</div>
        </Modal.Header>
        <Modal.Body className='text-sm font-normal leading-5 space-y-4'>
          <p>
            Apakah Anda yakin ingin menerbitkan order{" "}
            <strong>{selectedRow?.code}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='flex-1 rounded-xl'
            variant='primary'
            onClick={handleConfirmPublish}
            isLoading={publishResult?.isLoading}
          >
            Konfirmasi
          </Button>
          <Button
            className='flex-1 rounded-xl'
            styleType='outline'
            variant='secondary'
            onClick={closeConfirmModal}
            disabled={publishResult?.isLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>

      <Modal.Wrapper
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className='font-bold leading-7'>Hapus Order</div>
        </Modal.Header>
        <Modal.Body className='text-sm font-normal leading-5 space-y-4'>
          <p>
            Apakah Anda yakin ingin menghapus order{" "}
            <strong>{deleteRow?.code}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='flex-1 rounded-xl'
            variant='error'
            onClick={handleConfirmDelete}
            isLoading={removeResult?.isLoading}
          >
            Confirm
          </Button>
          <Button
            className='flex-1 rounded-xl'
            styleType='outline'
            variant='secondary'
            onClick={() => setDeleteRow(null)}
            disabled={removeResult?.isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}
