import config from "@/services/table/const";
import { Dropdown, Toggle } from "@/components/ui";
import { Pencil, ShieldCheck, MoreVertical } from "lucide-react";
import { formatDateTime } from "@/utils";
import type { UserDetail } from "@/services/types";

const createTableConfig = ({
  onEdit,
  onPermission,
  onToggleActive,
  canManage,
  currentUserId,
}: {
  onEdit?: (row: UserDetail) => void;
  onPermission?: (row: UserDetail) => void;
  onToggleActive?: (row: UserDetail) => void;
  canManage?: boolean;
  currentUserId?: string;
}) => ({
  ...config,
  url: "/user",
  columns: {
    name: { title: "Nama", sortable: true, class: "font-medium" },
    username: { title: "Username", sortable: true },
    usergroup: {
      title: "Usergroup",
      sortable: true,
      class: "text-sm",
      component: (row: UserDetail) => (
        <span className="text-slate-600">
          {row.usergroup?.name ?? "-"}
        </span>
      ),
    },
    is_active: {
      title: "Aktif",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: UserDetail) => (
        <div className="flex justify-center items-center">
          <Toggle
            checked={!!row.is_active}
            onChange={() => onToggleActive?.(row)}
            variant="success"
            size="sm"
            disabled={!canManage || row.id === currentUserId}
          />
        </div>
      ),
    },
    last_activity_at: {
      title: "Terakhir Aktif",
      sortable: true,
      class: "text-sm",
      component: (row: UserDetail) => (
        <span>
          {row.last_activity_at
            ? formatDateTime(row.last_activity_at)
            : "-"}
        </span>
      ),
    },
    action: {
      title: "",
      sortable: false,
      width: 60,
      class: "text-right",
      component: (row: UserDetail) =>
        row.id === currentUserId ? null : (
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
              <>
                <Dropdown.Item
                  onSelect={() => onEdit?.(row)}
                  className="hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Pencil className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-bold text-[13px]">Edit</span>
                      <span className="text-[11px] text-slate-400">
                        Modify user info
                      </span>
                    </div>
                  </button>
                </Dropdown.Item>
                <div className="my-1 border-t border-slate-50"></div>
                <Dropdown.Item
                  onSelect={() => onPermission?.(row)}
                  className="hover:bg-violet-50 hover:text-violet-600"
                >
                  <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-bold text-[13px]">Permission</span>
                      <span className="text-[11px] text-slate-400">
                        Ubah usergroup / hak akses
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
