/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OutletDetail } from "@/services/types/outlet";
import { Dropdown, Toggle } from "@/components/ui";
import { Edit, MoreVertical, Store, Trash, User } from "lucide-react";
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";

const createTableConfig = ({
  lockFilter,
  filter,
  onClick,
  onRemove,
  onToggleActive,
  onManageUser,
  canManage,
  canManageUser,
}: {
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: any) => void;
  onRemove?: (row: any) => void;
  onToggleActive?: (row: any) => void;
  onManageUser?: (row: any) => void;
  canManage?: boolean;
  canManageUser?: boolean;
}) => ({
  ...config,
  url: "/outlet",
  lockFilter,
  filter,
  columns: {
    name: {
      title: "Nama Outlet",
      sortable: true,
      component: (row: OutletDetail) => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0'>
            <Store size={16} />
          </div>
          <span className='font-bold text-slate-700'>{row.name}</span>
        </div>
      ),
    },
    type: {
      title: "Type",
      sortable: true,
      alias: "outlet_type:name",
      component: (row: OutletDetail) => (
        <span className='text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium'>
          {row?.outlet_type?.name ?? "-"}
        </span>
      ),
      align: "center",
    },
    recipient_name: {
      title: "Penerima",
      sortable: true,
      component: (row: OutletDetail) => (
        <span className='text-[13px] text-slate-600 font-medium'>
          {row.recipient_name}
        </span>
      ),
    },
    phone: {
      title: "Telepon",
      component: (row: OutletDetail) => (
        <span className='text-[13px] text-slate-500 font-mono'>
          {row.phone}
        </span>
      ),
    },
    address: {
      title: "Alamat",
      class: "max-w-[200px]",
      component: (row: OutletDetail) => (
        <span className='text-[13px] text-slate-500 line-clamp-1 truncate'>
          {row.address}
        </span>
      ),
    },
    created_at: {
      title: "Dibuat Pada",
      class: "text-right",
      align: "right",
      component: (row: OutletDetail) => (
        <span className='text-[13px] text-slate-500 font-medium'>
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
        <div className='flex justify-center items-center'>
          <Toggle
            checked={!!row?.is_active}
            onChange={() => onToggleActive?.(row)}
            disabled={!canManage}
            variant='success'
            size='sm'
          />
        </div>
      ),
      align: "center",
    },
    saldo: {
      title: "Saldo",
      class: "max-w-[200px]",
      sortable: false,
      component: (row: OutletDetail) => (
        <span className='text-[13px] text-slate-500 line-clamp-1 truncate'>
          {currencyFormat(row?.saldo)}
        </span>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      align: "right",
      sortable: false,
      component: (row: OutletDetail) => (
        <Dropdown
          trigger={
            <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
              <MoreVertical className='w-5 h-5 text-slate-600' />
            </button>
          }
          position='end'
          contentClassName='dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2'
        >
          {canManage && (
            <Dropdown.Item
              onSelect={() => onClick?.(row)}
              className='hover:bg-indigo-50 hover:text-indigo-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  <Edit className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Edit</span>
                  <span className='text-[11px] text-slate-400'>
                    Modify outlet info
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
          {canManage && (
            <Dropdown.Item
              onSelect={() => onRemove?.(row)}
              className='hover:bg-red-50 hover:text-red-600'
            >
              <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                  <Trash className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Delete</span>
                  <span className='text-[11px] text-slate-400'>
                    Remove outlet
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
          {canManageUser && (
            <Dropdown.Item
              onSelect={() => onManageUser?.(row)}
              className='hover:bg-emerald-50 hover:text-emerald-600'
            >
              <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left'>
                <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600'>
                  <User className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>User</span>
                  <span className='text-[11px] text-slate-400'>
                    Update user outlet
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
