import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/b2b/settlement",
  lockedFilter: {
    params_type: "yearly",
  },
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
        class: "text-right",
        component: (row: any) => {
          const vals = row.nominals ?? [];
          return vals[index] !== undefined ? currencyFormat(vals[index]) : "-";
        },
      };
    });

    return {
      periode: {
        title: "Date",
        component: (row: any) => row.periode,
      },
      ...dynamic,
    };
  },
});

export default createTableConfig;
