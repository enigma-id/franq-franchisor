/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import {
  Input,
  Button,
  RemoteSelect,
  Checkbox,
  ImageUpload,
} from "@/components/ui";
import { usePOSCategory, usePOSChannel, usePOSMenu } from "@/services/pos/hooks";
import type { POSMenuDetail, POSChannelDetail, POSCategoryDetail } from "@/services/types/pos";
import type { ProductCreateRequest } from "@/services/types/product";
import { Plus, Trash2, Layers, Info, Wallet } from "lucide-react";
import { useAppSelector } from "@/hooks";
import type { SelectOptionValue } from "@/services/types/table";
import { useEnigmaUI } from "@/components";

const addonTypeOptions: SelectOptionValue[] = [
  { label: "Quantity", value: "quantity" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Options", value: "options" },
];

type ProductFormState = Omit<
  ProductCreateRequest,
  "channel_prices" | "addon_groups" | "franchisor_id"
>;

interface POSAddonMenuOption {
  id: string;
  name: string;
  base_price?: number;
}

interface POSMenuFormProps {
  id?: string;
  /**
   * Data menu dari detail aggregate (`{ item, catalog, menu }`), sudah di-merge
   * dengan `unit_price`/`production_price` milik catalog oleh halaman update.
   */
  initialData?: Partial<POSMenuDetail> & {
    unit_price?: number;
    production_price?: number;
  };
  /** Scope brand (dari ?franchisor_id). Mengisi payload saat create & mem-filter pilihan. */
  franchisorId?: string;
  /** Mode edit: `is_additional` dikunci (backend menolak perubahannya). */
  isEdit?: boolean;
  onSubmit: (data: ProductCreateRequest) => void;
}

interface POSFormChannelPrice {
  channel: POSChannelDetail | null;
  is_active: boolean;
  price: number;
}

type POSAddonGroupType = "options" | "checkbox" | "quantity";

interface POSAddonItemForm {
  addon_menu: POSAddonMenuOption | null;
  addon_menu_id: string;
}

interface POSAddonGroupForm {
  name: string;
  type: POSAddonGroupType | "";
  items: POSAddonItemForm[] | [];
}

export const POSMenuForm: React.FC<POSMenuFormProps> = ({
  id = "pos-catalog-form",
  initialData,
  franchisorId,
  isEdit = false,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getCategories, getResult: categoriesResult } = usePOSCategory();
  const { get: getChannels, getResult: channelsResult } = usePOSChannel();
  const { get: getMenus, getResult: menusResult } = usePOSMenu();
  const { showToast } = useEnigmaUI();

  const [formData, setFormData] = useState<ProductFormState>({
    category_id: "",
    name: "",
    base_price: 0,
    unit_price: 0,
    production_price: 0,
    image: "",
    is_vatable: false,
    is_additional: false,
  });

  const [channel, setChannel] = useState<POSFormChannelPrice[]>([]);
  const [category, setCategory] = useState<POSCategoryDetail | null>(null);

  const [addGroup, setAddGroup] = useState<POSAddonGroupForm[]>([
    { name: "", type: "", items: [{ addon_menu: null, addon_menu_id: "" }] },
  ]);

  /** Channel aktif = harga produksi diturunkan backend (tidak perlu diisi). */
  const activeChannelCount = useMemo(
    () => channel.filter((c) => c.is_active && c.channel?.id).length,
    [channel],
  );
  const needsProductionPrice = !formData.is_additional && activeChannelCount > 1;

  useEffect(() => {
    getChannels({ status: "active" });
  }, []);

  useEffect(() => {
    if (channelsResult?.isSuccess) {
      const list = channelsResult?.data?.data ?? [];
      if (Array.isArray(list)) {
        const mapped = list.map((chan: any) => ({
          channel: chan,
          is_active: false,
          price: 0,
        }));

        setChannel(mapped);
      }
    }
  }, [channelsResult]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category_id: initialData.category_id ?? "",
        name: initialData.name ?? "",
        base_price: initialData.base_price ?? 0,
        unit_price: initialData.unit_price ?? 0,
        production_price: initialData.production_price ?? 0,
        image: initialData.image ?? "",
        is_vatable: initialData.is_vatable ?? false,
        is_additional: initialData.is_additional ?? false,
      });

      if (initialData.channel_prices) {
        setChannel((prev) =>
          prev.map((chan) => {
            const match = initialData.channel_prices?.find(
              (c) => c.pos_channel_id === chan.channel?.id,
            );
            return match
              ? {
                  ...chan,
                  is_active: true,
                  price: match.price,
                }
              : {
                  ...chan,
                  is_active: false,
                };
          }),
        );
      }
      if (initialData.addon_groups && initialData.addon_groups.length > 0) {
        const newAddGroups = initialData.addon_groups.map((group: any) => ({
          name: group.name ?? "",
          type: group.type ?? "",
          items: (group.items || []).map((item: any) => ({
            addon_menu: item.addon_menu ?? null,
            addon_menu_id: item.addon_menu?.id ?? item.addon_menu_id ?? "",
          })),
        }));
        setAddGroup(newAddGroups);
      }

      setCategory(initialData?.category ?? null);
    }
  }, [initialData, channelsResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductCreateRequest = {
      name: formData.name,
      category_id: formData.category_id,
      image: formData.image,
      is_vatable: formData.is_vatable,
      is_additional: formData.is_additional,
      base_price: formData.base_price,
      // Addon tidak punya catalog → unit_price diabaikan backend.
      unit_price: formData.is_additional ? 0 : formData.unit_price,
      // Channel tunggal → backend override dari harga channel; cukup kirim 0.
      production_price: needsProductionPrice ? formData.production_price : 0,
      channel_prices: channel
        .filter((c) => c.is_active)
        .map((c) => ({
          pos_channel_id: c.channel?.id ?? "",
          price: c.price,
        })),
      addon_groups: !formData.is_additional
        ? addGroup
            .filter((group) => group.type !== "")
            .map((group) => ({
              name: group.name,
              type: group.type as POSAddonGroupType,
              items: group.items.map((item) => ({
                addon_menu_id: item.addon_menu?.id ?? "",
              })),
            }))
        : [],
    };

    // Create utk brand tertentu (superuser dari halaman Franchise).
    if (franchisorId && !isEdit) {
      payload.franchisor_id = franchisorId;
    }

    onSubmit(payload);
  };

  const handleChannelActiveToggle = (index: number, active: boolean) => {
    setChannel((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        is_active: active,
        price: active ? updated[index].price : 0,
      };
      return updated;
    });
  };

  const handleChannelPriceChange = (index: number, val: number) => {
    setChannel((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        price: val < 0 ? 0 : val,
      };
      return updated;
    });
  };

  // Addon / Additional Groups Handlers
  const addAddonGroup = () => {
    setAddGroup((prev) => [
      ...prev,
      {
        name: "",
        type: "",
        items: [
          {
            addon_menu: null,
            addon_menu_id: "",
          },
        ],
      },
    ]);
  };

  const removeAddonGroup = (groupIndex: number) => {
    setAddGroup((prev) => prev.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddonGroupNameChange = (groupIndex: number, name: string) => {
    setAddGroup((prev) => {
      const updated = [...prev];
      updated[groupIndex] = { ...updated[groupIndex], name };
      return updated;
    });
  };

  const handleAddonGroupTypeChange = (
    groupIndex: number,
    type: POSAddonGroupType | "",
  ) => {
    setAddGroup((prev) => {
      const updated = [...prev];
      updated[groupIndex] = {
        ...updated[groupIndex],
        type,
      };
      return updated;
    });
  };

  const addAddonOptionRow = (groupIndex: number) => {
    setAddGroup((prev) => {
      const updated = [...prev];
      updated[groupIndex] = {
        ...updated[groupIndex],
        items: [
          ...updated[groupIndex].items,
          {
            addon_menu: null,
            addon_menu_id: "",
          },
        ],
      };
      return updated;
    });
  };

  const removeAddonOptionRow = (groupIndex: number, optionIndex: number) => {
    setAddGroup((prev) => {
      const updated = [...prev];
      if (updated[groupIndex].items.length === 1) {
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
        items: updated[groupIndex].items.filter(
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
    setAddGroup((prev) => {
      const updated = [...prev];
      const currentOptions = updated[groupIndex].items;

      // Uniqueness constraint validation across the current group
      const alreadySelected = currentOptions.some(
        (opt, idx) => idx !== optionIndex && opt.addon_menu_id === product?.id,
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

      updated[groupIndex].items[optionIndex] = {
        addon_menu: product,
        addon_menu_id: product?.id || 0,
      };
      return updated;
    });
  };

  const handleAddonOptionClear = (groupIndex: number, optionIndex: number) => {
    setAddGroup((prev) => {
      const updated = [...prev];
      updated[groupIndex].items[optionIndex] = {
        addon_menu: null,
        addon_menu_id: "",
      };
      return updated;
    });
  };

  const getAddonError = (
    groupIndex: number,
    field: "name" | "type" | string,
    optionIndex?: number,
  ): string | undefined => {
    let key = "";
    if (field === "name") {
      key = `addon_groups.${groupIndex}.name`;
    } else if (field === "type") {
      key = `addon_groups.${groupIndex}.type`;
    } else if (field === "items" && optionIndex !== undefined) {
      key = `addon_groups.${groupIndex}.items.${optionIndex}.addon_menu_id`;
    }
    return typeof FormState?.errors?.[key] === "string"
      ? (FormState.errors[key] as string)
      : undefined;
  };

  const getChannelError = (index: number): string | undefined => {
    const key = `channel_prices.[${index}].price`;
    return typeof FormState?.errors?.[key] === "string"
      ? (FormState.errors[key] as string)
      : undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible! relative z-20">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Layers size={16} className="text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Informasi Dasar
              </h2>
            </div>

            <div className="p-5 space-y-4">
              <Input
                label="Nama Menu"
                placeholder="Contoh: Nasi Goreng Spesial"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={FormState?.errors?.name as string}
              />
              <RemoteSelect<POSCategoryDetail>
                label="Kategori"
                required
                hook={categoriesResult as any}
                fetchData={(page, search) =>
                  franchisorId
                    ? getCategories({ page, search, franchisor_id: franchisorId })
                    : getCategories({ page, search })
                }
                getLabel={(item: any) => item?.name}
                renderItem={(item: any) => item?.name}
                value={category}
                onChange={(item: any) => {
                  setCategory(item);
                  setFormData({ ...formData, category_id: item?.id });
                }}
                onClear={() => {
                  setCategory(null);
                  setFormData({ ...formData, category_id: "" });
                }}
                placeholder="Pilih kategori"
                error={FormState?.errors?.category_id as string}
              />

              <Checkbox
                label="Dikenakan PPN?"
                checked={formData.is_vatable}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_vatable: e.target.checked,
                  }))
                }
                variant="primary"
              />
              <Checkbox
                label="Merupakan menu topping / tambahan?"
                checked={formData.is_additional}
                disabled={isEdit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_additional: e.target.checked,
                  }))
                }
                variant="primary"
              />
              {isEdit && (
                <p className="text-xs text-slate-400 leading-5">
                  Tipe menu (topping / tambahan) tidak dapat diubah setelah
                  dibuat.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section: Image */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-10">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Info size={16} className="text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Gambar Katalog
              </h2>
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, image: url }))
              }
            />
          </div>
        </div>
      </div>

      {/* Section: Harga Produk */}
      <div className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible! z-10">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex items-center gap-2">
          <Wallet size={16} className="text-slate-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Harga Produk
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {formData.is_additional
                ? "Menu tambahan hanya memakai harga dasar."
                : "Harga dasar untuk katalog, harga beli outlet, dan harga jual produksi."}
            </p>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Harga Dasar"
            type="currency"
            required
            value={formData.base_price}
            onChange={(e) =>
              setFormData({
                ...formData,
                base_price: Number(e.target.value),
              })
            }
            prefix="Rp"
            error={FormState?.errors?.base_price as string}
          />

          {!formData.is_additional && (
            <Input
              label="Harga Beli Outlet"
              type="currency"
              required
              value={formData.unit_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unit_price: Number(e.target.value),
                })
              }
              prefix="Rp"
              error={FormState?.errors?.unit_price as string}
            />
          )}

          {needsProductionPrice && (
            <Input
              label="Harga Produksi"
              type="currency"
              required
              value={formData.production_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  production_price: Number(e.target.value),
                })
              }
              prefix="Rp"
              error={FormState?.errors?.production_price as string}
            />
          )}
        </div>

        {!formData.is_additional && !needsProductionPrice && (
          <p className="px-5 pb-4 text-xs text-slate-400 leading-5">
            Harga produksi mengikuti harga channel aktif secara otomatis. Isi
            manual hanya bila channel aktif lebih dari satu.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Section 2: Channel Pricing Matrix */}
        <div className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible! z-10">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Matriks Harga Penjualan POS Channel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aktifkan channel dan tentukan harga khusus per channel jika
              berbeda dari harga dasar.
            </p>
          </div>
          <div className="p-4 overflow-visible!">
            {channel.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400 italic">
                Memuat data channel penjualan...
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {channel.map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      row.is_active
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/40"
                    }`}
                  >
                    <Checkbox
                      size="sm"
                      checked={row.is_active}
                      onChange={(e) =>
                        handleChannelActiveToggle(idx, e.target.checked)
                      }
                      variant="primary"
                    />
                    <span className="flex-1 text-sm font-semibold text-slate-700 truncate">
                      {row.channel?.name}
                    </span>
                    <div className="w-36 shrink-0">
                      <Input
                        prefix="Rp"
                        type="currency"
                        disabled={!row.is_active}
                        value={row.price}
                        onChange={(e) =>
                          handleChannelPriceChange(idx, Number(e.target.value))
                        }
                        placeholder="Harga..."
                        variant="primary"
                        error={getChannelError(idx)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {FormState.errors?.channel_prices ? (
              <div className="text-error text-xs font-medium leading-[1.66] pt-2">
                {FormState.errors?.channel_prices as string}
              </div>
            ) : null}
          </div>
        </div>

        {/* Section 3: Add-on Groups (Jika bukan menu tambahan itu sendiri) */}
        {formData.is_additional === false ? (
          <div
            className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible!"
            style={{ zIndex: 15 }}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
              <div>
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Pengaturan Menu Tambahan
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Addon Menu</p>
              </div>
              <Button
                variant="success"
                styleType="soft"
                onClick={addAddonGroup}
                size="sm"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Tambah Kelompok Add-on
              </Button>
            </div>

            <div className="p-5 space-y-5" style={{ overflow: "visible" }}>
              {addGroup.map((group, groupIdx) => (
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
                              (val?.value as POSAddonGroupType) ?? "",
                            )
                          }
                          onClear={() =>
                            handleAddonGroupTypeChange(groupIdx, "")
                          }
                          error={getAddonError(groupIdx, "type")}
                        />
                      </div>
                      <Button
                        variant="error"
                        styleType="ghost"
                        onClick={() => removeAddonGroup(groupIdx)}
                        type="button"
                      >
                        <Trash2 size={18} />
                      </Button>
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
                      <Button
                        variant="success"
                        styleType="soft"
                        onClick={() => addAddonOptionRow(groupIdx)}
                        size="sm"
                        type="button"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Opsi
                      </Button>
                    </div>

                    <div
                      className="grid grid-cols-1 gap-3"
                      style={{ overflow: "visible" }}
                    >
                      {group.items.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <div className="flex-1">
                            <RemoteSelect
                              placeholder="Pilih topping / menu tambahan..."
                              value={opt.addon_menu}
                              hook={menusResult as any}
                              fetchData={(page, search) =>
                                franchisorId
                                  ? getMenus({
                                      page,
                                      search,
                                      addons: "yes",
                                      is_active: true,
                                      franchisor_id: franchisorId,
                                    })
                                  : getMenus({
                                      page,
                                      search,
                                      addons: "yes",
                                      is_active: true,
                                    })
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
                              error={getAddonError(groupIdx, "items", optIdx)}
                            />
                          </div>
                          <Button
                            variant="error"
                            styleType="ghost"
                            onClick={() =>
                              removeAddonOptionRow(groupIdx, optIdx)
                            }
                            type="button"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {FormState.errors?.addon_groups ? (
                <div className="text-error text-xs font-medium leading-[1.66] pt-1">
                  {FormState.errors?.addon_groups as string}
                </div>
              ) : null}

              {addGroup.length === 0 && (
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
};
