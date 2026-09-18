/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDate, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { Dropdown } from "@/components/ui";
import { Gift, MoreVertical, Wallet } from "lucide-react";

const createTableConfig = ({
  filter,
  onRowClick,
  onNavigate,
}: {
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
  /** Buka mutasi saldo/point milik satu member (drill-down dari kolom aksi). */
  onNavigate?: (row: any, target: "saldo" | "point") => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/membership",
  filter,
  onRowClick,
  columns: {
    date: {
      title: "Tanggal Daftar",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.date ? formatDate(row.date) : "-"}</span>
      ),
    },
    card_id: {
      title: "Card ID",
      sortable: true,
      component: (row: any) => (
        <span className='font-medium text-sm'>{row?.card_id || "-"}</span>
      ),
    },
    name: {
      title: "Nama Member",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold text-sm'>{row?.name || "-"}</span>
      ),
    },
    reff_code: {
      title: "Reff Code",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.reff_code || "-"}</span>
      ),
    },
    saldo: {
      title: "Saldo",
      align: "right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => currencyFormat(row?.saldo ?? 0),
    },
    point: {
      title: "Poin",
      align: "right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => currencyFormat(row?.point ?? 0),
    },
    last_transaction: {
      title: "Transaksi Terakhir",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>
          {row?.last_transaction ? formatDateTime(row.last_transaction) : "-"}
        </span>
      ),
    },
    action: {
      title: "",
      width: 50,
      sortable: false,
      // stopPropagation: baris tabel punya onRowClick (drill-down ke Mutasi Saldo),
      // jangan ikut ter-trigger saat dropdown dibuka/dipilih.
      component: (row: any) => (
        <div onClick={(e) => e.stopPropagation()}>
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
              onSelect={() => onNavigate?.(row, "saldo")}
              className='hover:bg-indigo-50 hover:text-indigo-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  <Wallet className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Mutasi Saldo</span>
                  <span className='text-[11px] text-slate-400'>
                    Riwayat saldo member
                  </span>
                </div>
              </button>
            </Dropdown.Item>
            <Dropdown.Item
              onSelect={() => onNavigate?.(row, "point")}
              className='hover:bg-emerald-50 hover:text-emerald-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600'>
                  <Gift className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Mutasi Point</span>
                  <span className='text-[11px] text-slate-400'>
                    Riwayat point member
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          </Dropdown>
        </div>
      ),
    },
  },
});

export default createTableConfig;
