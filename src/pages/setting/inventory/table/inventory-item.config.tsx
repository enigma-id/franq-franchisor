import { Dropdown } from "@/components";
import config from "@/services/table/const";
import { Edit, MoreVertical, Trash, Power } from "lucide-react";
import { Toggle } from "@/components/ui";

const createTableConfig = ({
  lockFilter,
  filter,
  onClick,
  onReload,
  onRemove,
  onToggleActive,
}: {
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onReload: () => void;
  onClick: (v: any) => void;
  onRemove: (v: any) => void;
  onToggleActive?: (row: any) => void;
}) => ({
  ...config,
  url: "/inventory/item",
  lockFilter,
  onReload,
  filter,
  columns: {
    name: {
      title: "Nama",
      sortable: true,
      component: (row: any) => (
        <div>
          <div className="text-sm font-semibold uppercase">
            {row?.name ?? "-"}
          </div>
          {row?.code && <div className="text-xs text-gray-400">{row.code}</div>}
          {row?.category && (
            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded mt-0.5 inline-block">
              {row.category.name}
            </span>
          )}
        </div>
      ),
    },
    base_price: {
      title: "Base Price",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm font-semibold">
          {Number(row?.base_price ?? 0).toLocaleString("id-ID")}
        </span>
      ),
      align: "right",
    },
    fraction: {
      title: "",
      sortable: false,
      component: (row: any) => (
        <span className="text-xs text-gray-500">
          {row?.default_fraction?.name ?? "-"}
        </span>
      ),
    },
    weight: {
      title: "Weight",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-gray-600">
          {row?.weight ? `${row.weight} gram` : "-"}
        </span>
      ),
      align: "right",
    },
    in_catalog: {
      title: "In Catalog",
      sortable: false,
      component: (row: any) =>
        row?.in_catalog ? (
          <span className="text-emerald-600 font-semibold text-sm">✓</span>
        ) : (
          <span className="text-gray-300 text-sm">-</span>
        ),
      align: "center",
    },
    is_vatable: {
      title: "VAT",
      sortable: true,
      component: (row: any) =>
        row?.is_vatable ? (
          <span className="text-emerald-600 font-semibold text-sm">✓</span>
        ) : (
          <span className="text-gray-300 text-sm">-</span>
        ),
      align: "center",
    },
    is_stockable: {
      title: "Stockable",
      sortable: true,
      component: (row: any) =>
        row?.is_stockable ? (
          <span className="text-emerald-600 font-semibold text-sm">✓</span>
        ) : (
          <span className="text-gray-300 text-sm">-</span>
        ),
      align: "center",
    },
    safety_stock: {
      title: "Safety",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-gray-600">{row?.safety_stock ?? 0}</span>
      ),
      align: "right",
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
        <div className="flex justify-center items-center">
          <Toggle
            checked={!!row?.is_active}
            onChange={() => onToggleActive?.(row)}
            variant="success"
            size="sm"
          />
        </div>
      ),
      align: "center",
    },
    action: {
      title: "",
      component: (row: any) => (
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
            onSelect={() => onClick(row)}
            className="hover:bg-indigo-50 hover:text-indigo-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Edit className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Edit</span>
                <span className="text-[11px] text-slate-400">
                  Modify item info
                </span>
              </div>
            </button>
          </Dropdown.Item>

          <Dropdown.Item
            onSelect={() => onToggleActive?.(row)}
            className={row?.is_active ? "hover:bg-amber-50 hover:text-amber-600" : "hover:bg-emerald-50 hover:text-emerald-600"}
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
              <div className={`w-8 h-8 rounded-lg ${row?.is_active ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"} flex items-center justify-center`}>
                <Power className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">
                  {row?.is_active ? "Deactivate" : "Activate"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {row?.is_active ? "Deactivate item" : "Activate item"}
                </span>
              </div>
            </button>
          </Dropdown.Item>

          <div className="my-1 border-t border-slate-50"></div>
          <Dropdown.Item
            onSelect={() => onRemove(row)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <Trash className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Delete</span>
                <span className="text-[11px] text-slate-400">Remove item</span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
