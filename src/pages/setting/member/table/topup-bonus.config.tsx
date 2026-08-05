/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TopupBonusDetail } from "@/services/types/pos";
import { Dropdown, Toggle } from "@/components/ui";
import { Edit, Gift, MoreVertical, Trash } from "lucide-react";

const createTableConfig = ({
  onEdit,
  onRemove,
  onToggleActive,
}: {
  onEdit?: (row: TopupBonusDetail) => void;
  onRemove?: (row: TopupBonusDetail) => void;
  onToggleActive?: (row: TopupBonusDetail) => void;
}) => ({
  ...config,
  url: "/member/topup-bonus",
  columns: {
    min_amount: {
      title: "Minimal Topup",
      sortable: true,
      component: (row: TopupBonusDetail) => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0'>
            <Gift size={16} />
          </div>
          <span className='font-bold text-slate-700'>
            {currencyFormat(row.min_amount)}
          </span>
        </div>
      ),
    },
    bonus_percentage: {
      title: "Bonus",
      sortable: true,
      component: (row: TopupBonusDetail) => (
        <span className='text-slate-600 font-medium'>
          {row.bonus_percentage}%
        </span>
      ),
    },
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: TopupBonusDetail) => (
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
    actions: {
      title: "",
      width: 50,
      sortable: false,
      component: (row: TopupBonusDetail) => (
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
            onSelect={() => onEdit?.(row)}
            className='hover:bg-indigo-50 hover:text-indigo-600'
          >
            <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                <Edit className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Edit</span>
                <span className='text-[11px] text-slate-400'>
                  Ubah schema bonus
                </span>
              </div>
            </button>
          </Dropdown.Item>
          <div className='my-1 border-t border-slate-50'></div>
          <Dropdown.Item
            onSelect={() => onRemove?.(row)}
            className='hover:bg-red-50 hover:text-red-600'
          >
            <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                <Trash className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Hapus</span>
                <span className='text-[11px] text-slate-400'>
                  Hapus schema bonus
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
