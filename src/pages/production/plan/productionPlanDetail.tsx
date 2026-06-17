import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Badge, Button, Card } from "@/components/ui";
import { useProductionPlan } from "@/services/production/hooks";
import { Loader2, ArrowLeft, Factory, Calendar, FileText, Package, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";

const ProductionPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useProductionPlan();

  const { data: plan, isLoading } = getById(id || "");

  if (isLoading) {
    return (
      <Page className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </Page>
    );
  }

  if (!plan) {
    return (
      <Page className="h-full flex items-center justify-center">
        <p className="text-slate-500">Data rencana produksi tidak ditemukan.</p>
      </Page>
    );
  }

  const statusVariant: any = {
    draft: "neutral",
    published: "info",
    completed: "success",
    cancelled: "error",
  }[plan.status] || "neutral";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title={`Detail Rencana Produksi - ${plan.number}`}
        subtitle={`Detail rencana produksi tanggal ${dayjs(plan.date).format("DD MMM YYYY")}`}
        backUrl="/production/plan"
        action={
          <Button variant="outline" onClick={() => navigate("/production/plan")}>
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </Button>
        }
      />

      <Page.Body className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Nomor Rencana</Label>
                <p className="text-lg font-bold text-slate-800">{plan.number}</p>
              </div>
              <div>
                <Label>Tanggal Produksi</Label>
                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={18} />
                  {dayjs(plan.date).format("DD MMMM YYYY")}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  <Badge variant={statusVariant} shape="pill" className="capitalize">
                    {plan.status}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-3">
                <Label>Catatan</Label>
                <p className="text-slate-600 italic">{plan.note || "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Package className="text-slate-400" size={20} />
              <h3 className="font-bold text-slate-700">Daftar Item Produksi</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-3">Catalog ID</th>
                  <th className="px-6 py-3 text-right">Quantity</th>
                  <th className="px-6 py-3">Catatan</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plan.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-700">{item.catalog_id}</td>
                    <td className="px-6 py-4 text-right font-bold text-primary">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">{item.note || "-"}</td>
                    <td className="px-6 py-4 text-center">
                        {item.is_completed ? (
                            <Badge variant="success" className="flex items-center gap-1 w-fit mx-auto">
                                <CheckCircle2 size={12}/> Selesai
                            </Badge>
                        ) : (
                            <Badge variant="neutral">Pending</Badge>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </Page.Body>
    </Page>
  );
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{children}</span>
);

export default ProductionPlanDetailPage;
