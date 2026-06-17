import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/warehouse-stock",
  filter,
  columns: {
    name: {
      title: "Item Name",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-semibold block uppercase text-sm">
            {row?.item?.name ?? "-"}
          </span>
          <span className="text-xs text-gray-500 block">
            {row?.item?.code ?? "-"}
          </span>
        </div>
      ),
    },
    warehouse: {
      title: "Warehouse",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.warehouse?.name ?? "-"}</span>
      ),
    },
    stock: {
      title: "Current Stock",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => (
        <span className="text-right block">
          {currencyFormat(row?.stock)} {row?.item?.default_fraction ?? ""}
        </span>
      ),
    },
    value: {
      title: "Estimated Value",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) =>
        currencyFormat((row?.stock ?? 0) * (row?.item?.base_price ?? 0)),
    },
  },
});

export default createTableConfig;
