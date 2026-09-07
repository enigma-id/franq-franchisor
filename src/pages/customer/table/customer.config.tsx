import config from "@/services/table/const";
import { Dropdown, Toggle } from "@/components/ui";
import { MoreVertical, Trash, Eye, Contact } from "lucide-react";
import { formatDateTime } from "@/utils";
import type { CustomerDetail } from "@/services/types/customer";

const createTableConfig = ({
  onClick,
  onRemove,
  onToggleActive,
  canManage,
}: {
  onClick?: (row: CustomerDetail) => void;
  onRemove?: (row: CustomerDetail) => void;
  onToggleActive?: (row: CustomerDetail) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/customer",
  columns: {
    name: {
      title: "Nama",
      sortable: true,
      component: (row: CustomerDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
            <Contact className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-gray-900">
              {row?.name || "-"}
            </span>
            {row?.email && (
              <span className="text-[11px] text-slate-400">{row.email}</span>
            )}
          </div>
        </div>
      ),
    },
    phone: {
      title: "Telepon",
      sortable: true,
      component: (row: CustomerDetail) => (
        <span className="text-sm text-gray-600">{row?.phone || "-"}</span>
      ),
    },
    address: {
      title: "Alamat",
      sortable: false,
      component: (row: CustomerDetail) => (
        <span className="text-sm text-gray-600 max-w-60 block truncate">
          {row?.address || "-"}
        </span>
      ),
    },
    note: {
      title: "Catatan",
      sortable: false,
      component: (row: CustomerDetail) => (
        <span className="text-sm text-gray-500 max-w-40 block truncate">
          {row?.note || "-"}
        </span>
      ),
    },
    updated_at: {
      title: "Diperbarui",
      sortable: true,
      component: (row: CustomerDetail) => (
        <span className="text-sm text-gray-500">
          {row.updated_at ? formatDateTime(row.updated_at) : "-"}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      align: "center",
      headerClass: "text-center",
      component: (row: CustomerDetail) => (
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
    },
    action: {
      title: "",
      sortable: false,
      width: 50,
      class: "text-right",
      component: (row: CustomerDetail) => (
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
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Edit</span>
                <span className="text-[11px] text-slate-400">
                  Ubah data customer
                </span>
              </div>
            </button>
          </Dropdown.Item>
          {canManage && (
            <>
              <div className="my-1 border-t border-slate-50"></div>
              <Dropdown.Item
                onSelect={() => onRemove?.(row)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <Trash className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Delete</span>
                    <span className="text-[11px] text-slate-400">
                      Hapus customer
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
