import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/sales-order-item",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.date ?? "-"}</span>
      ),
    },
    code: {
      title: "Code",
      component: (row: any) => (
        <span className="font-semibold text-sm">{row?.code ?? "-"}</span>
      ),
    },
    order_type: {
      title: "Type",
      component: (row: any) => (
        <span className="capitalize text-sm">{row?.order_type ?? "-"}</span>
      ),
    },
    catalog: {
      title: "Catalog",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.catalog ?? "-"}</span>
      ),
    },
    quantity_ordered: {
      title: "Qty Ordered",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => row?.quantity_ordered ?? 0,
    },
    quantity_fulfilled: {
      title: "Qty Fulfilled",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => row?.quantity_fulfilled ?? 0,
    },
    unit_nett: {
      title: "Unit Nett",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => currencyFormat(row?.unit_nett ?? 0),
    },
  },
});

export default createTableConfig;
