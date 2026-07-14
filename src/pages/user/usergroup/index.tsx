import { useMemo, useCallback } from "react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/group.config";
import { useNavigate } from "react-router-dom";

const UserGroupListPage: React.FC = () => {
  useDocumentMeta("User Group | Sukabread Franchisee", "");
  const navigate = useNavigate();

  const tableConfig = useMemo(() => createTableConfig(), []);
  const Table = useTable("user-group-list", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="User Group"
        subtitle="Kelola grup pengguna."
        action={
          <Button variant="primary" onClick={() => navigate("/user/group/create")}>
            + Tambah Grup
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render emptyTitle="Data Tidak Ditemukan" emptyDescription="Belum ada grup user." />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
};

export default UserGroupListPage;
