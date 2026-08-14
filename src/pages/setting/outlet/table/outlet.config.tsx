/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OutletDetail } from "@/services/types/outlet";
import { Dropdown, Toggle } from "@/components/ui";
import { Edit, MoreVertical, Store, Trash } from "lucide-react";
import config from "@/services/table/const";
import { formatDate } from "@/utils";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onChangeChannel,
  onToggleActive,
  canManage,
}: {
  onRowClick?: (row: any) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: any) => void;
  onRemove?: (row: any) => void;
  onToggleActive?: (row: any) => void;
  onChangeChannel?: (row: any, channel?: any) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/outlet",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama Outlet",
      sortable: true,
      component: (row: OutletDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <Store size={16} />
          </div>
          <span className="font-bold text-slate-700">{row.name}</span>
        </div>
      ),
    },
    type: {
      title: "Type",
      sortable: true,
      component: (row: OutletDetail) => (
        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
          {row?.outlet_type?.name ?? "-"}
        </span>
      ),
      align: "center",
    },
    recipient_name: {
      title: "Penerima",
      sortable: true,
      component: (row: OutletDetail) => (
        <span className="text-[13px] text-slate-600 font-medium">
          {row.recipient_name}
        </span>
      ),
    },
    phone: {
      title: "Telepon",
      component: (row: OutletDetail) => (
        <span className="text-[13px] text-slate-500 font-mono">
          {row.phone}
        </span>
      ),
    },
    address: {
      title: "Alamat",
      class: "max-w-[200px]",
      component: (row: OutletDetail) => (
        <span className="text-[13px] text-slate-500 line-clamp-1 truncate">
          {row.address}
        </span>
      ),
    },
    pos_channels_count: {
      title: "POS Channel",
      sortable: false,
      align: "center",
      component: (row: any) => {
        const types = row?.pos_channels ?? [];
        return types.length > 0 ? (
          <div className="group relative inline-block">
            <span className="text-sm cursor-pointer hover:text-indigo-600 transition-colors">
              {types.length === 1
                ? types[0]?.pos_channel?.name || "-"
                : `${types.length} Channel`}
            </span>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-44 z-50 pointer-events-none">
              {types.map((ot: any) => (
                <span
                  key={ot.pos_channel?.id || ot.pos_channel_id}
                  className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg whitespace-nowrap"
                >
                  {ot.pos_channel?.name || "-"}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-slate-300 italic">None</span>
        );
      },
    },
    created_at: {
      title: "Dibuat Pada",
      class: "text-right",
      align: "right",
      component: (row: OutletDetail) => (
        <span className="text-[13px] text-slate-500 font-medium">
          {formatDate(row.created_at, "D MMMM YYYY")}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
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
      align: "center",
    },
    action: {
      title: "",
      class: "text-right",
      align: "right",
      component: (row: OutletDetail) => (
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
                    Modify outlet info
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
                    Remove outlet
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
          {canManage && (
            <Dropdown.Item
              onSelect={() => onChangeChannel?.(row)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Store className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">POS Channel</span>
                  <span className="text-[11px] text-slate-400">
                    Manage availability
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
