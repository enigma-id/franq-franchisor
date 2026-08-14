import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useInventoryItem } from "@/services/inventory/hooks";
import { Badge, Button, Loading } from "@/components";
import { formatCurrency } from "@/utils";
import type { InventoryItemDetail } from "@/services/types";
import { Package, Factory } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const InventoryItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult } = useInventoryItem();
  const canManage = useCan(ACTION.inventory);
  const { isLoading, data } = showResult;

  const item = data?.data as InventoryItemDetail;

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  if (isLoading)
    return (
      <Page className="h-full flex items-center justify-center">
        <Loading />
      </Page>
    );

  if (!item)
    return (
      <Page className="h-full flex items-center justify-center">
        Item not found
      </Page>
    );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory & Warehouse"
        title={item.name}
        backTo={() => navigate("/inventory/item")}
        action={
          canManage && (
            <Button
              variant="primary"
              onClick={() => navigate(`/inventory/item/update/${id}`)}
            >
              Edit Item
            </Button>
          )
        }
      />
      <Page.Body className="p-6 space-y-6">
        {/* TOP SECTION: Header & Meta */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 card-info p-6 flex flex-col justify-between">
            <div>
              <Badge
                variant={item.is_active ? "success" : "error"}
                className="mb-4"
              >
                ● {item.is_active ? "Active" : "Inactive"}
              </Badge>
              <h1 className="text-2xl font-bold">{item.name}</h1>
              <div className="flex gap-4 mt-2">
                <Badge variant="info">Code: {item.code}</Badge>
                <Badge variant="default">
                  Category: {item.category || "-"}
                </Badge>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 mt-6">
              <div className="info-row">
                <dt className="info-label">Variant</dt>
                <dd className="info-value">{item.variant || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Packaging</dt>
                <dd className="info-value">{item.packaging || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Size</dt>
                <dd className="info-value">{item.size || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">VATable</dt>
                <dd className="info-value">{item.is_vatable ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </div>
          <div className="col-span-4 card-info p-6 ">
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Base Price</dt>
                <dd className="info-value text-2xl text-indigo-600 font-bold">
                  {formatCurrency(item.base_price)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Weight</dt>
                <dd className="info-value">{item.weight} g</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Volume</dt>
                <dd className="info-value">{item.volume || 0} ml</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* MID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-info p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Factory size={18} />
              </div>
              <h2 className="card-section-title">Item Configuration</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Picking Strategy</dt>
                <dd className="info-value">
                  {item.picking_strategy.toUpperCase()}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Batch Tracking</dt>
                <dd className="info-value">
                  {item.is_batch_tracking ? "Yes" : "No"}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Default Fraction</dt>
                <dd className="info-value">{item.default_fraction}</dd>
              </div>
            </dl>
          </div>
          <div className="card-info p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Package size={18} />
              </div>
              <h2 className="card-section-title">Stock Status</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Available</dt>
                <dd className="info-value">{item.stock_available}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Defect</dt>
                <dd className="info-value">{item.stock_defect}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Safety Stock</dt>
                <dd className="info-value">{item.safety_stock}</dd>
              </div>
            </dl>
          </div>

          {/* Supplier Info */}
          <div className="card-info p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Factory size={18} />
              </div>
              <h2 className="card-section-title">Supplier Information</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Name</dt>
                <dd className="info-value">{item.supplier?.name || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Phone</dt>
                <dd className="info-value">{item.supplier?.phone || "-"}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Address</dt>
                <dd className="info-value">{item.supplier?.address || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Fractions Info */}
          <div className="card-info p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Package size={18} />
              </div>
              <h2 className="card-section-title">Fractions</h2>
            </div>
            <dl className="space-y-1">
              {item.fractions?.map((f, i) => (
                <div key={i} className="info-row">
                  <dt className="info-label">{f.name}</dt>
                  <dd className="info-value">
                    {f.quantity} {f.is_smallest ? "(Smallest)" : ""}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};

export default InventoryItemDetailPage;
