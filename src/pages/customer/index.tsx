/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UserPlus, Contact, Save } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button, Drawer, Modal } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/customer.config";
import type { CustomerDetail } from "@/services/types/customer";
import TableFilter from "./table/customer.filter";
import { useEnigmaUI } from "@/components";
import { useCustomer } from "@/services/customer/hooks";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import {
  CustomerForm,
  type CustomerFormData,
} from "./components/customerForm";

type DrawerMode = "create" | "edit";

const CustomerListPage: React.FC = () => {
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.b2b);

  const {
    create,
    createResult,
    update,
    updateResult,
    show,
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useCustomer();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editRow, setEditRow] = useState<CustomerDetail | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [deleteRow, setDeleteRow] = useState<CustomerDetail | null>(null);

  const handleToggleActive = useCallback(
    (v: any) => {
      if (v.is_active) {
        deactivate({ id: v.id as string });
      } else {
        activate({ id: v.id as string });
      }
    },
    [activate, deactivate],
  );

  const openCreate = useCallback(() => {
    setDrawerMode("create");
    setEditRow(null);
    setEditData(null);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditRow(null);
    setEditData(null);
    createResult.reset?.();
    updateResult.reset?.();
  }, [createResult, updateResult]);

  const openEdit = useCallback(
    async (row: CustomerDetail) => {
      setDrawerMode("edit");
      setEditRow(row);
      setDrawerOpen(true);
      try {
        const res = await show({ id: row.id });
        setEditData((res as any)?.data ?? row);
      } catch {
        setEditData(row);
      }
    },
    [show],
  );

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => openEdit(row),
        onRemove: (row: any) => setDeleteRow(row),
        onToggleActive: (row: any) => handleToggleActive(row),
        canManage,
      }),
    [openEdit, handleToggleActive, canManage],
  );

  const Table = useTable<CustomerDetail>("customer-list", tableConfig as any);

  const handleCreate = useCallback(
    async (data: CustomerFormData) => {
      create(data as any);
    },
    [create],
  );

  const handleUpdate = useCallback(
    async (data: CustomerFormData) => {
      if (!editRow) return;
      update({ id: editRow.id, payload: data as any });
    },
    [editRow, update],
  );

  const handleDelete = useCallback(() => {
    if (!deleteRow) return;
    remove({ id: deleteRow.id });
  }, [deleteRow, remove]);

  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "Customer berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      createResult.reset?.();
    }
  }, [createResult, showToast, closeDrawer, Table]);

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Customer berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeDrawer();
      Table.boot();
      updateResult.reset?.();
    }
  }, [updateResult, showToast, closeDrawer, Table]);

  useEffect(() => {
    if (removeResult?.isSuccess) {
      showToast({
        message: "Customer berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      setDeleteRow(null);
      Table.boot();
      removeResult.reset?.();
    }
  }, [removeResult, showToast, Table]);

  useEffect(() => {
    if (activateResult?.isSuccess) {
      showToast({
        message: "Customer berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateResult.reset?.();
    }
  }, [activateResult, showToast, Table]);

  useEffect(() => {
    if (deactivateResult?.isSuccess) {
      showToast({
        message: "Customer berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [deactivateResult, showToast, Table]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Customer"
        subtitle="Kelola data customer untuk transaksi B2B."
        action={
          canManage && (
            <Button variant="primary" onClick={openCreate}>
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah Customer
            </Button>
          )
        }
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Data Customer"
          emptyDescription="Data customer akan muncul di sini setelah ditambahkan."
        />

        <Table.Pagination />
      </Page.Body>

      {/* Drawer: tambah / edit customer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        position="right"
        className="!w-[30rem]"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Contact size={18} className="text-primary" />
              {drawerMode === "create" ? "Tambah Customer" : "Edit Customer"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {drawerMode === "create"
                ? "Daftarkan customer baru untuk transaksi B2B."
                : "Perbarui data customer."}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <CustomerForm
              id={
                drawerMode === "create"
                  ? "customer-create-form"
                  : "customer-edit-form"
              }
              initialData={drawerMode === "edit" ? (editData ?? editRow) : null}
              onSubmit={drawerMode === "create" ? handleCreate : handleUpdate}
            />
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="secondary" onClick={closeDrawer}>
              Batal
            </Button>
            <Button
              type="submit"
              form={
                drawerMode === "create"
                  ? "customer-create-form"
                  : "customer-edit-form"
              }
              variant="success"
              isLoading={
                drawerMode === "create"
                  ? createResult?.isLoading
                  : updateResult?.isLoading
              }
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Modal konfirmasi hapus */}
      <Modal.Wrapper
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        closeOnOutsideClick={false}
      >
        <Modal.Header>Hapus Customer</Modal.Header>
        <Modal.Body>
          <p className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus customer{" "}
            <strong>{deleteRow?.name}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteRow(null)}>
            Batal
          </Button>
          <Button
            variant="error"
            onClick={handleDelete}
            isLoading={removeResult?.isLoading}
          >
            Hapus
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default CustomerListPage;
