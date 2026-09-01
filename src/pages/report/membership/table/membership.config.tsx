/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDate, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
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
      width: 40,
      sortable: false,
      component: () => (
        <ChevronRight size={16} className='text-base-content/30' />
      ),
    },
  },
});

export default createTableConfig;
