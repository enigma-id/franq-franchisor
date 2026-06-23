/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Trash2, Truck, Plus } from "lucide-react";
import {
  Input,
  RemoteSelect,
  DatePicker,
  Checkbox,
  Button,
} from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import dayjs, { Dayjs } from "dayjs";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useAppSelector } from "@/hooks";
import { useRegion } from "@/services/region/hooks";
import { currencyFormat } from "@/utils";
import type {
  OutletDetail,
  SalesOrderDetail,
  WarehouseDetail,
} from "@/services/types";
import type { RegionDetail } from "@/services/types/region";
import { formatRegion } from "@/utils/common";

type SalesOrderItemForm = {
  catalogSelected: unknown;
  catalog_id: string;
  quantity_ordered: number;
};

type SalesOrderFormData = {
  warehouse_id: string;
  ref_code: string;
  outlet_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_region_id: string;
  recipient_address: string;
  note: string;
  shipping_date: string;
  self_pickup: boolean;
  items: SalesOrderItemForm[];
};

type RemoteOption = {
  id?: string | number;
  name?: string;
  [k: string]: unknown;
};

interface SalesOrderFormProps {
  id?: string;
  initialData?: SalesOrderDetail;
  onSubmit: (data: SalesOrderFormData) => void;
}

export const SalesOrderForm: React.FC<SalesOrderFormProps> = ({
  id = "sales-order-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);

  const { get: getOutlets, getResult: outletsResult } = useOutlet();
  const { get: getCatalogs, getResult: catalogsResult } = useInventoryCatalog();
  const { get: getWarehouse, getResult: warehouseResult } = useWarehouse();
  const { get: getRegion, getResult: regionResult } = useRegion();

  // Keep runtime shape as-is; fix TS to match the existing formData fields
  const [formData, setFormData] = useState<SalesOrderFormData>({
    warehouse_id: "",
    ref_code: "",
    outlet_id: "",
    recipient_name: "",
    recipient_phone: "",
    recipient_region_id: "",
    recipient_address: "",
    note: "",
    shipping_date: dayjs().format("YYYY-MM-DD"),
    self_pickup: false,
    items: [
      {
        catalogSelected: null,
        catalog_id: "",
        quantity_ordered: 1,
      },
    ],
  });

  const [shipping_date, setShippingDate] = useState<Dayjs | null>(dayjs());
  const [region, setRegion] = useState<RegionDetail | null>(null);
  const [outlet, setOutlet] = useState<OutletDetail | null>(null);
  const [warehouse, setWarehouse] = useState<WarehouseDetail | null>(null);

  useEffect(() => {
    if (initialData) {
      const newItems = (initialData.items || []).map((item: any) => {
        return {
          catalogSelected: item?.catalog,
          catalog_id: item?.catalog_id,
          quantity_ordered: item?.quantity_ordered,
        };
      });

      setFormData({
        warehouse_id: initialData?.warehouse_id,
        ref_code: initialData?.ref_code,
        outlet_id: initialData?.outlet_id,
        recipient_name: initialData?.recipient_name,
        recipient_phone: initialData?.recipient_phone,
        recipient_region_id: initialData?.recipient_region_id,
        recipient_address: initialData?.recipient_address,
        note: initialData?.note,
        shipping_date: dayjs(initialData?.shipping_date).format("YYYY-MM-DD"),
        self_pickup: initialData?.self_pickup ? false : true,
        items: newItems,
      });
      setShippingDate(dayjs(initialData?.shipping_date));

      setRegion(initialData?.region);
      setWarehouse({
        id: initialData?.warehouse_id,
        brand_id: "",
        type: "",
        name: initialData?.warehouse_name,
        address: "",
        region_id: "",
        is_default: false,
        is_active: false,
        has_area: false,
        created_by: "",
        created_at: "0001-01-01T00:00:00Z",
      });
      setOutlet(initialData?.outlet);
    }
  }, [initialData]);

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          catalogSelected: null,
          catalog_id: "",
          quantity_ordered: 1,
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

  const handleItemChange = (index: number, catalog: RemoteOption | null) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      const quantityFromCatalog =
        typeof catalog?.quantity_ordered === "number"
          ? catalog.quantity_ordered
          : 0;

      updated[index] = {
        ...updated[index],
        catalogSelected: catalog,
        catalog_id:
          typeof catalog?.id === "string"
            ? catalog.id
            : typeof catalog?.id === "number"
              ? String(catalog.id)
              : "",
        quantity_ordered: quantityFromCatalog,
      };
      return { ...prev, items: updated };
    });
  };

  const handleItemClear = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        catalogSelected: null,
        catalog_id: "",
        quantity_ordered: 0,
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
        quantity_ordered: qty,
      };
      return { ...prev, items: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: SalesOrderFormData = {
      ...formData,
      items: formData.items.map((item) => ({
        catalogSelected: item.catalogSelected,
        catalog_id: item.catalog_id,
        quantity_ordered: item.quantity_ordered,
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
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <Truck size={16} className="text-primary" />
          Informasi Penjualan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RemoteSelect<WarehouseDetail>
            label="Warehouse"
            required
            hook={warehouseResult as any}
            fetchData={(page, search) => getWarehouse({ page, search })}
            getLabel={(item: any) => item?.name}
            value={warehouse}
            onChange={(item: WarehouseDetail) => {
              setFormData({
                ...formData,
                warehouse_id: item.id,
              });
              setWarehouse(item);
            }}
            placeholder="Pilih warehouse"
            error={FormState?.errors?.warehouse_id as string}
          />
          <RemoteSelect<OutletDetail>
            label="Outlet"
            required
            hook={outletsResult as any}
            fetchData={(page, search) => getOutlets({ page, search })}
            getLabel={(item: any) => item?.name}
            value={outlet}
            onChange={(item: OutletDetail) => {
              const selectedOutlet = item;
              setFormData({
                ...formData,
                outlet_id: item.id,
                recipient_name: selectedOutlet?.recipient_name,
                recipient_region_id: selectedOutlet?.region_id,
                recipient_phone: selectedOutlet?.phone,
                recipient_address: selectedOutlet?.address,
              });
              setRegion(selectedOutlet?.region ?? null);
            }}
            placeholder="Pilih outlet"
            error={FormState?.errors?.outlet_id as string}
          />
          <DatePicker
            label="Tanggal Transaksi"
            required
            value={shipping_date || undefined}
            onChange={(date: unknown) => {
              const next = date as Dayjs;
              setShippingDate(next);
              setFormData({
                ...(formData as any),
                shipping_date: date ? (next as Dayjs).format("YYYY-MM-DD") : "",
              });
            }}
            error={FormState?.errors?.shipping_date as string}
          />
          <Input
            label="Nama Penerima"
            required
            placeholder="Contoh: Budi Santoso"
            value={formData.recipient_name}
            onChange={(e) =>
              setFormData({ ...formData, recipient_name: e.target.value })
            }
            error={FormState?.errors?.recipient_name as string}
          />
          <Input
            required
            label="No. Telepon"
            placeholder="Contoh: 081234567890"
            value={formData.recipient_phone}
            onChange={(e) =>
              setFormData({ ...formData, recipient_phone: e.target.value })
            }
            error={FormState?.errors?.recipient_phone as string}
          />
          <RemoteSelect<RegionDetail>
            label="Region"
            required
            hook={regionResult as any}
            fetchData={(page, search) => getRegion({ page, search })}
            getLabel={(item) => formatRegion(item)}
            renderItem={(item) => formatRegion(item)}
            value={region}
            onChange={(item) => {
              setRegion(item);
              setFormData({ ...formData, recipient_region_id: item?.id || "" });
            }}
            onClear={() => {
              setRegion(null);
              setFormData({ ...formData, recipient_region_id: "" });
            }}
            placeholder="Pilih Region"
            error={FormState?.errors?.recipient_region_id as string}
          />

          <Input
            type="textarea"
            label="Alamat Lengkap"
            placeholder="Contoh: Jl. Diponegoro No. 22"
            value={formData.recipient_address}
            onChange={(e) =>
              setFormData({ ...formData, recipient_address: e.target.value })
            }
            error={FormState?.errors?.recipient_address as string}
          />
          <Input
            type="textarea"
            label="Catatan"
            placeholder="Tambahkan catatan transaksi..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />

          <Checkbox
            label="Self Pickup"
            checked={formData.self_pickup}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                self_pickup: e.target.checked,
              }))
            }
            variant="primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
          style={{ overflow: "visible", zIndex: 10 }}
        >
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Daftar Barang (Catalog Items)
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
                  <th className="px-4 py-3 min-w-[320px]">Katalog Barang</th>
                  <th className="px-4 py-3 w-28 text-center">Satuan (Qty)</th>
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
                        placeholder="Pilih Catalog"
                        value={item.catalogSelected}
                        hook={catalogsResult as any}
                        fetchData={(page, search) =>
                          getCatalogs({ page, search, type: "finished_goods" })
                        }
                        getLabel={(item: any) =>
                          item
                            ? `${item.name} [${currencyFormat(item.unit_price)}]`
                            : ""
                        }
                        getValue={(item: any) => item?.id}
                        onChange={(item: any) => handleItemChange(idx, item)}
                        onClear={() => handleItemClear(idx)}
                        required
                        error={getErrorItem(idx, "catalog_id")}
                      />
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Input
                        type="number"
                        variant="primary"
                        className="text-center"
                        value={item.quantity_ordered}
                        onChange={(e) =>
                          handleQtyChange(idx, Number(e.target.value))
                        }
                        min={1}
                        error={getErrorItem(idx, "quantity_ordered")}
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
    </form>
  );
};
