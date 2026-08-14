import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { Badge, Button, Loading, useEnigmaUI } from "@/components";
import { formatCurrency, formatDate } from "@/utils";
import type { InventoryCatalogDetail } from "@/services/types";
import {
  Package,
  DollarSign,
  Factory,
  Calendar,
  Store,
  Edit,
} from "lucide-react";
import { AssignOutletTypeModal } from "./components/AssignOutletTypeModal";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const InventoryCatalogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal, closeModal } = useEnigmaUI();
  const { show, showResult } = useInventoryCatalog();
  const canManage = useCan(ACTION.catalog);
  const { isLoading, data } = showResult;

  const catalog = data?.data as InventoryCatalogDetail;

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  const openOutletType = (row: InventoryCatalogDetail) => {
    openModal({
      id: "assign-outlet-catalog",
      content: (
        <AssignOutletTypeModal
          catalog={row}
          onClose={() => closeModal("assign-outlet-catalog")}
          onSuccess={() => {
            closeModal("assign-outlet-catalog");
            show({ id });
          }}
        />
      ),
    });
  };

  if (isLoading)
    return (
      <Page className="h-full flex items-center justify-center">
        <Loading />
      </Page>
    );
  if (!catalog)
    return (
      <Page className="h-full flex items-center justify-center">
        Catalog not found
      </Page>
    );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory & Warehouse"
        title={catalog.name}
        backTo={() => navigate("/inventory/catalog")}
        action={
          canManage && (
            <Button
              variant="primary"
              onClick={() => navigate(`/inventory/catalog/update/${id}`)}
            >
              Edit Katalog
            </Button>
          )
        }
      />
      <Page.Body className="p-6 space-y-6">
        {/* TOP SECTION: Header & Meta */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9 card-info p-6 flex flex-col justify-between">
            <div>
              <Badge
                variant={catalog.is_active ? "success" : "error"}
                className="mb-4"
              >
                ● Active
              </Badge>
              <h1 className="text-2xl font-bold">{catalog.name}</h1>
              <div className="flex gap-4 mt-2">
                <Badge variant="info">Code: {catalog.code}</Badge>
                <Badge variant="default">
                  {catalog.is_bundle ? "Bundle" : "Not Bundle"}
                </Badge>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 mt-4">
              {!catalog.is_bundle && (
                <>
                  <div className="info-row">
                    <dt className="info-label">Item</dt>
                    <dd className="info-value">{catalog.item?.name}</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Variant</dt>
                    <dd className="info-value">{catalog.item?.variant}</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Packaging</dt>
                    <dd className="info-value">{catalog.item?.packaging}</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Size</dt>
                    <dd className="info-value">{catalog.item?.size}</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Category</dt>
                    <dd className="info-value">{catalog.item?.category}</dd>
                  </div>
                </>
              )}
              {catalog.is_bundle && (
                <>
                  <div className="info-row">
                    <dt className="info-label">Measurement</dt>
                    <dd className="info-value">
                      {catalog.volume} {catalog.measurement}
                    </dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Unit</dt>
                    <dd className="info-value">{catalog.unit}</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Weight</dt>
                    <dd className="info-value">{catalog.weight} g</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">VATable</dt>
                    <dd className="info-value">
                      {catalog.is_vatable ? "Yes" : "No"}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
          {!catalog.is_bundle ? (
            <div className="col-span-3 card-info p-6">
              <dl className="space-y-1">
                <>
                  <div className="info-row">
                    <dt className="info-label">Fraction</dt>
                    <dd className="info-value">
                      {catalog.item_fraction?.name} (
                      {catalog.item_fraction?.quantity})
                    </dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Measurement</dt>
                    <dd className="info-value">
                      {catalog.volume} {catalog.measurement}
                    </dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Unit</dt>
                    <dd className="info-value">{catalog.unit}</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">Weight</dt>
                    <dd className="info-value">{catalog.weight} g</dd>
                  </div>
                  <div className="info-row">
                    <dt className="info-label">VATable</dt>
                    <dd className="info-value">
                      {catalog.is_vatable ? "Yes" : "No"}
                    </dd>
                  </div>
                </>
              </dl>
            </div>
          ) : (
            <div className="col-span-3 card-info p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <DollarSign size={18} />
                </div>
                <h2 className="card-section-title">Pricing</h2>
              </div>
              <dl className="space-y-1">
                <div className="info-row">
                  <dt className="info-label">Base Price</dt>
                  <dd className="info-value">
                    {formatCurrency(catalog.base_price)}
                  </dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Unit Price</dt>
                  <dd className="info-value">
                    {formatCurrency(catalog.unit_price)}
                  </dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Margin</dt>
                  <dd className="info-value">
                    {formatCurrency(catalog.unit_price - catalog.base_price)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* MID SECTION: Cards */}
        <div className="grid grid-cols-3 gap-6">
          {!catalog.is_bundle && (
            <div className="card-info p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <DollarSign size={18} />
                </div>
                <h2 className="card-section-title">Pricing</h2>
              </div>
              <dl className="space-y-1">
                <div className="info-row">
                  <dt className="info-label">Base Price</dt>
                  <dd className="info-value">
                    {formatCurrency(catalog.base_price)}
                  </dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Unit Price</dt>
                  <dd className="info-value">
                    {formatCurrency(catalog.unit_price)}
                  </dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Margin</dt>
                  <dd className="info-value">
                    {formatCurrency(catalog.unit_price - catalog.base_price)}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {!catalog.is_bundle && (
            <div className="card-info p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <Factory size={18} />
                </div>
                <h2 className="card-section-title">Item Details</h2>
              </div>
              <dl className="space-y-1">
                <div className="info-row">
                  <dt className="info-label">Item Code</dt>
                  <dd className="info-value">{catalog.item.code}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Barcode</dt>
                  <dd className="info-value">{catalog.item.barcode || "-"}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Type</dt>
                  <dd className="info-value">{catalog.item.type}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Picking</dt>
                  <dd className="info-value">
                    {catalog.item.picking_strategy.toUpperCase()}
                  </dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Batch</dt>
                  <dd className="info-value">
                    {catalog.item.is_batch_tracking ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {!catalog.is_bundle && (
            <div className="card-info p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <Package size={18} />
                </div>
                <h2 className="card-section-title">Inventory & Stock</h2>
              </div>
              <dl className="space-y-1">
                <div className="info-row">
                  <dt className="info-label">Available</dt>
                  <dd className="info-value">{catalog.item.stock_available}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Defect</dt>
                  <dd className="info-value">{catalog.item.stock_defect}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Safety</dt>
                  <dd className="info-value">{catalog.item.safety_stock}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">In Catalog</dt>
                  <dd className="info-value">
                    {catalog.item.in_catalog ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {catalog.is_bundle && (
            <div className="col-span-3 card-info p-6">
              <div className="card-section-header mb-0!">
                <div className="card-section-icon">
                  <Package size={16} />
                </div>
                <h2 className="card-section-title">Bundle Components</h2>
              </div>

              <div className="overflow-auto">
                <table
                  className="table-hover table-vcenter datatable table"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                        Item Name
                      </th>
                      <th className="px-4 py-4 text-right uppercase text-[#8B95A5] text-[11px] font-bold">
                        Quantity
                      </th>
                      <th className="px-4 py-4 text-left uppercase text-[#8B95A5] text-[11px] font-bold">
                        Fraction
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.bundle_items?.map((bi: any) => (
                      <tr key={bi.id} className="border-b">
                        <td className="px-4 py-3">{bi.item?.name}</td>
                        <td className="px-4 py-3 text-right">{bi.quantity}</td>
                        <td className="px-4 py-3">{bi.fraction?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-2 gap-6">
          <div className="card-info p-6">
            <div className="card-section-header mb-0! justify-between">
              <div className="flex items-center gap-4">
                <div className="card-section-icon">
                  <Store size={16} />
                </div>
                <h2 className="card-section-title">Outlet Types</h2>
              </div>
              {canManage && (
                <Button
                  variant="primary"
                  styleType="ghost"
                  onClick={() => openOutletType(catalog)}
                  size="sm"
                >
                  <Edit size={14} />
                </Button>
              )}
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
                  {catalog.outlet_types?.map((ot: any) => (
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
          <div className="card-info p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Calendar size={18} />
              </div>
              <h2 className="card-section-title">Audit Information</h2>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 mt-4">
              <div className="info-row">
                <dt className="info-label">Created By</dt>
                <dd className="info-value">{catalog.created_by}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Updated By</dt>
                <dd className="info-value">{catalog.updated_by}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Created</dt>
                <dd className="info-value">{formatDate(catalog.created_at)}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Updated</dt>
                <dd className="info-value">{formatDate(catalog.updated_at)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export default InventoryCatalogDetailPage;
