import { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { useAppSelector } from "@/hooks";

export interface UserFormData extends Record<string, unknown> {
  name: string;
  username: string;
  password?: string;
  confirm_password?: string;
}

interface UserFormProps {
  id?: string;
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isEdit?: boolean;
}

export function UserForm({
  id = "user-form",
  initialData,
  onSubmit,
  isEdit = false,
}: UserFormProps) {
  const FormState = useAppSelector((s) => s.form);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        username: initialData.username ?? "",
        password: "",
        confirm_password: "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For edit, if password is empty, don't send it in the payload
    const submitData: UserFormData = {
      name: formData.name,
      username: formData.username,
    };
    if (formData.password) {
      submitData.password = formData.password;
      submitData.confirm_password = formData.confirm_password;
    }

    onSubmit(submitData);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
          Detail Pengguna
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Nama Lengkap"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Contoh: Admin Suka Bread"
            variant="primary"
            error={FormState?.errors?.name as string}
          />

          <Input
            label="Username"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="Contoh: admin_sukabread"
            variant="primary"
            error={FormState?.errors?.username as string}
            disabled={isEdit} // usually usernames cannot be changed, or if they can, keep it editable. Let's make it disabled for edit to keep it secure.
          />
        </div>
      </div>

      <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
          Kredensial & Keamanan
        </h3>
        
        <div className="space-y-4">
          <Input
            label={isEdit ? "Password Baru" : "Password"}
            required={!isEdit}
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder={isEdit ? "Kosongkan jika tidak ingin mengubah password" : "Minimal 6 karakter"}
            variant="primary"
            error={FormState?.errors?.password as string}
          />

          <Input
            label={isEdit ? "Konfirmasi Password Baru" : "Konfirmasi Password"}
            required={!isEdit || !!formData.password}
            type="password"
            value={formData.confirm_password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, confirm_password: e.target.value }))
            }
            placeholder={isEdit ? "Kosongkan jika tidak ingin mengubah password" : "Ulangi password"}
            variant="primary"
            error={FormState?.errors?.confirm_password as string}
          />
        </div>
      </div>
    </form>
  );
}

export default UserForm;
