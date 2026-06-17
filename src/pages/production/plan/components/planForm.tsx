/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Input, DatePicker, RemoteSelect } from "@/components/ui";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@/components";
import { Plus, Trash2 } from "lucide-react";
import { useWarehouse } from "@/services/warehouse/hooks";

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
  initialData?: unknown;
  onSubmit: (data: ProductionPlanFormRequest) => void;
  isLoading?: boolean;
}

export const ProductionPlanForm: React.FC<ProductionPlanFormProps> = ({
  id = "production-plan-form",
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { get: getWarehouse, getResult: warehouseResult } = useWarehouse();
  const { get: getCatalogs, getResult: catalogsResult } = useInventoryCatalog();

  const [formData, setFormData] = useState<
    ProductionPlanFormItem & { items: any[] }
  >({
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

  const [production_date, setProductionDate] = useState<Dayjs | null>(
    initialData?.production_date ? dayjs(initialData.production_date) : null,
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        warehouse_id: initialData.warehouse_id,
        production_date: initialData.production_date,
        items: initialData.items.map((item: any) => ({
          item_id: item.item_id,
          itemSelected: item.item,
          quantity: item.quantity,
        })),
      });
      setProductionDate(dayjs(initialData.production_date));
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
    onSubmit(formData);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative z-10">
        <div className="space-y-2">
          <RemoteSelect
            label="Pilih Warehouse"
            placeholder="Cari outlet..."
            hook={warehouseResult as any}
            fetchData={(page, search) => getWarehouse({ page, search })}
            getLabel={(item: any) => item?.name}
            value={warehouseResult.data?.data?.find(
              (o: any) => o.id === formData.warehouse_id,
            )}
            onChange={(item: any) =>
              setFormData((prev) => ({ ...prev, warehouse_id: item?.id || "" }))
            }
            disabled={isLoading}
            required
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
                production_date: date ? (date as Dayjs).toISOString() : "",
              }));
            }}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible relative">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-700">Daftar Item Produksi</h3>
          <div className="flex gap-2">
            <Button
              variant="success"
              onClick={addItem}
              disabled={isLoading}
              size="sm"
              styleType="soft"
            >
              <Plus size={14} />
              Tambah Baris
            </Button>
          </div>
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
                    hook={catalogsResult}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="error"
                    styleType="ghost"
                    onClick={() => removeItem(index)}
                    disabled={isLoading}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};
