import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Badge, Button } from "@/components/ui";
import { RefreshCcw, ShoppingBag, Calendar, Hash, CheckCircle2, XCircle } from "lucide-react";
import { useSalesReturn } from "@/services/sales/hooks";
import dayjs from "dayjs";
import type { SalesReturnDetail } from "@/services/types";

const SalesReturnDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, approve, approveResult, reject, rejectResult } = useSalesReturn();

  useEffect(() => {
    if (id) show(id);
  }, [id, show]);

  const data = showResult.data?.data as SalesReturnDetail;
  const isPending = data?.status === "pending" || data?.status === "awaiting_approval";
  const isApproved = data?.status === "approved" || data?.status === "active";

  const handleApprove = async () => {
    if (!id) return;
    await approve({ id });
    show(id);
  };

  const handleReject = async () => {
    if (!id) return;
    await reject({ id });
    show(id);
  };

  const statusBadge = () => {
    if (!data) return null;
    if (isApproved) return <Badge variant="success" className="px-4 py-1.5 rounded-full text-xs">Approved</Badge>;
    if (data.status === "rejected") return <Badge variant="error" className="px-4 py-1.5 rounded-full text-xs">Rejected</Badge>;
    return <Badge variant="warning" className="px-4 py-1.5 rounded-full text-xs">Pending</Badge>;
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Detail Return Penjualan"
        subtitle="Informasi lengkap pengembalian barang."
        backTo={() => navigate(-1)}
        action={
          data && (
            <div className="flex items-center gap-2">
              {isPending && (
                <>
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={approveResult.isLoading}
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={rejectResult.isLoading}
                  >
                    <XCircle size={18} />
                    Reject
                  </Button>
                </>
              )}
              <Button
                className="text-primary hover:bg-primary/5"
                onClick={() =>
                  navigate(`/sales/order/detail/${data.sales_order_id}`)
                }
              >
                <ShoppingBag size={18} />
                Lihat Transaksi Asal
              </Button>
            </div>
          )
        }
      />

      <Page.Body className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    {data?.number}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    ID Transaksi: {data?.sales_order_id}
                  </p>
                </div>
              </div>
              {statusBadge()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="px-8 py-6 space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Tanggal Return
                  </span>
                </div>
                <p className="font-bold text-slate-700">
                  {dayjs(data?.date).format("DD MMMM YYYY")}
                </p>
              </div>
              <div className="px-8 py-6 space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Total Items
                  </span>
                </div>
                <p className="font-bold text-slate-700">
                  {data?.items.length || 0} Barang
                </p>
              </div>
              <div className="px-8 py-6 space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Dibuat Pada
                  </span>
                </div>
                <p className="font-bold text-slate-700">
                  {dayjs(data?.created_at).format("DD MMM YYYY, HH:mm")}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-slate-800 tracking-tight">
                Barang yang Dikembalikan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                    <th className="px-8 py-4">Nama Barang</th>
                    <th className="px-8 py-4 text-center">Quantity</th>
                    <th className="px-8 py-4">Alasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.items.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-700">
                          Item ID: {item.sales_order_item_id}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 italic">
                          "{item.reason || "Tidak ada alasan"}"
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export default SalesReturnDetailPage;
