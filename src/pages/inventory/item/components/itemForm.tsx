/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input, Checkbox, RemoteSelect } from "@/components/ui";
import { Plus, Trash2, Package } from "lucide-react";
import clsx from "clsx";
import { useAppSelector } from "@/hooks";
import { getOptionByValue } from "@/utils/helper";
import type {
  InventoryBOM,
  InventoryFraction,
  InventoryItemCreateRequest,
  InventoryItemDetail,
  InventoryItemPickingStrategy,
  SupplierDetail,
} from "@/services/types";
import type { SelectOptionValue } from "@/services/types/table";
import { useSupplier } from "@/services/supplier/hooks";
import { useInventoryItem } from "@/services/inventory/hooks";

const TYPES = [
  { value: "raw_material", label: "Raw Material" },
  { value: "finished_goods", label: "Finished Goods" },
];

const STRATEGY = [
  { value: "fifo", label: "First-In, First-Out" },
  { value: "fefo", label: "First-Expired, First-Out" },
  { value: "lifo", label: "Last-In, First-Out" },
  { value: "manual", label: "Manual" },
];

interface InventoryBOMField extends InventoryBOM {
  material?: any;
}

const initialFractions: InventoryFraction[] = [{ name: "PCS", quantity: 1 }];
const initialBoms: InventoryBOMField[] = [
  { material: null, material_id: "", quantity: 0, measurement: "" },
];

interface InventoryItemFormProps {
  id?: string;
  initialData?: Partial<InventoryItemCreateRequest>;
  onSubmit: (data: InventoryItemCreateRequest) => void;
}

