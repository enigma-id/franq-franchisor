/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import type { SessionPaymentMethod } from "@/services/types";
import { currencyFormat, formatDate, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { ChevronRight } from "lucide-react";
import { PayTooltip } from "../components/PayTooltip";

const createTableConfig = ({
  filter,
  lockedFilter,
  onDetail,
}: {
  filter?: Record<string, unknown>;
  lockedFilter?: Record<string, unknown>;
  onDetail?: (row: any) => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/franchise/session",
  filter,
  lockedFilter,
  columns: {
    transaction_date: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{formatDate(row?.transaction_date)}</span>
      ),
    },
    cashier_name: {
      title: "Kasir",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold text-sm'>{row?.cashier_name || "-"}</span>
      ),
    },
    started_at: {
      title: "Mulai",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{formatDateTime(row?.started_at)}</span>
      ),
    },
    finished_at: {
      title: "Selesai",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>
          {row?.finished_at ? formatDateTime(row.finished_at) : "-"}
        </span>
      ),
    },
    status: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
        <span
          className={
            row?.status === "opened"
              ? "text-xs font-bold text-amber-600 capitalize"
              : "text-xs font-bold text-slate-500 capitalize"
          }
        >
          {row?.status || "-"}
        </span>
      ),
    },
    cash_started: {
      title: "Kas Awal",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row?.cash_started ?? 0),
    },
    cash_finished: {
      title: "Kas Akhir",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) =>
        currencyFormat(row?.cash_finished ?? 0),
    },
    total_sales: {
      title: "Total Sales",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row?.total_sales ?? 0),
    },
    total_discount: {
      title: "Discount",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) =>
        currencyFormat(row?.total_discount ?? 0),
    },
    total_service: {
      title: "Service",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) =>
        currencyFormat(row?.total_service ?? 0),
    },
    grand_total: {
      title: "Grand Total",
      align: "right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => {
        const methods: SessionPaymentMethod[] = row?.payment_methods ?? [];
        return (
          <PayTooltip methods={methods}>
            <span className='border-b border-dashed border-slate-400/60 pb-px transition-colors hover:border-indigo-400 hover:text-indigo-600'>
              {currencyFormat(row?.grand_total ?? 0)}
            </span>
          </PayTooltip>
        );
      },
    },
    outstanding_bill: {
      title: "Outstanding",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) =>
        currencyFormat(row?.outstanding_bill ?? 0),
    },
    action: {
      title: "",
      width: 40,
      sortable: false,
      component: (row: any) => (
        <button
          type='button'
          onClick={() => onDetail?.(row)}
          aria-label='Lihat Detail Sesi'
          className='p-1.5 rounded-lg text-base-content/30 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer'
        >
          <ChevronRight size={16} />
        </button>
      ),
    },
  },
});

export default createTableConfig;
