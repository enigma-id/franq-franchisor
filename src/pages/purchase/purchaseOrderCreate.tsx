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
import { usePurchaseOrder, useSupplier } from "@/services/purchase/hooks";
import { useInventoryItem } from "@/services/inventory/hooks";
import { useLazyGetItemFractionsQuery } from "@/services/inventory/api";
import { Plus, Trash2, Save } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { useEnigmaUI } from "@/components";

interface PurchaseOrderItemInput {
  itemSelected: any | null;
  fractionSelected: any | null;
  item_id: number;
  fraction_id: number;
  quantity: number;
  unit_nett: number;
  is_vatable?: number;
}
export function PurchaseOrderCreate() {
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);
  const { create, createResult } = usePurchaseOrder();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;
  const { showToast } = useEnigmaUI();
  const { get: getSuppliers, getResult: suppliersResult } = useSupplier();
  const { get: getItems, getResult: itemsResult } = useInventoryItem();
  // Lazy query for dynamic fraction cascading
  const [getItemFractions] = useLazyGetItemFractionsQuery();
  // Separate fractions state cache per index to hold dynamic dropdown options
  const [fractionsCache, setFractionsCache] = useState<Record<number, any[]>>(
    {},
  );

  // Decoupled useEffect on mutation success
  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Purchase Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/purchase/order/${resData.data.id}`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  const [supplierSelected, setSupplierSelected] = useState<any | null>(null);
  const [etaAt, setEtaAt] = useState<Dayjs | null>(dayjs().add(1, "day"));
  const [formData, setFormData] = useState({
    supplier_id: 0,
    reff_code: "",
    eta_at: dayjs().add(1, "day").format("YYYY-MM-DD"),
    address: "",
    recipient_name: "",
    recipient_phone: "",
    note: "",
    shipping_charge: 0,
    items: [
      {
        itemSelected: null,
        fractionSelected: null,
        item_id: 0,
        fraction_id: 0,
        quantity: 1,
        unit_nett: 0,
        is_vatable: 0,
      },
    ] as PurchaseOrderItemInput[],
  });
  const handleSupplierChange = (val: any) => {
    setSupplierSelected(val);
    setFormData((prev) => ({
      ...prev,
      supplier_id: val?.id || 0,
      address: val?.address || "",
      recipient_name: val?.name || "",
      recipient_phone: val?.phone || "",
    }));
  };
  const handleSupplierClear = () => {
    setSupplierSelected(null);
    setFormData((prev) => ({
      ...prev,
      supplier_id: 0,
      address: "",
      recipient_name: "",
      recipient_phone: "",
    }));
  };
  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemSelected: null,
          fractionSelected: null,
          item_id: 0,
          fraction_id: 0,
          quantity: 1,
          unit_nett: 0,
          is_vatable: 0,
        },
      ],
    }));
  };
  const removeItemRow = (index: number) => {
    if (formData.items.length === 1) {
      showToast({
        message: "Purchase Order minimal harus memiliki 1 item barang",
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
    // Clean up fractions cache
    setFractionsCache((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };
  const handleItemChange = async (index: number, item: any) => {
    // Dynamic cascade reset
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        itemSelected: item,
        item_id: item?.id || 0,
        fractionSelected: null,
        fraction_id: 0,
        unit_nett: item?.base_price || 0,
        is_vatable: item?.is_vatable || 0,
      };
      return { ...prev, items: updated };
    });
    if (item?.id) {
      try {
        const res = await getItemFractions({ id: item.id }).unwrap();
        if (res?.data) {
          setFractionsCache((prev) => ({
            ...prev,
            [index]: res.data,
          }));
        }
      } catch (err) {
        console.error("Failed to load fractions", err);
      }
    } else {
      setFractionsCache((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  };
  const handleItemClear = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        itemSelected: null,
        item_id: 0,
        fractionSelected: null,
        fraction_id: 0,
        unit_nett: 0,
        is_vatable: 0,
      };
      return { ...prev, items: updated };
    });
    setFractionsCache((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };
  const handleFractionChange = (index: number, fraction: any) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        fractionSelected: fraction,
        fraction_id: fraction?.id || fraction?.fraction_id || 0,
      };
      return { ...prev, items: updated };
    });
  };
  const handleFractionClear = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        fractionSelected: null,
        fraction_id: 0,
      };
      return { ...prev, items: updated };
    });
  };
  const handleInputChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
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
        unit_nett: price,
      };
      return { ...prev, items: updated };
    });
  };
  // Computations
  const computedTotals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    formData.items.forEach((item) => {
      const lineTotal = item.quantity * item.unit_nett;
      subtotal += lineTotal;
      if (item.is_vatable === 1) {
        const tax = (item.unit_nett - item.unit_nett / 1.1) * item.quantity;
        totalTax += tax;
      }
    });
    return {
      subtotal,
      totalTax,
      totalBill: subtotal + (formData.shipping_charge || 0),
    };
  }, [formData.items, formData.shipping_charge]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      supplier_id: formData.supplier_id,
      reff_code: formData.reff_code,
      eta_at: formData.eta_at,
      address: formData.address,
      recipient_name: formData.recipient_name,
      recipient_phone: formData.recipient_phone,
      note: formData.note,
      shipping_charge: formData.shipping_charge,
      items: formData.items.map((item) => ({
        item_id: item.item_id,
        fraction_id: item.fraction_id,
        quantity: item.quantity,
        unit_nett: item.unit_nett,
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
        category="purchase"
        title="Tambah Purchase Order"
        subtitle="Buat transaksi pengadaan bahan baku ke supplier."
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
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              <RemoteSelect
                label="Supplier"
                placeholder="Pilih Supplier"
                value={supplierSelected}
                hook={suppliersResult as any}
                fetchData={(page, search) =>
                  getSuppliers({ page, search, is_active: "true" })
                }
                getLabel={(item: any) => item?.name || ""}
                getValue={(item: any) => item?.id}
                onChange={handleSupplierChange}
                onClear={handleSupplierClear}
                required
                error={
                  typeof FormState?.errors?.supplier_id === "string"
                    ? FormState.errors.supplier_id
                    : undefined
                }
              />
              <DatePicker
                label="Estimasi Kedatangan (ETA)"
                value={etaAt as any}
                disablePast
                onChange={(date) => {
                  const dayjsDate = date as Dayjs | null;
                  setEtaAt(dayjsDate);
                  setFormData((prev) => ({
                    ...prev,
                    eta_at: dayjsDate ? dayjsDate.format("YYYY-MM-DD") : "",
                  }));
                }}
                required
                error={
                  typeof FormState?.errors?.eta_at === "string"
                    ? FormState.errors.eta_at
                    : undefined
                }
              />
              <Input
                label="Kode Referensi Eksternal"
                variant="primary"
                placeholder="Contoh: INV/SUP/109283"
                value={formData.reff_code}
                onChange={(e) => handleInputChange("reff_code", e.target.value)}
              />
            </div>
          </div>
          {/* Section 2: Informasi Pengiriman & Penerima */}
          <div
            className="card-info card-animate bg-white border border-slate-200 rounded-xl relative shadow-sm"
            style={{ overflow: "visible", zIndex: 15 }}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Pengiriman & Penerima
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input
                label="Nama Penerima"
                variant="primary"
                required
                placeholder="Nama kontak di gudang..."
                value={formData.recipient_name}
                onChange={(e) =>
                  handleInputChange("recipient_name", e.target.value)
                }
                error={
                  typeof FormState?.errors?.recipient_name === "string"
                    ? FormState.errors.recipient_name
                    : undefined
                }
              />
              <Input
                label="No. Handphone"
                variant="primary"
                required
                placeholder="08123xxxx"
                value={formData.recipient_phone}
                onChange={(e) =>
                  handleInputChange("recipient_phone", e.target.value)
                }
                error={
                  typeof FormState?.errors?.recipient_phone === "string"
                    ? FormState.errors.recipient_phone
                    : undefined
                }
              />
              <Input
                label="Catatan Opsional"
                variant="primary"
                placeholder="Instruksi pengiriman..."
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
              />
              <div className="md:col-span-3">
                <Input
                  label="Alamat Pengiriman Lengkap"
                  variant="primary"
                  required
                  placeholder="Masukkan alamat lengkap tujuan pengiriman..."
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  error={
                    typeof FormState?.errors?.address === "string"
                      ? FormState.errors.address
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
          {/* Section 3: Dynamic Item Grid */}
          <div
            className="card-table card-animate bg-white border border-slate-200 rounded-xl shadow-sm"
            style={{ overflow: "visible", zIndex: 10 }}
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Daftar Bahan Baku (Purchase Items)
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
                    <th className="px-4 py-3 min-w-[250px]">Bahan Baku</th>
                    <th className="px-4 py-3 w-48">Satuan (Fraction)</th>
                    <th className="px-4 py-3 w-28 text-center">Jumlah</th>
                    <th className="px-4 py-3 w-40 text-right">Harga (Nett)</th>
                    <th className="px-4 py-3 w-44 text-right">Subtotal</th>
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
                          placeholder="Pilih item..."
                          value={item.itemSelected}
                          hook={itemsResult as any}
                          fetchData={(page, search) =>
                            getItems({ page, search, is_active: "true" })
                          }
                          getLabel={(it: any) =>
                            it ? `${it.name || "-"} [${it.barcode || "-"}]` : ""
                          }
                          getValue={(it: any) => it?.id}
                          onChange={(val) => handleItemChange(idx, val)}
                          onClear={() => handleItemClear(idx)}
                          error={getErrorItem(idx, "item_id")}
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <RemoteSelect
                          placeholder="Pilih satuan..."
                          value={item.fractionSelected}
                          disabled={!item.item_id}
                          data={fractionsCache[idx] || []}
                          getLabel={(f: any) =>
                            f
                              ? `${f.name || f.fraction_name || "PCS"} (Qty: ${f.quantity ?? 1})`
                              : ""
                          }
                          getValue={(f: any) => f?.id || f?.fraction_id}
                          onChange={(val) => handleFractionChange(idx, val)}
                          onClear={() => handleFractionClear(idx)}
                          error={getErrorItem(idx, "fraction_id")}
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
                      <td className="px-4 py-3 align-top text-right">
                        <Input
                          type="number"
                          variant="primary"
                          className="text-right font-medium mono"
                          value={item.unit_nett}
                          onChange={(e) =>
                            handlePriceChange(idx, Number(e.target.value))
                          }
                          min={0}
                          error={getErrorItem(idx, "unit_nett")}
                        />
                      </td>
                      <td className="px-4 py-3 align-top text-right text-sm font-bold text-slate-800 mono pt-5">
                        Rp{" "}
                        {(item.quantity * item.unit_nett).toLocaleString(
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
                      type="number"
                      value={formData.shipping_charge}
                      onChange={(e) =>
                        handleInputChange(
                          "shipping_charge",
                          Number(e.target.value),
                        )
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
                    Rp {(computedTotals.totalBill || 0).toLocaleString("id-ID")}
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
export default PurchaseOrderCreate;
