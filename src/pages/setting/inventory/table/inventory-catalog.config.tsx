import { Dropdown } from "@/components";
import config from "@/services/table/const";
import { Edit, MoreVertical, Trash } from "lucide-react";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
}: {
  onRowClick?: (row: any) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: any) => void;
  onRemove?: (row: any) => void;
} = {}) => ({
  ...config,
  url: "/inventory/catalog",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    image: {
      title: "Gambar",
      component: (row: any) =>
        row?.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
            -
          </div>
        ),
      align: "center",
    },
    name: {
      title: "Menu",
      sortable: true,
      component: (row: any) => (
        <div>
          <div className="text-sm font-semibold">{row?.name ?? "-"}</div>
          {row?.code && (
            <div className="text-xs text-gray-400">{row.code}</div>
          )}
        </div>
      ),
    },
    fraction: {
      title: "Unit",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.default_fraction?.name ?? "-"}</span>
      ),
      align: "center",
    },
    base_price: {
      title: "Base Price",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm font-semibold text-right block">
          {Number(row?.base_price ?? 0).toLocaleString("id-ID")}
        </span>
      ),
      align: "right",
    },
    unit_price: {
      title: "Unit Price",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-right block">
          {Number(row?.unit_price ?? 0).toLocaleString("id-ID")}
        </span>
      ),
      align: "right",
    },
    outlet_type_count: {
      title: "Outlet Type",
      sortable: false,
      component: (row: any) => (
        <span className="text-sm">{row?.outlet_type_count ?? 0} type</span>
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
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: any) =>
        row?.is_active ? (
          <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
            Active
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
            Inactive
          </span>
        ),
      align: "center",
    },
    actions: {
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
            onSelect={() => onClick?.(row)}
            className="hover:bg-indigo-50 hover:text-indigo-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
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
                <span className="text-[11px] text-slate-400">Remove catalog</span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
