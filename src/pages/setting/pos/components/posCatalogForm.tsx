import { useState, useEffect } from "react";
import { Input, Checkbox, RemoteSelect } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";
import {
  usePOSCategory,
  usePOSChannel,
  usePOSCatalog,
} from "@/services/pos/hooks";

export interface ActiveChannelRow {
  channel_id: number;
  name: string;
  is_active: number;
  unit_price: number;
}

export interface AdditionalOption {
  additionalSelected: any | null;
  additional_id: number;
}

export interface AddonGroupInput {
  name: string;
  required: number;
  options: AdditionalOption[];
}

export interface PosCatalogFormData extends Record<string, unknown> {
  name: string;
  sku: string;
  barcode: string;
  pos_category_id: number;
  base_price: number;
  is_vatable: number;
  is_additional: number;
  image: string;
  channels: { channel_id: number; unit_price: number }[];
  additionals: { name: string; required: number; child_ids: number[] }[];
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
    sku: "",
    barcode: "",
    pos_category_id: 0,
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
        if (response?.data?.data?.data) {
          const mapped = response.data.data.data.map((chan: any) => ({
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
        sku: initialData.sku ?? "",
        barcode: initialData.barcode ?? "",
        pos_category_id: initialData.pos_category_id ?? 0,
        base_price: initialData.base_price ?? 0,
        is_vatable: initialData.is_vatable ?? 0,
        is_additional: initialData.is_additional ?? 0,
        image: initialData.image ?? "",
      });

      if (initialData.pos_category_id) {
        // Assume loaded category selected mapping or resolve it
        setCategorySelected({
          id: initialData.pos_category_id,
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
            required: group.required,
            options: group.child_ids.map((id: number) => ({
              additionalSelected: { id, name: `Topping #${id}` }, // placeholder
              additional_id: id,
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
        required: 0,
        options: [
          {
            additionalSelected: null,
            additional_id: 0,
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

  const handleAddonGroupRequiredToggle = (
    groupIndex: number,
    required: boolean,
  ) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex] = {
        ...updated[groupIndex],
        required: required ? 1 : 0,
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
            additionalSelected: null,
            additional_id: 0,
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
        (opt, idx) => idx !== optionIndex && opt.additional_id === product?.id,
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
        additionalSelected: product,
        additional_id: product?.id || 0,
      };
      return updated;
    });
  };

  const handleAddonOptionClear = (groupIndex: number, optionIndex: number) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].options[optionIndex] = {
        additionalSelected: null,
        additional_id: 0,
      };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PosCatalogFormData = {
      ...formData,
      is_vatable: Number(formData.is_vatable),
      is_additional: Number(formData.is_additional),
      base_price: Number(formData.base_price),
      // Filter out only active channel rows
      channels: channelsList
        .filter((row) => row.is_active === 1)
        .map((row) => ({
          channel_id: row.channel_id,
          unit_price: Number(row.unit_price),
        })),
      // Map addon groups payload structure
      additionals:
        formData.is_additional === 0
          ? addonGroups.map((group) => ({
              name: group.name,
              required: Number(group.required),
              child_ids: group.options.map((opt) => opt.additional_id),
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
    <form id={id} onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-5">
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
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
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
            label="SKU Produk"
            required
            value={formData.sku}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sku: e.target.value }))
            }
            placeholder="Contoh: K-ROTCOKKEJ"
            variant="primary"
            error={FormState?.errors?.sku as string}
          />
          <Input
            label="Barcode / EAN (Opsional)"
            value={formData.barcode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, barcode: e.target.value }))
            }
            placeholder="E.g. 8991234567890"
            variant="primary"
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
                pos_category_id: val?.id || 0,
              }));
            }}
            onClear={() => {
              setCategorySelected(null);
              setFormData((prev) => ({ ...prev, pos_category_id: 0 }));
            }}
            required
            error={FormState?.errors?.pos_category_id as string}
          />
          <Input
            label="Harga Dasar POS (Rp)"
            required
            type="number"
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
          <div className="flex gap-6 items-center pt-5">
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
            Aktifkan channel dan tentukan harga khusus per channel jika berbeda
            dari harga dasar.
          </p>
        </div>
        <div style={{ overflow: "visible" }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-4 py-3 w-20 text-center">Status</th>
                <th className="px-4 py-3">Nama Channel</th>
                <th className="px-4 py-3 text-right w-64">
                  Harga Jual Channel (Rp)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {channelsList.map((row, idx) => (
                <tr
                  key={row.channel_id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-4 py-3 align-middle text-center">
                    <input
                      type="checkbox"
                      checked={row.is_active === 1}
                      onChange={(e) =>
                        handleChannelActiveToggle(idx, e.target.checked)
                      }
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 align-middle text-sm font-semibold text-slate-700">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <Input
                      type="number"
                      disabled={row.is_active === 0}
                      value={row.unit_price}
                      onChange={(e) =>
                        handleChannelPriceChange(idx, Number(e.target.value))
                      }
                      placeholder="Harga jual channel..."
                      variant="primary"
                      min={0}
                      className="text-right h-9"
                    />
                  </td>
                </tr>
              ))}
              {channelsList.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-sm text-slate-400 italic"
                  >
                    Memuat data channel penjualan...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Add-on Groups (Jika bukan menu tambahan itu sendiri) */}
      {formData.is_additional === 0 && (
        <div
          className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Pengaturan Menu Tambahan (Add-on Groups)
            </h2>
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
                      className="h-9 font-semibold text-slate-700 bg-white"
                      error={getAddonError(groupIdx, "name")}
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <Checkbox
                      label="Wajib Dipilih Konsumen?"
                      checked={group.required === 1}
                      onChange={(e) =>
                        handleAddonGroupRequiredToggle(
                          groupIdx,
                          e.target.checked,
                        )
                      }
                      variant="primary"
                    />
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

                  <div className="space-y-3" style={{ overflow: "visible" }}>
                    {group.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <RemoteSelect
                            placeholder="Pilih topping / menu tambahan..."
                            value={opt.additionalSelected}
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
                          onClick={() => removeAddonOptionRow(groupIdx, optIdx)}
                          disabled={group.options.length === 1}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                Belum ada kelompok add-on yang ditambahkan. Menu ini akan dijual
                tanpa menu tambahan.
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
