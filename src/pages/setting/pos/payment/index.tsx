/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import useTable from "@/services/table/hooks";
import createTableConfig from "./table/payment.config";
import type { TableConfig } from "@/services/table/const";
import { useAppSelector } from "@/hooks";
import {
  Checkbox,
  Input,
  Loading,
  Modal,
  RemoteSelect,
  useEnigmaUI,
} from "@/components";
import { usePaymentMethod } from "@/services/payment-method/hooks";
import type { SelectOptionValue } from "@/services/types/table";
import { getOptionByValue } from "@/utils/helper";

const providerOptions = {
  franchise: [
    { label: "QRIS", value: "qris" },
    { label: "Midtrans", value: "midtrans" },
    { label: "Manual", value: "manual" },
    { label: "Saldo", value: "saldo" },
    { label: "Other", value: "other" },
  ],
  pos: [
    { label: "Cash", value: "cash" },
    { label: "QRIS", value: "qris" },
    { label: "Midtrans", value: "midtrans" },
    { label: "Other", value: "other" },
    { label: "Manual", value: "manual" },
  ],
};

const bankOptions = [
  { label: "BCA", value: "BCA" },
  { label: "Mandiri", value: "Mandiri" },
  { label: "BNI", value: "BNI" },
  { label: "BRI", value: "BRI" },
];

const typeOptions = [
  { label: "POS", value: "pos" },
  { label: "Franchise", value: "franchise" },
];

