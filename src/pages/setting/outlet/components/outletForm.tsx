/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useOutletType } from "@/services/outlet/hooks";
import type {
  OutletCreateRequest,
  OutletTypeDetail,
} from "@/services/types/outlet";
import { Input, RemoteSelect } from "@/components";
import { useRegion } from "@/services/region/hooks";
import { useAppSelector } from "@/hooks";

interface OutletFormProps {
  id?: string;
  initialData?: any;
  onSubmit: (data: OutletCreateRequest) => void;
}

export const OutletForm: React.FC<OutletFormProps> = ({
  id = "outlet-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getTypes, getResult: typesResult } = useOutletType();
  const { get: getProvinces, getResult: provincesResult } = useRegion();

  const [formData, setFormData] = useState<OutletCreateRequest>({
    outlet_type_id: "",
    name: "",
    recipient_name: "",
    phone: "",
    address: "",
    region_id: "",
    service_charges: 0,
    owner_name: "",
    owner_username: "",
    owner_password: "",
    channels: [],
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
          <RemoteSelect<OutletTypeDetail>
            label='Tipe Outlet'
            required
            hook={typesResult as any}
            fetchData={(page, search) => getTypes({ page, search })}
            getLabel={(item: any) => item?.name}
            renderItem={(item: any) => item?.name}
            value={
              formData.outlet_type_id
                ? (typesResult.data as any)?.data?.find(
                    (t: any) => t.id === formData.outlet_type_id,
                  )
                : null
            }
            onChange={(item: any) =>
              setFormData({ ...formData, outlet_type_id: item?.id })
            }
            onClear={() => setFormData({ ...formData, outlet_type_id: "" })}
            placeholder='Pilih tipe outlet'
            error={FormState?.errors?.outlet_type_id as string}
          />
          <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5'>
            <Input
              label='No. Telepon Outlet'
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder='Contoh: 022123456'
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
        </div>
      </div>

      {/* Section 2: Informasi PIC & Kredensial Owner */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div
          className='bg-white border border-slate-200 rounded-xl relative shadow-sm'
          style={{ overflow: "visible", zIndex: 15 }}
        >
          <div className='px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl'>
            <h2 className='text-sm font-bold text-slate-700 uppercase tracking-wider'>
              Person In Charge (PIC)
            </h2>
          </div>
          <div className='p-5 space-y-4'>
            <Input
              label='Nama Penerima'
              required
              value={formData.recipient_name}
              onChange={(e) =>
                setFormData({ ...formData, recipient_name: e.target.value })
              }
              placeholder='Contoh: Budi Santoso'
              error={FormState?.errors?.recipient_name as string}
            />
            <Input
              label='No. Telepon PIC'
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder='Contoh: 081234567890'
              error={FormState?.errors?.phone as string}
            />
          </div>
        </div>

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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
      </div>

      {/* Section 3: Regional & Alamat */}
      <div
        className='bg-white border border-slate-200 rounded-xl relative shadow-sm'
        style={{ overflow: "visible", zIndex: 10 }}
      >
        <div className='px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl'>
          <h2 className='text-sm font-bold text-slate-700 uppercase tracking-wider'>
            Regional & Lokasi
          </h2>
        </div>
        <div className='p-5 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <RemoteSelect
              label='Provinsi'
              required
              hook={provincesResult as any}
              fetchData={(page, search) => getProvinces({ page, q: search })}
              getLabel={(item) => formatRegion(item)}
              renderItem={(item) => formatRegion(item)}
              value={
                formData.region_id
                  ? (provincesResult.data as any)?.data?.find(
                      (p: any) => p.id === formData.region_id,
                    )
                  : null
              }
              onChange={(item: any) =>
                setFormData({ ...formData, region_id: item?.id })
              }
              onClear={() => setFormData({ ...formData, region_id: "" })}
              placeholder='Pilih Provinsi'
              error={FormState?.errors?.region_id as string}
            />
          </div>
          <div className='space-y-1'>
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
      </div>
    </form>
  );
};
