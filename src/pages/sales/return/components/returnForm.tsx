/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Input, DatePicker, RemoteSelect } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import type {
  SalesReturnRequest,
  SalesOrderDetail,
} from "@/services/types/sales";

import dayjs, { Dayjs } from "dayjs";

interface SalesReturnFormProps {
  id?: string;
  initialData?: any;
  onSubmit: (data: SalesReturnRequest) => void;
  isLoading?: boolean;
}

export const SalesReturnForm: React.FC<SalesReturnFormProps> = ({
  id = "sales-order-return",
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { get: getSalesOrders, getResult: salesOrdersResult } = useSalesOrder();

  const [selectedOrder, setSelectedOrder] = useState<SalesOrderDetail | null>(
    null,
  );
  const [formData, setFormData] = useState<SalesReturnRequest>({
    sales_order_id: "",
    date: new Date().toISOString(),
    items: [],
  });

  const [return_date, setReturnDate] = useState<Dayjs | null>(
    initialData?.date ? dayjs(initialData.date) : dayjs(),
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        sales_order_id: initialData.sales_order_id,
        date: initialData.date,
        items: initialData.items.map((item: any) => ({
          sales_order_item_id: item.sales_order_item_id,
          quantity: item.quantity,
          reason: item.reason,
        })),
      });
      setReturnDate(dayjs(initialData.date));
    }
  }, [initialData]);

  const handleOrderChange = (order: SalesOrderDetail | null) => {
    setSelectedOrder(order);
    if (order) {
      setFormData((prev) => ({
        ...prev,
        sales_order_id: order.id,
        items: order.sales_order_items.map((item) => ({
          sales_order_item_id: item.id,
          quantity: 0,
          reason: "",
        })),
      }));
    } else {
      setFormData((prev) => ({ ...prev, sales_order_id: "", items: [] }));
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <RemoteSelect<SalesOrderDetail>
            label="Pilih Transaksi Penjualan"
            placeholder="Cari nomor transaksi..."
            hook={salesOrdersResult as any}
            fetchData={(page, search) =>
              getSalesOrders({ page, search, status: "completed" })
            }
            getLabel={(item: any) =>
              `${item?.number} - ${item?.customer_name || "General"}`
            }
            renderItem={(item: any) => (
              <div className="flex flex-col">
                <span className="font-bold">{item?.number}</span>
                <span className="text-xs text-slate-500">
                  {item?.customer_name || "General Customer"}
                </span>
              </div>
            )}
            value={selectedOrder}
            onChange={handleOrderChange}
            disabled={!!initialData || isLoading}
          />
        </div>

        <div className="space-y-2">
          <DatePicker
            label="Tanggal Return"
            value={return_date || undefined}
            onChange={(date: any) => {
              setReturnDate(date as Dayjs);
              setFormData((prev) => ({
                ...prev,
                date: date ? (date as Dayjs).toISOString() : "",
              }));
            }}
            disabled={isLoading}
          />
        </div>
      </div>

      {formData.items.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Item Penjualan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-3">Nama Barang</th>
                  <th className="px-6 py-3 w-32">Qty Jual</th>
                  <th className="px-6 py-3 w-32">Qty Return</th>
                  <th className="px-6 py-3">Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.items.map((item, index) => {
                  const originalItem = selectedOrder?.sales_order_items.find(
                    (oi) => oi.id === item.sales_order_item_id,
                  );
                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">
                            {originalItem?.name || "Loading..."}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {originalItem?.quantity_ordered || 0}
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          min={0}
                          max={originalItem?.quantity_ordered || 0}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-24"
                          disabled={isLoading}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          placeholder="Contoh: Barang cacat"
                          value={item.reason}
                          onChange={(e) =>
                            handleItemChange(index, "reason", e.target.value)
                          }
                          disabled={isLoading}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </form>
  );
};
