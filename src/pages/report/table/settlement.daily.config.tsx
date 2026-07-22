/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  lockedFilter,
  onRowClick,
}: {
  lockedFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/pos-settlement",
  dataKey: "datas",
  lockedFilter,
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
      periode: {
        title: "Date",
        component: (row: any) => row.periode,
      },
      ...dynamic,
      action: {
        title: "",
        width: 40,
        component: () => (
          <ChevronRight size={16} className="text-base-content/30" />
        ),
      },
    };
  },
});

export default createTableConfig;
