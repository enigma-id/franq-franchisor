import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { Page } from "@/components/app/layout";
import {
  Button,
  Input,
  DatePicker,
  RemoteSelect,
  Loading,
} from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { useOutlet } from "@/services/outlet/hooks";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { Plus, Trash2, Save } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";

interface SalesOrderItemInput {
  catalogSelected: any | null;
  catalog_id: number;
  quantity: number;
  unit_price: number;
  is_vatable?: number;
}

export function SalesOrderCreate() {
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);
  const { create, createResult } = useSalesOrder();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;
  const { showToast } = useEnigmaUI();

  const { get: getOutlets, getResult: outletsResult } = useOutlet();
  const { get: getCatalogs, getResult: catalogsResult } = useInventoryCatalog();

  // Decoupled useEffect on mutation success
  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Sales Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/sales/order/${resData.data.id}`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  const [outletSelected, setOutletSelected] = useState<any | null>(null);
  const [shippingAt, setShippingAt] = useState<Dayjs | null>(
    dayjs().add(1, "day"),
  );

  const [formData, setFormData] = useState({
    outlet_id: 0,
    type: "default",
    shipping_at: dayjs().add(1, "day").format("YYYY-MM-DD"),
    shipping_charge: 0,
    note: "",
    items: [
      {
        catalogSelected: null,
        catalog_id: 0,
        quantity: 1,
        unit_price: 0,
        is_vatable: 0,
      },
    ] as SalesOrderItemInput[],
  });

  const handleOutletChange = (val: any) => {
    setOutletSelected(val);
    setFormData((prev) => ({ ...prev, outlet_id: val?.id || 0 }));
  };

  const handleOutletClear = () => {
    setOutletSelected(null);
    setFormData((prev) => ({ ...prev, outlet_id: 0 }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          catalogSelected: null,
          catalog_id: 0,
          quantity: 1,
          unit_price: 0,
          is_vatable: 0,
        },
      ],
    }));
  };

  const removeItemRow = (index: number) => {
    if (formData.items.length === 1) {
      showToast({
        message: "Sales Order minimal harus memiliki 1 item barang",
        type: "error",
        position: "bottom-center",
        duration: 3000,
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, catalog: any) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        catalogSelected: catalog,
        catalog_id: catalog?.id || 0,
        unit_price: catalog?.unit_price || 0,
        is_vatable: catalog?.is_vatable || 0,
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
        catalog_id: 0,
        unit_price: 0,
        is_vatable: 0,
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

  // Computations
  const computedTotals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    formData.items.forEach((item) => {
      const lineTotal = item.quantity * item.unit_price;
      subtotal += lineTotal;

      if (item.is_vatable === 1) {
        const dpp = item.quantity * (item.unit_price / 1.1);
        const tax = dpp * 0.1;
        totalTax += tax;
      }
    });

    return {
      subtotal,
      totalTax,
      totalBill: subtotal,
    };
  }, [formData.items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      outlet_id: formData.outlet_id,
      type: formData.type,
      shipping_at: formData.shipping_at,
      shipping_charge: formData.shipping_charge,
      note: formData.note,
      items: formData.items.map((item) => ({
        catalog_id: item.catalog_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    };

    create(payload);
  };

  // Helper to get nested validation errors
  const getErrorItem = (index: number, field: string) => {
    const errorKey = `items.${index}.${field}`;
    return typeof FormState?.errors?.[errorKey] === "string"
      ? FormState.errors[errorKey]
      : undefined;
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Tambah Sales Order"
        subtitle="Buat transaksi penjualan baru untuk outlet waralaba."
        backTo={() => navigate(-1)}
        action={
          <Button
            onClick={handleSubmit}
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Order
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-5">
          {/* Section 1: Informasi Utama */}
          <div
            className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm"
            style={{ overflow: "visible", zIndex: 20 }}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Informasi Utama
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <RemoteSelect
                label="Outlet"
                placeholder="Pilih Outlet"
                value={outletSelected}
                hook={outletsResult as any}
                fetchData={(page, search) =>
                  getOutlets({ page, search, is_active: "true" })
                }
                getLabel={(item: any) => item?.name || ""}
                getValue={(item: any) => item?.id}
                onChange={handleOutletChange}
                onClear={handleOutletClear}
                required
                error={
                  typeof FormState?.errors?.outlet_id === "string"
                    ? FormState.errors.outlet_id
                    : undefined
                }
              />
              <DatePicker
                label="Tanggal Rencana Pengiriman"
                value={shippingAt as any}
                disablePast
                onChange={(date) => {
                  const dayjsDate = date as Dayjs | null;
                  setShippingAt(dayjsDate);
                  setFormData((prev) => ({
                    ...prev,
                    shipping_at: dayjsDate
                      ? dayjsDate.format("YYYY-MM-DD")
                      : "",
                  }));
                }}
                required
                error={
                  typeof FormState?.errors?.shipping_at === "string"
                    ? FormState.errors.shipping_at
                    : undefined
                }
              />
              <div className="md:col-span-2">
                <Input
                  label="Catatan Opsional"
                  variant="primary"
                  type="textarea"
                  placeholder="Tambahkan catatan khusus pengiriman atau transaksi..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, note: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          {/* Section 2: Dynamic Item Grid */}
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
                    <th className="px-4 py-3 w-44 text-right">Harga Satuan</th>
                    <th className="px-4 py-3 w-48 text-right">Subtotal</th>
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
                          placeholder="Pilih produk..."
                          value={item.catalogSelected}
                          hook={catalogsResult as any}
                          fetchData={(page, search) =>
                            getCatalogs({ page, search, is_active: "true" })
                          }
                          getLabel={(cat: any) =>
                            cat
                              ? `${cat.name || "-"} [Rp ${Number(cat.unit_price).toLocaleString("id-ID")}]`
                              : ""
                          }
                          getValue={(cat: any) => cat?.id}
                          onChange={(val) => handleItemChange(idx, val)}
                          onClear={() => handleItemClear(idx)}
                          error={getErrorItem(idx, "catalog_id")}
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
                          error={getErrorItem(idx, "quantity")}
                        />
                      </td>
                      <td className="px-4 py-3 align-top text-right text-sm font-semibold text-slate-700 mono pt-5">
                        Rp {item.unit_price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 align-top text-right text-sm font-bold text-slate-800 mono pt-5">
                        Rp{" "}
                        {(item.quantity * item.unit_price).toLocaleString(
                          "id-ID",
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-center pt-4">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={formData.items.length === 1}
                          title="Hapus baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer: Billing Summary */}
            <div className="bg-slate-50 border-t border-slate-200 p-5 rounded-b-xl flex flex-col md:flex-row justify-end">
              <div className="w-full md:w-[400px] space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-semibold text-slate-800 mono">
                    Rp {(computedTotals.subtotal || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">
                    Pajak (PPN)
                  </span>
                  <span className="font-semibold text-slate-800 mono">
                    Rp{" "}
                    {Math.round(computedTotals.totalTax || 0).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium mt-1">
                    Biaya Pengiriman
                  </span>
                  <div className="w-40">
                    <Input
                      variant="primary"
                      type="currency"
                      value={formData.shipping_charge}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shipping_charge: Number(e.target.value),
                        }))
                      }
                      min={0}
                      className="text-right h-8 text-sm"
                      prefix={
                        <span className="text-xs text-slate-400">Rp</span>
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200">
                  <span className="text-base font-bold text-slate-800">
                    Total Tagihan
                  </span>
                  <span className="text-xl font-bold text-emerald-600 mono">
                    Rp{" "}
                    {(
                      computedTotals.totalBill + (formData.shipping_charge || 0)
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Page.Body>
    </Page>
  );
}
export default SalesOrderCreate;
