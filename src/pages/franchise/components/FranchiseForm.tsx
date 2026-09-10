/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { Input, RemoteSelect } from "@/components/ui";
import { useAppSelector } from "@/hooks";
import type { SelectOptionValue } from "@/services/types/table";
import type {
  FranchisorCreateRequest,
  FranchisorRow,
  FranchisorRowUpdateRequest,
} from "@/services/types/franchisor";
import { useState, useEffect } from "react";

const TYPES: SelectOptionValue[] = [
  { value: "outlet", label: "Outlet" },
  { value: "mitra", label: "Mitra" },
];

interface FranchiseFormProps {
  id?: string;
  initialData?: FranchisorRow | null;
  onSubmit: (
    data: FranchisorCreateRequest | FranchisorRowUpdateRequest,
  ) => void;
}

export function FranchiseForm({
  id = "franchise-form",
  initialData,
  onSubmit,
}: FranchiseFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const isEdit = !!initialData?.id;

  const [typeSelected, setTypeSelected] = useState<SelectOptionValue | null>({
    value: initialData?.type || "outlet",
    label:
      initialData?.type === "mitra"
        ? "Mitra"
        : initialData?.type === "outlet"
          ? "Outlet"
          : "Outlet",
  });
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    username: "",
    name_user: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        username: "",
        name_user: "",
        password: "",
        confirm_password: "",
      });
      setTypeSelected(TYPES.find((t) => t.value === initialData.type) ?? null);
    }
  }, [initialData]);

  const handleInput = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      onSubmit({
        type: (typeSelected?.value as any) || "outlet",
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      });
    } else {
      onSubmit({
        type: (typeSelected?.value as any) || "outlet",
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        username: formData.username,
        name_user: formData.name_user,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });
    }
  };

  const err = (field: string) =>
    typeof FormState?.errors?.[field] === "string"
      ? FormState.errors[field]
      : undefined;

  return (
    <form id={id} onSubmit={handleSubmit} className='space-y-4'>
      <RemoteSelect<SelectOptionValue>
        label='Tipe'
        placeholder='Pilih Tipe...'
        required
        data={TYPES}
        value={typeSelected}
        getLabel={(item: any) => item?.label || ""}
        getValue={(item: any) => item?.value}
        onChange={(val) => setTypeSelected(val)}
        onClear={() => setTypeSelected(null)}
        error={err("type")}
      />
      <Input
        label='Nama Brand / Perusahaan'
        required
        value={formData.name}
        onChange={(e) => handleInput("name", e.target.value)}
        placeholder='Contoh: JAGO'
        variant='primary'
        error={err("name")}
      />
      <Input
        label='Email'
        type='email'
        value={formData.email}
        onChange={(e) => handleInput("email", e.target.value)}
        placeholder='email@perusahaan.com'
        variant='primary'
        error={err("email")}
      />
      <Input
        label='Telepon'
        required
        value={formData.phone}
        onChange={(e) => handleInput("phone", e.target.value)}
        placeholder='08xxxxxxxxxx'
        variant='primary'
        error={err("phone")}
      />
      <Input
        type='textarea'
        label='Alamat Lengkap'
        value={formData.address}
        onChange={(e) => handleInput("address", e.target.value)}
        placeholder='Contoh: Jl. Diponegoro No. 22'
        error={err["address"]}
      />

      {!isEdit && (
        <>
          <div className='pt-2 border-t border-slate-100'>
            <p className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-3'>
              Akun Owner
            </p>
            <div className='space-y-4'>
              <Input
                label='Nama Owner'
                required
                value={formData.name_user}
                onChange={(e) => handleInput("name_user", e.target.value)}
                placeholder='Nama lengkap owner'
                variant='primary'
                error={err("name_user")}
              />
              <Input
                label='Username Owner'
                required
                value={formData.username}
                onChange={(e) => handleInput("username", e.target.value)}
                placeholder='username unik'
                variant='primary'
                error={err("username")}
              />
              <Input
                label='Password'
                required
                type='password'
                value={formData.password}
                onChange={(e) => handleInput("password", e.target.value)}
                placeholder='Minimal 6 karakter'
                variant='primary'
                error={err("password")}
              />
              <Input
                label='Konfirmasi Password'
                required
                type='password'
                value={formData.confirm_password}
                onChange={(e) =>
                  handleInput("confirm_password", e.target.value)
                }
                placeholder='Ulangi password'
                variant='primary'
                error={err("confirm_password")}
              />
            </div>
          </div>
        </>
      )}
    </form>
  );
}

export default FranchiseForm;