export function InventoryItemForm({
  id = "inventory-item-form",
  initialData,
  onSubmit,
}: InventoryItemFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const { get: getSupplier, getResult: supplierResult } = useSupplier();
  const { get: getItems, getResult: itemsResult } = useInventoryItem();

  const [formData, setFormData] = useState<InventoryItemCreateRequest>({
    type: initialData?.type || "raw_material",
    supplier_id: initialData?.supplier?.id || "",
    barcode: initialData?.barcode || "",
    name: initialData?.name || "",
    variant: initialData?.variant || "",
    packaging: initialData?.packaging || "",
    size: initialData?.size || "",
    picking_strategy: initialData?.picking_strategy || "fifo",
    is_batch_tracking: initialData?.is_batch_tracking || false,
    base_price: initialData?.base_price || 0,
    weight: initialData?.weight || 0,
    volume: initialData?.volume || 0,
    category: initialData?.category || "",
    safety_stock: initialData?.safety_stock || 0,
    is_vatable: initialData?.is_vatable || false,
    fractions: initialData?.fractions || initialFractions,
    boms: initialData?.materials || [],
  });

  const [fractions, setFractions] = useState<InventoryFraction[]>(
    initialData?.fractions || initialFractions,
  );

  const [boms, setBoms] = useState<InventoryBOMField[]>(
    initialData?.boms || initialBoms,
  );
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);

  const [typeSelected, setTypeSelected] = useState<SelectOptionValue | null>({
    value: "raw_material",
    label: "Raw Material",
  });

  const [strategySelected, setStrategySelected] =
    useState<SelectOptionValue | null>({
      value: "fifo",
      label: "First-In, First-Out",
    });

  useEffect(() => {
    if (initialData) {
      const itemType = initialData.type || "raw_material";
      setFormData({
        type: itemType,
        supplier_id: initialData?.supplier?.id || "",
        barcode: initialData?.barcode || "",
        name: initialData?.name || "",
        variant: initialData?.variant || "",
        packaging: initialData?.packaging || "",
        size: initialData?.size || "",
        picking_strategy: initialData?.picking_strategy || "fifo",
        is_batch_tracking: initialData?.is_batch_tracking || false,
        base_price: initialData?.base_price || 0,
        weight: initialData?.weight || 0,
        volume: initialData?.volume || 0,
        category: initialData?.category || "",
        safety_stock: initialData?.safety_stock || 0,
        is_vatable: initialData?.is_vatable || false,
        fractions: initialData?.fractions || initialFractions,
        boms: initialData?.materials || [],
      });
      setTypeSelected(getOptionByValue(TYPES, itemType));
      setStrategySelected(
        getOptionByValue(STRATEGY, initialData.picking_strategy),
      );

      setFractions(initialData.fractions ?? initialFractions);
      setSupplier(initialData.supplier ?? null);
      setBoms(initialData.materials ?? initialBoms);
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: "is_vatable" | "is_batch_tracking",
    checked: boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const addFraction = () => {
    setFractions((prev) => [...prev, { name: "", quantity: 1 }]);
  };

  const removeFraction = (index: number) => {
    if (index === 0) return;
    setFractions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFraction = (
    index: number,
    field: keyof InventoryFraction,
    value: any,
  ) => {
    setFractions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateBoms = (
    index: number,
    field: keyof InventoryBOMField,
    value: any,
  ) => {
    setBoms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addBoms = () => {
    setBoms((prev) => [
      ...prev,
      { material: null, material_id: "", quantity: 0, measurement: "" },
    ]);
  };

  const removeBoms = (index: number) => {
    if (index === 0) return;
    setBoms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: InventoryItemCreateRequest = {
      ...formData,
      supplier_id: supplier?.id,
      picking_strategy: strategySelected?.value as InventoryItemPickingStrategy,
      fractions: fractions.map((f) => ({
        name: f.name,
        quantity: f.quantity,
      })),
    };

    if (payload?.type === "finished_goods") {
      payload.boms = boms.map((b) => ({
        material_id: b?.material?.id,
        quantity: b?.quantity,
        measurement: b?.measurement,
      }));
    }

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
        {/* Informasi Umum Item Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-20">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                <Package size={18} />
              </div>
              <h2 className="font-bold text-slate-700">Informasi Umum Item</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            <RemoteSelect<SelectOptionValue>
              label="Tipe"
              placeholder="Pilih Tipe..."
              required
              data={TYPES}
              value={typeSelected}
              getLabel={(item: any) => item?.label || ""}
              getValue={(item: any) => item?.value}
              onChange={(val) => {
                setTypeSelected(val);
                if (val?.value) {
                  setFormData((prev) => ({
                    ...prev,
                    type: val.value as any,
                  }));
                }
              }}
              onClear={() => {
                setTypeSelected(null);
              }}
              error={FormState?.errors?.type as string}
            />

            <RemoteSelect<SupplierDetail>
              label="Supplier"
              placeholder="Pilih Supplier..."
              hook={supplierResult as any}
              fetchData={(page, search) => getSupplier({ page, search })}
              getLabel={(item: any) => item?.name}
              onChange={(item: any) => setSupplier(item)}
              value={supplier}
              onClear={() => setSupplier(null)}
            />

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
            <Checkbox
              label="Batch Tracking"
              checked={formData.is_batch_tracking}
              onChange={(e) =>
                handleCheckboxChange("is_batch_tracking", e.target.checked)
              }
              variant="primary"
            />
            {formData.is_batch_tracking && (
              <RemoteSelect<SelectOptionValue>
                label="Picking Strategy"
                placeholder="Pilih..."
                data={STRATEGY}
                value={strategySelected}
                getLabel={(item: any) => item?.label || ""}
                getValue={(item: any) => item?.value}
                onChange={(val) => {
                  setStrategySelected(val);
                  if (val?.value) {
                    setFormData((prev) => ({
                      ...prev,
                      picking_strategy: val.value as any,
                    }));
                  }
                }}
                onClear={() => {
                  setStrategySelected(null);
                }}
                error={FormState?.errors?.picking_strategy as string}
              />
            )}
          </div>
        </div>

        {/* Harga, Berat & Pajak Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-10">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg">
                <Package size={18} />
              </div>
              <h2 className="font-bold text-slate-700">Harga, Berat & Pajak</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            <Input
              label="Base Price"
              type="currency"
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
              label="Berat"
              required
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-10">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
              <Package size={16} />
            </div>
            <h2 className="font-bold text-slate-700">Satuan (Fractions)</h2>
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
                    className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOMS Card */}
      {typeSelected?.value === "finished_goods" && (
        <div className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible! relative z-20">
          <div className="table-header px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="table-header-icon p-1.5 bg-violet-50 text-violet-600 rounded-lg">
                <Package size={16} />
              </div>
              <h2 className="table-header-title font-bold text-slate-700">
                Bill of Materials
              </h2>
            </div>
            <button
              type="button"
              onClick={addBoms}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {boms.map((bom, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all bg-white  hover:border-violet-300",
                    FormState.errors?.boms
                      ? "border-red-600"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <RemoteSelect<InventoryItemDetail>
                        label="Item"
                        placeholder="Pilih item..."
                        required
                        hook={itemsResult as any}
                        fetchData={(page, search) =>
                          getItems({ page, search, type: "raw_material" })
                        }
                        getLabel={(it: any) => it?.alias_name}
                        getValue={(cat: any) => cat?.id}
                        value={bom.material} // Simplification for now
                        onChange={(it: any) => {
                          updateBoms(index, "material", it);
                        }}
                        error={
                          (typeof FormState?.errors?.[
                            `boms.[${index}].material_id`
                          ] === "string"
                            ? FormState.errors?.[`boms.[${index}].material_id`]
                            : undefined) as any
                        }
                      />
                    </div>
                  </div>
                  <div className="w-28">
                    <Input
                      label="Qty"
                      type="number"
                      value={bom.quantity}
                      onChange={(e) =>
                        updateBoms(index, "quantity", Number(e.target.value))
                      }
                      variant="primary"
                      error={
                        (typeof FormState?.errors?.[
                          `boms.[${index}].quantity`
                        ] === "string"
                          ? FormState.errors?.[`boms.[${index}].quantity`]
                          : undefined) as any
                      }
                    />
                  </div>
                  <div className="w-48">
                    <Input
                      label="Nama Satuan"
                      value={bom.measurement}
                      onChange={(e) =>
                        updateBoms(index, "measurement", e.target.value)
                      }
                      placeholder="Contoh: ml, gram, pcs"
                      required
                      variant="primary"
                      error={
                        (typeof FormState?.errors?.[
                          `boms.${index}.measurement`
                        ] === "string"
                          ? FormState.errors?.[`boms.${index}.measurement`]
                          : undefined) as any
                      }
                    />
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBoms(index)}
                      className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {FormState.errors?.boms ? (
                <div className="text-error text-xs font-medium leading-[1.66] pt-1">
                  {FormState.errors?.boms as string}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
