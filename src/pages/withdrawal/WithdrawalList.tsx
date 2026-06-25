import { useMemo, useCallback } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/withdrawal.config";
import type { WithdrawalRequest } from "@/services/types";
import { useNavigate } from "react-router-dom";

export function WithdrawalList() {
  useDocumentMeta("Permintaan Penarikan | Sukabread Franchisee", "");
  const navigate = useNavigate();

  const handleView = useCallback(
    (row: WithdrawalRequest) => {
      navigate(`/withdrawal/${row.id}`);
    },
    [navigate],
  );

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onView: handleView,
    });
  }, [handleView]);

  const Table = useTable(
    "withdrawal-list",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Withdrawal"
        title="Permintaan Penarikan"
        subtitle="Kelola permintaan penarikan saldo outlet."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada permintaan penarikan."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
