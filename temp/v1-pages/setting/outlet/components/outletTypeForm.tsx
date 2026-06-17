import { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { useAppSelector } from "@/hooks";

export interface OutletTypeFormData extends Record<string, unknown> {
  name: string;
}

interface OutletTypeFormProps {
  id?: string;
  initialData?: Partial<OutletTypeFormData>;
  onSubmit: (data: OutletTypeFormData) => void;
}

export function OutletTypeForm({
  id = "outlet-type-form",
  initialData,
  onSubmit,
}: OutletTypeFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const [formData, setFormData] = useState<OutletTypeFormData>({
    name: initialData?.name || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-6"
    >
      <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <Input
          label="Nama Tipe Outlet"
          required
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
          placeholder="Contoh: Express, Premium, Booth"
          variant="primary"
          error={FormState?.errors?.name as string}
        />
      </div>
    </form>
  );
}
