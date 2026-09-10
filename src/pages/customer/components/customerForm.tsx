/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { useAppSelector } from "@/hooks";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useIsSuperuser } from "@/utils/permission";
import type { FranchisorRow } from "@/services/types/franchisor";

export interface CustomerFormData extends Record<string, unknown> {
  franchisor_id?: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  note: string;
}

interface CustomerFormProps {
  id?: string;
  initialData?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void;
}

export function CustomerForm({
  id = "customer-form",
  initialData,
  onSubmit,
}: CustomerFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const isSuperuser = useIsSuperuser();
  const { get: getFranchisors, getResult: franchisorsResult } =
    useFranchisorList();

  // Mode create → superuser wajib memilih brand (backend menolak bila kosong).
  const isCreateMode = !initialData;

  const [franchise, setFranchise] = useState<FranchisorRow | null>(null);

  const [formData, setFormData] = useState<CustomerFormData>({
    franchisor_id: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        franchisor_id: initialData.franchisor_id ?? "",
        name: initialData.name ?? "",
        phone: initialData.phone ?? "",
        address: initialData.address ?? "",
        email: initialData.email ?? "",
        note: initialData.note ?? "",
      });

      const initialFranchise = (initialData as any)?.franchisor ?? null;
      if (initialFranchise?.id) setFranchise(initialFranchise);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      // Hanya dikirim saat create; backend PUT customer tidak menerima franchisor_id.
      franchisor_id: isCreateMode ? franchise?.id || undefined : undefined,
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className='space-y-4'>
      {isSuperuser && isCreateMode && (
        <RemoteSelect<FranchisorRow>
          label='Franchise'
          required
          placeholder='Pilih Franchise...'
          value={franchise}
          hook={franchisorsResult as any}
          fetchData={(page, search) => getFranchisors({ page, search })}
          getLabel={(item: any) => item?.name || ""}
          renderItem={(item: any) =>
            item
              ? `${item.name} (${item.type === "mitra" ? "Mitra" : "Outlet"})`
              : ""
          }
          onChange={(item: FranchisorRow | null) => {
            setFranchise(item);
            setFormData((prev) => ({
              ...prev,
              franchisor_id: item?.id ?? "",
            }));
          }}
          onClear={() => {
            setFranchise(null);
            setFormData((prev) => ({ ...prev, franchisor_id: "" }));
          }}
          error={FormState?.errors?.franchisor_id as string}
        />
      )}
      <Input
        label='Nama Customer'
        required
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder='Contoh: Budi Santoso'
        variant='primary'
        error={FormState?.errors?.name as string}
      />
      <Input
        label='No. Telepon'
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, phone: e.target.value }))
        }
        placeholder='Contoh: 081234567890'
        variant='primary'
        error={FormState?.errors?.phone as string}
      />
      <Input
        label='Email'
        type='email'
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder='Contoh: budi@email.com'
        variant='primary'
        error={FormState?.errors?.email as string}
      />
      <div>
        <div className='flex items-center gap-1.5 mb-1'>
          <label className='text-xs font-bold text-slate-600 uppercase'>
            Alamat Lengkap
          </label>
        </div>
        <textarea
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder='Contoh: Jl. Diponegoro No. 22, Jakarta Pusat'
          className={`w-full min-h-17.5 px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all ${
            FormState?.errors?.address
              ? "border-rose-500 focus:border-rose-500 bg-rose-50/20"
              : "border-slate-200 focus:border-emerald-500"
          }`}
        />
        <div className='text-xs mt-0.5'>
          <span className='text-rose-500 font-medium'>
            {FormState?.errors?.address as string}
          </span>
        </div>
      </div>
      <div>
        <div className='flex items-center gap-1.5 mb-1'>
          <label className='text-xs font-bold text-slate-600 uppercase'>
            Catatan
          </label>
        </div>
        <textarea
          value={formData.note}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, note: e.target.value }))
          }
          placeholder='Catatan internal customer (opsional)'
          className={`w-full min-h-17.5 px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all ${
            FormState?.errors?.note
              ? "border-rose-500 focus:border-rose-500 bg-rose-50/20"
              : "border-slate-200 focus:border-emerald-500"
          }`}
        />
        <div className='text-xs mt-0.5'>
          <span className='text-rose-500 font-medium'>
            {FormState?.errors?.note as string}
          </span>
        </div>
      </div>
    </form>
  );
}

export default CustomerForm;
