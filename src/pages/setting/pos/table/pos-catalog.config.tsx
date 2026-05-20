import { Dropdown } from "@/components";
import config from "@/services/table/const";
import { Edit, MoreVertical, Trash, Power } from "lucide-react";
import { Toggle, Tooltip } from "@/components/ui";
import { currencyFormat } from "@/utils";

const activeChannels = (row: any) =>
  Array.isArray(row?.channels)
    ? row.channels.filter((channel: any) => channel?.is_active === 1)
    : [];

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
  url: "/pos/catalog",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Menu",
      sortable: true,
      component: (row: any) => (
        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-slate-800">
            {row?.name ?? "-"}
          </div>
          <div className="text-xs text-slate-500">
            {row?.code ? `Kode: ${row.code}` : "Kode: -"}
          </div>
        </div>
      ),
    },
    category: {
      alias: "category.id",
      title: "Kategori",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm text-slate-700">
          {row?.category?.name ?? "-"}
        </span>
      ),
    },
    base_price: {
      title: "Harga Dasar",
      sortable: true,
      align: "right",
      format_number: true,
    },
    channels: {
      title: "Channel Aktif",
      sortable: false,
      component: (row: any) => {
        const channels = activeChannels(row);
        if (channels.length === 0) {
          return (
            <span className="text-xs text-slate-400 italic">Tidak ada</span>
          );
        }

        return (
          <Tooltip
            size="lg"
            position="right"
            variant="accent"
            label={
              <div className="space-y-2 min-w-[200px]">
                <div className="text-xs font-bold text-slate-600 uppercase mb-2">
                  Channel Aktif
                </div>
                {channels.map((ch: any) => (
                  <div
                    key={ch.channel_id}
                    className="flex items-center justify-between gap-3 text-xs whitespace-nowrap"
                  >
                    <span className="font-medium text-slate-700">
                      {ch.name}
                    </span>
                    <span className="font-semibold text-emerald-600 tabular-nums">
                      {currencyFormat(ch.unit_price)}
                    </span>
                  </div>
                ))}
              </div>
            }
          >
            <span className="text-sm font-medium text-slate-700 cursor-help">
              {channels.length} channel
            </span>
          </Tooltip>
        );
      },
    },
    is_additional: {
      title: "Additional",
      sortable: true,
      component: (row: any) =>
        row?.is_additional ? (
          <span className="text-emerald-600 font-semibold text-sm">✓</span>
        ) : (
          <span className="text-gray-300 text-sm">-</span>
        ),
      align: "center",
    },
    is_vatable: {
      title: "VAT",
      sortable: true,
      component: (row: any) =>
        row?.is_vatable ? (
          <span className="text-emerald-600 font-semibold text-sm">✓</span>
        ) : (
          <span className="text-gray-300 text-sm">-</span>
        ),
      align: "center",
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
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
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Edit className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Edit</span>
                <span className="text-[11px] text-slate-400">
                  Modify catalog info
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
                  {row?.is_active ? "Deactivate catalog" : "Activate catalog"}
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
                <span className="font-bold text-[13px]">Delete</span>
                <span className="text-[11px] text-slate-400">
                  Remove catalog
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
