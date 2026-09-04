/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FranchiseDetail } from "@/services/types/franchise";
import { Badge, Dropdown, Toggle } from "@/components/ui";
import { Edit, Eye, MoreVertical, Store, Trash, User } from "lucide-react";
import config from "@/services/table/const";
import { formatDateTime, getTypeVariant } from "@/utils";

const createTableConfig = ({
  onClick,
  onDetail,
  onRemove,
  onToggleActive,
  onManageUser,
  canManage,
  canManageUser,
}: {
  onClick?: (row: any) => void;
  onDetail?: (row: any) => void;
  onRemove?: (row: any) => void;
  onToggleActive?: (row: any) => void;
  onManageUser?: (row: any) => void;
  canManage?: boolean;
  canManageUser?: boolean;
}) => ({
  ...config,
  url: "/franchise",
  columns: {
    name: {
      title: "Nama Franchise",
      sortable: true,
      component: (row: FranchiseDetail) => (
        <div className='flex items-center gap-3'>
          {row.logo_url ? (
            <img
              src={row.logo_url}
              alt={row.name}
              className='w-8 h-8 rounded-lg object-cover shrink-0'
            />
          ) : (
            <div className='w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0'>
              <Store size={16} />
            </div>
          )}
          <span className='font-bold text-slate-700'>{row.name}</span>
        </div>
      ),
    },
    type: {
      title: "Tipe",
      sortable: true,
      alias: "outlet_type:name",
      align: "center" as const,
      component: (row: FranchiseDetail) => (
        <Badge
          variant={getTypeVariant(row?.outlet_type?.name)}
          size='xs'
          className='px-2.5 font-semibold text-[10px] tracking-wider uppercase'
        >
          {row?.outlet_type?.name ?? "-"}
        </Badge>
      ),
    },
    phone: {
      title: "Telepon",
      component: (row: FranchiseDetail) => (
        <span className='text-[13px] text-slate-500 font-mono'>{row.phone}</span>
      ),
    },
    email: {
      title: "Email",
      component: (row: FranchiseDetail) => (
        <span className='text-[13px] text-slate-500'>{row.email}</span>
      ),
    },
    address: {
      title: "Alamat",
      class: "max-w-[200px]",
      component: (row: FranchiseDetail) => (
        <span className='text-[13px] text-slate-500 line-clamp-1 truncate'>
          {row.address}
        </span>
      ),
    },
    created_at: {
      title: "Dibuat Pada",
      class: "text-right",
      align: "right" as const,
      component: (row: FranchiseDetail) => (
        <span className='text-[13px] text-slate-500 font-medium'>
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      align: "center" as const,
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
    },
    action: {
      title: "",
      class: "text-right",
      align: "right" as const,
      sortable: false,
      component: (row: FranchiseDetail) => (
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
            onSelect={() => onDetail?.(row)}
            className='hover:bg-green-50 hover:text-green-600'
          >
            <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success'>
                <Eye className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Lihat Detail</span>
                <span className='text-[11px] text-slate-400'>Detail franchise & outlet</span>
              </div>
            </button>
          </Dropdown.Item>
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
                  <span className='text-[11px] text-slate-400'>Ubah info franchise</span>
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
                  <span className='text-[11px] text-slate-400'>Update user pemilik</span>
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
                  <span className='text-[11px] text-slate-400'>Hapus franchise</span>
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
