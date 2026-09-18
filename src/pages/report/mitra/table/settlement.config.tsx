/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  onDetail,
}: {
  filter?: Record<string, unknown>;
  /** Drill-down ke detail harian — dipanggil dari tombol aksi di kolom kanan. */
  onDetail?: (row: any) => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/franchise/settlement",
  dataKey: "datas",
  filter,
  lockedFilter: {
    periode_type: "yearly",
  },
  dynamicColumns: (rows: any[]) => {
    if (!rows?.length) return {};

    const firstRow = rows[0];
    const methods = firstRow.payment_methods ?? [];

    const dynamic: Record<string, any> = {};

    methods.forEach((method: string, index: number) => {
      dynamic[method] = {
        title: method,
        align: "right",
        headerClass: "text-right",
        class: "text-left",
        sortable: false,
        component: (row: any) => {
          const vals = row.nominals ?? [];
          return vals[index] !== undefined ? currencyFormat(vals[index]) : "-";
        },
      };
    });

    return {
      date: {
        title: "Date",
        sortable: false,
        component: (row: any) => row.date,
      },
      ...dynamic,
      action: {
        title: "",
        width: 40,
        sortable: false,
        component: (row: any) => (
          <button
            type='button'
            onClick={() => onDetail?.(row)}
            aria-label='Lihat Detail'
            className='p-1.5 rounded-lg text-base-content/30 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer'
          >
            <ChevronRight size={16} />
          </button>
        ),
      },
    };
  },
});

export default createTableConfig;
