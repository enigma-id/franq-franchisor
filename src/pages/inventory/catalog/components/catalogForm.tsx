/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { Plus, Trash2, Info, Ruler, Layers } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { Button, useEnigmaUI } from "@/components";
import { currencyFormat } from "@/utils/common";
import { useInventoryItem, useItemFractions } from "@/services/inventory/hooks";
import type {
  InventoryCatalogDetail,
  InventoryCatalogRequest,
  InventoryCatalogItem,
  InventoryItemDetail,
  InventoryFractionDetail,
  ItemDetail,
} from "@/services/types/inventory";

interface InventoryCatalogFormProps {
  id?: string;
  initialData?: InventoryCatalogDetail;
  onSubmit: (data: InventoryCatalogRequest) => void;
  isLoading?: boolean;
}

interface BundleItemState extends InventoryCatalogItem {
  itemSelected: ItemDetail | null;
  fractionSelected: InventoryFractionDetail | null;
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
  const { show: getItemFractions, showResult: itemFractionsResult } =
    useItemFractions();

  const [type, setType] = useState<"singular" | "bundle">("singular");

  // Singular Type Selections
  // Accept either InventoryItemDetail or ItemDetail for initial data compatibility
  const [singularItem, setSingularItem] = useState<
    InventoryItemDetail | ItemDetail | null
  >(null);
  const [singularFraction, setSingularFraction] =
    useState<InventoryFractionDetail | null>(null);

  // Form State matching current payload structure
  const [formData, setFormData] = useState<InventoryCatalogRequest>({
    name: "",
    is_bundle: false,
    unit_price: 0,
    measurement: "",
    unit: 1,
    image: "",
    item_id: "",
    fraction_id: "",
  });

  const [bundleItems, setBundleItems] = useState<BundleItemState[]>([]);

  // Toggle singular vs bundle
  const handleTypeChange = (newType: "singular" | "bundle") => {
    setType(newType);
    setSingularItem(null);
    setSingularFraction(null);
    setFormData((prev) => ({
      ...prev,
      is_bundle: newType === "bundle",
      item_id: "",
      fraction_id: "",
      unit_price: 0,
      name: "",
    }));
    setBundleItems(
      newType === "bundle"
        ? [
            {
              item_id: "",
              fraction_id: "",
              quantity: 1,
              margin: 0,
              itemSelected: null,
              fractionSelected: null,
            },
          ]
        : [],
    );
  };

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      const isBundle = initialData.is_bundle;
      setType(isBundle ? "bundle" : "singular");

      console.log(initialData);

      setFormData({
        name: initialData.name ?? "",
        is_bundle: initialData.is_bundle,
        unit_price: initialData.unit_price ?? 0,
        measurement: initialData.measurement ?? "",
        unit: initialData.unit ?? 1,
        image: initialData.image ?? "",
        item_id: initialData.item_id ?? "",
        fraction_id: initialData.fraction_id ?? "",
      });

      if (isBundle && initialData.bundle_items) {
        setBundleItems(
          initialData.bundle_items.map((b) => ({
            item_id: b.item_id,
            fraction_id: b.fraction_id ?? "",
            quantity: b.quantity,
            margin: b.margin,
            itemSelected: b.item ?? null,
            fractionSelected: b?.fraction,
          })),
        );
      }

