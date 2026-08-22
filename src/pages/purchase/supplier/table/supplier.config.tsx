import config from "@/services/table/const";
import type { SupplierDetail } from "@/services/types/supplier";
import { Dropdown, Toggle } from "@/components/ui";
import {
  Edit,
  User,
  MoreVertical,
  Trash,
  Building2,
  CreditCard,
  Clock,
} from "lucide-react";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onToggleActive,
  canManage,
}: {
  onRowClick?: (row: SupplierDetail) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: SupplierDetail) => void;
  onRemove?: (row: SupplierDetail) => void;
  onToggleActive?: (row: SupplierDetail) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/supplier",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama Supplier",
      sortable: true,
      component: (row: SupplierDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">{row.name}</span>
              {row.type && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                  {row.type}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              <span>{row.code || row.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      ),
    },
    address: {
      title: "Alamat",
      component: (row: SupplierDetail) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium line-clamp-1">
            <Building2 size={12} className="text-slate-400" />
            <span>{row.address || "-"}</span>
          </div>
        </div>
      ),
    },
    sales_person: {
      title: "Contact Person",
      component: (row: SupplierDetail) => (
        <div className="flex flex-col">
          <span className="text-slate-700 font-bold">
            {row.sales_person || "-"}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {row.phone || "-"}
          </span>
        </div>
      ),
    },
    bank_info: {
      title: "Rekening Bank",
      sortable: true,
      alias: "bank_name",
      component: (row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <CreditCard size={12} className="text-slate-400" />
            <span>{row.bank_name || "-"}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {row.bank_number ? `${row.bank_number} a/n ${row.bank_account}` : "-"}
          </span>
        </div>
      ),
    },
    top: {
      title: "TOP",
      align: "center",
      component: (row: any) => (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-700 font-bold">
            <Clock size={12} className="text-slate-400" />
            <span>{row.top || 0}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium uppercase">
            Hari
          </span>
        </div>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: SupplierDetail) => (
        <div className="flex justify-center items-center">
          <Toggle
            checked={!!row?.is_active}
            onChange={() => onToggleActive?.(row)}
            variant="success"
            size="sm"
            disabled={!canManage}
          />
        </div>
      ),
      align: "center",
    },
    actions: {
      title: "",
      width: 50,
      sortable: false,
      component: (row: SupplierDetail) => (
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          }
          position="end"
          contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2"
        >
          {canManage && (
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
                    Modify supplier info
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
          {canManage && (
            <>
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
                      Remove supplier
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            </>
          )}
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
