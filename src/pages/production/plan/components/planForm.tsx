/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Input, DatePicker, RemoteSelect } from "@/components/ui";
import { useInventoryItem } from "@/services/inventory/hooks";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@/components";
import { Plus, Trash2 } from "lucide-react";
import { useWarehouse } from "@/services/warehouse/hooks";
import type { ProductionPlanDetail, WarehouseDetail } from "@/services/types";
import { useAppSelector } from "@/hooks";
import { dateFormat } from "@/utils";

type ProductionPlanFormItem = {
  item_id: string;
  itemSelected: unknown | null;
  quantity: number;
};

type ProductionPlanFormRequest = {
  warehouse_id: string;
  production_date: string;
  note?: string;
  items: Array<{
    item_id: string;
    quantity: number;
    note?: string;
  }>;
};

interface ProductionPlanFormProps {
  id: string;
  initialData?: ProductionPlanDetail;
  onSubmit: (data: ProductionPlanFormRequest) => void;
}

export const ProductionPlanForm: React.FC<ProductionPlanFormProps> = ({
  id = "production-plan-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);

  const { get: getWarehouse, getResult: warehouseResult } = useWarehouse();
  // const { get: getCatalogs, getResult: catalogsResult } = useInventoryCatalog();
  const { get: getCatalogs, getResult: catalogsResult } = useInventoryItem();

  const [formData, setFormData] = useState<{
    warehouse_id: string;
    production_date: string;
    items: ProductionPlanFormItem[];
  }>({
    warehouse_id: "",
    production_date: new Date().toISOString(),
    items: [
      {
        item_id: "",
        itemSelected: null,
        quantity: 1,
      },
    ],
  });

  const [production_date, setProductionDate] = useState<Dayjs | null>(dayjs());
  const [warehouse, setWarehouse] = useState<WarehouseDetail | null>(null);

  // Auto-select warehouse ketika data hanya satu.
  useEffect(() => {
    getWarehouse({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (initialData) return;
    const items = warehouseResult?.data?.data as any[] | undefined;
    if (items?.length === 1 && !warehouse) {
      const item = items[0];
      setWarehouse(item);
      setFormData((prev) => ({ ...prev, warehouse_id: item?.id || "" }));
    }
  }, [warehouseResult?.data?.data, initialData, warehouse]);

  useEffect(() => {
    if (initialData) {
      const newItems = (initialData.items || []).map((data: any) => {
        return {
          itemSelected: data?.item,
          item_id: data?.item_id,
          quantity: data?.quantity_planned,
        };
      });

      setFormData({
        warehouse_id:
          initialData?.warehouse_id !== "00000000-0000-0000-0000-000000000000"
            ? initialData?.warehouse_id
            : "",
        production_date: initialData.production_date,
        items: newItems,
      });

      setProductionDate(dayjs(initialData.production_date));

      setWarehouse({
        id:
          initialData?.warehouse_id !== "00000000-0000-0000-0000-000000000000"
            ? initialData?.warehouse_id
            : "",
        brand_id: "",
        type: "",
        name: initialData?.warehouse_name,
        address: "",
        is_default: false,
        is_active: false,
        has_area: false,
        created_by: "",
        created_at: "0001-01-01T00:00:00Z",
      });
    }
  }, [initialData]);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { item_id: "", itemSelected: null, quantity: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      production_date: dateFormat(formData.production_date, "YYYY-MM-DD"),
      items: formData?.items.map((data) => ({
        item_id: data?.item_id,
        quantity: data?.quantity,
      })),
    };
    onSubmit(payload);
  };

  // Helper to get nested validation errors
  const getErrorItem = (index: number, field: string) => {
    const errorKey = `items.${index}.${field}`;
    return typeof FormState?.errors?.[errorKey] === "string"
      ? FormState.errors[errorKey]
      : undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative z-10">
        <div className="space-y-2">
          <RemoteSelect
            label="Pilih Warehouse"
            placeholder="Cari warehouse..."
            hook={warehouseResult as any}
            fetchData={(page, search) => getWarehouse({ page, search })}
            getLabel={(item: any) => item?.name}
            value={warehouse}
            onChange={(item: any) => {
              setWarehouse(item);
              setFormData((prev) => ({
                ...prev,
                warehouse_id: item?.id || "",
              }));
            }}
            required
            error={FormState?.errors?.warehouse_id as string}
          />
        </div>

        <div className="space-y-2">
          <DatePicker
            label="Tanggal Produksi"
            value={production_date || undefined}
            onChange={(date: any) => {
              setProductionDate(date as Dayjs);
              setFormData((prev) => ({
                ...prev,
                production_date: date ? date : "",
              }));
            }}
            required
            error={FormState?.errors?.eta_date as string}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible relative">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-700">Daftar Item Produksi</h3>
        </div>
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <th className="px-6 py-3 w-10 text-center">#</th>
              <th className="px-6 py-3">Produk Catalog</th>
              <th className="px-6 py-3 w-32">Quantity</th>
              <th className="px-6 py-3 w-16 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {formData.items.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-center text-xs font-semibold text-slate-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <RemoteSelect
                    placeholder="Pilih Produk Catalog..."
                    value={item.itemSelected}
                    hook={catalogsResult as any}
                    fetchData={(page, search) =>
                      getCatalogs({
                        page,
                        search,
                        type: "finished_goods",
                      })
                    }
                    getLabel={(it: any) => it?.name}
                    getValue={(it: any) => it?.id}
                    onChange={(it: any) => {
                      const newItems = [...formData.items];
                      newItems[index] = {
                        ...newItems[index],
                        item_id: it?.id || "",
                        itemSelected: it,
                      };
                      setFormData((prev) => ({ ...prev, items: newItems }));
                    }}
                    onClear={() => {
                      const newItems = [...formData.items];
                      newItems[index] = {
                        ...newItems[index],
                        item_id: "",
                        itemSelected: null,
                      };
                      setFormData((prev) => ({ ...prev, items: newItems }));
                    }}
                    error={getErrorItem(index, "item_id")}
                  />
                </td>
                <td className="px-6 py-4">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    error={getErrorItem(index, "quantity")}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="error"
                    styleType="ghost"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-slate-100">
          <Button
            variant="success"
            onClick={addItem}
            size="sm"
            styleType="soft"
          >
            <Plus size={14} />
            Tambah Baris
          </Button>
        </div>
      </div>
    </form>
  );
};
