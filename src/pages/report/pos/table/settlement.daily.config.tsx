/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  lockedFilter,
  onDetail,
}: {
  lockedFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onDetail?: (row: any) => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/franchise/settlement",
  dataKey: "datas",
  lockedFilter,
  filter,
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
      periode: {
        title: "Date",
        sortable: false,
        component: (row: any) => row.date,
      },
      started_at: {
        title: "Mulai",
        sortable: false,
        component: (row: any) => formatDateTime(row.started_at),
      },
      finished_at: {
        title: "Selesai",
        sortable: false,
        component: (row: any) => formatDateTime(row.finished_at),
      },
      ...dynamic,
      ...(onDetail
        ? {
            action: {
              title: "",
              width: 40,
              sortable: false,
              component: (row: any) => (
                <button
                  type='button'
                  onClick={() => onDetail(row)}
                  aria-label='Lihat Detail Sesi'
                  className='p-1.5 rounded-lg text-base-content/30 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer'
                >
                  <ChevronRight size={16} />
                </button>
              ),
            },
          }
        : {}),
    };
  },
});

export default createTableConfig;
