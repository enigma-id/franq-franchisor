import { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { User, Building, MapPin, Landmark, BookOpen } from "lucide-react";
import { useAppSelector } from "@/hooks";

const SUPPLIER_TYPES = [
  { value: "individual", label: "Perorangan (Individual)" },
  { value: "company", label: "Perusahaan (Company)" },
];

const PKP_STATUS_OPTIONS = [
  { value: 0, label: "Non PKP (Bebas PPN)" },
  { value: 1, label: "PKP (Wajib PPN)" },
];

export interface SupplierFormData extends Record<string, unknown> {
  type: string;
  name: string;
  address: string;
  phone: string;
  is_pkp: number;
  top: number;
  lead_time: number;
  bank_name: string;
  bank_number: string;
  bank_account: string;
  sales_person: string;
  sales_person_phone: string;
  note: string;
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
    value: "individual",
    label: "Perorangan (Individual)",
  });

  const [pkpSelected, setPkpSelected] = useState<{
    value: number;
    label: string;
  } | null>({
    value: 0,
    label: "Non PKP (Bebas PPN)",
  });

  const [formData, setFormData] = useState<SupplierFormData>({
    type: "individual",
    name: "",
    address: "",
    phone: "",
    is_pkp: 0,
    top: 0,
    lead_time: 0,
    bank_name: "",
    bank_number: "",
    bank_account: "",
    sales_person: "",
    sales_person_phone: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type ?? "individual",
        name: initialData.name ?? "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        is_pkp: initialData.is_pkp ?? 0,
        top: initialData.top ?? 0,
        lead_time: initialData.lead_time ?? 0,
        bank_name: initialData.bank_name ?? "",
        bank_number: initialData.bank_number ?? "",
        bank_account: initialData.bank_account ?? "",
        sales_person: initialData.sales_person ?? "",
        sales_person_phone: initialData.sales_person_phone ?? "",
        note: initialData.note ?? "",
      });

      const typeOpt = SUPPLIER_TYPES.find(
        (opt) => opt.value === initialData.type,
      ) ?? {
        value: "individual",
        label: "Perorangan (Individual)",
      };
      setTypeSelected(typeOpt);

      const pkpOpt = PKP_STATUS_OPTIONS.find(
        (opt) => opt.value === initialData.is_pkp,
      ) ?? {
        value: 0,
        label: "Non PKP (Bebas PPN)",
      };
      setPkpSelected(pkpOpt);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      is_pkp: Number(formData.is_pkp),
      top: Number(formData.top),
      lead_time: Number(formData.lead_time),
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
            label="No. Telepon"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Contoh: 021987654"
            variant="primary"
            error={FormState?.errors?.phone as string}
          />

          <RemoteSelect
            label="Status PKP"
            placeholder="Pilih Status PKP..."
            required
            data={PKP_STATUS_OPTIONS}
            value={pkpSelected}
            getLabel={(item: any) => item?.label || ""}
            getValue={(item: any) => item?.value}
            onChange={(val) => {
              setPkpSelected(val);
              setFormData((prev) => ({
                ...prev,
                is_pkp: val ? Number(val.value) : 0,
              }));
            }}
            onClear={() => {
              setPkpSelected(null);
              setFormData((prev) => ({ ...prev, is_pkp: 0 }));
            }}
            error={FormState?.errors?.is_pkp as string}
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

          <Input
            label="Lead Time Pengiriman (Hari)"
            type="number"
            value={formData.lead_time}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                lead_time: Number(e.target.value),
              }))
            }
            placeholder="Contoh: 3"
            variant="primary"
            min={0}
            error={FormState?.errors?.lead_time as string}
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
            className={`w-full min-h-[70px] px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all ${
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
              {formData.address.length}/130 karakter
            </span>
          </div>
        </div>
      </div>

      {/* Section 2 & 3: Rekening Bank & Contact Person */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="p-5 space-y-4">
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

        {/* Contact Person Card */}
        <div className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 rounded-t-xl">
            <div className="p-1 bg-amber-50 text-amber-600 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Contact Person (Sales)
            </h2>
          </div>
          <div className="p-5 space-y-4">
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
              label="No. Telepon Sales"
              value={formData.sales_person_phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sales_person_phone: e.target.value,
                }))
              }
              placeholder="Contoh: 081298765432"
              variant="primary"
              error={FormState?.errors?.sales_person_phone as string}
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <label className="text-xs font-bold text-slate-600 uppercase">
                  Catatan Khusus
                </label>
              </div>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="Catatan tambahan mengenai terms supplier ini..."
                className={`w-full min-h-[60px] px-3 py-2 text-sm rounded-lg border focus:outline-none transition-all ${
                  FormState?.errors?.note
                    ? "border-rose-500 focus:border-rose-500 bg-rose-50/20"
                    : "border-slate-200 focus:border-emerald-500"
                }`}
              />
              <div className="flex items-center justify-between text-xs mt-0.5">
                <span className="text-rose-500 font-medium">
                  {FormState?.errors?.note as string}
                </span>
                <span className="text-slate-400">
                  {(formData.note || "").length}/130 karakter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
