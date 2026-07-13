/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Trash2, Plus, ShoppingBag } from "lucide-react";
import { Input, RemoteSelect, DatePicker, Button } from "@/components/ui";
import { usePOSMenu } from "@/services/pos/hooks";
import { useAppSelector } from "@/hooks";
import dayjs, { Dayjs } from "dayjs";
import { currencyFormat } from "@/utils";
import type { B2BOrderDetail } from "@/services/types";

type B2BOrderItemForm = {
  menuSelected: unknown;
  menu_id: string;
  menu_name: string;
  quantity: number;
};

type B2BOrderFormData = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string;
  discount: number;
  is_discount_percentage: boolean;
  discount_value: number;
  service_charge: number;
  shipping_date: string;
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
  const { get: getMenus, getResult: menusResult } = usePOSMenu();

  const [formData, setFormData] = useState<B2BOrderFormData>({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    note: "",
    discount: 0,
    is_discount_percentage: false,
    discount_value: 0,
    service_charge: 0,
    shipping_date: dayjs().format("YYYY-MM-DD"),
    items: [
      {
        menuSelected: null,
        menu_id: "",
        menu_name: "",
        quantity: 1,
      },
    ],
  });

  const [shippingDate, setShippingDate] = useState<Dayjs | null>(dayjs());

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
      }));

      setFormData({
        customer_name: initialData?.customer_name || "",
        customer_phone: initialData?.customer_phone || "",
        customer_address: initialData?.customer_address || "",
        note: initialData?.note || "",
        discount: initialData?.discount ?? 0,
        is_discount_percentage: initialData?.is_discount_percentage ?? false,
        discount_value: initialData?.discount_value ?? 0,
        service_charge: initialData?.service_charge ?? 0,
        shipping_date: dayjs(initialData?.shipping_date).format("YYYY-MM-DD"),
        items:
          newItems.length > 0
            ? newItems
            : [{ menuSelected: null, menu_id: "", menu_name: "", quantity: 1 }],
      });
      setShippingDate(dayjs(initialData?.shipping_date));
    }
  }, [initialData]);

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
        menu_name: typeof menu?.name === "string" ? menu.name : "",
        quantity: updated[index].quantity || 1,
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
      };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      discount: formData.discount ?? 0,
      is_discount_percentage: formData.is_discount_percentage,
      discount_value: formData.discount_value ?? 0,
      service_charge: formData.service_charge ?? 0,
      items: formData.items
        .filter((item) => item.menu_id)
        .map((item) => ({
          menu_id: item.menu_id,
          menu_name: item.menu_name,
          quantity: item.quantity,
        })),
    };
    onSubmit(payload as any);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <ShoppingBag size={16} className="text-primary" />
          Informasi Pelanggan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="md:col-span-2">
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
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <ShoppingBag size={16} className="text-primary" />
          Detail Order
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            label="Diskon"
            type="number"
            placeholder="0"
            value={formData.discount}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount: Number(e.target.value),
              })
            }
            min={0}
          />
          <Input
            label="Diskon Value (Rp)"
            type="number"
            placeholder="0"
            value={formData.discount_value}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_value: Number(e.target.value),
              })
            }
            min={0}
          />
          <Input
            label="Service Charge (Rp)"
            type="number"
            placeholder="0"
            value={formData.service_charge}
            onChange={(e) =>
              setFormData({
                ...formData,
                service_charge: Number(e.target.value),
              })
            }
            min={0}
          />
          <div className="md:col-span-2">
            <Input
              type="textarea"
              label="Catatan"
              placeholder="Tambahkan catatan order..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
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
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Daftar Menu
            </h2>
            <button
              type="button"
              onClick={addItemRow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Baris
            </button>
          </div>
          <div style={{ overflow: "visible" }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3 min-w-[320px]">Menu</th>
                  <th className="px-4 py-3 w-28 text-center">Qty</th>
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
                        fetchData={(page, search) => getMenus({ page, search })}
                        getLabel={(item: any) =>
                          item
                            ? `${item.name} [${currencyFormat(item.base_price)}]`
                            : ""
                        }
                        getValue={(item: any) => item?.id}
                        onChange={(item: any) => handleItemChange(idx, item)}
                        onClear={() => handleItemClear(idx)}
                        required
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
        </div>
      </div>

      {typeof FormState?.errors?.items === "string" ? (
        <p className="text-xs text-red-500 -mt-3">{FormState.errors.items}</p>
      ) : null}
    </form>
  );
};
