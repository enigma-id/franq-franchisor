/* eslint-disable react-hooks/set-state-in-effect */
import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Modal } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/return.config";
import type { TableConfig } from "@/services/table/const";
import type { SalesReturnDetail } from "@/services/types";
import { useSalesReturn } from "@/services/sales/hooks";

const SalesReturnListPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { approve, approveResult } = useSalesReturn();
  const [selectedRow, setSelectedRow] = useState<SalesReturnDetail | null>(
    null,
  );
  const tableRef = useRef<ReturnType<typeof useTable> | null>(null);

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onView: (id) => navigate(`/sales/return/detail/${id}`),
        onApprove: (row) => setSelectedRow(row),
      }),
    [navigate],
  );

  const Table = useTable("sales_return", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    tableRef.current = Table;
  }, [Table]);

  const closeConfirmModal = useCallback(() => {
    setSelectedRow(null);
  }, []);

  const handleConfirmApprove = useCallback(async () => {
    if (!selectedRow) return;
    await approve({ id: selectedRow.id });
  }, [selectedRow, approve]);

  useEffect(() => {
    if (approveResult?.isSuccess) {
      showToast({
        message: "Return berhasil disetujui",
        type: "success",
        position: "bottom-center",
      });
      closeConfirmModal();
      approveResult.reset?.();
      tableRef.current?.boot();
    }
  }, [approveResult?.isSuccess]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Daftar Return Penjualan"
        subtitle="Kelola pengembalian barang dari transaksi penjualan."
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />

        <Table.Render
          emptyTitle="Belum Ada Return"
          emptyDescription="Daftar return penjualan akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper
        open={!!selectedRow}
        onClose={closeConfirmModal}
        closeOnOutsideClick={false}
      >
        <Modal.Header>
          <div className="font-bold leading-7">Konfirmasi Approve</div>
        </Modal.Header>
        <Modal.Body className="text-sm font-normal leading-5">
          <p>
            Apakah Anda yakin ingin menyetujui return{" "}
            <strong>{selectedRow?.number}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="flex-1 rounded-xl"
            variant="primary"
            onClick={handleConfirmApprove}
            isLoading={approveResult?.isLoading}
          >
            Konfirmasi
          </Button>
          <Button
            className="flex-1 rounded-xl"
            styleType="outline"
            variant="secondary"
            onClick={closeConfirmModal}
            disabled={approveResult?.isLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default SalesReturnListPage;
