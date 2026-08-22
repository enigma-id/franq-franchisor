import config from "@/services/table/const";
import type { POSChannelDetail } from "@/services/types/pos";
import { Dropdown, Toggle } from "@/components/ui";
import { Edit, Monitor, MoreVertical, Trash } from "lucide-react";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onToggleActive,
  canManage,
}: {
  onRowClick?: (row: POSChannelDetail) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: POSChannelDetail) => void;
  onRemove?: (row: POSChannelDetail) => void;
  onToggleActive?: (row: POSChannelDetail) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/pos/channel",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama Channel",
      sortable: true,
      component: (row: POSChannelDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Monitor size={16} />
          </div>
          <span className="font-bold text-slate-700">{row.name}</span>
        </div>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: POSChannelDetail) => (
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
    actions: {
      title: "",
      width: 50,
      sortable: false,
      component: (row: POSChannelDetail) => (
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
                    Modify channel info
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
                      Remove channel
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