const PaymentMethodListPage: React.FC = () => {
  const FormState = useAppSelector((s) => s.form);
  const { openModal, closeModal, showToast } = useEnigmaUI();

  const {
    create,
    createResult,
    update,
    updateResult,
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = usePaymentMethod();

  const { isLoading: isCreating, isSuccess: isCreateSuccess } = createResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;
  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    account_name: "",
    account_number: "",
    is_member_payment: false,
  });

  const [provider, setProvider] = useState<SelectOptionValue | null>(null);

  const [type, setType] = useState<SelectOptionValue | null>(null);

  useEffect(() => {
    // Jalankan jika mode create ATAU jika provider diubah secara manual saat mode edit
    if (provider?.value) {
      if (provider?.value === "cash") {
        setType(getOptionByValue(typeOptions, "pos"));
        setFormData((prev) => ({
          ...prev,
          name: "Cash",
          account_name: "",
          account_number: "",
        }));
      } else if (provider?.value === "saldo") {
        setType(getOptionByValue(typeOptions, "franchise"));
        setFormData((prev) => ({
          ...prev,
          name: "Saldo",
          account_name: "",
          account_number: "",
        }));
      } else if (provider?.value === "qris") {
        setFormData((prev) => ({
          ...prev,
          name: "QRIS",
          account_name: "",
          account_number: "",
        }));
      } else if (
        provider?.value === "manual" ||
        provider?.value === "midtrans" ||
        provider?.value === "other"
      ) {
        // Jangan reset name jika sedang mode edit dan provider-nya belum diubah user
        // (opsional: bisa dikondisikan lagi jika ingin mempertahankan nilai lama)
      }
    }

    if (!editingItem) {
      setFormData((prev) => ({ ...prev, is_member_payment: false }));
    }
  }, [provider?.value, editingItem]);

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: any) => {
          setEditingItem(row);
          setFormData({
            name: row?.name ?? "",
            account_name: row?.account_name ?? "",
            account_number: row?.account_number ?? "",
            is_member_payment: row?.is_member_payment ?? false,
          });

          // Ambil provider berdasarkan type dari row
          const selectedType = row?.type as keyof typeof providerOptions;
          const availableProviders = providerOptions[selectedType] || [];
          setProvider(getOptionByValue(availableProviders, row?.provider));

          setType(getOptionByValue(typeOptions, row?.type));
          setModalOpen(true);
        },
        onRemove: (row: any) => {
          openDelete(row);
        },
        onToggleActive: (row: any) => handleToggleActive(row),
      }),
    [],
  );

  const Table = useTable(
    "payment-method-list",
    tableConfig as TableConfig<unknown>,
  );

  useEffect(() => {
    if (isCreateSuccess) {
      showToast({
        message: "Metode pembayaran berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      createResult.reset?.();
      Table.boot();
    }
  }, [isCreateSuccess, createResult, Table]);

  useEffect(() => {
    if (isUpdateSuccess) {
      showToast({
        message: "Metode pembayaran berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      handleCloseModal();
      updateResult.reset?.();
      Table.boot();
    }
  }, [isUpdateSuccess, Table, updateResult]);

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-payment");
      showToast({
        message: "Metode pembayaran berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess, Table, removeResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      showToast({
        message: "Metode pembayaran berhasil diaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      activateResult.reset?.();
    }
  }, [isActivateSuccess, Table, activateResult]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      showToast({
        message: "Metode pembayaran berhasil dinonaktifkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      Table.boot();
      deactivateResult.reset?.();
    }
  }, [isDeactivateSuccess, Table, deactivateResult]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      account_name: "",
      account_number: "",
      is_member_payment: false,
    });
    setProvider(null);
    setType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      provider: provider?.value,
      type: type?.value,
    };

    if (editingItem) {
      update({ id: editingItem.id, payload });
    } else {
      create(payload);
    }
  };

  const openDelete = (row: any) => {
    openModal({
      id: "delete-payment",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-payment")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className='font-bold text-lg text-slate-900 leading-7'>
              Hapus Metode Pembayaran
            </div>
          </Modal.Header>
          <Modal.Body className='text-sm font-normal text-slate-600 leading-5'>
            <p>
              Apakah Anda yakin ingin menghapus metode pembayaran{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <Button
              className='flex-1 rounded-xl'
              variant='error'
              onClick={() => handleDelete(row)}
              isLoading={isDeleting}
            >
              Hapus
            </Button>
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("delete-payment")}
              disabled={isDeleting}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const handleDelete = (row: any) => {
    if (row?.id) {
      remove({ id: row.id });
    }
  };

  const onChangeType = (t: any) => {
    setType(t);

    setFormData({
      name: "",
      account_name: "",
      account_number: "",
      is_member_payment: false,
    });
    setProvider(null);
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Settings'
        title='Metode Pembayaran'
        subtitle='Kelola metode pembayaran yang tersedia di POS.'
        action={
          <Button
            variant='primary'
            shape='wide'
            size='md'
            onClick={() => setModalOpen(true)}
          >
            <Plus size={18} />
            Tambah Metode
          </Button>
        }
      />

      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools />

        <Table.Render
          emptyTitle='Belum Ada Metode'
          emptyDescription='Daftar metode pembayaran yang Anda buat akan muncul di sini.'
        />

        <Table.Pagination />
      </Page.Body>

      <Modal.Wrapper open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>
          <div className='flex flex-col text-left'>
            <span className='text-lg font-bold text-slate-900'>
              {editingItem ? "Ubah Metode" : "Tambah Metode"}
            </span>
            <span className='text-xs text-slate-500 font-medium mt-0.5'>
              {editingItem
                ? "Ubah detail metode pembayaran."
                : "Buat metode pembayaran baru."}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className='pt-4 pb-2 text-left'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <RemoteSelect<SelectOptionValue>
                required
                label='Type'
                suffix={<ChevronDown className='text-gray-400 w-4 h-4' />}
                data={typeOptions}
                value={type}
                onChange={(val) => {
                  onChangeType(val);
                }}
                onClear={() => {
                  setType(null);
                }}
                getLabel={(item) => item.label ?? ""}
                renderItem={(item) => item.label ?? ""}
                error={FormState?.errors?.type as string}
              />

              {type && (
                <>
                  <RemoteSelect<SelectOptionValue>
                    required
                    label='Provider'
                    suffix={<ChevronDown className='text-gray-400 w-4 h-4' />}
                    data={
                      type?.value
                        ? providerOptions[
                            type.value as keyof typeof providerOptions
                          ]
                        : []
                    }
                    value={provider}
                    onChange={(val) => {
                      setProvider(val);
                    }}
                    onClear={() => {
                      setProvider(null);
                      setFormData((prev) => ({ ...prev, name: "" }));
                    }}
                    getLabel={(item) => item.label ?? ""}
                    renderItem={(item) => item.label ?? ""}
                    error={FormState?.errors?.provider as string}
                  />

                  {provider?.value === "manual" ||
                  provider?.value === "midtrans" ? (
                    <RemoteSelect<SelectOptionValue>
                      required
                      label='Nama Metode'
                      suffix={<ChevronDown className='text-gray-400 w-4 h-4' />}
                      data={bankOptions}
                      value={getOptionByValue(bankOptions, formData.name)}
                      onChange={(val) => {
                        setFormData((prev) => ({
                          ...prev,
                          name: (val?.value as string) ?? "",
                        }));
                      }}
                      onClear={() => {
                        setFormData((prev) => ({ ...prev, name: "" }));
                      }}
                      getLabel={(item) => item.label ?? ""}
                      renderItem={(item) => item.label ?? ""}
                      error={FormState?.errors?.name as string}
                    />
                  ) : (
                    <Input
                      label='Nama Metode'
                      required
                      value={formData.name}
                      disabled={
                        provider?.value === "cash" || provider?.value === "qris"
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder={
                        provider?.value === "other"
                          ? "Masukkan nama metode"
                          : "Auto-filled"
                      }
                      variant='primary'
                      error={FormState?.errors?.name as string}
                    />
                  )}
                </>
              )}
            </div>

            {provider?.value === "manual" && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  label='Account Name'
                  required
                  value={formData.account_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      account_name: e.target.value,
                    }))
                  }
                  variant='primary'
                  error={FormState?.errors?.account_name as string}
                />
                <Input
                  label='Account Number'
                  required
                  value={formData.account_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      account_number: e.target.value,
                    }))
                  }
                  variant='primary'
                  error={FormState?.errors?.account_number as string}
                />
              </div>
            )}

            {provider?.value === "other" && (
              <Checkbox
                label='Member Payment ?'
                checked={formData.is_member_payment}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    is_member_payment: e.target.checked,
                  }));
                  if (e.target.checked) {
                    setType(getOptionByValue(typeOptions, "pos"));
                  }
                }}
                variant='primary'
              />
            )}
          </form>
        </Modal.Body>

        <Modal.Footer className='flex justify-end gap-2 pt-4'>
          <Button
            onClick={handleCloseModal}
            variant='secondary'
            disabled={isCreating || isUpdating}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            variant='success'
          >
            {isCreating || isUpdating ? (
              <Loading size='sm' variant='spinner' />
            ) : (
              <>
                <Plus className='w-4 h-4 mr-2' />
                {editingItem ? "Simpan Perubahan" : "Simpan Metode"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default PaymentMethodListPage;
