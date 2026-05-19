import { Page } from "@/components/app/layout";
import { useEffect, useMemo } from "react";
import createTableConfig from "./table/outlet.config";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@/components/ui";
import { Plus } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useOutlet } from "@/services/outlet/hooks";

export function OutletPage() {
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { remove: removeOutlet, removeResult: removeOutletResult } =
    useOutlet();

  const tableConfig = useMemo(() => createTableConfig({
    onClick: (row: any) => navigate(`/setting/outlet/update/${row.id}`),
    onRemove: (row: any) => openDelete(row),
  }), [navigate]);

  const Table = useTable("setting_outlet", tableConfig as TableConfig<unknown>);

  const openDelete = (v: any) => {
    openModal({
      id: "delete-outlet",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-outlet")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold! leading-7">Delete Outlet</div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal leading-5">
            <p>Are you sure you want to delete outlet "{v?.name}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => handleDelete(v)}
              isLoading={removeOutletResult?.isLoading}
            >
              Confirm
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-outlet")}
              disabled={removeOutletResult?.isLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (v: any) => {
    if (v) {
      removeOutlet({ id: v?.id as string });
    }
  };

  useEffect(() => {
    if (removeOutletResult?.isSuccess) {
      closeModal("delete-outlet");
      Table.boot();
    }
  }, [removeOutletResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="Outlet"
        subtitle="Daftar outlet franchise."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/setting/outlet/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Outlet
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable />
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data outlet akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default OutletPage;
