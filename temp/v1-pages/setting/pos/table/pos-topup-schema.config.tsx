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
  url: "/pos/topup-schema",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    min_nominal: {
      title: "Min Nominal",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm font-semibold text-left block">
          Rp {Number(row?.min_nominal ?? 0).toLocaleString("id-ID")}
        </span>
      ),
      align: "left",
    },
    bonus: {
      title: "Bonus",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm font-semibold text-left block">
          {row?.bonus ?? 0}%
        </span>
      ),
      align: "left",
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
                  Modify topup schema
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
                <span className="text-[11px] text-slate-400">
                  Remove schema
                </span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
