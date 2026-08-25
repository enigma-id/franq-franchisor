import config from "@/services/table/const";
import type { PaymentMethodDetail } from "@/services/types/pos";
import { Dropdown, Toggle } from "@/components/ui";
import { Edit, CreditCard, MoreVertical, Trash, Store } from "lucide-react";

interface PaymentMethodOutletTypeRelation {
  id?: string;
  outlet_type_id?: string;
  outlet_type?: { id?: string; name?: string } | null;
}

type PaymentMethodRow = PaymentMethodDetail & {
  outlet_types?: PaymentMethodOutletTypeRelation[];
};

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
  onClick,
  onRemove,
  onToggleActive,
  onOutletType,
  canManage,
}: {
  onRowClick?: (row: PaymentMethodDetail) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onClick?: (row: PaymentMethodDetail) => void;
  onRemove?: (row: PaymentMethodDetail) => void;
  onToggleActive?: (row: PaymentMethodDetail) => void;
  onOutletType?: (row: PaymentMethodDetail) => void;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/payment/method",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama Pembayaran",
      sortable: true,
      component: (row: PaymentMethodDetail) => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0'>
            <CreditCard size={16} />
          </div>
          <span className='font-bold text-slate-700'>{row.name}</span>
        </div>
      ),
    },
    provider: {
      title: "Provider",
      sortable: true,
      component: (row: PaymentMethodDetail) => (
        <span className='text-slate-600 font-medium'>{row.provider}</span>
      ),
    },
    type: {
      title: "Tipe",
      sortable: true,
      component: (row: PaymentMethodDetail) => (
        <span className='text-[12px] bg-slate-100 px-2 py-0.5 rounded uppercase font-mono text-slate-500'>
          {row.type}
        </span>
      ),
    },
    outlet_types: {
      title: "Outlet Type",
      sortable: false,
      component: (row: PaymentMethodRow) => {
        const types = row?.outlet_types ?? [];
        return types.length > 0 ? (
          <div className='group relative inline-block'>
            <span className='text-sm cursor-pointer hover:text-indigo-600 transition-colors'>
              {types.length === 1
                ? types[0]?.outlet_type?.name || "-"
                : `${types.length} Type`}
            </span>
            <div className='absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-44 z-50 pointer-events-none'>
              {types.map((ot: PaymentMethodOutletTypeRelation) => (
                <span
                  key={ot.id || ot.outlet_type?.id || ot.outlet_type_id}
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
    is_active: {
      title: "Status",
      sortable: true,
      component: (row: PaymentMethodDetail) => (
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
    actions: {
      title: "",
      width: 50,
      sortable: false,
      component: (row: PaymentMethodDetail) => (
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
                    Modify payment info
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
          {canManage && (
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
          )}
          {canManage && (
            <>
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
                    <span className='font-bold text-[13px]'>Delete</span>
                    <span className='text-[11px] text-slate-400'>
                      Remove payment method
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
