import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/b2b/product-sales",
  filter,
  columns: {
    name: {
      title: "Product Name",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.name ?? "-"}
        </span>
      ),
    },
    total_qty: {
      title: "Total Sold",
      align: "center",
      class: "text-center font-semibold",
      component: (row: any) => currencyFormat(row?.total_qty),
    },
    total_nett: {
      title: "Total Revenue",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row?.total_nett),
    },
  },
});

export default createTableConfig;
