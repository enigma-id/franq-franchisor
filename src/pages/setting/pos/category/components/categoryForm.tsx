/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Input, Button } from "@/components/ui";
import type {
  POSCategoryDetail,
  POSCategoryCreateRequest,
} from "@/services/types/pos";

interface POSCategoryFormProps {
  initialData?: POSCategoryDetail;
  onSubmit: (data: POSCategoryCreateRequest) => void;
  isLoading?: boolean;
}

export const POSCategoryForm: React.FC<POSCategoryFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<POSCategoryCreateRequest>({
    name: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Nama Kategori"
            placeholder="Contoh: Makanan, Minuman, Snack"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button variant="primary" type="submit" isLoading={isLoading}>
          Simpan Kategori
        </Button>
      </div>
    </form>
  );
};
