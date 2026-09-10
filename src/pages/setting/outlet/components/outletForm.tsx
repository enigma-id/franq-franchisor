/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { OutletCreateRequest } from "@/services/types/outlet";
import { Input } from "@/components";
import { useAppSelector } from "@/hooks";

interface OutletFormProps {
  id?: string;
  initialData?: any;
  /** Sembunyikan section Akun Pemilik — dipakai di mode update (user dikelola via drawer User). */
  hideOwnerSection?: boolean;
  /** Brand/franchisor default saat create (mis. dari detail franchise). */
  defaultFranchisorId?: string;
  onSubmit: (data: OutletCreateRequest) => void;
}

export const OutletForm: React.FC<OutletFormProps> = ({
  id = "outlet-form",
  initialData,
  hideOwnerSection = false,
  defaultFranchisorId,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);

  const [formData, setFormData] = useState<OutletCreateRequest>({
    name: "",
    recipient_name: "",
    phone: "",
    address: "",
    service_charges: 0,
    owner_name: "",
    owner_username: "",
    owner_password: "",
    channels: [],
    franchisor_id: defaultFranchisorId || undefined,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className='space-y-6'>
      {/* Section 1: Informasi Utama */}
      <div
        className='bg-white border border-slate-200 rounded-xl relative shadow-sm'
        style={{ overflow: "visible", zIndex: 20 }}
      >
        <div className='px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl'>
          <h2 className='text-sm font-bold text-slate-700 uppercase tracking-wider'>
            Informasi Utama
          </h2>
        </div>
        <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Input
            label='Nama Outlet'
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Contoh: Suka Bread Express Bandung'
            error={FormState?.errors?.name as string}
          />

          <Input
            label='Nama PIC'
            required
            value={formData.recipient_name}
            onChange={(e) =>
              setFormData({ ...formData, recipient_name: e.target.value })
            }
            placeholder='Contoh: Budi Santoso'
            error={FormState?.errors?.recipient_name as string}
          />
          <Input
            label='No. Telepon'
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder='Contoh: 081234567890'
            error={FormState?.errors?.phone as string}
          />
          <Input
            label='Biaya Layanan (%)'
            type='number'
            required
            value={formData.service_charges}
            onChange={(e) =>
              setFormData({
                ...formData,
                service_charges: Number(e.target.value),
              })
            }
            error={FormState?.errors?.service_charges as string}
          />
        </div>

        {/* Alamat (di dalam Informasi Utama) */}
        <div className='px-5 pb-5'>
          <Input
            type='textarea'
            label='Alamat Lengkap'
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder='Contoh: Jl. Diponegoro No. 22'
            error={FormState?.errors?.address as string}
          />
        </div>
      </div>

      {/* Section 2: Akun Pemilik (hanya saat create) */}
      {!hideOwnerSection && (
        <div
          className='bg-white border border-slate-200 rounded-xl relative shadow-sm'
          style={{ overflow: "visible", zIndex: 15 }}
        >
          <div className='px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl'>
            <h2 className='text-sm font-bold text-slate-700 uppercase tracking-wider'>
              Akun Pemilik (Owner Credentials)
            </h2>
          </div>
          <div className='p-5 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Nama Pemilik'
                required
                value={formData.owner_name}
                onChange={(e) =>
                  setFormData({ ...formData, owner_name: e.target.value })
                }
                placeholder='Contoh: Budi Pemilik'
                error={FormState?.errors?.owner_name as string}
              />
              <Input
                label='Username'
                required
                value={formData.owner_username}
                onChange={(e) =>
                  setFormData({ ...formData, owner_username: e.target.value })
                }
                placeholder='Contoh: budi_sukabread'
                error={FormState?.errors?.owner_username as string}
              />
              <Input
                label='Password'
                type='password'
                required={!initialData}
                value={formData.owner_password}
                onChange={(e) =>
                  setFormData({ ...formData, owner_password: e.target.value })
                }
                placeholder='********'
                error={FormState?.errors?.owner_password as string}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
