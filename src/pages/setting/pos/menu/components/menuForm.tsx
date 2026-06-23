/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  RemoteSelect,
  Checkbox,
  ImageUpload,
} from "@/components/ui";
import {
  usePOSCategory,
  usePOSChannel,
  usePOSMenu,
} from "@/services/pos/hooks";
import type {
  POSMenuDetail,
  POSMenuCreateRequest,
  POSMenuBase,
  POSChannelDetail,
  POSCategoryDetail,
} from "@/services/types/pos";
import { Plus, Trash2, Layers, Info } from "lucide-react";
import type { InventoryItemDetail } from "@/services/types";
import { useAppSelector } from "@/hooks";
import type { SelectOptionValue } from "@/services/types/table";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { useEnigmaUI } from "@/components";
import clsx from "clsx";

const addonTypeOptions: SelectOptionValue[] = [
  { label: "Quantity", value: "quantity" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Options", value: "options" },
];

interface POSMenuFormProps {
  id?: string;
  initialData?: Partial<POSMenuDetail>;
  onSubmit: (data: POSMenuCreateRequest) => void;
}

interface POSFormChannelPrice {
  channel: POSChannelDetail | null;
  is_active: boolean;
  price: number;
}

interface POSIngredientForm {
  catalog: InventoryItemDetail | null;
  catalog_id: string;
  porsi: number;
}

type POSAddonGroupType = "options" | "checkbox" | "quantity";

interface POSAddonItemForm {
  addon_menu: InventoryItemDetail | null;
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
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getCategories, getResult: categoriesResult } = usePOSCategory();
  const { get: getChannels, getResult: channelsResult } = usePOSChannel();
  const { get: getCatalog, getResult: catalogResult } = useInventoryCatalog();
  const { get: getMenus, getResult: menusResult } = usePOSMenu();
  const { showToast } = useEnigmaUI();

  const [formData, setFormData] = useState<POSMenuBase>({
    category_id: "",
    name: "",
    base_price: 0,
    image: "",
    is_vatable: false,
    is_additional: false,
  });

  const [channel, setChannel] = useState<POSFormChannelPrice[]>([]);
  const [category, setCategory] = useState<POSCategoryDetail | null>(null);

  const [ingredient, setIngredient] = useState<POSIngredientForm[]>([
    {
      catalog: null,
      catalog_id: "",
      porsi: 0,
    },
  ]);

  const [addGroup, setAddGroup] = useState<POSAddonGroupForm[]>([
    { name: "", type: "", items: [{ addon_menu: null, addon_menu_id: "" }] },
  ]);

  useEffect(() => {
    getChannels({ status: "active" });
  }, []);

  useEffect(() => {
    if (channelsResult?.isSuccess) {
      const list = channelsResult?.data?.data ?? [];
      if (Array.isArray(list)) {
        const mapped = list.map((chan: any) => ({
          channel: chan,
          is_active: true,
          price: 0,
        }));

        setChannel(mapped);
      }
    }
  }, [channelsResult]);

  useEffect(() => {
    if (initialData) {
      const newIng = (initialData.ingredients || []).map((item: any) => {
        return {
          catalog: item?.catalog,
          catalog_id: item?.catalog_id,
          porsi: item?.porsi,
        };
      });

      setIngredient(newIng);

      setFormData({
        category_id: initialData.category_id ?? "",
        name: initialData.name ?? "",
        base_price: initialData.base_price ?? 0,
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
      setCategory(initialData?.category ?? null);
    }
  }, [initialData, channelsResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      channel_prices: channel.map((c) => ({
        pos_channel_id: c.channel?.id ?? "",
        price: c.price,
      })),
      ingredients: ingredient.map((c) => ({
        catalog_id: c.catalog?.id ?? "",
        porsi: c.porsi,
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

    onSubmit(payload as unknown as POSMenuCreateRequest);
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

  const updateIngredient = (
    index: number,
    field: keyof POSIngredientForm,
    value: any,
  ) => {
    setIngredient((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addIngredient = () => {
    setIngredient((prev) => [
      ...prev,
      { catalog: null, catalog_id: "", porsi: 0 },
    ]);
  };

  const removeIngredient = (index: number) => {
    if (index === 0) return;
    setIngredient((prev) => prev.filter((_, i) => i !== index));
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-10">
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
              <div className="grid grid-cols-2 gap-3">
                <RemoteSelect<POSCategoryDetail>
                  label="Kategori"
                  required
                  hook={categoriesResult as any}
                  fetchData={(page, search) => getCategories({ page, search })}
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
              </div>

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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_additional: e.target.checked,
                  }))
                }
                variant="primary"
              />
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

      <div className="grid grid-cols-2 gap-5">
        {/* Section 2: Channel Pricing Matrix */}
        <div
          className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
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
            className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
            style={{ overflow: "visible", zIndex: 15 }}
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
                                getMenus({
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
      <div>
        <div
          className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Bahan Baku
              </h2>
              <Button
                variant="success"
                styleType="soft"
                size="sm"
                onClick={addIngredient}
                type="button"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </Button>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {ingredient.map((ig, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all bg-white  hover:border-violet-300",
                      FormState.errors?.ingredients
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
                          hook={catalogResult as any}
                          fetchData={(page, search) =>
                            getCatalog({ page, search })
                          }
                          getLabel={(it: any) => it?.name}
                          getValue={(cat: any) => cat?.id}
                          value={ig.catalog} // Simplification for now
                          onChange={(it: any) => {
                            updateIngredient(index, "catalog", it);
                          }}
                          error={
                            (typeof FormState?.errors?.[
                              `ingredients.${index}.catalog_id`
                            ] === "string"
                              ? FormState.errors?.[
                                  `ingredients.${index}.catalog_id`
                                ]
                              : undefined) as any
                          }
                        />
                      </div>
                    </div>
                    <div className="w-28">
                      <Input
                        label="Porsi"
                        type="number"
                        value={ig.porsi}
                        onChange={(e) =>
                          updateIngredient(
                            index,
                            "porsi",
                            Number(e.target.value),
                          )
                        }
                        variant="primary"
                        error={
                          (typeof FormState?.errors?.[
                            `ingredients.${index}.porsi`
                          ] === "string"
                            ? FormState.errors?.[`ingredients.${index}.porsi`]
                            : undefined) as any
                        }
                      />
                    </div>
                    <Button
                      variant="error"
                      styleType="ghost"
                      onClick={() => removeIngredient(index)}
                      disabled={index === 0}
                      className="mt-7"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
        </div>
      </div>
    </form>
  );
};
