import config from "@/services/table/const";
import type { POSMenuDetail } from "@/services/types/pos";
import { Dropdown, Toggle } from "@/components/ui";
import { UtensilsCrossed, Edit, Eye, MoreVertical, Trash } from "lucide-react";
import { formatCurrency } from "@/utils";

const createTableConfig = ({
  onClick,
  onEdit,
  onRemove,
  onToggleActive,
}: {
  onClick?: (row: POSMenuDetail) => void;
  onEdit: (row: POSMenuDetail) => void;
  onRemove: (row: POSMenuDetail) => void;
  onToggleActive: (row: POSMenuDetail) => void;
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
    is_active: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: POSMenuDetail) => (
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
    outlet_types: {
      title: "Jenis Outlet",
      component: (row: POSMenuDetail) => (
        <span className="text-slate-600 font-medium">
          {row.outlet_types?.map((ot) => ot.outlet_type?.name).join(", ") ||
            "-"}
        </span>
      ),
    },
    action: {
      title: "",
      headerClass: "text-right",
      class: "text-right",
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
                  See purchase order info
                </span>
              </div>
            </button>
          </Dropdown.Item>
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
          <div className="my-1 border-t border-slate-50"></div>
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
                <span className="text-[11px] text-slate-400">Remove menu</span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
