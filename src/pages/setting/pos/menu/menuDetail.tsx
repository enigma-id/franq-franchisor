import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Package, Tag, Layers, DollarSign } from "lucide-react";
import { Page } from "@/components/app/layout";
import { usePOSMenu } from "@/services/pos/hooks";
import { Button, Badge } from "@/components/ui";
import { formatCurrency } from "@/utils";

const POSMenuDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult } = usePOSMenu();
  const { data, isLoading } = showResult;
  const menu = data?.data;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  if (isLoading) {
    return (
      <Page className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </Page>
    );
  }

  if (!menu) {
    return (
      <Page className="h-full flex items-center justify-center">
        <p className="text-slate-500">Data menu tidak ditemukan.</p>
      </Page>
    );
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title={`Detail Menu - ${menu.name}`}
        backTo={() => navigate("/setting/pos/menu")}
        action={
          <Button variant="primary" onClick={() => navigate(`/setting/pos/menu/update/${id}`)}>
            Edit Menu
          </Button>
        }
      />
      <Page.Body className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Package size={16} />
              </div>
              Informasi Dasar
            </h2>
          </div>
          <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            <div className="space-y-0.5">
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kode</dt>
              <dd className="font-semibold text-sm text-slate-900">{menu.code}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama</dt>
              <dd className="font-semibold text-sm text-slate-900">{menu.name}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kategori</dt>
              <dd className="font-semibold text-sm text-indigo-600">{menu.category?.name || "-"}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</dt>
              <dd>
                <Badge variant={menu.is_active ? "success" : "error"} size="xs" className="rounded-full px-2 py-0.5 text-[11px] font-bold">
                  {menu.is_active ? "Aktif" : "Non-Aktif"}
                </Badge>
              </dd>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="space-y-0.5">
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Harga Dasar</dt>
              <dd className="font-extrabold text-lg text-slate-900 tracking-tight">{formatCurrency(menu.base_price)}</dd>
            </div>
          </div>
        </div>

        {/* Secondary Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={16} />
              </div>
              Channel Prices
            </h2>
            <div className="space-y-2">
              {menu.channel_prices?.map((cp) => (
                <div key={cp.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-medium text-sm text-slate-700">{cp.pos_channel?.name || "Unknown"}</span>
                  <span className="font-bold text-sm text-indigo-600">{formatCurrency(cp.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Layers size={16} />
              </div>
              Outlet Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {menu.outlet_types?.map((ot) => (
                <Badge key={ot.id} variant="info" className="rounded-full px-3 py-1 text-xs font-semibold">
                  {ot.outlet_type?.name || "Unknown"}
                </Badge>
              ))}
            </div>
          </div>

          {/* Ingredient Recipe Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <Package size={16} />
              </div>
              Ingredient Recipe
            </h2>
            {menu.ingredients && menu.ingredients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {menu.ingredients.map((ing, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-medium text-xs text-slate-600">ID: {ing.catalog_id}</span>
                    <Badge variant="outline" className="font-bold text-xs text-indigo-600 px-2 py-0.5">
                      {ing.porsi} units
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No ingredients defined.</p>
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export default POSMenuDetailPage;

