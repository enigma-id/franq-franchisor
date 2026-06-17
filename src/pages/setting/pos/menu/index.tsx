import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/menu.config";
import TableFilter from "./table/menu.filter";
import type { TableConfig } from "@/services/table/const";

const POSMenuListPage: React.FC = () => {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onEdit: (id) => navigate(`/setting/pos/menu/update/${id}`),
      }),
    [navigate],
  );

  const Table = useTable("pos-menu-list", tableConfig as TableConfig);

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
