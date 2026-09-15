/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Trash2, Truck, Plus, Store } from "lucide-react";
import { Input, RemoteSelect, DatePicker, Button } from "@/components/ui";
import { formatCurrency } from "@/utils";
import { useOutlet } from "@/services/outlet/hooks";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useWarehouse } from "@/services/warehouse/hooks";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "@/hooks";
import type {
  OutletDetail,
  SalesOrderDetail,
  FranchisorRow,
  WarehouseDetail,
} from "@/services/types";

type CentralKitchenItemForm = {
  catalogSelected: unknown;
  catalog_id: string;
  quantity_ordered: number;
};

type CentralKitchenFormData = {
  ref_code: string;
  franchisor_id: string;
  outlet_id: string;
  destination_warehouse_id?: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  note: string;
  shipping_date: string;
  self_pickup: boolean;
  shipping_charges?: number;
  items: CentralKitchenItemForm[];
};

type RemoteOption = {
  id?: string | number;
  name?: string;
  [k: string]: unknown;
};

interface CentralKitchenFormProps {
  id?: string;
  initialData?: SalesOrderDetail;
  onSubmit: (data: CentralKitchenFormData) => void;
}

export const CentralKitchenForm: React.FC<CentralKitchenFormProps> = ({
  id = "central-kitchen-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);

  const { get: getOutlets, getResult: outletsResult } = useOutlet();
  const { get: getCatalogs, getResult: catalogsResult } = useInventoryCatalog();
  const { get: getFranchisors, getResult: franchisorsResult } =
    useFranchisorList();
  const { get: getWarehouses, getResult: warehousesResult } = useWarehouse();

  // Keep runtime shape as-is; fix TS to match the existing formData fields
  const [formData, setFormData] = useState<CentralKitchenFormData>({
    ref_code: "",
    franchisor_id: "",
    outlet_id: "",
    recipient_name: "",
    recipient_phone: "",
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
  const [outlet, setOutlet] = useState<OutletDetail | null>(null);
  const [franchise, setFranchise] = useState<FranchisorRow | null>(null);
  const [destinationWarehouse, setDestinationWarehouse] =
    useState<WarehouseDetail | null>(null);

  // Fetch gudang sesuai franchise terpilih (superuser wajib pilih franchise dulu).
  useEffect(() => {
    if (!formData.franchisor_id) return;
    getWarehouses({
      page: 1,
      limit: 50,
      is_active: "true",
      franchisor_id: formData.franchisor_id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.franchisor_id]);

  // Hydrate Gudang Tujuan dari data detail (embedded object / id saja).
  useEffect(() => {
    const embedded = (initialData as any)?.destination_warehouse;
    if (embedded?.id) setDestinationWarehouse(embedded);
  }, [initialData]);

  useEffect(() => {
    const id = formData.destination_warehouse_id;
    if (!id || destinationWarehouse?.id === id) return;
    const items = warehousesResult?.data?.data as any[] | undefined;
    const found = items?.find((w) => w.id === id);
    if (found) setDestinationWarehouse(found);
  }, [
    formData.destination_warehouse_id,
    warehousesResult?.data?.data,
    destinationWarehouse,
  ]);

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
        ref_code: initialData?.ref_code,
        franchisor_id:
          (initialData as any)?.franchisor_id ??
          (initialData as any)?.franchisor?.id ??
          "",
        outlet_id: initialData?.outlet_id,
        destination_warehouse_id:
          (initialData as any)?.destination_warehouse_id ??
          (initialData as any)?.destination_warehouse?.id ??
          "",
        recipient_name: initialData?.recipient_name,
        recipient_phone: initialData?.recipient_phone,
        recipient_address: initialData?.recipient_address,
        note: initialData?.note,
        shipping_date: dayjs(initialData?.shipping_date).format("YYYY-MM-DD"),
        self_pickup: initialData?.self_pickup ? false : true,
        items: newItems,
      });
      setShippingDate(dayjs(initialData?.shipping_date));

      if ((initialData as any)?.franchisor) {
        setFranchise((initialData as any)?.franchisor);
      }

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

  // Pilih franchise → set franchisor_id, reset outlet, penerima, & item katalog.
  const handleFranchiseChange = (item: FranchisorRow | null) => {
    setFranchise(item);
    setOutlet(null);
    setDestinationWarehouse(null);
    setFormData((prev) => ({
      ...prev,
      franchisor_id: item?.id ?? "",
      outlet_id: "",
      destination_warehouse_id: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_address: "",
      items: prev.items.map((it) => ({
        ...it,
        catalogSelected: null,
        catalog_id: "",
        quantity_ordered: 1,
      })),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      destination_warehouse_id: formData.destination_warehouse_id || undefined,
      self_pickup: true,
      shipping_charges: formData.shipping_charges ?? 0,
      items: formData.items.map((item) => ({
        catalog_id: item.catalog_id,
        quantity_ordered: item.quantity_ordered,
      })),
    };
    onSubmit(payload as any);
  };

  // Helper to get nested validation errors
  const getErrorItem = (index: number, field: string) => {
    const errorKey = `items.${index}.${field}`;
    return typeof FormState?.errors?.[errorKey] === "string"
      ? FormState.errors[errorKey]
      : undefined;
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className='grid grid-cols-1 lg:grid-cols-12 gap-6'
    >
      <div className='lg:col-span-6 flex flex-col gap-6'>
        <div className='bg-white rounded-xl p-5 border border-base-300 shadow-sm'>
          <h3 className='text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2'>
            <Truck size={16} className='text-primary' />
            Informasi Penjualan
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <RemoteSelect<FranchisorRow>
              label='Franchise'
              required
              hook={franchisorsResult as any}
              fetchData={(page, search) => getFranchisors({ page, search })}
              getLabel={(item: any) => item?.name}
              value={franchise}
              onChange={(item: FranchisorRow | null) =>
                handleFranchiseChange(item)
              }
              onClear={() => handleFranchiseChange(null)}
              placeholder='Pilih franchise'
              error={FormState?.errors?.franchisor_id as string}
            />
            <RemoteSelect<OutletDetail>
              label='Outlet'
              required
              hook={outletsResult as any}
              fetchData={(page, search) =>
                getOutlets({
                  page,
                  search,
                  ...(formData.franchisor_id
                    ? { franchisor_id: formData.franchisor_id }
                    : {}),
                })
              }
              getLabel={(item: any) => item?.name}
              value={outlet}
              onChange={(item: OutletDetail) => {
                setOutlet(item);
                setFormData({
                  ...formData,
                  outlet_id: item.id,
                  recipient_name: item?.recipient_name,
                  recipient_phone: item?.phone,
                  recipient_address: item?.address || "-",
                });
              }}
              placeholder='Pilih outlet'
              disabled={!formData.franchisor_id}
              watchKey={formData.franchisor_id}
              error={FormState?.errors?.outlet_id as string}
            />

            <RemoteSelect<WarehouseDetail>
              label='Gudang Tujuan'
              placeholder='Opsional — pilih jika dikirim ke gudang'
              hook={warehousesResult as any}
              fetchData={(page, search) =>
                getWarehouses({
                  page,
                  search,
                  is_active: "true",
                  franchisor_id: formData.franchisor_id || undefined,
                }) as any
              }
              getLabel={(item: any) => item?.name || ""}
              getValue={(item: any) => item?.id}
              value={destinationWarehouse}
              disabled={!formData.franchisor_id}
              watchKey={formData.franchisor_id}
              onChange={(item: WarehouseDetail | null) => {
                setDestinationWarehouse(item);
                setFormData((prev) => ({
                  ...prev,
                  destination_warehouse_id: item?.id ?? "",
                }));
              }}
              onClear={() => {
                setDestinationWarehouse(null);
                setFormData((prev) => ({
                  ...prev,
                  destination_warehouse_id: "",
                }));
              }}
            />

            <DatePicker
              label='Tanggal Produksi'
              required
              value={shipping_date || undefined}
              onChange={(date: unknown) => {
                const next = date as Dayjs;
                setShippingDate(next);
                setFormData({
                  ...(formData as any),
                  shipping_date: date
                    ? (next as Dayjs).format("YYYY-MM-DD")
                    : "",
                });
              }}
              error={FormState?.errors?.shipping_date as string}
            />
            <div className='md:col-span-2'>
              <Input
                type='textarea'
                label='Catatan'
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className='lg:col-span-6 flex flex-col'>
        <div className='bg-white rounded-xl border border-base-300 shadow-sm'>
          <div className='p-5 border-b border-base-300 bg-base-100'>
            <div className='flex items-center gap-2'>
              <Store size={16} className='text-primary' />
              <h3 className='font-semibold text-base text-base-content'>
                Daftar Barang (Catalog Items)
              </h3>
            </div>
          </div>

          <div style={{ overflow: "visible" }}>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider'>
                  <th className='px-4 py-3 w-12 text-center'>#</th>
                  <th className='px-4 py-3'>Katalog Barang</th>
                  <th className='px-4 py-3 w-28 text-right'>Harga</th>
                  <th className='px-4 py-3 w-32 text-center'>Satuan (Qty)</th>
                  <th className='px-4 py-3 w-16 text-center'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {formData.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className='hover:bg-slate-50/30 transition-colors'
                  >
                    <td className='px-4 py-3 align-top text-center text-sm font-semibold text-slate-400 pt-5'>
                      {idx + 1}
                    </td>
                    <td className='px-4 py-3 align-top'>
                      <RemoteSelect
                        placeholder='Pilih Catalog'
                        value={item.catalogSelected}
                        hook={catalogsResult as any}
                        fetchData={(page, search) =>
                          getCatalogs({
                            page,
                            search,
                            is_active: "true",
                            franchisor_id: formData.franchisor_id || undefined,
                          })
                        }
                        getLabel={(item: any) => item?.name ?? ""}
                        getValue={(item: any) => item?.id}
                        onChange={(item: any) => handleItemChange(idx, item)}
                        onClear={() => handleItemClear(idx)}
                        required
                        disabled={!formData.franchisor_id}
                        watchKey={formData.franchisor_id}
                        error={getErrorItem(idx, "catalog_id")}
                      />
                    </td>
                    <td className='px-4 py-3 align-top text-right whitespace-nowrap pt-5 text-[13px] font-medium text-slate-700'>
                      {typeof (item.catalogSelected as any)?.unit_price ===
                      "number"
                        ? formatCurrency((item.catalogSelected as any).unit_price)
                        : "-"}
                    </td>
                    <td className='px-4 py-3 align-top'>
                      <Input
                        type='number'
                        variant='primary'
                        className='text-center'
                        value={item.quantity_ordered}
                        onChange={(e) =>
                          handleQtyChange(idx, Number(e.target.value))
                        }
                        min={1}
                        error={getErrorItem(idx, "quantity_ordered")}
                      />
                    </td>
                    <td className='px-4 py-3 align-top text-center pt-4'>
                      <Button
                        variant='error'
                        styleType='ghost'
                        onClick={() => removeItemRow(idx)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='px-5 py-4 border-t border-slate-100'>
            <button
              type='button'
              onClick={addItemRow}
              className='w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 border-dashed rounded-lg transition-colors cursor-pointer'
            >
              <Plus className='w-4 h-4' />
              Tambah Item
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
