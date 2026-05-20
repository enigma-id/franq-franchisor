import { Page } from "@/components/app/layout";
import { useEffect, useState } from "react";
import { Button, Input, Loading } from "@/components/ui";
import { Edit2, Save, X, RefreshCw } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useAppSelector } from "@/hooks";
import { useFranchise } from "@/services/franchise/hooks";

interface FranchiseData {
  id?: string;
  name?: string;
  company_name?: string;
  legal_address?: string;
  office_address?: string;
  email?: string;
  phone?: string;
  finance_name?: string;
  finance_phone?: string;
  finance_email?: string;
  bank_name?: string;
  bank_account?: string;
  bank_holder?: string;
}

interface FieldConfig {
  label: string;
  key: keyof FranchiseData;
  placeholder?: string;
  required?: boolean;
  type?: "number" | "text" | "email" | "password" | "time" | "textarea" | "currency" | "phone";
}

const FIELDS: FieldConfig[] = [
  {
    label: "Nama Franchise",
    key: "name",
    required: true,
    placeholder: "Contoh: Suka Bread",
  },
  {
    label: "Nama Perusahaan",
    key: "company_name",
    required: true,
    placeholder: "Contoh: PT Suka Bread Indonesia",
  },
  {
    label: "Alamat Legal",
    key: "legal_address",
    required: true,
    placeholder: "Alamat sesuai hukum",
  },
  {
    label: "Alamat Kantor",
    key: "office_address",
    required: true,
    placeholder: "Alamat operasional kantor",
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    required: true,
    placeholder: "Contoh: corporate@sukabread.com",
  },
  {
    label: "Telepon",
    key: "phone",
    required: true,
    placeholder: "Contoh: 021-XXXXXXX",
  },
];

const FINANCE_FIELDS: FieldConfig[] = [
  {
    label: "Nama Kontak",
    key: "finance_name",
    placeholder: "Nama contact person finance",
  },
  {
    label: "Telepon",
    key: "finance_phone",
    placeholder: "No. telepon finance",
  },
  {
    label: "Email",
    key: "finance_email",
    type: "email",
    placeholder: "Email finance",
  },
];

const BANK_FIELDS: FieldConfig[] = [
  { label: "Bank", key: "bank_name", placeholder: "Contoh: BCA / Mandiri" },
  {
    label: "No. Rekening",
    key: "bank_account",
    placeholder: "Nomor rekening bank",
  },
  {
    label: "Atas Nama",
    key: "bank_holder",
    placeholder: "Nama pemilik rekening",
  },
];

export function BusinessSetting() {
  const { showToast } = useEnigmaUI();
  const FormState = useAppSelector((state) => state.form);
  const [data, setData] = useState<FranchiseData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FranchiseData>({});

  const session = useAppSelector((state) => state.auth.session);
  const user = session?.user as any;
  const franchiseId = user?.franchise?.id;

  const { show, showResult, update, updateResult } = useFranchise();
  const {
    isLoading: isLoadingFetch,
    data: detailData,
    isError: isFetchError,
  } = showResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;

  const franchiseDetail = (detailData as any)?.data ?? detailData ?? null;

  useEffect(() => {
    if (franchiseId) {
      show({ id: franchiseId });
    }
  }, [franchiseId, show]);

  useEffect(() => {
    if (franchiseDetail) {
      setData(franchiseDetail);
      setEditData(franchiseDetail);
    }
  }, [franchiseDetail]);

  useEffect(() => {
    if (isFetchError) {
      showToast({
        message: "Gagal mengambil data franchise",
        type: "error",
      });
    }
  }, [isFetchError, showToast]);

  useEffect(() => {
    if (isUpdateSuccess) {
      showToast({
        message: "Informasi bisnis berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      setIsEditing(false);
      if (franchiseId) {
        show({ id: franchiseId });
      }
      updateResult.reset?.();
    }
  }, [isUpdateSuccess, franchiseId, show, updateResult, showToast]);

  const handleEditClick = () => {
    if (data) {
      setEditData({ ...data });
      setIsEditing(true);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (data) {
      setEditData({ ...data });
    }
  };

  const handleSaveClick = async () => {
    try {
      if (!franchiseId) {
        throw new Error("Franchise ID tidak ditemukan.");
      }

      await update({
        id: franchiseId,
        payload: editData as Record<string, unknown>,
      });
    } catch (err: any) {
      showToast({
        message: err?.data?.message || "Gagal memperbarui informasi bisnis",
        type: "error",
        position: "bottom-center",
      });
    }
  };

  const handleFieldChange = (key: keyof FranchiseData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderField = (field: FieldConfig) => {
    const value = data?.[field.key];
    return (
      <div
        key={field.label}
        className="flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-50/50 transition-all duration-200"
      >
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {field.label}
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {value || "-"}
        </span>
      </div>
    );
  };

  const renderInputField = (field: FieldConfig) => {
    return (
      <div key={field.label} className="p-1">
        <Input
          label={field.label}
          required={field.required}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={(editData[field.key] as string) ?? ""}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          error={FormState?.errors?.[field.key] as string}
          variant="primary"
        />
      </div>
    );
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Business"
        subtitle="Informasi franchise dan perusahaan."
        action={
          isLoadingFetch ? null : isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                styleType="outline"
                onClick={handleCancelClick}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                variant="success"
                onClick={handleSaveClick}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loading size="sm" variant="spinner" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleEditClick}
              disabled={!data}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Informasi
            </Button>
          )
        }
      />

      <Page.Body className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        {isLoadingFetch ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Memuat Informasi Bisnis...
            </p>
          </div>
        ) : data ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* General Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                Informasi Umum
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {isEditing
                  ? FIELDS.map(renderInputField)
                  : FIELDS.map(renderField)}
              </div>
            </div>

            {/* Finance Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                Kontak Finance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {isEditing
                  ? FINANCE_FIELDS.map(renderInputField)
                  : FINANCE_FIELDS.map(renderField)}
              </div>
            </div>

            {/* Bank Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                Informasi Rekening Bank
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {isEditing
                  ? BANK_FIELDS.map(renderInputField)
                  : BANK_FIELDS.map(renderField)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-lg font-bold">Data tidak ditemukan</p>
            <p className="text-sm">Silakan hubungi administrator.</p>
          </div>
        )}
      </Page.Body>
    </Page>
  );
}

export default BusinessSetting;
