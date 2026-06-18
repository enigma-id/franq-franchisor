import { Dropdown } from "@/components";
import config from "@/services/table/const";
import { Edit, MoreVertical, Trash, Power } from "lucide-react";
import { Toggle } from "@/components/ui";
import type { InventoryItemDetail } from "@/services/types/inventory";
import { formatCurrency } from "@/utils";

const createTableConfig = ({
  lockFilter,
  filter,
  onClick,
  onReload,
  onRemove,
  onToggleActive,
}: {
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onReload: () => void;
  onClick: (v: InventoryItemDetail) => void;
  onRemove: (v: InventoryItemDetail) => void;
  onToggleActive?: (row: InventoryItemDetail) => void;
}) => ({
  ...config,
  url: "/inventory/item",
  lockFilter,
  onReload,
  filter,
  columns: {
    name: {
      title: "Nama",
      sortable: true,
      component: (row: InventoryItemDetail) => (
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <div className='text-sm font-semibold uppercase truncate'>
              {row?.alias_name ?? "-"}
            </div>
            {row?.code && (
              <div className='text-xs text-gray-400'>{row.code}</div>
            )}
          </div>
          {row?.category && (
            <span className='text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0 mt-0.5'>
              {row.category}
            </span>
          )}
        </div>
      ),
    },
    base_price: {
      title: "Base Price",
      sortable: true,
      align: "right",
      component: (row: InventoryItemDetail) => (
        <span className='text-sm text-gray-600'>
          {formatCurrency(row.base_price)}
          {row?.default_fraction && (
            <span className='text-xs text-gray-400 ml-1'>
              /{row.default_fraction}
            </span>
          )}
        </span>
      ),
    },
    weight: {
      title: "Weight",
      sortable: true,
      component: (row: InventoryItemDetail) => (
        <span className='text-sm text-gray-600'>
          {row?.weight ? `${row.weight} gram` : "-"}
        </span>
      ),
      align: "right",
    },
    in_catalog: {
      title: "In Catalog",
      sortable: false,
      component: (row: InventoryItemDetail) =>
        row?.in_catalog ? (
          <span className='text-emerald-600 font-semibold text-sm'>✓</span>
        ) : (
          <span className='text-gray-300 text-sm'>-</span>
        ),
      align: "center",
    },
    is_vatable: {
      title: "VAT",
      sortable: true,
      component: (row: InventoryItemDetail) =>
        row?.is_vatable ? (
          <span className='text-emerald-600 font-semibold text-sm'>✓</span>
        ) : (
          <span className='text-gray-300 text-sm'>-</span>
        ),
      align: "center",
    },
    safety_stock: {
      title: "Safety Stock",
      sortable: true,
      component: (row: InventoryItemDetail) => (
        <span className='text-sm text-gray-600'>{row?.safety_stock ?? 0}</span>
      ),
      align: "right",
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: InventoryItemDetail) => (
        <div className='flex justify-center items-center'>
          <Toggle
            checked={!!row?.is_active}
            onChange={() => onToggleActive?.(row)}
            variant='success'
            size='sm'
          />
        </div>
      ),
      align: "center",
    },
    action: {
      title: "",
      component: (row: InventoryItemDetail) => (
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
            onSelect={() => onClick(row)}
            className='hover:bg-indigo-50 hover:text-indigo-600'
          >
            <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left'>
              <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                <Edit className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Edit</span>
                <span className='text-[11px] text-slate-400'>
                  Modify item info
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
                  {row?.is_active ? "Deactivate item" : "Activate item"}
                </span>
              </div>
            </button>
          </Dropdown.Item>

          <div className='my-1 border-t border-slate-50'></div>
          <Dropdown.Item
            onSelect={() => onRemove(row)}
            className='hover:bg-red-50 hover:text-red-600'
          >
            <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left'>
              <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                <Trash className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Delete</span>
                <span className='text-[11px] text-slate-400'>Remove item</span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
