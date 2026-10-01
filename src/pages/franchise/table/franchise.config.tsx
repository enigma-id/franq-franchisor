import config from "@/services/table/const";
import { Dropdown, Toggle, Badge } from "@/components/ui";
import {
  Pencil,
  MoreVertical,
  Trash,
  Building2,
  Store,
  UserRound,
} from "lucide-react";
import { formatDateTime, getTypeVariant } from "@/utils";
import type { FranchisorRow } from "@/services/types/franchisor";

const createTableConfig = ({
  onView,
  onEdit,
  onRemove,
  onToggleActive,
  onManageUser,
  canManage,
  canManageUser,
}: {
  onView?: (row: FranchisorRow) => void;
  onEdit?: (row: FranchisorRow) => void;
  onRemove?: (row: FranchisorRow) => void;
  onToggleActive?: (row: FranchisorRow) => void;
  onManageUser?: (row: FranchisorRow) => void;
  canManage?: boolean;
  canManageUser?: boolean;
}) => ({
  ...config,
  url: "/franchisor",
  columns: {
    name: {
      title: "Brand / Franchise",
      sortable: true,
      component: (row: FranchisorRow) => (
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50'>
            <Building2 className='w-4.5 h-4.5' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-[13px] font-semibold text-gray-900'>
              {row?.name || "-"}
            </span>
          </div>
        </div>
      ),
    },
    type: {
      title: "Tipe",
      sortable: true,
      component: (row: FranchisorRow) => (
        <Badge
          variant={getTypeVariant(row.type)}
          size='xs'
          className='px-2.5 font-semibold text-[10px] tracking-wider capitalize'
        >
          {row.type}
        </Badge>
      ),
    },
    email: {
      title: "Email",
      sortable: true,
      component: (row: FranchisorRow) => (
        <span className='text-sm text-gray-600'>{row.email || "-"}</span>
      ),
    },
    phone: {
      title: "Telepon",
      sortable: true,
      component: (row: FranchisorRow) => (
        <span className='text-sm text-gray-600'>{row.phone || "-"}</span>
      ),
    },
    created_at: {
      title: "Dibuat",
      sortable: true,
      component: (row: FranchisorRow) => (
        <span className='text-sm text-gray-500'>
          {row.created_at ? formatDateTime(row.created_at) : "-"}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      align: "center",
      headerClass: "text-center",
      component: (row: FranchisorRow) => (
        <div className='flex justify-center items-center'>
          <Toggle
            checked={!!row?.is_active}
            onChange={() => onToggleActive?.(row)}
            variant='success'
            size='sm'
            disabled={!canManage}
          />
        </div>
      ),
    },
    action: {
      title: "",
      sortable: false,
      width: 50,
      class: "text-right",
      component: (row: FranchisorRow) => (
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
            <>
              <Dropdown.Item
                onSelect={() => onView?.(row)}
                className='hover:bg-blue-50 hover:text-blue-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600'>
                    <Store className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>
                      Kelola Franchise
                    </span>
                    <span className='text-[11px] text-slate-400'>
                      Lihat Franchise brand ini
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => onEdit?.(row)}
                className='hover:bg-indigo-50 hover:text-indigo-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                    <Pencil className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Edit</span>
                    <span className='text-[11px] text-slate-400'>
                      Ubah data brand
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
              {canManageUser && (
                <Dropdown.Item
                  onSelect={() => onManageUser?.(row)}
                  className='hover:bg-emerald-50 hover:text-emerald-600'
                >
                  <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left'>
                    <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600'>
                      <UserRound className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start leading-tight'>
                      <span className='font-bold text-[13px]'>User</span>
                      <span className='text-[11px] text-slate-400'>
                        Update user owner
                      </span>
                    </div>
                  </button>
                </Dropdown.Item>
              )}
              <div className='my-1 border-t border-slate-50'></div>
              <Dropdown.Item
                onSelect={() => onRemove?.(row)}
                className='hover:bg-red-50 hover:text-red-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                    <Trash className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Delete</span>
                    <span className='text-[11px] text-slate-400'>
                      Hapus brand
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
