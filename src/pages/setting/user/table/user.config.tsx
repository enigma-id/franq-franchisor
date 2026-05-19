import { Dropdown } from "@/components";
import config from "@/services/table/const";
import { Edit, MoreVertical, Trash, Power, Check } from "lucide-react";
import { Toggle } from "@/components/ui";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onToggleActive,
}: {
  onRowClick?: (row: any) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: any) => void;
  onRemove?: (row: any) => void;
  onToggleActive?: (row: any) => void;
} = {}) => ({
  ...config,
  url: "/user",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm font-semibold">{row?.name ?? "-"}</span>
      ),
    },
    username: {
      title: "Username",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-gray-600">{row?.username ?? "-"}</span>
      ),
    },
    usergroup: {
      title: "User Group",
      sortable: true,
      component: (row: any) => (
        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
          {row?.usergroup?.name ?? "-"}
        </span>
      ),
      align: "center",
    },
    last_login_at: {
      title: "Last Login",
      sortable: true,
      component: (row: any) => {
        const date = row?.last_login_at;
        if (!date || date === "0001-01-01T00:00:00Z") {
          return <span className="text-sm text-gray-400">-</span>;
        }
        const d = new Date(date);
        const formatted = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return <span className="text-xs">{formatted}</span>;
      },
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: any) => {
        if (row?.usergroup?.id === 1) {
          return (
            <div className="flex justify-center items-center">
              <Toggle
                checked={!!row?.is_active}
                onChange={() => onToggleActive?.(row)}
                variant="success"
                size="sm"
              />
            </div>
          );
        }
        return row?.is_active ? (
          <div className="flex justify-center items-center">
            <Check className="w-5 h-5 text-emerald-500 font-bold" />
          </div>
        ) : (
          <span className="text-gray-400 font-bold">-</span>
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
          contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-60 border border-slate-100 mt-2"
        >
          <Dropdown.Item
            onSelect={() => onClick?.(row)}
            className="hover:bg-indigo-50 hover:text-indigo-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Edit className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Edit</span>
                <span className="text-[11px] text-slate-400">
                  Ubah profil & kredensial
                </span>
              </div>
            </button>
          </Dropdown.Item>

          <Dropdown.Item
            onSelect={() => onToggleActive?.(row)}
            className={row?.is_active ? "hover:bg-amber-50 hover:text-amber-600" : "hover:bg-emerald-50 hover:text-emerald-600"}
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
              <div className={`w-8 h-8 rounded-lg ${row?.is_active ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"} flex items-center justify-center`}>
                <Power className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">
                  {row?.is_active ? "Nonaktifkan" : "Aktifkan"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {row?.is_active ? "Batasi akses user" : "Beri akses masuk user"}
                </span>
              </div>
            </button>
          </Dropdown.Item>

          <div className="my-1 border-t border-slate-50"></div>
          
          <Dropdown.Item
            onSelect={() => onRemove?.(row)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <Trash className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Hapus</span>
                <span className="text-[11px] text-slate-400">Hapus akun user</span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