      if (!isBundle && initialData.item) {
        setSingularItem(initialData.item);
        if (initialData.item_fraction) {
          setSingularFraction({
            id: initialData.item_fraction.name,
            item_id: initialData.item_fraction.item_id,
            name: initialData.item_fraction.name,
            quantity: initialData.item_fraction.quantity,
            is_smallest: initialData.item_fraction.is_smallest,
          });
        }
      }
    }
  }, [initialData]);

  // Singular Item & Fraction Changes
  const handleSingularItemChange = (
    item: InventoryItemDetail | ItemDetail | null,
  ) => {
    setSingularItem(item);
    setSingularFraction(null);
    setFormData((prev) => ({
      ...prev,
      name: item?.alias_name || item?.name || prev.name,
      item_id: item?.id || "",
      fraction_id: "",
    }));
  };

  const handleSingularItemClear = () => {
    setSingularItem(null);
    setSingularFraction(null);
    setFormData((prev) => ({ ...prev, item_id: "", fraction_id: "" }));
  };

  // Bundle Dynamic Table Handlers
  const addBundleRow = () => {
    setBundleItems((prev) => [
      ...prev,
      {
        item_id: "",
        fraction_id: "",
        quantity: 1,
        margin: 0,
        itemSelected: null,
        fractionSelected: null,
      },
    ]);
  };

  const removeBundleRow = (index: number) => {
    if (bundleItems.length === 1) {
      showToast({
        message: "Katalog bundle minimal harus memiliki 1 item barang",
        type: "error",
      });
      return;
    }
    setBundleItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBundleItemChange = (index: number, item: any) => {
    setBundleItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        itemSelected: item,
        item_id: item?.id || "",
        fractionSelected: null,
        fraction_id: "",
      };
      return updated;
    });
  };

  const handleBundleItemClear = (index: number) => {
    setBundleItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        itemSelected: null,
        item_id: "",
        fractionSelected: null,
        fraction_id: "",
      };
      return updated;
    });
  };

  const handleBundleFractionChange = (index: number, fraction: any) => {
    setBundleItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        fractionSelected: fraction,
        fraction_id: fraction?.id || "",
      };
      return updated;
    });
  };

  const handleBundleFractionClear = (index: number) => {
    setBundleItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        fractionSelected: null,
        fraction_id: "",
      };
      return updated;
    });
  };

  const handleBundleQtyChange = (index: number, qty: number) => {
    const validQty = qty < 1 ? 1 : qty;
    setBundleItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: validQty,
      };
      return updated;
    });
  };

  const handleBundleMarginChange = (index: number, margin: number) => {
    setBundleItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        margin: margin,
      };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: InventoryCatalogRequest = {
      ...formData,
      items:
        type === "bundle"
          ? bundleItems.map((bundle) => ({
              item_id: bundle.item_id,
              fraction_id: bundle.fraction_id,
              quantity: bundle.quantity,
              margin: bundle.margin,
            }))
          : undefined,
    };

    onSubmit(payload);
  };

  const getErrorItem = (index: number, field: string) => {
    const errorKey = `bundle_items.${index}.${field}`;
    return typeof FormState?.errors?.[errorKey] === "string"
      ? FormState.errors[errorKey]
      : undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit} className='space-y-6'>
      {/* Section: Type Selector Toggle */}
      <div className='bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-emerald-50 text-emerald-600 rounded-lg'>
            <Layers size={20} />
          </div>
          <div>
            <h4 className='text-sm font-bold text-slate-800'>Tipe Katalog</h4>
            <p className='text-xs text-slate-400'>
              Tentukan apakah katalog berisi satu jenis barang atau paket
              bundel.
            </p>
          </div>
        </div>
        <div className='flex bg-slate-100 p-1 rounded-lg border border-slate-200'>
          <button
            type='button'
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
            type='button'
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

      <div className='grid grid-cols-1 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Section: Informasi Utama (bundle only) */}
          {type === "bundle" && (
            <div className='bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-10'>
              <div className='px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2'>
                <Info size={16} className='text-slate-400' />
                <h2 className='text-sm font-bold text-slate-700 uppercase tracking-wider'>
                  Informasi Utama
                </h2>
              </div>
              <div className='p-5 space-y-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Input
                    label='Nama Katalog'
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder='Contoh: Tepung Terigu Segitiga Biru 10kg'
                    variant='primary'
                    error={FormState?.errors?.name as string}
                  />

                  <Input
                    label='Harga Jual'
                    required
                    type='currency'
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        unit_price: Number(e.target.value),
                      }))
                    }
                    placeholder='Contoh: 15000'
                    variant='primary'
                    min={0}
                    error={FormState?.errors?.unit_price as string}
                  />

                  <Input
                    label='Unit'
                    required
                    type='number'
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        unit: Number(e.target.value),
                      }))
                    }
                    variant='primary'
                    error={FormState?.errors?.unit as string}
                  />
                  <Input
                    label='Satuan'
                    required
                    value={formData.measurement}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        measurement: e.target.value,
                      }))
                    }
                    placeholder='kg, pcs, box'
                    variant='primary'
                    error={FormState?.errors?.measurement as string}
                  />
                </div>
                <div className='p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex gap-3'>
                  <Ruler
                    className='text-indigo-500 shrink-0 mt-0.5'
                    size={16}
                  />
                  <p className='text-[11px] text-indigo-700 leading-relaxed'>
                    <strong>Unit & Satuan:</strong> Deskripsikan porsi terkecil
                    katalog ini. Misal: Beras 5kg, Unit = 5, Satuan = kg.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Items Selection */}
          <div className='bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible relative z-20'>
            <div className='px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Layers size={16} className='text-slate-400' />
                <h2 className='text-sm font-bold text-slate-700 uppercase tracking-wider'>
                  {type === "singular"
                    ? "Barang & Satuan"
                    : "Item Paket Bundle"}
                </h2>
              </div>
              {type === "bundle" && (
                <Button
                  variant='success'
                  onClick={addBundleRow}
                  styleType='soft'
                  size='sm'
                >
                  <Plus className='w-4 h-4' />
                  Tambah
                </Button>
              )}
            </div>

            <div className='p-5'>
              {type === "singular" ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <RemoteSelect
                    label='Barang'
                    placeholder='Pilih Barang'
                    value={singularItem}
                    hook={inventoryItemsResult as any}
                    fetchData={(page, search) =>
                      getInventoryItems({ page, search, status: "active" })
                    }
                    getLabel={(item: any) =>
                      item
                        ? `${item.alias_name || item.name} [${currencyFormat(item.base_price)}]`
                        : ""
                    }
                    getValue={(item: any) => item?.id}
                    onChange={handleSingularItemChange}
                    onClear={handleSingularItemClear}
                    required
                    error={FormState?.errors?.item_id as string}
                  />
                  <RemoteSelect
                    label='Satuan Barang (Fraction)'
                    placeholder='Pilih Satuan'
                    value={singularFraction}
                    hook={itemFractionsResult as any}
                    fetchData={(page, search) => {
                      if (formData.item_id) {
                        getItemFractions({
                          id: formData.item_id,
                          params: { page, search },
                        });
                      }
                    }}
                    getLabel={(fraction: any) =>
                      fraction
                        ? `${fraction.name} (Qty: ${fraction.quantity})`
                        : ""
                    }
                    getValue={(fraction: any) => fraction?.id}
                    onChange={(fraction: any) => {
                      setSingularFraction(fraction);
                      setFormData((prev) => ({
                        ...prev,
                        fraction_id: fraction?.id ?? "",
                      }));
                    }}
                    onClear={() => {
                      setSingularFraction(null);
                      setFormData((prev) => ({ ...prev, fraction_id: "" }));
                    }}
                    required
                    disabled={!formData.item_id}
                    error={FormState?.errors?.fraction_id as string}
                    watchKey={formData.item_id}
                  />
                  <Input
                    label='Harga Jual'
                    required
                    type='currency'
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        unit_price: Number(e.target.value),
                      }))
                    }
                    placeholder='Contoh: 15000'
                    variant='primary'
                    min={0}
                    error={FormState?.errors?.unit_price as string}
                  />
                  <Input
                    label='Unit'
                    required
                    type='number'
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        unit: Number(e.target.value),
                      }))
                    }
                    variant='primary'
                    error={FormState?.errors?.unit as string}
                  />
                  <Input
                    label='Satuan'
                    required
                    value={formData.measurement}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        measurement: e.target.value,
                      }))
                    }
                    placeholder='kg, pcs, box'
                    variant='primary'
                    error={FormState?.errors?.measurement as string}
                  />
                </div>
              ) : (
                <div className=''>
                  <table className='w-full text-left border-collapse min-w-150'>
                    <thead>
                      <tr className='bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider'>
                        <th className='px-3 py-3 w-10 text-center'>#</th>
                        <th className='px-3 py-3 min-w-50'>Barang</th>
                        <th className='px-3 py-3 min-w-37.5'>Satuan</th>
                        <th className='px-3 py-3 w-20 text-center'>Qty</th>
                        <th className='px-3 py-3 w-20 text-center'>Margin</th>
                        <th className='px-3 py-3 w-10'></th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                      {bundleItems.map((item, idx) => (
                        <tr key={idx} className='group hover:bg-slate-50/50'>
                          <td className='px-3 py-4 text-center text-xs font-semibold text-slate-400'>
                            {idx + 1}
                          </td>
                          <td className='px-3 py-4'>
                            <RemoteSelect
                              placeholder='Barang...'
                              value={item.itemSelected}
                              hook={inventoryItemsResult as any}
                              fetchData={(page, search) =>
                                getInventoryItems({
                                  page,
                                  search,
                                  status: "active",
                                })
                              }
                              getLabel={(it: any) => it?.alias_name || it?.name}
                              getValue={(it: any) => it?.id}
                              onChange={(it: any) =>
                                handleBundleItemChange(idx, it)
                              }
                              onClear={() => handleBundleItemClear(idx)}
                              error={getErrorItem(idx, "item_id")}
                            />
                          </td>
                          <td className='px-3 py-4'>
                            <RemoteSelect
                              placeholder='Satuan...'
                              value={item.fractionSelected}
                              hook={itemFractionsResult as any}
                              fetchData={(page, search) => {
                                if (item.item_id) {
                                  getItemFractions({
                                    id: item.item_id,
                                    page,
                                    search,
                                  });
                                }
                              }}
                              getLabel={(it: any) => it?.name}
                              getValue={(it: any) => it?.id}
                              onChange={(it: any) =>
                                handleBundleFractionChange(idx, it)
                              }
                              onClear={() => handleBundleFractionClear(idx)}
                              disabled={!item.item_id}
                              error={getErrorItem(idx, "item_fraction_id")}
                              watchKey={item.item_id}
                            />
                          </td>
                          <td className='px-3 py-4'>
                            <Input
                              type='number'
                              value={item.quantity}
                              onChange={(e) =>
                                handleBundleQtyChange(
                                  idx,
                                  Number(e.target.value),
                                )
                              }
                              className='text-center'
                              min={1}
                              error={getErrorItem(idx, "quantity")}
                            />
                          </td>
                          <td className='px-3 py-4'>
                            <Input
                              type='number'
                              value={item.margin}
                              onChange={(e) =>
                                handleBundleMarginChange(
                                  idx,
                                  Number(e.target.value),
                                )
                              }
                              className='text-center'
                              error={getErrorItem(idx, "margin")}
                            />
                          </td>
                          <td className='px-3 py-4 text-center'>
                            <Button
                              variant='error'
                              styleType='ghost'
                              onClick={() => removeBundleRow(idx)}
                              disabled={bundleItems.length === 1}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
