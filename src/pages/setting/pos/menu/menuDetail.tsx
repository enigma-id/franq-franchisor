import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Package, Layers, DollarSign } from "lucide-react";
import { Page } from "@/components/app/layout";
import { usePOSMenu } from "@/services/pos/hooks";
import { Button, Badge } from "@/components/ui";
import { formatCurrency } from "@/utils";
import type { POSMenuDetail } from "@/services/types";

const POSMenuDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult } = usePOSMenu();
  const { data, isLoading } = showResult;

  const menu = data?.data as POSMenuDetail;

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
          <Button
            variant="primary"
            onClick={() => navigate(`/setting/pos/menu/update/${id}`)}
          >
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
          <div className="p-6 flex gap-6">
            {menu.image && (
              <img
                src={menu.image}
                alt={menu.name}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-100"
              />
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 flex-1">
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Kode
              </dt>
              <dd className="font-semibold text-xs text-slate-900">
                {menu.code}
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Nama
              </dt>
              <dd className="font-semibold text-xs text-slate-900">
                {menu.name}
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Kategori
              </dt>
              <dd className="font-semibold text-xs text-indigo-600">
                {menu.category?.name || "-"}
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </dt>
              <dd>
                <Badge
                  variant={menu.is_active ? "success" : "error"}
                  size="xs"
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                >
                  {menu.is_active ? "Aktif" : "Non-Aktif"}
                </Badge>
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tambahan
              </dt>
              <dd>
                <Badge
                  variant={menu.is_additional ? "info" : "warning"}
                  size="xs"
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                >
                  {menu.is_additional ? "Ya" : "Tidak"}
                </Badge>
              </dd>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="space-y-0.5">
              <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Harga Dasar
              </dt>
              <dd className="font-extrabold text-sm text-slate-900 tracking-tight">
                {formatCurrency(menu.base_price)}
              </dd>
            </div>
          </div>
        </div>

        {/* Secondary Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={14} />
              </div>
              Channel Prices
            </h2>
            <div className="space-y-2">
              {menu.channel_prices?.map((cp) => (
                <div
                  key={cp.id}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="font-medium text-xs text-slate-700">
                    {cp.pos_channel?.name || "Unknown"}
                  </span>
                  <span className="font-bold text-xs text-indigo-600">
                    {formatCurrency(cp.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Layers size={14} />
              </div>
              Outlet Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {menu.outlet_types?.map((ot) => (
                <Badge
                  key={ot.id}
                  variant="info"
                  className="rounded-full px-3 py-1 text-[10px] font-semibold"
                >
                  {ot.outlet_type?.name || "Unknown"}
                </Badge>
              ))}
            </div>
          </div>

          {/* Ingredient Recipe Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <Package size={14} />
              </div>
              Ingredient Recipe
            </h2>
            {menu.ingredients && menu.ingredients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {menu.ingredients.map((ing, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <span className="font-medium text-[11px] text-slate-600">
                      {ing.catalog?.name || "Unknown"}
                    </span>
                    <Badge
                      appearance="outline"
                      variant="info"
                      className="text-[10px] py-0.5"
                    >
                      {ing.porsi} units
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                No ingredients defined.
              </p>
            )}
          </div>

          {/* Addon Groups Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <Layers size={14} />
              </div>
              Addon Groups
            </h2>
            {menu.addon_groups && menu.addon_groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.addon_groups.map((group, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-slate-800">
                        {group.name}
                      </span>
                      <Badge
                        appearance="outline"
                        variant="accent"
                        className="text-[10px]"
                      >
                        {group.type}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {group.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="font-medium">
                            {item.addon_menu?.name || "Unknown"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                No addon groups defined.
              </p>
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export default POSMenuDetailPage;
