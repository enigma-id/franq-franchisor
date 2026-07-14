import { useMemo, useCallback } from "react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/user.config";
import type { UserDetail } from "@/services/types";
import TableFilter from "./table/user.filter";
import { useNavigate } from "react-router-dom";

const UserListPage: React.FC = () => {
  useDocumentMeta("User | Sukabread Franchisee", "");
  const navigate = useNavigate();

  const handleView = useCallback(
    (row: UserDetail) => navigate(`/user/update/${row.id}`),
    [navigate],
  );

  const tableConfig = useMemo(
    () => createTableConfig({ onView: handleView }),
    [handleView],
  );
  const Table = useTable("user-list", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="User"
        subtitle="Kelola pengguna sistem."
        action={
          <Button variant="primary" onClick={() => navigate("/user/create")}>
            + Tambah User
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada user."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default UserListPage;
