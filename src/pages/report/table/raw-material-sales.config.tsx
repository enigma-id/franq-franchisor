import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/raw-material-sales",
  filter,
  columns: {
    name: {
      title: "Material Name",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.name ?? "-"}
        </span>
      ),
    },
    total_qty: {
      title: "Total Usage",
      align: "center",
      class: "text-center font-semibold",
      component: (row: any) => currencyFormat(row?.total_qty),
    },
  },
});

export default createTableConfig;
