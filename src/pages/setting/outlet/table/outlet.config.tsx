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
  url: "/outlet",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <div>
          <div className="text-sm font-bold">{row?.name ?? "-"}</div>
          {row?.brand && (
            <div className="text-xs text-gray-400">{row.brand}</div>
          )}
        </div>
      ),
    },
    outlet_type: {
      title: "Type",
      sortable: true,
      component: (row: any) => (
        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
          {row?.outlet_type?.name ?? "-"}
        </span>
      ),
      align: "center",
    },
    phone: {
      title: "Kontak",
      component: (row: any) => (
        <div>
          <div className="text-sm">{row?.phone ?? "-"}</div>
          <div className="text-xs text-gray-400">{row?.recipient ?? "-"}</div>
        </div>
      ),
    },
    regency: {
      title: "Kabupaten",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-gray-600">{row?.regency?.name ?? "-"}</span>
      ),
    },
    village: {
      title: "Kecamatan",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-gray-600">{row?.village?.name ?? "-"}</span>
      ),
    },
    shipping_time: {
      title: "Jam Operasional",
      sortable: true,
      component: (row: any) => {
        const time = row?.shipping_time;
        const labels: Record<string, string> = {
          morning: "Pagi",
          afternoon: "Siang",
          evening: "Sore",
          night: "Malam",
        };
        return (
          <span className="text-xs text-gray-500">
            {time ? labels[time] ?? time : "-"}
          </span>
        );
      },
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
                  Modify outlet info
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
                <span className="text-[11px] text-slate-400">Remove outlet</span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
