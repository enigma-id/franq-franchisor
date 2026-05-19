import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  lockedFilter,
  onRowClick,
}: {
  lockedFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
}) => ({
  ...config,
  url: "/report/pos/settlement",
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
      started_at: {
        title: "Session Time",
        component: (row: any) =>
          row.started_at && row.finished_at
            ? `${formatDateTime(row.started_at)} - ${formatDateTime(row.finished_at)}`
            : "-",
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
