/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { Dropdown, Toggle } from "@/components/ui";
import { Pencil, Trash, MoreVertical } from "lucide-react";
import type { UserGroupDetail } from "@/services/types";

const createTableConfig = ({
  onEdit,
  onRemove,
  onToggleActive,
  canManage,
}: {
  onEdit?: (row: UserGroupDetail) => void;
  onRemove?: (row: UserGroupDetail) => void;
  onToggleActive?: (row: UserGroupDetail) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/usergroup",
  columns: {
    name: { title: "Nama Usergroup", sortable: true, class: "font-medium" },
    is_active: {
      title: "Aktif",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: UserGroupDetail) => (
        <div className="flex justify-center items-center">
          <Toggle
            checked={!!row.is_active}
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
      width: 60,
      class: "text-right",
      component: (row: UserGroupDetail) =>
        canManage ? (
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
              onSelect={() => onEdit?.(row)}
              className="hover:bg-indigo-50 hover:text-indigo-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Pencil className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Update Usergroup</span>
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
                </div>
              </button>
            </Dropdown.Item>
          </Dropdown>
        ) : null,
    },
  },
});

export default createTableConfig;
