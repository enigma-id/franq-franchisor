import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
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
  url: "/report/b2b/settlement",
  lockedFilter: {
    periode_type: "yearly",
  },
  filter,
  onRowClick,
  dynamicColumns: (rows: any[]) => {
    if (!rows?.length) return {};

    const firstRow = rows[0];
    const statuses =
      firstRow.payment_statuses ?? firstRow.payment_methods ?? [];

    const dynamic: Record<string, any> = {};

    statuses.forEach((status: string, index: number) => {
      dynamic[status] = {
        title: status,
        align: "right",
        headerClass: "text-right",
        class: "text-right",
        sortable: false,
        component: (row: any) => {
          const vals = row.nominals ?? [];
          return vals[index] !== undefined ? currencyFormat(vals[index]) : "-";
        },
      };
    });

    return {
      periode: {
        title: "Periode",
        sortable: false,
        component: (row: any) => row.periode,
      },
      ...dynamic,
      action: {
        title: "",
        width: 40,
        sortable: false,
        component: () => (
          <ChevronRight size={16} className="text-base-content/30" />
        ),
      },
    };
  },
});

export default createTableConfig;
