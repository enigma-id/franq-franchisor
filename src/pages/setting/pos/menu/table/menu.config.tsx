/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import type { POSMenuDetail } from "@/services/types/pos";
import { Dropdown, Toggle, Tooltip } from "@/components/ui";
import {
  UtensilsCrossed,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import { formatCurrency } from "@/utils";

const createTableConfig = ({
  onClick,
  onEdit,
  onRemove,
  onToggleActive,
  filter,
  canManage,
}: {
  onClick?: (row: POSMenuDetail) => void;
  onEdit: (row: POSMenuDetail) => void;
  onRemove: (row: POSMenuDetail) => void;
  onToggleActive: (row: POSMenuDetail) => void;
  filter?: Record<string, unknown>;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/inventory/product",
  filter,
  columns: {
    code: {
      title: "Kode",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <span className="text-slate-600 font-medium">{row.code}</span>
      ),
    },
    name: {
      title: "Nama Menu",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 overflow-hidden">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed size={16} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">{row.name}</span>
          </div>
        </div>
      ),
    },
    category: {
      title: "Kategori",
      sortable: true,
      alias: "category_id",
      component: (row: POSMenuDetail) => (
        <span className="text-slate-600 font-medium">
          {row.category?.name || "Tanpa Kategori"}
        </span>
      ),
    },
    // List aggregate hanya mengembalikan `menu`; `menu.base_price` non-addon
    // diturunkan dari ingredient = catalog.unit_price (harga beli outlet).
    base_price: {
      title: "Harga Beli Outlet",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <span className="font-medium text-slate-600">
          {formatCurrency(row.base_price)}
        </span>
      ),
    },
    // Harga jual per POS channel, sumber `menu.channel_prices`.
    // 1 channel → harga tampil langsung; ≥2 channel → badge `+N channel`
    // (tooltip berisi seluruh channel beserta harganya).
    channel_prices: {
      title: "Harga Jual",
      sortable: false,
      width: 190,
      component: (row: POSMenuDetail) => {
        const prices = row.channel_prices ?? [];

        if (prices.length === 0) {
          return <span className="text-slate-300">-</span>;
        }

        if (prices.length === 1) {
          const cp = prices[0];
          return (
            <div className="flex items-center justify-between gap-4">
              <span className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {cp.pos_channel?.name ?? "-"}
              </span>
              <span className="shrink-0 text-[13px] font-semibold text-slate-700 tabular-nums">
                {formatCurrency(cp.price)}
              </span>
            </div>
          );
        }

        return (
          <Tooltip
            size="sm"
            position="top"
            variant="neutral"
            className="px-0! py-0! overflow-hidden"
            label={
              <div className="min-w-[200px] py-2.5">
                <div className="border-b border-white/15 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Harga Jual · {prices.length} Channel
                </div>
                <div className="flex flex-col divide-y divide-white/10">
                  {prices.map((cp) => (
                    <div
                      key={cp.id}
                      className="flex items-center justify-between gap-6 px-3 py-1.5"
                    >
                      <span className="text-[12px] text-white/70">
                        {cp.pos_channel?.name ?? "-"}
                      </span>
                      <span className="text-[12px] font-bold tabular-nums text-white">
                        {formatCurrency(cp.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <button
              type="button"
              className="inline-flex w-fit cursor-help items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
            >
              <Plus size={11} strokeWidth={3} />
              {prices.length} channel
            </button>
          </Tooltip>
        );
      },
    },
    is_additional: {
      title: "Add-on",
      sortable: true,
      align: "center",
      component: (row: POSMenuDetail) => (
        row.is_additional ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            Ya
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )
      ),
    },
    is_active: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: POSMenuDetail) => (
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
    },
    action: {
      title: "",
      headerClass: "text-right",
      class: "text-right",
      sortable: false,
      component: (row: POSMenuDetail) => (
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
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">See Detail</span>
                <span className="text-[11px] text-slate-400">
                  See catalog info
                </span>
              </div>
            </button>
          </Dropdown.Item>
          {canManage && (
            <Dropdown.Item
              onSelect={() => onEdit?.(row)}
              className="hover:bg-indigo-50 hover:text-indigo-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Edit className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Edit</span>
                  <span className="text-[11px] text-slate-400">
                    Modify menu info
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
                    Remove menu
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
