/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { Dropdown } from "@/components/ui";
import { Eye, Pencil, ShieldCheck, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserDetail } from "@/services/types";

const createTableConfig = ({
  onView,
  onEdit,
  onPermission,
  canManage,
}: {
  onView?: (row: UserDetail) => void;
  onEdit?: (row: UserDetail) => void;
  onPermission?: (row: UserDetail) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/user",
  columns: {
    name: { title: "Nama", sortable: true, class: "font-medium" },
    username: { title: "Username", sortable: true },
    is_active: {
      title: "Aktif",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: UserDetail) => (
        <Badge variant={row.is_active ? "success" : "error"}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    last_activity_at: {
      title: "Terakhir Aktif",
      sortable: true,
      class: "text-sm",
      component: (row: UserDetail) => (
        <span>
          {row.last_activity_at
            ? new Date(row.last_activity_at).toLocaleDateString("id-ID")
            : "-"}
        </span>
      ),
    },
    action: {
      title: "",
      sortable: false,
      width: 60,
      class: "text-right",
      component: (row: UserDetail) => (
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
            onSelect={() => onView?.(row)}
            className="hover:bg-green-50 hover:text-green-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">See Detail</span>
                <span className="text-[11px] text-slate-400">
                  View user info
                </span>
              </div>
            </button>
          </Dropdown.Item>

          {canManage && (
            <>
              <div className="my-1 border-t border-slate-50"></div>
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
