/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { Badge, Dropdown } from "@/components/ui";
import { currencyFormat, formatDate, getStatusVariant } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import {
  CheckCircle2,
  Eye,
  MoreVertical,
  RefreshCw,
  XCircle,
} from "lucide-react";

export type SettlementAction = "settle" | "unsettle" | "reconcile";

/** Tanggal lokal (YYYY-MM-DD) — dibandingkan dengan `date` header (date-only). */
const todayString = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** BE hanya mengizinkan settle untuk tanggal < hari ini. */
const isPastDate = (date?: string) =>
  !!date && date.slice(0, 10) < todayString();

const DIRECTION_LABEL: Record<string, string> = {
  ho_to_outlet: "HO → Outlet",
  outlet_to_ho: "Outlet → HO",
};

const createTableConfig = ({
  filter,
  lockedFilter,
  onDetail,
  onAction,
  canSettle,
}: {
  filter?: Record<string, unknown>;
  lockedFilter?: Record<string, unknown>;
  /** Buka halaman detail baris — dipanggil dari item "Lihat Detail". */
  onDetail?: (row: any) => void;
  onAction?: (row: any, action: SettlementAction) => void;
  /** Superuser + punya slug aksi — kalau false, item aksi tidak ditampilkan. */
  canSettle?: boolean;
}): TableConfig<any> => ({
  ...config,
  url: "/report/membership-settlement",
  filter,
  lockedFilter,
  columns: {
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className='font-medium block'>
            {`${row?.franchisor?.name ? row.franchisor.name + " - " : ""}${row.outlet?.name ?? ""}`}
          </span>
          <span className='text-xs text-gray-500 block'>
            {row.outlet?.phone ?? ""}
          </span>
        </div>
      ),
    },
    date: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => (
        <span className='font-medium'>{formatDate(row.date)}</span>
      ),
    },
    topup_cash: {
      title: "Topup Cash",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => currencyFormat(row?.topup_cash ?? 0),
    },

    payment_saldo: {
      title: "Payment Saldo",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => currencyFormat(row?.payment_saldo ?? 0),
    },
    payment_point: {
      title: "Payment Point",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => currencyFormat(row?.payment_point ?? 0),
    },
    payment_total: {
      title: "Payment Total",
      align: "right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => currencyFormat(row?.payment_total ?? 0),
    },
    net_amount: {
      title: "Nominal",
      align: "right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => {
        const net = row.net_amount < 0 ? -1 * row.net_amount : row.net_amount;
        return <span className='font-semibold'>{currencyFormat(net)}</span>;
      },
    },
    transfer_direction: {
      title: "Aksi",
      component: (row: any) => (
        <span className='text-sm'>
          {DIRECTION_LABEL[row?.transfer_direction] || "-"}
        </span>
      ),
    },
    status: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.status)}
          size='xs'
          className='px-2.5 font-semibold text-[10px] tracking-wider'
        >
          {row.status?.toLowerCase()}
        </Badge>
      ),
    },
    action: {
      title: "",
      width: 50,
      sortable: false,
      component: (row: any) => {
        const settled = row?.status === "settled";
        const canSettleRow = !settled && isPastDate(row?.date);

        return (
          <Dropdown
            trigger={
              <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
                <MoreVertical className='w-5 h-5 text-slate-600' />
              </button>
            }
            position='end'
            contentClassName='dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-64 border border-slate-100 mt-2'
          >
            <Dropdown.Item
              onSelect={() => onDetail?.(row)}
              className='hover:bg-sky-50 hover:text-sky-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600'>
                  <Eye className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Lihat Detail</span>
                  <span className='text-[11px] text-slate-400'>
                    Buka item sumber settlement
                  </span>
                </div>
              </button>
            </Dropdown.Item>
            {canSettle && canSettleRow && (
              <Dropdown.Item
                onSelect={() => onAction?.(row, "settle")}
                className='hover:bg-emerald-50 hover:text-emerald-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600'>
                    <CheckCircle2 className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Settle</span>
                    <span className='text-[11px] text-slate-400'>
                      Tandai settlement sudah dibayar
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            )}
            {canSettle && settled && (
              <Dropdown.Item
                onSelect={() => onAction?.(row, "unsettle")}
                className='hover:bg-red-50 hover:text-red-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                    <XCircle className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Unsettle</span>
                    <span className='text-[11px] text-slate-400'>
                      Batalkan status settled
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            )}
            {canSettle && !settled && (
              <Dropdown.Item
                onSelect={() => onAction?.(row, "reconcile")}
                className='hover:bg-indigo-50 hover:text-indigo-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                    <RefreshCw className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Reconcile</span>
                    <span className='text-[11px] text-slate-400'>
                      Sesuaikan item dengan ledger
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            )}
            {canSettle && !settled && !canSettleRow && (
              <div className='px-3 py-2 text-[11px] text-slate-400 leading-snug'>
                Settle hanya untuk tanggal sebelum hari ini.
              </div>
            )}
          </Dropdown>
        );
      },
    },
  },
});

export default createTableConfig;
