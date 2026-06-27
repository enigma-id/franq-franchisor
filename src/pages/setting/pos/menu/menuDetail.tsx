import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Loader2, Package, Store } from "lucide-react";
import { Page } from "@/components/app/layout";
import { usePOSMenu } from "@/services/pos/hooks";
import { Button, Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils";
import type { POSMenuDetail } from "@/services/types";
import { Modal, useEnigmaUI } from "@/components";
import { AssignOutletTypeModal } from "./components/AssignOutletTypeModal";
import Label from "@/components/app/print/label";
import { usePrintWindow } from "@/utils/usePrintWindow";

const POSMenuDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { show, showResult } = usePOSMenu();
  const { data, isLoading } = showResult;

  const { open: openPrint } = usePrintWindow({
    title: "Print Preview",
    autoClose: true,
  });

  const menu = data?.data as POSMenuDetail;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  const openOutletType = (row: POSMenuDetail) => {
    openModal({
      id: "assign-outlet-catalog",
      content: (
        <AssignOutletTypeModal
          catalog={row}
          onClose={() => closeModal("assign-outlet-menu")}
          onSuccess={() => {
            closeModal("assign-outlet-menu");
            show({ id });
          }}
        />
      ),
    });
  };

  const handleOpenPrint = () => {
    if (menu.channel_prices && menu.channel_prices.length > 0) {
      openModal({
        id: "select-channel-price",
        content: (
          <Modal.Wrapper
            open
            onClose={() => closeModal("select-channel-price")}
            closeOnOutsideClick={false}
          >
            <Modal.Header>
              <div className="font-bold leading-7">Pilih Channel Price</div>
              <div className="text-xs text-slate-500 font-normal mt-1">
                Pilih channel price mana saja yang dapat menggunakan
                katalog{" "}
              </div>
            </Modal.Header>
            <Modal.Body className="max-h-[60vh] overflow-y-auto p-5">
              <div className="space-y-2">
                <button
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
                  onClick={() => {
                    openPrint(<Label data={menu} />);
                    closeModal("select-channel-price");
                  }}
                >
                  <div className="font-medium">Default Price</div>
                  <div className="text-sm text-indigo-600 font-bold">
                    {formatCurrency(menu.base_price)}
                  </div>
                </button>
                {menu.channel_prices.map((cp: any) => (
                  <button
                    key={cp.id}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
                    onClick={() => {
                      openPrint(<Label data={menu} channel_prices={cp} />);
                      closeModal("select-channel-price");
                    }}
                  >
                    <div className="font-medium">{cp.pos_channel?.name}</div>
                    <div className="text-sm text-indigo-600 font-bold">
                      {formatCurrency(cp.price)}
                    </div>
                  </button>
                ))}
              </div>
            </Modal.Body>
          </Modal.Wrapper>
        ),
      });
    } else {
      openPrint(<Label data={menu} />);
    }
  };

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
        title={menu.name}
        backTo={() => navigate("/setting/pos/menu")}
        action={
          <div className="flex gap-4">
            <Button
              variant="primary"
              onClick={() => navigate(`/setting/pos/menu/update/${id}`)}
            >
              Edit Menu
            </Button>
            <Button variant="primary" onClick={handleOpenPrint}>
              Print
            </Button>
          </div>
        }
      />
      <Page.Body className="p-6 space-y-6">
        {/* TOP SECTION: Header & Meta */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 card-info p-6 flex flex-col justify-between">
            <div>
              <Badge
                variant={menu.is_active ? "success" : "error"}
                className="mb-4"
              >
                ● {menu.is_active ? "Active" : "Inactive"}
              </Badge>
              <div className="flex items-start gap-4">
                {menu.image && (
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{menu.name}</h1>
                  <div className="flex gap-4 mt-2">
                    <Badge variant="info">Code: {menu.code}</Badge>
                    <Badge variant="default">
                      Category: {menu.category?.name || "-"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 mt-6">
              <div className="info-row">
                <dt className="info-label">Vatable</dt>
                <dd className="info-value">{menu.is_vatable ? "Yes" : "No"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Additional</dt>
                <dd className="info-value">
                  {menu.is_additional ? "Yes" : "No"}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Custom</dt>
                <dd className="info-value">{menu.is_custom ? "Yes" : "No"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Base Price</dt>
                <dd className="info-value text-2xl text-indigo-600 font-bold">
                  {formatCurrency(menu.base_price)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="col-span-4 card-info p-6">
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Created By</dt>
                <dd className="info-value">{menu.created_by}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Updated By</dt>
                <dd className="info-value">{menu.updated_by || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Created At</dt>
                <dd className="info-value">{formatDate(menu.created_at)}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Updated At</dt>
                <dd className="info-value">{formatDate(menu.updated_at)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Content Tabs Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Ingredients */}
            <div className="card-info p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <Package size={18} />
                </div>
                <h3 className="card-section-title">Ingredients</h3>
              </div>
              {menu.ingredients && menu.ingredients.length > 0 ? (
                <div className="space-y-3">
                  {menu.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        {ing.catalog?.name}
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        {ing.catalog.unit} {ing.catalog.measurement}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No ingredients.</p>
              )}
            </div>

            {/* Add-ons */}
            {!menu?.is_additional && (
              <div className="card-info p-6">
                <div className="card-section-header">
                  <div className="card-section-icon">
                    <Package size={18} />
                  </div>
                  <h3 className="card-section-title">Add-ons</h3>
                </div>
                {menu.addon_groups && menu.addon_groups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menu.addon_groups.map((group, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-slate-800 text-sm">
                            {group.name}
                          </p>
                          <Badge variant="accent" className="text-[10px]">
                            {group.type}
                          </Badge>
                        </div>
                        {group.items.map((item, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 border-t pt-2 border-slate-200"
                          >
                            {item.addon_menu?.image && (
                              <img
                                src={item.addon_menu.image}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="text-xs font-medium text-slate-800">
                                {item.addon_menu?.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {formatCurrency(
                                  item.addon_menu?.base_price || 0,
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">No add-ons.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Channel Pricing */}
            <div className="card-info p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <Store size={18} />
                </div>
                <h3 className="card-section-title">Channel Prices</h3>
              </div>
              <div className="space-y-3">
                {menu.channel_prices?.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex justify-between items-center bg-slate-50 p-3 rounded-xl"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {cp.pos_channel?.name}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {formatCurrency(cp.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outlet Types */}
            {!menu?.is_additional && (
              <div className="card-info p-6">
                <div className="card-section-header mb-0! justify-between">
                  <div className="flex items-center gap-4">
                    <div className="card-section-icon">
                      <Store size={16} />
                    </div>
                    <h2 className="card-section-title">Outlet Types</h2>
                  </div>
                  <Button
                    variant="primary"
                    styleType="ghost"
                    onClick={() => openOutletType(menu)}
                    size="sm"
                  >
                    <Edit size={14} />
                  </Button>
                </div>

                <div className="flex-1 overflow-auto">
                  <table
                    className="table-hover table-vcenter datatable table"
                    width="100%"
                  >
                    <thead>
                      <tr>
                        <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                          Outlet Type
                        </th>
                        <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.outlet_types?.map((ot: any) => (
                        <tr key={ot.id} className="border-b">
                          <td className="px-4 py-3">{ot.outlet_type?.name}</td>
                          <td className="px-4 py-3">
                            <Badge variant="success">Active</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export default POSMenuDetailPage;
