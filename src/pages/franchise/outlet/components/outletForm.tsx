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
  onSubmit: (data: OutletCreateRequest) => void;
}

export const OutletForm: React.FC<OutletFormProps> = ({
  id = "outlet-form",
  initialData,
  hideOwnerSection = false,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);

  const [formData, setFormData] = useState<OutletCreateRequest>({
    outlet_type_id: "",
    name: "",
    recipient_name: "",
    phone: "",
    address: "",
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
    // PIC tidak lagi diinput manual: recipient_name mengikuti Nama Pemilik
    // (mode create), atau tetap data existing saat update (owner disembunyikan).
    const payload: OutletCreateRequest = {
      ...formData,
      recipient_name: hideOwnerSection
        ? formData.recipient_name
        : formData.owner_name,
    };
    onSubmit(payload);
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
        <div
          className="bg-white border border-slate-200 rounded-xl relative shadow-sm"
          style={{ overflow: "visible", zIndex: 20 }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Informasi Utama
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nama Outlet"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Suka Bread Express Bandung"
              error={FormState?.errors?.name as string}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="No. Telepon Outlet"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Contoh: 022123456"
                error={FormState?.errors?.phone as string}
              />
              <Input
                label="Biaya Layanan (%)"
                type="number"
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

        {/* Akun Pemilik (PIC dihapus, recipient_name di-sync otomatis) */}
        {!hideOwnerSection && (
          <div
            className="bg-white border border-slate-200 rounded-xl relative shadow-sm"
            style={{ overflow: "visible", zIndex: 15 }}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}
      </div>
    </form>
  );
};
