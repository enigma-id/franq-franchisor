/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/pos-settlement",
  dataKey: "datas",
  filter,
  onRowClick,
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
        component: (row: any) => row.date,
      },
      ...dynamic,
    };
  },
});

export default createTableConfig;
