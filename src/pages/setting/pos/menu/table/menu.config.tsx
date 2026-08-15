/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import type { POSMenuDetail } from "@/services/types/pos";
import { Dropdown, Toggle } from "@/components/ui";
import {
  UtensilsCrossed,
  Edit,
  Eye,
  MoreVertical,
  Trash,
  Store,
} from "lucide-react";
import { formatCurrency } from "@/utils";

const createTableConfig = ({
  onClick,
  onEdit,
  onRemove,
  onToggleActive,
  onOutletType,
  canManage,
}: {
  onClick?: (row: POSMenuDetail) => void;
  onEdit: (row: POSMenuDetail) => void;
  onRemove: (row: POSMenuDetail) => void;
  onToggleActive: (row: POSMenuDetail) => void;
  onOutletType?: (row: POSMenuDetail, outletType?: any) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/pos/menu",
  columns: {
    code: {
      title: "Kode",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <span className="text-slate-600 font-medium">{row.code}</span>
      ),
    },
    name: {
      title: "Nama Menu",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 overflow-hidden">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed size={16} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">{row.name}</span>
          </div>
        </div>
      ),
    },
    category: {
      title: "Kategori",
      sortable: true,
      alias: "category_id",
      component: (row: POSMenuDetail) => (
        <span className="text-slate-600 font-medium">
          {row.category?.name || "Tanpa Kategori"}
        </span>
      ),
    },
    base_price: {
      title: "Harga Dasar",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <span className="font-medium text-slate-600">
          {formatCurrency(row.base_price)}
        </span>
      ),
    },
    is_additional: {
      title: "Add-on",
      sortable: true,
      align: "center",
      component: (row: POSMenuDetail) => (
        row.is_additional ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            Ya
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )
      ),
    },
    is_active: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: POSMenuDetail) => (
        <div className="flex justify-center items-center">
          <Toggle
            checked={!!row?.is_active}
            onChange={() => onToggleActive?.(row)}
            disabled={!canManage}
            variant="success"
            size="sm"
          />
        </div>
      ),
    },
    outlet_type_count: {
      title: "Outlet Type",
      sortable: false,
      component: (row: any) => {
        const types = row?.outlet_types ?? [];
        return types.length > 0 ? (
          <div className="group relative inline-block">
            <span className="text-sm cursor-pointer hover:text-indigo-600 transition-colors">
              {types.length === 1
                ? types[0]?.outlet_type?.name || "-"
                : `${types.length} Type`}
            </span>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-44 z-50 pointer-events-none">
              {types.map((ot: any) => (
                <span
                  key={ot.outlet_type?.id || ot.outlet_type_id}
                  className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg whitespace-nowrap"
                >
                  {ot.outlet_type?.name || "-"}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-slate-300 italic">None</span>
        );
      },
      align: "center",
    },
    action: {
      title: "",
      headerClass: "text-right",
      class: "text-right",
      sortable: false,
      component: (row: POSMenuDetail) => (
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
            className="hover:bg-green-50 hover:text-green-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">See Detail</span>
                <span className="text-[11px] text-slate-400">
                  See catalog info
                </span>
              </div>
            </button>
          </Dropdown.Item>
          {canManage && (
            <Dropdown.Item
              onSelect={() => onEdit?.(row)}
              className="hover:bg-indigo-50 hover:text-indigo-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Edit className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Edit</span>
                  <span className="text-[11px] text-slate-400">
                    Modify menu info
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
          {canManage && !row?.is_additional && (
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
          )}
          {canManage && (
            <Dropdown.Item
              onSelect={() => onRemove?.(row)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <Trash className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Delete</span>
                  <span className="text-[11px] text-slate-400">
                    Remove menu
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
