/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from "@/components";
import config from "@/services/table/const";
import type { InventoryCatalogDetail } from "@/services/types/inventory";
import {
  Edit,
  Layers,
  MoreVertical,
  Package,
  Power,
  Trash,
  Scale,
  Store,
} from "lucide-react";
import { Toggle } from "@/components/ui";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onOutletType,
  onToggleActive,
}: {
  onRowClick?: (row: any) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: any) => void;
  onRemove?: (row: any) => void;
  onOutletType?: (row: any) => void;
  onToggleActive?: (row: any) => void;
}) => {
  return {
    ...config,
    url: "/inventory/catalog",
    lockFilter,
    filter,
    onRowClick,
    columns: {
      name: {
        title: "Catalog",
        sortable: true,
        headerClass: "text-xs uppercase!",
        class: "p-4! capitalize",
        component: (row: InventoryCatalogDetail) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
              {row?.is_bundle ? (
                <Layers className="w-4.5 h-4.5" />
              ) : (
                <Package className="w-4.5 h-4.5" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-gray-900">
                {row?.name || "-"}
              </span>
              {row?.code && (
                <div className="text-xs text-gray-400">{row.code}</div>
              )}
            </div>
          </div>
        ),
      },
      is_bundle: {
        title: "Type",
        headerClass: "text-xs uppercase!",
        class: "p-4!",
        component: (row: InventoryCatalogDetail) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${row?.is_bundle ? "bg-purple-500" : "bg-blue-500"}`}
            />
            <span className="text-[13px] font-medium text-gray-700">
              {row?.is_bundle ? "Bundle" : "Single"}
            </span>
          </div>
        ),
        align: "center",
      },
      fraction: {
        title: "Unit",
        headerClass: "text-xs uppercase!",
        class: "p-4!",
        component: (row: InventoryCatalogDetail) => {
          if (row?.is_bundle) {
            return <span className="text-[12px] text-gray-500 italic">-</span>;
          }
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-semibold text-gray-700">
                {row?.item_fraction?.name || row?.measurement || "-"}
              </span>
              {row?.item_fraction?.quantity &&
                row?.item_fraction?.quantity > 1 && (
                  <span className="text-[11px] text-gray-400">
                    Qty: {row?.item_fraction?.quantity}
                  </span>
                )}
            </div>
          );
        },
        align: "center",
      },
      base_price: {
        title: "Base Price",
        sortable: true,
        format_number: true,
      },
      unit_price: {
        title: "Unit Price",
        sortable: true,
        format_number: true,
      },
      weight: {
        title: "Weight",
        headerClass: "text-xs uppercase!",
        class: "p-4!",
        component: (row: InventoryCatalogDetail) => (
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[12px] font-medium text-gray-600">
              {row?.weight ? `${row.weight} g` : "-"}
            </span>
          </div>
        ),
        align: "center",
      },

      outlet_type_count: {
        title: "Outlet Type",
        sortable: false,
        component: (row: any) => (
          <span className="text-sm">{row?.outlets?.length ?? 0} type</span>
        ),
        align: "center",
      },
      is_active: {
        title: "Status",
        headerClass: "text-xs uppercase!",
        class: "p-4!",
        align: "center",
        component: (row: InventoryCatalogDetail) => (
          <div className="flex justify-center items-center">
            <Toggle
              checked={!!row?.is_active}
              onChange={() => onToggleActive?.(row)}
              variant="success"
              size="sm"
            />
          </div>
        ),
      },
      action: {
        title: "",
        class: "flex place-items-center place-content-end",
        sortable: false,
        width: 50,
        component: (row: InventoryCatalogDetail) => (
          <Dropdown
            trigger={
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </button>
            }
            position="end"
            contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2"
          >
            <Dropdown.Item
              onSelect={() => onClick?.(row)}
              className="hover:bg-indigo-50 hover:text-indigo-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Edit className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Edit</span>
                  <span className="text-[11px] text-slate-400">
                    Modify catalog info
                  </span>
                </div>
              </button>
            </Dropdown.Item>

            <Dropdown.Item
              onSelect={() => onToggleActive?.(row)}
              className={
                row?.is_active
                  ? "hover:bg-amber-50 hover:text-amber-600"
                  : "hover:bg-emerald-50 hover:text-emerald-600"
              }
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
                <div
                  className={`w-8 h-8 rounded-lg ${row?.is_active ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"} flex items-center justify-center`}
                >
                  <Power className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">
                    {row?.is_active ? "Deactivate" : "Activate"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {row?.is_active ? "Deactivate catalog" : "Activate catalog"}
                  </span>
                </div>
              </button>
            </Dropdown.Item>

            <div className="my-1 border-t border-slate-50"></div>
            <Dropdown.Item
              onSelect={() => onRemove?.(row)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <Trash className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Delete</span>
                  <span className="text-[11px] text-slate-400">
                    Remove catalog
                  </span>
                </div>
              </button>
            </Dropdown.Item>
            <div className="my-1 border-t border-slate-50"></div>
            <Dropdown.Item
              onSelect={() => onOutletType?.(row)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Store className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Outlet Type</span>
                  <span className="text-[11px] text-slate-400">
                    Manage availability
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          </Dropdown>
        ),
      },
    },
  };
};

export default createTableConfig;
