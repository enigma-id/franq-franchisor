import { Dropdown } from "@/components";
import config from "@/services/table/const";
import type { POSMenuDetail } from "@/services/types/pos";
import type { OutletTypeDetail } from "@/services/types/outlet";
import { Toggle } from "@/components/ui";
import {
  Edit,
  MoreVertical,
  Trash,
  Power,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { formatCurrency } from "@/utils";

const createTableConfig = ({
  onEdit,
  onToggleActive,
  onRemove,
  onOutletType,
  outletTypes,
  channels,
}: {
  onEdit: (id: string) => void;
  onToggleActive?: (row: POSMenuDetail) => void;
  onRemove?: (row: POSMenuDetail) => void;
  onOutletType?: (row: POSMenuDetail) => void;
  outletTypes: OutletTypeDetail[];
  channels: { id: string; name: string }[];
}) => {
  const typeMap = new Map(outletTypes.map((t) => [t.id, t.name]));
  const channelMap = new Map(channels.map((c) => [c.id, c.name]));

  return {
    ...config,
    url: "/pos/menu",
    columns: {
      name: {
        title: "Nama Menu",
        sortable: true,
        component: (row: POSMenuDetail) => (
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 overflow-hidden'>
              {row.image ? (
                <img
                  src={row.image}
                  alt={row.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <UtensilsCrossed size={16} />
              )}
            </div>
            <div className='flex flex-col'>
              <span className='font-bold text-slate-700'>{row.name}</span>
            </div>
          </div>
        ),
      },
      category: {
        title: "Kategori",
        component: (row: POSMenuDetail) => (
          <span className='text-[11px] text-slate-400 font-medium uppercase tracking-wider'>
            {(row as any).category?.name || "Tanpa Kategori"}
          </span>
        ),
      },
      outlet_type_count: {
        title: "Outlet Type",
        sortable: false,
        component: (row: any) => {
          const types = row?.outlet_types ?? [];
          return types.length > 0 ? (
            <div className='group relative inline-block'>
              <span className='text-sm cursor-pointer hover:text-indigo-600 transition-colors'>
                {types.length === 1
                  ? types[0]?.outlet_type?.name || "-"
                  : `${types.length} Type`}
              </span>
              <div className='absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-44 z-50 pointer-events-none'>
                {types.map((ot: any) => (
                  <span
                    key={ot.outlet_type?.id || ot.outlet_type_id}
                    className='text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg whitespace-nowrap'
                  >
                    {ot.outlet_type?.name || "-"}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className='text-[11px] text-slate-300 italic'>None</span>
          );
        },
        align: "center",
      },
      channel: {
        title: "Channel",
        component: (row: POSMenuDetail) => {
          const prices = row.channel_prices ?? [];
          return prices.length > 0 ? (
            <div className='group relative inline-block'>
              <span className='text-sm hover:text-emerald-600 transition-colors'>
                {`${prices.length} CH`}
              </span>
              <div className='absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 pointer-events-none p-2 w-50'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='bg-slate-50 border-b border-slate-100'>
                      <th className='px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                        CH
                      </th>
                      <th className='px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-l border-slate-100'>
                        Harga Jual
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((p) => (
                      <tr
                        key={p.pos_channel_id}
                        className='border-b border-slate-50 last:border-b-0'
                      >
                        <td className='px-3 py-2 text-[11px] font-semibold text-slate-700'>
                          {channelMap.get(p.pos_channel_id) || "-"}
                        </td>
                        <td className='px-3 py-2 text-[11px] font-medium text-emerald-600 border-l border-slate-100'>
                          {formatCurrency(p.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <span className='text-[11px] text-slate-300 italic'>None</span>
          );
        },
      },
      base_price: {
        title: "Harga Dasar",
        sortable: true,
        component: (row: POSMenuDetail) => (
          <span className='font-medium text-slate-600'>
            {formatCurrency(row.base_price)}
          </span>
        ),
      },
      is_active: {
        title: "Status",
        class: "text-center",
        align: "center",
        component: (row: POSMenuDetail) => (
          <div className='flex justify-center items-center'>
            <Toggle
              checked={!!row?.is_active}
              onChange={() => onToggleActive?.(row)}
              variant='success'
              size='sm'
            />
          </div>
        ),
      },
      action: {
        title: "",
        class: "flex place-items-center place-content-end",
        sortable: false,
        width: 50,
        component: (row: POSMenuDetail) => (
          <Dropdown
            trigger={
              <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
                <MoreVertical className='w-5 h-5 text-slate-600' />
              </button>
            }
            position='end'
            contentClassName='dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2'
          >
            <Dropdown.Item
              onSelect={() => onEdit(row.id)}
              className='hover:bg-indigo-50 hover:text-indigo-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left'>
                <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  <Edit className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Edit</span>
                  <span className='text-[11px] text-slate-400'>
                    Modify menu info
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
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left'>
                <div
                  className={`w-8 h-8 rounded-lg ${row?.is_active ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"} flex items-center justify-center`}
                >
                  <Power className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>
                    {row?.is_active ? "Deactivate" : "Activate"}
                  </span>
                  <span className='text-[11px] text-slate-400'>
                    {row?.is_active ? "Deactivate menu" : "Activate menu"}
                  </span>
                </div>
              </button>
            </Dropdown.Item>

            <div className='my-1 border-t border-slate-50'></div>
            <Dropdown.Item
              onSelect={() => onRemove?.(row)}
              className='hover:bg-red-50 hover:text-red-600'
            >
              <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left'>
                <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                  <Trash className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Delete</span>
                  <span className='text-[11px] text-slate-400'>
                    Remove menu
                  </span>
                </div>
              </button>
            </Dropdown.Item>
            <div className='my-1 border-t border-slate-50'></div>
            <Dropdown.Item
              onSelect={() => onOutletType?.(row)}
              className='hover:bg-blue-50 hover:text-blue-600'
            >
              <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left'>
                <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600'>
                  <Store className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Outlet Type</span>
                  <span className='text-[11px] text-slate-400'>
                    Manage availability
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          </Dropdown>
        ),
      },
    },
  };
};

export default createTableConfig;
