import { useState, useEffect } from "react";
import { Checkbox, Input, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";
import {
  usePOSCategory,
  usePOSChannel,
  usePOSCatalog,
} from "@/services/pos/hooks";

const addonTypeOptions: SelectOptionValue[] = [
  { label: "Quantity", value: "quantity" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Options", value: "options" },
];

export interface ActiveChannelRow {
  channel_id: number;
  name: string;
  is_active: number;
  unit_price: number;
}

export interface AdditionalOption {
  catalogSelected: any | null;
  catalog_id: number;
}

export interface AddonGroupInput {
  name: string;
  type: string;
  options: AdditionalOption[];
}

export interface PosCatalogFormData extends Record<string, unknown> {
  name: string;
  code: string;
  category_id: number;
  base_price: number;
  is_vatable: number;
  is_additional: number;
  image: string;
  channels: {
    channel_id: number;
    name: string;
    is_active: number;
    unit_price: number;
  }[];
  additionals: {
    name: string;
    type: string;
    childs: { catalog_id: number }[];
  }[];
}

interface PosCatalogFormProps {
  id?: string;
  initialData?: Partial<PosCatalogFormData>;
  onSubmit: (data: PosCatalogFormData) => void;
}

export function PosCatalogForm({
  id = "pos-catalog-form",
  initialData,
  onSubmit,
}: PosCatalogFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const { showToast } = useEnigmaUI();

  const { get: getCategories, getResult: categoriesResult } = usePOSCategory();
  const { get: getChannels } = usePOSChannel();
  const { get: getAdditionalProducts, getResult: additionalResult } =
    usePOSCatalog();

  const [categorySelected, setCategorySelected] = useState<any | null>(null);

  // Dynamic state for channel grid mapping
  const [channelsList, setChannelsList] = useState<ActiveChannelRow[]>([]);

  // Addon / Additional Groups State
  const [addonGroups, setAddonGroups] = useState<AddonGroupInput[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category_id: 0,
    base_price: 0,
    is_vatable: 0,
    is_additional: 0,
    image: "", // base64 string placeholder
  });

  // Fetch active channels on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = (await getChannels({ page: 1, limit: 100 })) as any;
        const list = response?.data ?? [];
        if (Array.isArray(list)) {
          const mapped = list.map((chan: any) => ({
            channel_id: chan.id,
            name: chan.name,
            is_active: 0,
            unit_price: 0,
          }));
          setChannelsList(mapped);
        }
      } catch (err) {
        console.error("Failed to load active channels", err);
      }
    };
    fetchChannels();
  }, []);

  // Sync initialData if provided (for Update route compatibility)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        code: initialData.code ?? "",
        category_id: initialData.category_id ?? 0,
        base_price: initialData.base_price ?? 0,
        is_vatable: initialData.is_vatable ?? 0,
        is_additional: initialData.is_additional ?? 0,
        image: initialData.image ?? "",
      });

      if (initialData.category_id) {
        // Assume loaded category selected mapping or resolve it
        setCategorySelected({
          id: initialData.category_id,
          name: "Kategori Terpilih", // placeholder or map from additional loaded state
        });
      }

      if (initialData.channels) {
        setChannelsList((prev) =>
          prev.map((chan) => {
            const match = initialData.channels?.find(
              (c) => c.channel_id === chan.channel_id,
            );
            return match
              ? {
                  ...chan,
                  is_active: 1,
                  unit_price: match.unit_price,
                }
              : chan;
          }),
        );
      }

      if (initialData.additionals) {
        const mappedAddons: AddonGroupInput[] = initialData.additionals.map(
          (group: any) => ({
            name: group.name,
            type: group.type ?? "",
            options: group.childs.map((child: any) => ({
              catalogSelected: {
                id: child.catalog_id,
                name: `Topping #${child.catalog_id}`,
              }, // placeholder
              catalog_id: child.catalog_id,
            })),
          }),
        );
        setAddonGroups(mappedAddons);
      }
    }
  }, [initialData]);

  // Channel toggling and price handlers
  const handleChannelActiveToggle = (index: number, active: boolean) => {
    setChannelsList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        is_active: active ? 1 : 0,
        unit_price: active
          ? updated[index].unit_price || formData.base_price
          : 0,
      };
      return updated;
    });
  };

  const handleChannelPriceChange = (index: number, val: number) => {
    setChannelsList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        unit_price: val < 0 ? 0 : val,
      };
      return updated;
    });
  };

  // Addon / Additional Groups Handlers
  const addAddonGroup = () => {
    setAddonGroups((prev) => [
      ...prev,
      {
        name: "",
        type: "",
        options: [
          {
            catalogSelected: null,
            catalog_id: 0,
          },
        ],
      },
    ]);
  };

  const removeAddonGroup = (groupIndex: number) => {
    setAddonGroups((prev) => prev.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddonGroupNameChange = (groupIndex: number, name: string) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex] = { ...updated[groupIndex], name };
      return updated;
    });
  };

  const handleAddonGroupTypeChange = (groupIndex: number, type: string) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex] = {
        ...updated[groupIndex],
        type,
      };
      return updated;
    });
  };

  const addAddonOptionRow = (groupIndex: number) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex] = {
        ...updated[groupIndex],
        options: [
          ...updated[groupIndex].options,
          {
            catalogSelected: null,
            catalog_id: 0,
          },
        ],
      };
      return updated;
    });
  };

  const removeAddonOptionRow = (groupIndex: number, optionIndex: number) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      if (updated[groupIndex].options.length === 1) {
        showToast({
          message: "Setidaknya harus ada satu opsi add-on dalam kelompok",
          type: "error",
          position: "bottom-center",
          duration: 3000,
        });
        return prev;
      }
      updated[groupIndex] = {
        ...updated[groupIndex],
        options: updated[groupIndex].options.filter(
          (_, idx) => idx !== optionIndex,
        ),
      };
      return updated;
    });
  };

  const handleAddonOptionChange = (
    groupIndex: number,
    optionIndex: number,
    product: any,
  ) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      const currentOptions = updated[groupIndex].options;

      // Uniqueness constraint validation across the current group
      const alreadySelected = currentOptions.some(
        (opt, idx) => idx !== optionIndex && opt.catalog_id === product?.id,
      );

      if (alreadySelected && product) {
        showToast({
          message: "Menu tambahan sudah dipilih dalam kelompok add-on ini",
          type: "error",
          position: "bottom-center",
          duration: 3000,
        });
        return prev;
      }

      updated[groupIndex].options[optionIndex] = {
        catalogSelected: product,
        catalog_id: product?.id || 0,
      };
      return updated;
    });
  };

  const handleAddonOptionClear = (groupIndex: number, optionIndex: number) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].options[optionIndex] = {
        catalogSelected: null,
        catalog_id: 0,
      };
      return updated;
    });
  };

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

    const payload: PosCatalogFormData = {
      category_id: Number(formData.category_id),
      code: formData.code,
      name: formData.name,
      base_price: Number(formData.base_price),
      image: formData.image,
      is_vatable: Number(formData.is_vatable),
      is_additional: Number(formData.is_additional),
      channels: channelsList.map((row) => ({
        name: row.name,
        channel_id: row.channel_id,
        is_active: row.is_active,
        unit_price: Number(row.unit_price),
      })),
      additionals:
        formData.is_additional === 0
          ? addonGroups.map((group) => ({
              type: group.type,
              name: group.name,
              childs: group.options.map((opt) => ({
                catalog_id: opt.catalog_id,
              })),
            }))
          : [],
    };

    onSubmit(payload);
  };

  const getAddonError = (
    groupIndex: number,
    field: "name" | string,
    optionIndex?: number,
  ): string | undefined => {
    let key = "";
    if (field === "name") {
      key = `addon_group.${groupIndex}.name`;
    } else if (field === "option" && optionIndex !== undefined) {
      key = `addon_group.${groupIndex}.option.${optionIndex}`;
    }
    return typeof FormState?.errors?.[key] === "string"
      ? (FormState.errors[key] as string)
      : undefined;
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto space-y-5"
    >
      {/* Section 1: Informasi Utama */}
      <div
        className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm"
        style={{ overflow: "visible", zIndex: 20 }}
      >
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Informasi Menu Utama
          </h2>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Core Identity Fields */}
          <div className="space-y-5">
            <Input
              label="Nama Produk Menu"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Roti Coklat Keju"
              variant="primary"
              error={FormState?.errors?.name as string}
            />

            <Input
              label="Kode Produk"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="Contoh: K-ROTCOKKEJ"
              variant="primary"
              error={FormState?.errors?.code as string}
            />

            <RemoteSelect
              label="Kategori Menu POS"
              placeholder="Pilih Kategori"
              value={categorySelected}
              hook={categoriesResult as any}
              fetchData={(page, search) =>
                getCategories({ page, search, is_active: "true" }) as any
              }
              getLabel={(item: any) => item?.name || ""}
              getValue={(item: any) => item?.id}
              onChange={(val) => {
                setCategorySelected(val);
                setFormData((prev) => ({
                  ...prev,
                  category_id: val?.id || 0,
                }));
              }}
              onClear={() => {
                setCategorySelected(null);
                setFormData((prev) => ({ ...prev, category_id: 0 }));
              }}
              required
              error={FormState?.errors?.category_id as string}
            />

            <Input
              label="Harga Dasar POS (Rp)"
              required
              type="currency"
              value={formData.base_price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  base_price: Number(e.target.value),
                }))
              }
              placeholder="Contoh: 15000"
              variant="primary"
              min={0}
              error={FormState?.errors?.base_price as string}
            />
          </div>

          {/* Right Column: Media & Flags */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-3">
                Gambar Menu (Opsional)
              </label>
              <div className="flex items-start gap-4">
                {formData.image ? (
                  <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-md cursor-pointer">
                        <Plus className="w-4 h-4 text-slate-600" />
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
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-32 h-32 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all group">
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600">
                      Pilih Gambar
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
                <div className="text-[11px] text-slate-400 pt-1">
                  Maks. 2MB (JPG, PNG, WEBP)
                </div>
              </div>
              {typeof FormState?.errors?.image === "string" && (
                <span className="text-xs text-red-500 font-semibold mt-2 block">
                  {FormState.errors.image}
                </span>
              )}
            </div>

            <div className="border-t border-slate-100 pt-5">
              <label className="text-xs font-bold text-slate-600 uppercase block mb-3">
                Pengaturan Tambahan
              </label>
              <div className="space-y-3">
                <Checkbox
                  label="Dikenakan PPN?"
                  checked={formData.is_vatable === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_vatable: e.target.checked ? 1 : 0,
                    }))
                  }
                  variant="primary"
                />
                <Checkbox
                  label="Merupakan menu topping / tambahan?"
                  checked={formData.is_additional === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_additional: e.target.checked ? 1 : 0,
                    }))
                  }
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 & 3: Channel Pricing + Add-on Groups side by side */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        style={{ alignItems: "start" }}
      >
        {/* Section 2: Channel Pricing Matrix */}
        <div
          className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
          style={{ overflow: "visible", zIndex: 15 }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Matriks Harga Penjualan POS Channel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aktifkan channel dan tentukan harga khusus per channel jika
              berbeda dari harga dasar.
            </p>
          </div>
          <div className="p-4" style={{ overflow: "visible" }}>
            {channelsList.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400 italic">
                Memuat data channel penjualan...
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {channelsList.map((row, idx) => (
                  <div
                    key={row.channel_id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      row.is_active === 1
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/40"
                    }`}
                  >
                    <Checkbox
                      checked={row.is_active === 1}
                      onChange={(e) =>
                        handleChannelActiveToggle(idx, e.target.checked)
                      }
                      variant="primary"
                    />
                    <span className="flex-1 text-sm font-semibold text-slate-700 truncate">
                      {row.name}
                    </span>
                    <div className="w-36 shrink-0">
                      <Input
                        type="currency"
                        disabled={row.is_active === 0}
                        value={row.unit_price}
                        onChange={(e) =>
                          handleChannelPriceChange(idx, Number(e.target.value))
                        }
                        placeholder="Harga..."
                        variant="primary"
                        min={0}
                        className="text-right h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Add-on Groups (Jika bukan menu tambahan itu sendiri) */}
        {formData.is_additional === 0 ? (
          <div
            className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
            style={{ overflow: "visible", zIndex: 10 }}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
              <div>
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Pengaturan Menu Tambahan
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Addon Menu</p>
              </div>
              <button
                type="button"
                onClick={addAddonGroup}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Kelompok Add-on
              </button>
            </div>

            <div className="p-5 space-y-5" style={{ overflow: "visible" }}>
              {addonGroups.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 relative space-y-4"
                  style={{ overflow: "visible" }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-3">
                    <div className="flex-1 max-w-md">
                      <Input
                        placeholder="Contoh: Pilih Topping, Tingkat Kemanisan"
                        value={group.name}
                        onChange={(e) =>
                          handleAddonGroupNameChange(groupIdx, e.target.value)
                        }
                        variant="primary"
                        className="font-semibold text-slate-700 bg-white"
                        error={getAddonError(groupIdx, "name")}
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <div style={{ minWidth: 200 }}>
                        <RemoteSelect<SelectOptionValue>
                          placeholder="Tipe Add-on"
                          data={addonTypeOptions}
                          value={
                            group.type
                              ? (addonTypeOptions.find(
                                  (o) => o.value === group.type,
                                ) ?? null)
                              : null
                          }
                          getLabel={(item) =>
                            item ? `Tipe: ${item.label}` : ""
                          }
                          renderItem={(item) => item?.label}
                          onChange={(val) =>
                            handleAddonGroupTypeChange(
                              groupIdx,
                              (val?.value as string) ?? "",
                            )
                          }
                          onClear={() =>
                            handleAddonGroupTypeChange(groupIdx, "")
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAddonGroup(groupIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Kelompok"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Addon Options Sub-table */}
                  <div
                    className="space-y-3 pt-2"
                    style={{ overflow: "visible" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Opsi Pilihan Menu Tambahan
                      </span>
                      <button
                        type="button"
                        onClick={() => addAddonOptionRow(groupIdx)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Opsi
                      </button>
                    </div>

                    <div
                      className="grid grid-cols-1 gap-3"
                      style={{ overflow: "visible" }}
                    >
                      {group.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <div className="flex-1">
                            <RemoteSelect
                              placeholder="Pilih topping / menu tambahan..."
                              value={opt.catalogSelected}
                              hook={additionalResult as any}
                              fetchData={(page, search) =>
                                getAdditionalProducts({
                                  page,
                                  search,
                                  is_additional: "1",
                                  is_active: "true",
                                }) as any
                              }
                              getLabel={(item: any) => item?.name || ""}
                              getValue={(item: any) => item?.id}
                              onChange={(product) =>
                                handleAddonOptionChange(
                                  groupIdx,
                                  optIdx,
                                  product,
                                )
                              }
                              onClear={() =>
                                handleAddonOptionClear(groupIdx, optIdx)
                              }
                              error={getAddonError(groupIdx, "option", optIdx)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeAddonOptionRow(groupIdx, optIdx)
                            }
                            disabled={group.options.length === 1}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                            title="Hapus opsi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {addonGroups.length === 0 && (
                <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400 italic">
                  Belum ada kelompok add-on yang ditambahkan. Menu ini akan
                  dijual tanpa menu tambahan.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div /> /* Empty div to maintain grid layout when addons are hidden */
        )}
      </div>
    </form>
  );
}
