import { useState, useMemo, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";
import { currencyFormat } from "@/utils/common";
import { useInventoryItem, useItemFractions } from "@/services/inventory/hooks";

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
  image?: string;
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
  const { show: showFractionsQuery, showResult: showFractionsResult } =
    useItemFractions();

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
    image: "",
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
      image: "",
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
        image: initialData.image ?? "",
        item_id: initialData.item_id ?? 0,
        fraction_id: initialData.fraction_id ?? 0,
        bundles:
          isBundle && initialData.bundles
            ? initialData.bundles.map((b: any) => ({
                itemSelected: b.item ?? {
                  id: b.item_id,
                  name: `Barang #${b.item_id}`,
                  base_price: 0,
                },
                item_id: b.item_id,
                fractionSelected: b.fraction ?? {
                  id: b.fraction_id,
                  name: `Satuan #${b.fraction_id}`,
                  quantity: 1,
                },
                fraction_id: b.fraction_id,
                quantity: b.quantity ?? 1,
              }))
            : [],
      });

      if (!isBundle && initialData.item_id) {
        setSingularItem(
          initialData.item ?? {
            id: initialData.item_id,
            name: `Barang #${initialData.item_id}`,
            base_price: 0,
          },
        );
        setSingularFraction(
          initialData.fraction ?? {
            id: initialData.fraction_id,
            name: `Satuan #${initialData.fraction_id}`,
            quantity: 1,
          },
        );
        if ((initialData.item as any)?.fractions) {
          setSingularFractionsList((initialData.item as any).fractions);
        } else {
          showFractionsQuery({ id: initialData.item_id });
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
      showFractionsQuery({ id: item?.id });
    }
  };

  useEffect(() => {
    if (showFractionsResult?.isSuccess) {
      setSingularFractionsList(showFractionsResult?.data?.data as any);
    }
  }, [showFractionsResult]);

  const handleBundleFractionClear = (idx: number) => {
    setFormData((prev) => {
      const newBundles = [...prev.bundles];
      newBundles[idx] = {
        ...newBundles[idx],
        fraction_id: 0,
        fractionSelected: null,
      };
      return { ...prev, bundles: newBundles };
    });
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast({
          message: "Ukuran file terlalu besar, maksimal 2MB",
          type: "error",
          position: "bottom-center",
          duration: 3000,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: InventoryCatalogFormData = {
      name: formData.name,
      commission: Number(formData.commission),
      is_bundle: formData.is_bundle,
      description: formData.description,
      unit_price: Number(formData.unit_price),
      image: formData.image || undefined,
      item_id: type === "singular" ? formData.item_id : undefined,
      fraction_id: type === "singular" ? formData.fraction_id : undefined,
      type,
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
    <form
      id={id}
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto space-y-6"
    >
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
      <div
        className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm"
        style={{ overflow: "visible", zIndex: 15 }}
      >
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Informasi Utama
          </h2>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              <Input
                label="Harga Jual"
                required
                type="currency"
                value={formData.unit_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    unit_price: Number(e.target.value),
                  }))
                }
                placeholder="Contoh: 15000"
                variant="primary"
                min={0}
                error={FormState?.errors?.unit_price as string}
              />
            </div>
            <Input
              label="Deskripsi Katalog (Opsional)"
              type="textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Keterangan lengkap produk atau isi paket bundle..."
              variant="primary"
              className="min-h-[100px] py-2"
            />
          </div>

          {/* Right Column: Catalog Image Upload */}
          <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6 space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase self-start mb-1">
              Gambar Katalog (Opsional)
            </label>
            {formData.image ? (
              <div className="relative group w-full max-w-[200px] aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-slate-600" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                    title="Hapus Gambar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-full max-w-[200px] aspect-square border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-600">
                  Pilih Gambar
                </span>
                <span className="text-[10px] text-slate-400">
                  Maks. 2MB (JPG, PNG, WEBP)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
            {typeof FormState?.errors?.image === "string" && (
              <span className="text-xs text-red-500 font-semibold">
                {FormState.errors.image}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section: Singular Items Setup */}
      {type === "singular" && (
        <div
          className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Barang & Satuan
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <RemoteSelect
              label="Barang"
              placeholder="Pilih Barang"
              value={singularItem}
              hook={inventoryItemsResult as any}
              fetchData={(page, search) =>
                getInventoryItems({ page, search, status: "active" }) as any
              }
              getLabel={(item: any) =>
                item ? `${item.name}  [${currencyFormat(item.base_price)}]` : ""
              }
              getValue={(item: any) => item?.id}
              onChange={handleSingularItemChange}
              onClear={handleSingularItemClear}
              required
              error={FormState?.errors?.item_id as string}
            />
            <RemoteSelect
              label="Satuan Barang (Fraction)"
              placeholder="Pilih Satuan"
              value={singularFraction}
              hook={showFractionsResult as any}
              fetchData={(page, search) => {
                // Fetch fractions for the currently selected singular item
                if (formData.item_id) {
                  showFractionsQuery({
                    id: formData.item_id,
                    params: {
                      page,
                      search,
                    },
                  }) as any;
                }
              }}
              getLabel={(fraction: any) =>
                fraction
                  ? `${fraction.name} (Kuantitas: ${fraction.quantity})`
                  : ""
              }
              getValue={(fraction: any) => fraction?.id}
              onChange={(fraction: any) => {
                setSingularFraction(fraction);
                setFormData((prev) => ({
                  ...prev,
                  fraction_id: fraction?.id ?? 0,
                }));
              }}
              onClear={() => {
                setSingularFraction(null);
                setFormData((prev) => ({ ...prev, fraction_id: 0 }));
              }}
              required
              disabled={!formData.item_id || singularFractionsList.length === 0}
              error={FormState?.errors?.fraction_id as string}
            />
          </div>
        </div>
      )}

      {/* Section: Bundle Items Setup */}
      {type === "bundle" && (
        <div
          className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
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
                  <th className="px-4 py-3 min-w-[240px]">Barang</th>
                  <th className="px-4 py-3 min-w-[200px]">
                    Satuan Barang (Qty)
                  </th>
                  <th className="px-4 py-3 w-28 text-center">Kuantitas</th>
                  <th className="px-4 py-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.bundles.map((bundle, idx) => {
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
                              status: "active",
                            }) as any
                          }
                          getLabel={(item: any) =>
                            item
                              ? `${item.name} [${currencyFormat(
                                  item.base_price,
                                )}]`
                              : ""
                          }
                          getValue={(item: any) => item?.id}
                          onChange={(val) => handleBundleItemChange(idx, val)}
                          onClear={() => handleBundleItemClear(idx)}
                          error={getErrorItem(idx, "item_id")}
                        />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <RemoteSelect
                          placeholder="Pilih satuan..."
                          value={bundle.fractionSelected}
                          hook={showFractionsResult as any}
                          fetchData={(page, search) => {
                            if (bundle.item_id) {
                              showFractionsQuery({
                                id: bundle.item_id,
                                params: {
                                  page,
                                  search,
                                },
                              }) as any;
                            }
                          }}
                          getLabel={(fraction: any) =>
                            fraction
                              ? `${fraction.name} (Qty: ${fraction.quantity})`
                              : ""
                          }
                          getValue={(fraction: any) => fraction?.id}
                          onChange={(val) =>
                            handleBundleFractionChange(idx, val)
                          }
                          onClear={() => handleBundleFractionClear(idx)}
                          disabled={!bundle.item_id}
                          error={getErrorItem(idx, "fraction_id")}
                          watchKey={bundle?.item_id}
                        />
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
      <div className="card-animate bg-white border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
        <div className="space-y-1 text-center md:text-left pl-2">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Kalkulasi Harga Jual
          </span>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">
                Total Harga Dasar (HPP)
              </span>
              <p className="text-base font-bold text-slate-800 tracking-tight">
                {currencyFormat(computedPricing.basePrice)}
              </p>
            </div>
            <div className="hidden md:block text-slate-200 text-lg">|</div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">
                Estimasi Margin Keuntungan
              </span>
              <p className="text-base font-bold text-slate-800 tracking-tight">
                {currencyFormat(
                  (Number(formData.unit_price) || 0) - computedPricing.basePrice
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center md:text-right bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 min-w-[200px]">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Harga Jual Katalog
          </span>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {currencyFormat(formData.unit_price)}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">
            Saran: {currencyFormat(Math.round(computedPricing.sellingPrice))}
          </span>
        </div>
      </div>
    </form>
  );
}
