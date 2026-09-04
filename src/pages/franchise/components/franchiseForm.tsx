/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { FranchiseCreateRequest } from "@/services/types/franchise";
import type { OutletTypeDetail } from "@/services/types/outlet";
import { Input, RemoteSelect } from "@/components";
import { useAppSelector } from "@/hooks";
import { useOutletType } from "@/services/outlet/hooks";

interface FranchiseFormProps {
  id?: string;
  initialData?: any;
  /** Sembunyikan section Akun Pemilik — dipakai di mode update (akun pemilik dikelola terpisah). */
  hideOwnerSection?: boolean;
  onSubmit: (data: FranchiseCreateRequest) => void;
}

export const FranchiseForm: React.FC<FranchiseFormProps> = ({
  id = "franchise-form",
  initialData,
  hideOwnerSection = false,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getTypes, getResult: typesResult } = useOutletType();

  const [formData, setFormData] = useState<FranchiseCreateRequest>({
    name: "",
    outlet_type_id: "",
    address: "",
    phone: "",
    email: "",
    logo_url: "",
    owner_name: "",
    owner_username: "",
    owner_password: "",
  });

  const [outletTypeValue, setOutletTypeValue] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        outlet_type_id: initialData.outlet_type_id ?? "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        email: initialData.email ?? "",
        logo_url: initialData.logo_url ?? "",
        owner_name: initialData.owner_name ?? "",
        owner_username: initialData.owner_username ?? "",
        owner_password: initialData.owner_password ?? "",
      });
      setOutletTypeValue(
        initialData?.outlet_type?.id
          ? initialData.outlet_type
          : initialData?.outlet_type_id
            ? { id: initialData.outlet_type_id }
            : null,
      );
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div
        className={
          hideOwnerSection
            ? "grid grid-cols-1 gap-6"
            : "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
        }
      >
        {/* Informasi Utama + Alamat */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Informasi Utama
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nama Franchise"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Suka Bread"
              error={FormState?.errors?.name as string}
            />

            <RemoteSelect<OutletTypeDetail>
              label="Tipe"
              required
              hook={typesResult as any}
              fetchData={(page, search) => getTypes({ page, search })}
              getLabel={(item: any) => item?.name}
              renderItem={(item: any) => item?.name}
              value={outletTypeValue}
              onChange={(item: any) => {
                setOutletTypeValue(item);
                setFormData({ ...formData, outlet_type_id: item?.id ?? "" });
              }}
              onClear={() => {
                setOutletTypeValue(null);
                setFormData({ ...formData, outlet_type_id: "" });
              }}
              placeholder="Pilih tipe"
              error={FormState?.errors?.outlet_type_id as string}
            />

            <Input
              label="No. Telepon"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Contoh: 081234567890"
              error={FormState?.errors?.phone as string}
            />

            <div className="md:col-span-2">
              <Input
                type="textarea"
                label="Alamat Lengkap"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Contoh: Jl. Diponegoro No. 22"
                error={FormState?.errors?.address as string}
              />
            </div>
          </div>
        </div>

        {/* Akun Pemilik */}
        {!hideOwnerSection && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Akun Pemilik (Owner Credentials)
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <Input
                label="Nama Pemilik"
                required
                value={formData.owner_name}
                onChange={(e) =>
                  setFormData({ ...formData, owner_name: e.target.value })
                }
                placeholder="Contoh: Budi Pemilik"
                error={FormState?.errors?.owner_name as string}
              />
              <Input
                label="Username"
                required
                value={formData.owner_username}
                onChange={(e) =>
                  setFormData({ ...formData, owner_username: e.target.value })
                }
                placeholder="Contoh: budi_sukabread"
                error={FormState?.errors?.owner_username as string}
              />
              <Input
                label="Password"
                type="password"
                required={!initialData}
                value={formData.owner_password}
                onChange={(e) =>
                  setFormData({ ...formData, owner_password: e.target.value })
                }
                placeholder="********"
                error={FormState?.errors?.owner_password as string}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
