/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { Building, MapPin, Landmark } from "lucide-react";
import { useAppSelector } from "@/hooks";

const SUPPLIER_TYPES = [
  { value: "distributor", label: "Distributor" },
  { value: "factory", label: "Factory" },
  { value: "store", label: "Store" },
];

export interface SupplierFormData extends Record<string, unknown> {
  type: string;
  name: string;
  address: string;
  phone: string;
  sales_person: string;
  bank_name: string;
  bank_number: string;
  bank_account: string;
  top: number;
}

interface SupplierFormProps {
  id?: string;
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => void;
}

export function SupplierForm({
  id = "supplier-form",
  initialData,
  onSubmit,
}: SupplierFormProps) {
  const FormState = useAppSelector((s) => s.form);

  const [typeSelected, setTypeSelected] = useState<{
    value: string;
    label: string;
  } | null>({
    value: "distributor",
    label: "Distributor",
  });

  const [formData, setFormData] = useState<SupplierFormData>({
    type: "",
    name: "",
    address: "",
    phone: "",
    sales_person: "",
    bank_name: "",
    bank_account: "",
    bank_number: "",
    top: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type ?? "distributor",
        name: initialData.name ?? "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        sales_person: initialData.sales_person ?? "",
        bank_name: initialData.bank_name ?? "",
        bank_number: initialData.bank_number ?? "",
        bank_account: initialData.bank_account ?? "",
        top: initialData.top ?? 0,
      });

      const typeOpt = SUPPLIER_TYPES.find(
        (opt) => opt.value === initialData.type,
      ) ?? {
        value: "distributor",
        label: "Distributor",
      };
      setTypeSelected(typeOpt);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type: typeSelected?.value || "",
      top: Number(formData.top),
    });
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Section 1: Informasi Utama Supplier */}
      <div className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Informasi Utama Supplier
            </h2>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <RemoteSelect
            label="Tipe Supplier"
            placeholder="Pilih Tipe..."
            required
            data={SUPPLIER_TYPES}
            value={typeSelected}
            getLabel={(item: any) => item?.label || ""}
            getValue={(item: any) => item?.value}
            onChange={(val) => {
              setTypeSelected(val);
              setFormData((prev) => ({ ...prev, type: val?.value || "" }));
            }}
            onClear={() => {
              setTypeSelected(null);
              setFormData((prev) => ({ ...prev, type: "" }));
            }}
            error={FormState?.errors?.type as string}
          />

          <Input
            label="Nama Supplier"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Contoh: PT. Sinar Logistik Abadi"
            variant="primary"
            error={FormState?.errors?.name as string}
          />

          <Input
            label="Nama Sales"
            value={formData.sales_person}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sales_person: e.target.value,
              }))
            }
            placeholder="Contoh: Adi Wijaya"
            variant="primary"
            error={FormState?.errors?.sales_person as string}
          />

          <Input
            label="No. Telepon"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Contoh: 021987654"
            variant="primary"
            error={FormState?.errors?.phone as string}
          />

          <Input
            label="Term of Payment (Hari)"
            type="number"
            value={formData.top}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                top: Number(e.target.value),
              }))
            }
            placeholder="Contoh: 30"
            variant="primary"
            min={0}
            error={FormState?.errors?.top as string}
          />
        </div>

        <div className="px-5 pb-5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-xs font-bold text-slate-600 uppercase">
              Alamat Lengkap
            </label>
          </div>
          <textarea
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Contoh: Kawasan Industri Jababeka Tahap 2, Blok C-18, Bekasi, Jawa Barat"
            className={`w-full min-h-17.5 px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all ${
              FormState?.errors?.address
                ? "border-rose-500 focus:border-rose-500 bg-rose-50/20"
                : "border-slate-200 focus:border-emerald-500"
            }`}
          />
          <div className="flex items-center justify-between text-xs mt-0.5">
            <span className="text-rose-500 font-medium">
              {FormState?.errors?.address as string}
            </span>
            <span className="text-slate-400">
              {formData.address.length}/250 karakter
            </span>
          </div>
        </div>
      </div>

      {/* Section 2 & 3: Rekening Bank & Contact Person */}
      <div className="grid grid-cols-1 gap-6">
        {/* Rekening Bank Card */}
        <div className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 rounded-t-xl">
            <div className="p-1 bg-blue-50 text-blue-600 rounded-lg">
              <Landmark className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Informasi Rekening Bank
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-15 p-5 space-y-4">
            <Input
              label="Nama Bank"
              value={formData.bank_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bank_name: e.target.value,
                }))
              }
              placeholder="Contoh: Bank Central Asia (BCA)"
              variant="primary"
              error={FormState?.errors?.bank_name as string}
            />
            <Input
              label="Nomor Rekening"
              value={formData.bank_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bank_number: e.target.value,
                }))
              }
              placeholder="Contoh: 8720123456"
              variant="primary"
              error={FormState?.errors?.bank_number as string}
            />
            <Input
              label="Nama Pemilik Rekening"
              value={formData.bank_account}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bank_account: e.target.value,
                }))
              }
              placeholder="Contoh: PT Sinar Logistik Abadi"
              variant="primary"
              error={FormState?.errors?.bank_account as string}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
