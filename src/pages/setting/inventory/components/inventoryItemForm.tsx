import { useState, useEffect } from "react";
import { Input, Checkbox } from "@/components/ui";
import { Plus, Trash2, Package } from "lucide-react";
import clsx from "clsx";
import { useAppSelector } from "@/hooks";

export interface Fraction {
  name: string;
  quantity: number;
  is_smallest: number;
}

export interface InventoryItemFormData extends Record<string, unknown> {
  category: string;
  barcode: string;
  name: string;
  brand: string;
  variant: string;
  packaging: string;
  size: string;
  base_price: number;
  margin: number | null;
  weight: number;
  volume: number;
  safety_stock: number;
  is_stockable: boolean;
  is_vatable: boolean;
  fractions: Fraction[];
}

const initialFractions: Fraction[] = [
  { name: "PCS", quantity: 1, is_smallest: 1 },
];

interface InventoryItemFormProps {
  id?: string;
  initialData?: Partial<InventoryItemFormData>;
  onSubmit: (data: InventoryItemFormData) => void;
}

export function InventoryItemForm({
  id = "inventory-item-form",
  initialData,
  onSubmit,
}: InventoryItemFormProps) {
  const FormState = useAppSelector((s) => s.form);

  const [formData, setFormData] = useState<InventoryItemFormData>({
    category: initialData?.category || "",
    barcode: initialData?.barcode || "",
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    variant: initialData?.variant || "",
    packaging: initialData?.packaging || "",
    size: initialData?.size || "",
    base_price: initialData?.base_price || 0,
    margin: initialData?.margin !== undefined ? initialData.margin : null,
    weight: initialData?.weight || 0,
    volume: initialData?.volume || 0,
    safety_stock: initialData?.safety_stock || 0,
    is_stockable: initialData?.is_stockable || false,
    is_vatable: initialData?.is_vatable || false,
    fractions: initialData?.fractions || initialFractions,
  });

  const [fractions, setFractions] = useState<Fraction[]>(
    initialData?.fractions || initialFractions,
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category ?? "",
        barcode: initialData.barcode ?? "",
        name: initialData.name ?? "",
        brand: initialData.brand ?? "",
        variant: initialData.variant ?? "",
        packaging: initialData.packaging ?? "",
        size: initialData.size ?? "",
        base_price: initialData.base_price ?? 0,
        margin: initialData.margin !== undefined ? initialData.margin : null,
        weight: initialData.weight ?? 0,
        volume: initialData.volume ?? 0,
        safety_stock: initialData.safety_stock ?? 0,
        is_stockable: initialData.is_stockable ?? false,
        is_vatable: initialData.is_vatable ?? false,
        fractions: initialData.fractions ?? initialFractions,
      });
      setFractions(initialData.fractions ?? initialFractions);
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: "is_stockable" | "is_vatable",
    checked: boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const addFraction = () => {
    setFractions((prev) => [
      ...prev,
      { name: "", quantity: 1, is_smallest: 0 },
    ]);
  };

  const removeFraction = (index: number) => {
    if (index === 0) return;
    setFractions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFraction = (index: number, field: keyof Fraction, value: any) => {
    setFractions((prev) => {
      const updated = [...prev];
      if (field === "is_smallest" && value === 1) {
        updated.forEach((f, i) => {
          f.is_smallest = i === index ? 1 : 0;
        });
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: InventoryItemFormData = {
      ...formData,
      fractions: fractions.map((f) => ({
        name: f.name,
        quantity: f.quantity,
        is_smallest: f.is_smallest,
      })),
    };

    onSubmit(payload);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Grid: Basic Info + Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="card-info card-animate p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="card-section-header flex items-center gap-2 mb-4">
            <div className="card-section-icon p-1.5 bg-violet-50 text-violet-600 rounded-lg">
              <Package size={18} />
            </div>
            <h2 className="card-section-title font-bold text-slate-700">
              Informasi Dasar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Item"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Masukkan nama item"
              variant="primary"
              error={
                typeof FormState?.errors?.name === "string"
                  ? FormState.errors.name
                  : undefined
              }
            />
            <Input
              label="Kategori"
              required
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="Masukkan kategori"
              variant="primary"
              error={
                typeof FormState?.errors?.category === "string"
                  ? FormState.errors.category
                  : undefined
              }
            />
            <Input
              label="Barcode"
              value={formData.barcode}
              onChange={(e) => handleInputChange("barcode", e.target.value)}
              placeholder="Masukkan barcode"
              variant="primary"
              error={
                typeof FormState?.errors?.barcode === "string"
                  ? FormState.errors.barcode
                  : undefined
              }
            />
            <Input
              label="Brand"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              placeholder="Masukkan brand"
              variant="primary"
              error={
                typeof FormState?.errors?.brand === "string"
                  ? FormState.errors.brand
                  : undefined
              }
            />
            <Input
              label="Variant"
              value={formData.variant}
              onChange={(e) => handleInputChange("variant", e.target.value)}
              placeholder="Masukkan variant"
              variant="primary"
              error={
                typeof FormState?.errors?.variant === "string"
                  ? FormState.errors.variant
                  : undefined
              }
            />
            <Input
              label="Packaging"
              value={formData.packaging}
              onChange={(e) => handleInputChange("packaging", e.target.value)}
              placeholder="Masukkan packaging"
              variant="primary"
              error={
                typeof FormState?.errors?.packaging === "string"
                  ? FormState.errors.packaging
                  : undefined
              }
            />
            <Input
              label="Size"
              value={formData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              placeholder="Masukkan size"
              variant="primary"
              error={
                typeof FormState?.errors?.size === "string"
                  ? FormState.errors.size
                  : undefined
              }
            />
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="card-info card-animate p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="card-section-header flex items-center gap-2 mb-4">
            <div className="card-section-icon p-1.5 bg-violet-50 text-violet-600 rounded-lg">
              <Package size={18} />
            </div>
            <h2 className="card-section-title font-bold text-slate-700">
              Harga & Stock
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Base Price"
              type="number"
              value={formData.base_price}
              onChange={(e) =>
                handleInputChange("base_price", Number(e.target.value))
              }
              placeholder="0"
              prefix={
                <span className="text-sm font-medium text-slate-500">Rp</span>
              }
              variant="primary"
              error={
                typeof FormState?.errors?.base_price === "string"
                  ? FormState.errors.base_price
                  : undefined
              }
            />
            <Input
              label="Margin (%)"
              type="number"
              value={formData.margin || ""}
              onChange={(e) =>
                handleInputChange(
                  "margin",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              placeholder="0"
              suffix={<span className="text-sm text-slate-400">%</span>}
              variant="primary"
              error={
                typeof FormState?.errors?.margin === "string"
                  ? FormState.errors.margin
                  : undefined
              }
            />
            <Input
              label="Berat"
              type="number"
              value={formData.weight}
              onChange={(e) =>
                handleInputChange("weight", Number(e.target.value))
              }
              placeholder="0"
              suffix={<span className="text-sm text-slate-400">gram</span>}
              variant="primary"
              error={
                typeof FormState?.errors?.weight === "string"
                  ? FormState.errors.weight
                  : undefined
              }
            />
            <Input
              label="Volume"
              type="number"
              value={formData.volume}
              onChange={(e) =>
                handleInputChange("volume", Number(e.target.value))
              }
              placeholder="0"
              suffix={<span className="text-sm text-slate-400">cm³</span>}
              hint="Rumus dalam cm (PxLxT)/4, hasil menjadi satuan gram"
              variant="primary"
              error={
                typeof FormState?.errors?.volume === "string"
                  ? FormState.errors.volume
                  : undefined
              }
            />
            {formData.is_stockable && (
              <Input
                label="Safety Stock"
                type="number"
                value={formData.safety_stock}
                onChange={(e) =>
                  handleInputChange("safety_stock", Number(e.target.value))
                }
                placeholder="0"
                variant="primary"
                error={
                  typeof FormState?.errors?.safety_stock === "string"
                    ? FormState.errors.safety_stock
                    : undefined
                }
              />
            )}
          </div>
          <div className="flex gap-6 pt-4 mt-4 border-t border-slate-100">
            <Checkbox
              label="Stockable"
              checked={formData.is_stockable}
              onChange={(e) =>
                handleCheckboxChange("is_stockable", e.target.checked)
              }
              variant="primary"
            />
            <Checkbox
              label="Vatable (PPN)"
              checked={formData.is_vatable}
              onChange={(e) =>
                handleCheckboxChange("is_vatable", e.target.checked)
              }
              variant="primary"
            />
          </div>
        </div>
      </div>

      {/* Fractions Card */}
      <div className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="table-header px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="table-header-icon p-1.5 bg-violet-50 text-violet-600 rounded-lg">
              <Package size={16} />
            </div>
            <h2 className="table-header-title font-bold text-slate-700">
              Satuan (Fractions)
            </h2>
          </div>
          <button
            type="button"
            onClick={addFraction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {fractions.map((fraction, index) => (
              <div
                key={index}
                className={clsx(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all",
                  index === 0
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white border-slate-200 hover:border-violet-300",
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Input
                      label="Nama Satuan"
                      value={fraction.name}
                      onChange={(e) =>
                        updateFraction(index, "name", e.target.value)
                      }
                      placeholder="Contoh: PCS, Box, Lusin"
                      required
                      variant="primary"
                      error={
                        (typeof FormState?.errors?.[
                          `fractions.${index}.name`
                        ] === "string"
                          ? FormState.errors?.[`fractions.${index}.name`]
                          : undefined) as any
                      }
                    />
                  </div>
                </div>
                <div className="w-28">
                  <Input
                    label="Qty"
                    type="number"
                    value={fraction.quantity}
                    disabled={index === 0}
                    onChange={(e) =>
                      updateFraction(index, "quantity", Number(e.target.value))
                    }
                    variant="primary"
                    error={
                      (typeof FormState?.errors?.[
                        `fractions.[${index}].quantity`
                      ] === "string"
                        ? FormState.errors?.[`fractions.[${index}].quantity`]
                        : undefined) as any
                    }
                  />
                </div>
                {index === 0 && (
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium mt-6">
                    Satuan terkecil
                  </span>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeFraction(index)}
                    className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
