/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Trash2, Plus, ShoppingBag, Percent } from "lucide-react";
import { Input, RemoteSelect, DatePicker, Button, Checkbox } from "@/components/ui";
import { usePOSMenu, usePOSChannel } from "@/services/pos/hooks";
import { useAppSelector } from "@/hooks";
import dayjs, { Dayjs } from "dayjs";
import { currencyFormat } from "@/utils";
import type { B2BOrderDetail } from "@/services/types";

type B2BOrderItemForm = {
  menuSelected: unknown;
  menu_id: string;
  menu_name: string;
  quantity: number;
  unit_price: number;
};

type B2BOrderFormData = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string;
  payment_ref: string;
  shipping_date: string;
  discount_value: number;
  discount_percentage: number;
  is_discount_percentage: boolean;
  service_charge: number;
  items: B2BOrderItemForm[];
};

type RemoteOption = {
  id?: string | number;
  name?: string;
  [k: string]: unknown;
};

interface B2BOrderFormProps {
  id?: string;
  initialData?: B2BOrderDetail;
  onSubmit: (data: B2BOrderFormData) => void;
}

export const B2BOrderForm: React.FC<B2BOrderFormProps> = ({
  id = "b2b-order-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getMenus, getResult: menusResult, getPrices, getPricesResult } = usePOSMenu();
  const { get: getChannels, getResult: channelsResult } = usePOSChannel();

  const [formData, setFormData] = useState<B2BOrderFormData>({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    note: "",
    payment_ref: "",
    shipping_date: dayjs().format("YYYY-MM-DD"),
    discount_value: 0,
    discount_percentage: 0,
    is_discount_percentage: false,
    service_charge: 0,
    items: [
      {
        menuSelected: null,
        menu_id: "",
        menu_name: "",
        quantity: 1,
        unit_price: 0,
      },
    ],
  });

  const [shippingDate, setShippingDate] = useState<Dayjs | null>(dayjs());

  const [channel, setChannel] = useState<RemoteOption | null>(null);
  const [pendingPriceRow, setPendingPriceRow] = useState<number | null>(null);

  // Fetch B2B channel on mount (search=B2B)
  useEffect(() => {
    getChannels({ search: "B2B" });
  }, [getChannels]);

  useEffect(() => {
    if (channelsResult?.isSuccess) {
      const list = (channelsResult?.data?.data ?? []) as unknown as RemoteOption[];
      if (Array.isArray(list) && list.length > 0) {
        setChannel(list[0]);
      }
    }
  }, [channelsResult]);

  useEffect(() => {
    if (initialData) {
      const newItems = (initialData.items || []).map((item: any) => ({
        menuSelected: {
          ...item,
          id: item?.menu_id,
          name: item?.menu_name,
          base_price: item?.unit_base,
        },
        menu_id: item?.menu_id || "",
        menu_name: item?.menu_name || "",
        quantity: item?.quantity || 1,
        unit_price: item?.unit_nett ?? item?.unit_base ?? 0,
      }));

      setFormData({
        customer_name: initialData?.customer_name || "",
        customer_phone: initialData?.customer_phone || "",
        customer_address: initialData?.customer_address || "",
        note: initialData?.note || "",
        payment_ref: (initialData as any)?.payment_ref ?? "",
        shipping_date: dayjs(initialData?.shipping_date).format("YYYY-MM-DD"),
        discount_value: initialData?.discount_value ?? 0,
        discount_percentage:
          (initialData as any)?.discount_percentage ??
          (initialData as any)?.discount ??
          0,
        is_discount_percentage: initialData?.is_discount_percentage ?? false,
        service_charge: (initialData as any)?.service_charge_percentage ?? initialData?.service_charge ?? 0,
        items:
          newItems.length > 0
            ? newItems
            : [{ menuSelected: null, menu_id: "", menu_name: "", quantity: 1, unit_price: 0 }],
      });
      setShippingDate(dayjs(initialData?.shipping_date));
    }
  }, [initialData]);

  // Apply fetched channel price to the pending row
  useEffect(() => {
    if (getPricesResult?.isSuccess && pendingPriceRow != null) {
      const priceData = (getPricesResult as any)?.data?.data;
      const price =
        typeof priceData?.channel_price === "number"
          ? priceData.channel_price
          : typeof priceData?.price === "number"
            ? priceData.price
            : typeof priceData?.unit_price === "number"
              ? priceData.unit_price
              : 0;

      if (price > 0) {
        setFormData((prev) => {
          const updated = [...prev.items];
          if (updated[pendingPriceRow]) {
            updated[pendingPriceRow] = {
              ...updated[pendingPriceRow],
              unit_price: price,
            };
            return { ...prev, items: updated };
          }
          return prev;
        });
      }
      setPendingPriceRow(null);
    }
  }, [getPricesResult, pendingPriceRow]);

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          menuSelected: null,
          menu_id: "",
          menu_name: "",
          quantity: 1,
          unit_price: 0,
        },
      ],
    }));
  };

  const removeItemRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, menu: RemoteOption | null) => {
    // Fetch menu pricing for the selected menu + channel (skip custom menus)
    if (menu && channel?.id && menu.is_custom !== true) {
      setPendingPriceRow(index);
      getPrices({ menu_id: String(menu.id), channel_id: String(channel.id) });
    } else {
      setPendingPriceRow(null);
    }

    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        menuSelected: menu,
        menu_id:
          typeof menu?.id === "string"
            ? menu.id
            : typeof menu?.id === "number"
              ? String(menu.id)
              : "",
        menu_name:
          typeof menu?.name === "string" && menu.name
            ? menu.name
            : typeof menu?.custom_name === "string"
              ? menu.custom_name
              : "",
        quantity: updated[index].quantity || 1,
        unit_price: Number(menu?.base_price ?? updated[index].unit_price ?? 0),
      };
      return { ...prev, items: updated };
    });
  };

  const handleItemClear = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        menuSelected: null,
        menu_id: "",
        menu_name: "",
        quantity: 0,
        unit_price: 0,
      };
      if (index === pendingPriceRow) setPendingPriceRow(null);
      return { ...prev, items: updated };
    });
  };

  const handleQtyChange = (index: number, val: number) => {
    const qty = val < 1 ? 1 : val;
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        quantity: qty,
      };
      return { ...prev, items: updated };
    });
  };

  const handlePriceChange = (index: number, val: number) => {
    const price = val < 0 ? 0 : val;
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        unit_price: price,
      };
      return { ...prev, items: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const items = formData.items.filter((item) => item.menu_id).map((item) => ({
      menu_id: item.menu_id,
      menu_name: item.menu_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    let payload: Record<string, any> = {
      ...formData,
      items,
    };

    if (formData.is_discount_percentage) {
      payload = {
        ...payload,
        discount_value: 0,
        discount_percentage: formData.discount_percentage,
      };
    } else {
      payload = {
        ...payload,
        discount_percentage: 0,
        discount_value: formData.discount_value,
      };
    }

    onSubmit(payload as any);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Detail Order */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <ShoppingBag size={16} className="text-primary" />
          Detail Order
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Customer info */}
          <div className="space-y-4">
            <Input
              label="Nama Pelanggan"
              required
              placeholder="Contoh: Budi Santoso"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              error={FormState?.errors?.customer_name as string}
            />
            <Input
              label="No. Telepon"
              required
              placeholder="Contoh: 081234567890"
              value={formData.customer_phone}
              onChange={(e) =>
                setFormData({ ...formData, customer_phone: e.target.value })
              }
              error={FormState?.errors?.customer_phone as string}
            />
            <Input
              type="textarea"
              label="Alamat Lengkap"
              placeholder="Contoh: Jl. Diponegoro No. 22, Jakarta Pusat"
              value={formData.customer_address}
              onChange={(e) =>
                setFormData({ ...formData, customer_address: e.target.value })
              }
              error={FormState?.errors?.customer_address as string}
            />
          </div>
          {/* Right: Shipping & payment */}
          <div className="space-y-4">
            <DatePicker
              label="Tanggal Pengiriman"
              required
              disablePast
              value={shippingDate || undefined}
              onChange={(date: unknown) => {
                const next = date as Dayjs;
                setShippingDate(next);
                setFormData({
                  ...formData,
                  shipping_date: date ? (next as Dayjs).format("YYYY-MM-DD") : "",
                });
              }}
            />
            <Input
              label="Payment Ref"
              placeholder="Contoh: INV/12345"
              value={formData.payment_ref}
              onChange={(e) =>
                setFormData({ ...formData, payment_ref: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-3">
        <div
          className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
        >
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Daftar Menu
            </h2>
          </div>
          <div style={{ overflow: "visible" }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3 w-66">Menu</th>
                  <th className="px-4 py-3 w-32 text-right">Harga</th>
                  <th className="px-4 py-3 w-20 text-center">Qty</th>
                  <th className="px-4 py-3 w-32 text-right">Subtotal</th>
                  <th className="px-4 py-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 align-top text-center text-sm font-semibold text-slate-400 pt-5">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <RemoteSelect
                        placeholder="Pilih Menu"
                        value={item.menuSelected}
                        hook={menusResult as any}
                        fetchData={(page, search) => getMenus({ page, search, addons: "no", is_already_order: "true", is_active: "true" })}
                        getLabel={(item: any) =>
                          item?.is_custom ? "{custom name}" : item?.name ?? ""
                        }
                        getValue={(item: any) => item?.id}
                        onChange={(item: any) => handleItemChange(idx, item)}
                        onClear={() => handleItemClear(idx)}
                        required
                      />
                      {(item as any).menuSelected?.is_custom === true && (
                        <div className="mt-2">
                          <Input
                            placeholder="Masukkan nama menu custom..."
                            value={item.menu_name}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[idx] = {
                                ...newItems[idx],
                                menu_name: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                items: newItems,
                              }));
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Input
                        type="currency"
                        variant="primary"
                        className="text-right font-medium"
                        value={item.unit_price}
                        onChange={(e) =>
                          handlePriceChange(idx, Number(e.target.value))
                        }
                        min={0}
                      />
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Input
                        type="number"
                        variant="primary"
                        className="text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQtyChange(idx, Number(e.target.value))
                        }
                        min={1}
                      />
                    </td>
                    <td className="px-4 py-3 align-top text-right text-sm font-bold text-slate-800 pt-5 mono">
                      {currencyFormat(item.unit_price * item.quantity)}
                    </td>
                    <td className="px-4 py-3 align-top text-center pt-4">
                      <Button
                        variant="error"
                        styleType="ghost"
                        onClick={() => removeItemRow(idx)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row */}
          <div className="px-5 py-4 border-t border-slate-100">
            <button
              type="button"
              onClick={addItemRow}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 border-dashed rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris
            </button>
          </div>

          {/* Billing Summary + Notes */}
          <div className="bg-slate-50 border-t border-slate-200 p-5 rounded-b-xl">
            <div className="grid grid-cols-2 gap-6">
              {/* Notes - left side */}
              <div>
                <Input
                  type="textarea"
                  label="Catatan"
                  placeholder="Catatan untuk order ini..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </div>
              {/* Billing - right side */}
              <div className="space-y-2">
                {(() => {
                  const subTotal = formData.items.reduce(
                    (sum, i) => sum + (i.unit_price || 0) * (i.quantity || 0), 0,
                  );
                  const discAmount = formData.is_discount_percentage
                    ? subTotal * (formData.discount_percentage || 0) / 100
                    : formData.discount_value || 0;
                  const afterDiscount = subTotal - discAmount;
                  const scAmount = afterDiscount * (formData.service_charge || 0) / 100;
                  const total = afterDiscount + scAmount;
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold text-slate-800 mono">{currencyFormat(subTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">Discount</span>
                          <Checkbox
                            checked={formData.is_discount_percentage}
                            onChange={(e) => setFormData({ ...formData, is_discount_percentage: e.target.checked })}
                            variant="primary"
                          />
                          <Percent className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="!w-24 text-right"
                            value={formData.is_discount_percentage ? formData.discount_percentage : formData.discount_value}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (formData.is_discount_percentage) {
                                setFormData({ ...formData, discount_percentage: val });
                              } else {
                                setFormData({ ...formData, discount_value: val });
                              }
                            }}
                            min={0}
                          />
                          <span className="text-xs text-slate-500 w-4">{formData.is_discount_percentage ? '%' : 'Rp'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm text-slate-600">Service Charge</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="!w-24 text-right"
                            value={formData.service_charge}
                            onChange={(e) => setFormData({ ...formData, service_charge: Number(e.target.value) })}
                            min={0}
                          />
                          <span className="text-xs text-slate-500 w-4">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200">
                        <span className="text-base font-bold text-slate-800">Total Charges</span>
                        <span className="text-xl font-bold text-emerald-600 mono">{currencyFormat(total)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {typeof FormState?.errors?.items === "string" ? (
        <p className="text-xs text-red-500 -mt-3">{FormState.errors.items}</p>
      ) : null}
    </form>
  );
};
