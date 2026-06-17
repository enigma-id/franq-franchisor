import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
}) => ({
  ...config,
  url: "/report/pos/settlement",
  lockedFilter: {
    params_type: "yearly",
  },
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
