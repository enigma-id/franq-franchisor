import { useState, useMemo, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";
import {
  useInventoryItem,
} from "@/services/inventory/hooks";

export interface BundleItemInput {
  itemSelected: any | null;
  item_id: number;
  fractionSelected: any | null;
  fraction_id: number;
  quantity: number;
}

export interface InventoryCatalogFormData extends Record<string, unknown> {
  name: string;
  commission: number;
  is_bundle: number;
  description: string;
  unit_price: number;
  item_id?: number;
  fraction_id?: number;
  bundles?: { item_id: number; fraction_id: number; quantity: number }[];
}

interface InventoryCatalogFormProps {
  id?: string;
  initialData?: Partial<InventoryCatalogFormData>;
  onSubmit: (data: InventoryCatalogFormData) => void;
}

export function InventoryCatalogForm({
  id = "inventory-catalog-form",
  initialData,
  onSubmit,
}: InventoryCatalogFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const { showToast } = useEnigmaUI();

  const { get: getInventoryItems, getResult: inventoryItemsResult } =
    useInventoryItem();
  const { getFractions: getFractionsQuery } = useInventoryItem();


  const [type, setType] = useState<"singular" | "bundle">("singular");

  // Singular Type Inputs
  const [singularItem, setSingularItem] = useState<any | null>(null);
  const [singularFraction, setSingularFraction] = useState<any | null>(null);
  const [singularFractionsList, setSingularFractionsList] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    commission: 0,
    is_bundle: 0,
    description: "",
    unit_price: 0,
    item_id: 0,
    fraction_id: 0,
    bundles: [] as BundleItemInput[],
  });

  // Toggle singular vs bundle
  const handleTypeChange = (newType: "singular" | "bundle") => {
    setType(newType);
    setSingularItem(null);
    setSingularFraction(null);
    setSingularFractionsList([]);
    setFormData((prev) => ({
      ...prev,
      is_bundle: newType === "bundle" ? 1 : 0,
      item_id: 0,
      fraction_id: 0,
      unit_price: 0,
      bundles:
        newType === "bundle"
          ? [
              {
                itemSelected: null,
                item_id: 0,
                fractionSelected: null,
                fraction_id: 0,
                quantity: 1,
              },
            ]
          : [],
    }));
  };

  // Sync initialData if provided (for Update route compatibility)
  useEffect(() => {
    if (initialData) {
      const isBundle = initialData.is_bundle === 1;
      setType(isBundle ? "bundle" : "singular");
      
      setFormData({
        name: initialData.name ?? "",
        commission: initialData.commission ?? 0,
        is_bundle: initialData.is_bundle ?? 0,
        description: initialData.description ?? "",
        unit_price: initialData.unit_price ?? 0,
        item_id: initialData.item_id ?? 0,
        fraction_id: initialData.fraction_id ?? 0,
        bundles: isBundle && initialData.bundles
          ? initialData.bundles.map((b: any) => ({
              itemSelected: b.item ?? { id: b.item_id, name: `Barang #${b.item_id}`, base_price: 0 },
              item_id: b.item_id,
              fractionSelected: b.fraction ?? { id: b.fraction_id, name: `Satuan #${b.fraction_id}`, quantity: 1 },
              fraction_id: b.fraction_id,
              quantity: b.quantity ?? 1,
            }))
          : [],
      });

      if (!isBundle && initialData.item_id) {
        setSingularItem(initialData.item ?? { id: initialData.item_id, name: `Barang #${initialData.item_id}`, base_price: 0 });
        setSingularFraction(initialData.fraction ?? { id: initialData.fraction_id, name: `Satuan #${initialData.fraction_id}`, quantity: 1 });
        if ((initialData.item as any)?.fractions) {
          setSingularFractionsList((initialData.item as any).fractions);
        } else {
          // Trigger dynamic load of fractions
          getFractionsQuery({ id: initialData.item_id }).then((response: any) => {
            if (response?.data?.data) {
              setSingularFractionsList(response.data.data);
            }
          });
        }
      }
    }
  }, [initialData]);

  // Singular Item & Fraction Changes
  const handleSingularItemChange = async (item: any) => {
    setSingularItem(item);
    setSingularFraction(null);
    setSingularFractionsList([]);
    setFormData((prev) => ({
      ...prev,
      item_id: item?.id || 0,
      fraction_id: 0,
    }));
    if (item?.id) {
      try {
        const response = (await getFractionsQuery({ id: item.id })) as any;
        if (response?.data?.data) {
          setSingularFractionsList(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch fractions", err);
      }
    }
  };

  const handleSingularItemClear = () => {
    setSingularItem(null);
    setSingularFraction(null);
    setSingularFractionsList([]);
    setFormData((prev) => ({ ...prev, item_id: 0, fraction_id: 0 }));
  };

  // Bundle Dynamic Table Handlers
  const addBundleRow = () => {
    setFormData((prev) => ({
      ...prev,
      bundles: [
        ...prev.bundles,
        {
          itemSelected: null,
          item_id: 0,
          fractionSelected: null,
          fraction_id: 0,
          quantity: 1,
        },
      ],
    }));
  };

  const removeBundleRow = (index: number) => {
    if (formData.bundles.length === 1) {
      showToast({
        message: "Katalog bundle minimal harus memiliki 1 item barang",
        type: "error",
        position: "bottom-center",
        duration: 3000,
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      bundles: prev.bundles.filter((_, i) => i !== index),
    }));
  };

  const handleBundleItemChange = async (index: number, item: any) => {
    setFormData((prev) => {
      const updated = [...prev.bundles];
      updated[index] = {
        ...updated[index],
        itemSelected: item,
        item_id: item?.id || 0,
        fractionSelected: null,
        fraction_id: 0,
      };
      return { ...prev, bundles: updated };
    });
  };

  const handleBundleItemClear = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.bundles];
      updated[index] = {
        ...updated[index],
        itemSelected: null,
        item_id: 0,
        fractionSelected: null,
        fraction_id: 0,
      };
      return { ...prev, bundles: updated };
    });
  };

  const handleBundleFractionChange = (index: number, fraction: any) => {
    setFormData((prev) => {
      const updated = [...prev.bundles];
      updated[index] = {
        ...updated[index],
        fractionSelected: fraction,
        fraction_id: fraction?.id || 0,
      };
      return { ...prev, bundles: updated };
    });
  };

  const handleBundleQtyChange = (index: number, qty: number) => {
    const validQty = qty < 1 ? 1 : qty;
    setFormData((prev) => {
      const updated = [...prev.bundles];
      updated[index] = {
        ...updated[index],
        quantity: validQty,
      };
      return { ...prev, bundles: updated };
    });
  };

  // Computations
  const computedPricing = useMemo(() => {
    if (type === "singular") {
      if (!singularItem || !singularFraction) {
        return { basePrice: 0, sellingPrice: 0 };
      }
      const basePrice =
        (Number(singularItem.base_price) || 0) *
        (Number(singularFraction.quantity) || 0);
      const commissionAmount =
        (basePrice * (Number(formData.commission) || 0)) / 100;
      const sellingPrice = basePrice + commissionAmount;
      return { basePrice, sellingPrice };
    } else {
      let basePriceSum = 0;
      formData.bundles.forEach((bundle) => {
        if (bundle.itemSelected && bundle.fractionSelected) {
          const itemBase = Number(bundle.itemSelected.base_price) || 0;
          const fractionQty = Number(bundle.fractionSelected.quantity) || 0;
          basePriceSum += itemBase * fractionQty * bundle.quantity;
        }
      });
      const commissionAmount =
        (basePriceSum * (Number(formData.commission) || 0)) / 100;
      const sellingPrice = basePriceSum + commissionAmount;
      return { basePrice: basePriceSum, sellingPrice };
    }
  }, [
    type,
    singularItem,
    singularFraction,
    formData.bundles,
    formData.commission,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: InventoryCatalogFormData = {
      name: formData.name,
      commission: Number(formData.commission),
      is_bundle: formData.is_bundle,
      description: formData.description,
      unit_price: Math.round(computedPricing.sellingPrice),
      item_id: type === "singular" ? formData.item_id : undefined,
      fraction_id: type === "singular" ? formData.fraction_id : undefined,
      bundles:
        type === "bundle"
          ? formData.bundles.map((bundle) => ({
              item_id: bundle.item_id,
              fraction_id: bundle.fraction_id,
              quantity: bundle.quantity,
            }))
          : undefined,
    };

    onSubmit(payload);
  };

  const getErrorItem = (index: number, field: string) => {
    const errorKey = `bundles.${index}.${field}`;
    return typeof FormState?.errors?.[errorKey] === "string"
      ? FormState.errors[errorKey]
      : undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      {/* Section: Type Selector Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Tipe Katalog</h4>
          <p className="text-xs text-slate-400">
            Tentukan apakah katalog berisi satu jenis barang atau paket bundel
            beberapa barang.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => handleTypeChange("singular")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              type === "singular"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Singular
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("bundle")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              type === "bundle"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Paket Bundle
          </button>
        </div>
      </div>

      {/* Section: Informasi Utama */}
      <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
          Informasi Utama
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Katalog"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Contoh: Tepung Terigu Segitiga Biru 10kg"
            variant="primary"
            error={FormState?.errors?.name as string}
          />
          <Input
            label="Komisi Penjualan (%)"
            required
            type="number"
            value={formData.commission}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                commission: Number(e.target.value),
              }))
            }
            placeholder="Contoh: 10"
            variant="primary"
            min={0}
            max={100}
            error={FormState?.errors?.commission as string}
          />
          <div className="md:col-span-2">
            <Input
              label="Deskripsi Katalog (Opsional)"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Keterangan lengkap produk atau isi paket bundle..."
              variant="primary"
            />
          </div>
        </div>
      </div>

      {/* Section: Singular Items Setup */}
      {type === "singular" && (
        <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
            Barang & Satuan Inventaris
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RemoteSelect
              label="Barang Inventaris"
              placeholder="Pilih Barang"
              value={singularItem}
              hook={inventoryItemsResult as any}
              fetchData={(page, search) =>
                getInventoryItems({ page, search, is_active: "true" }) as any
              }
              getLabel={(item: any) =>
                item
                  ? `${item.name} [Rp ${Number(item.base_price).toLocaleString(
                      "id-ID",
                    )}]`
                  : ""
              }
              getValue={(item: any) => item?.id}
              onChange={handleSingularItemChange}
              onClear={handleSingularItemClear}
              required
              error={FormState?.errors?.item_id as string}
            />
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">
                Satuan Barang (Fraction) *
              </label>
              <select
                value={formData.fraction_id}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const fraction =
                    singularFractionsList.find((f) => f.id === id) || null;
                  setSingularFraction(fraction);
                  setFormData((prev) => ({ ...prev, fraction_id: id }));
                }}
                disabled={
                  !formData.item_id || singularFractionsList.length === 0
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value={0}>Pilih Satuan</option>
                {singularFractionsList.map((frac) => (
                  <option key={frac.id} value={frac.id}>
                    {frac.name} (Kuantitas: {frac.quantity})
                  </option>
                ))}
              </select>
              {(FormState?.errors?.fraction_id as string) && (
                <span className="text-xs text-red-500 font-semibold mt-1">
                  {FormState?.errors?.fraction_id as string}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section: Bundle Items Setup */}
      {type === "bundle" && (
        <div className="card-table bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Daftar Barang Paket Bundle
            </h2>
            <button
              type="button"
              onClick={addBundleRow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris
            </button>
          </div>
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3 min-w-[240px]">Barang Inventaris</th>
                  <th className="px-4 py-3 min-w-[200px]">
                    Satuan Barang (Qty)
                  </th>
                  <th className="px-4 py-3 w-28 text-center">Kuantitas</th>
                  <th className="px-4 py-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.bundles.map((bundle, idx) => {
                  // Fetch fractions list for this bundle item
                  const fractionsList = bundle.itemSelected?.fractions || [];
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-4 py-3 align-middle text-center text-sm font-semibold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <RemoteSelect
                          placeholder="Pilih barang..."
                          value={bundle.itemSelected}
                          hook={inventoryItemsResult as any}
                          fetchData={(page, search) =>
                            getInventoryItems({
                              page,
                              search,
                              is_active: "true",
                            }) as any
                          }
                          getLabel={(item: any) =>
                            item
                              ? `${
                                  item.name
                                } [Rp ${Number(
                                  item.base_price,
                                ).toLocaleString("id-ID")}]`
                              : ""
                          }
                          getValue={(item: any) => item?.id}
                          onChange={(val) => handleBundleItemChange(idx, val)}
                          onClear={() => handleBundleItemClear(idx)}
                          error={getErrorItem(idx, "item_id")}
                        />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <select
                          value={bundle.fraction_id}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            const frac =
                              fractionsList.find((fracItem: any) => fracItem.id === id) ||
                              null;
                            handleBundleFractionChange(idx, frac);
                          }}
                          disabled={
                            !bundle.item_id || fractionsList.length === 0
                          }
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                          <option value={0}>Pilih Satuan</option>
                          {fractionsList.map((frac: any) => (
                            <option key={frac.id} value={frac.id}>
                              {frac.name} (Qty: {frac.quantity})
                            </option>
                          ))}
                        </select>
                        {getErrorItem(idx, "fraction_id") && (
                           <span className="text-xs text-red-500 font-semibold mt-1 block">
                            {getErrorItem(idx, "fraction_id")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <Input
                          type="number"
                          variant="primary"
                          className="text-center h-10"
                          value={bundle.quantity}
                          onChange={(e) =>
                            handleBundleQtyChange(idx, Number(e.target.value))
                          }
                          min={1}
                          error={getErrorItem(idx, "quantity")}
                        />
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <button
                          type="button"
                          onClick={() => removeBundleRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={formData.bundles.length === 1}
                          title="Hapus baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section: Pricing Summary Card */}
      <div className="bg-slate-100 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Kalkulasi Harga Jual
          </span>
          <div className="flex items-center gap-4 mt-1">
            <div>
              <span className="text-xs text-slate-400">
                Total Harga Dasar (HPP)
              </span>
              <p className="text-sm font-bold text-slate-700 mono">
                Rp {computedPricing.basePrice.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-slate-300">|</div>
            <div>
              <span className="text-xs text-slate-400">
                Margin Komisi ({formData.commission}%)
              </span>
              <p className="text-sm font-bold text-slate-700 mono">
                Rp{" "}
                {Math.round(
                  (computedPricing.basePrice * formData.commission) / 100,
                ).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center md:text-right">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Harga Jual Katalog
          </span>
          <p className="text-2xl font-black text-emerald-600 mono mt-0.5">
            Rp {Math.round(computedPricing.sellingPrice).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </form>
  );
}
