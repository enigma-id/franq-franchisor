import config from "@/services/table/const";
import type { PaymentMethodDetail } from "@/services/types/pos";
import { Dropdown, Toggle } from "@/components/ui";
import { Edit, CreditCard, MoreVertical, Power, Trash } from "lucide-react";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onToggleActive,
}: {
  onRowClick?: (row: PaymentMethodDetail) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: PaymentMethodDetail) => void;
  onRemove?: (row: PaymentMethodDetail) => void;
  onToggleActive?: (row: PaymentMethodDetail) => void;
}) => ({
  ...config,
  url: "/payment/method",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama Pembayaran",
      sortable: true,
      component: (row: PaymentMethodDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <CreditCard size={16} />
          </div>
          <span className="font-bold text-slate-700">{row.name}</span>
        </div>
      ),
    },
    provider: {
      title: "Provider",
      component: (row: PaymentMethodDetail) => (
        <span className="text-slate-600 font-medium">{row.provider}</span>
      ),
    },
    type: {
      title: "Tipe",
      component: (row: PaymentMethodDetail) => (
        <span className="text-[12px] bg-slate-100 px-2 py-0.5 rounded uppercase font-mono text-slate-500">
          {row.type}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: PaymentMethodDetail) => (
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
    actions: {
      title: "",
      width: 50,
      sortable: false,
      component: (row: PaymentMethodDetail) => (
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
                  Modify payment info
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
                  Remove payment method
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
                  {row?.is_active ? "Deactivate method" : "Activate method"}
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
