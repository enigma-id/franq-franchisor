/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
  lockedFilter,
}: {
  lockedFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/pos-settlement",
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
        component: (row: any) => row.date,
      },
      started_at: {
        title: "Mulai",
        component: (row: any) => formatDateTime(row.started_at),
      },
      finished_at: {
        title: "Selesai",
        component: (row: any) => formatDateTime(row.finished_at),
      },
      ...dynamic,
    };
  },
});

export default createTableConfig;
